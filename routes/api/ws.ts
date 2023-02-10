import { HandlerContext } from "$fresh/server.ts";
import { reviver, send } from "../../utils.ts";

const rooms: Map<string, GameState> = new Map();
const players: Map<string, Map<string, WebSocket>> = new Map();

function getAvailablePlayers(
  playerName: string,
  gamePlayers: Map<string, number>,
  connectedPlayers: Map<string, WebSocket>,
) {
  const availablePlayers: string[] = [];
  gamePlayers.forEach((_, k) => {
    if (!connectedPlayers.has(k) && k !== playerName) {
      availablePlayers.push(k);
    }
  });
  return availablePlayers;
}

export const handler = (_req: Request, _ctx: HandlerContext): Response => {
  const { socket: ws, response } = Deno.upgradeWebSocket(_req);
  let wsRoomName: string;
  let wsPlayerName: string;

  function join(msg: JoinMsg) {
    console.log("Joining room ...");
    wsRoomName = msg.payload.roomName;
    wsPlayerName = msg.payload.playerName;

    // create the room if it doesn't exist
    if (!rooms.has(wsRoomName)) {
      rooms.set(wsRoomName, {
        oxygen: 0,
        temperature: 0,
        room: wsRoomName,
        players: new Map(),
      });
    }

    // create players room if it doesn't exist
    if (!players.has(wsRoomName)) players.set(wsRoomName, new Map());

    players.get(wsRoomName)!.set(wsPlayerName, ws);

    // if already 4 players registered, don't add player
    if (rooms.get(wsRoomName)!.players.size < 4) {
      rooms.get(wsRoomName)!.players.set(wsPlayerName, 0);
    } else if (!rooms.get(wsRoomName)!.players.has(wsPlayerName)) {
      console.log("send available players");
      send(ws, {
        type: "max_player_reach",
        availablePlayers: getAvailablePlayers(
          wsPlayerName,
          rooms.get(wsRoomName)!.players,
          players.get(wsRoomName)!,
        ),
      });
    }
  }

  function leaveRoom(roomName: string, playerName: string) {
    console.log("Leaving room ...");
    players.get(roomName)!.delete(playerName);
    if (players.get(roomName)!.size === 0) {
      players.delete(roomName);
      rooms.delete(roomName);
    } else {
      // broadcast to all players in the room
      players.get(wsRoomName)!.forEach((v) =>
        send(v, { type: "server", room: rooms.get(wsRoomName)! })
      );
    }
  }

  ws.onclose = () => leaveRoom(wsRoomName, wsPlayerName);

  ws.onmessage = (event) => {
    const msg: ClientMsg = JSON.parse(event.data, reviver);
    const type = msg.type;

    switch (type) {
      case "join":
        join(msg);
        break;
      case "update": {
        const { key, op } = msg.data;
        const { roomName } = msg.payload;
        const room = rooms.get(roomName)!;
        rooms.set(roomName, {
          ...room,
          [key]: op === "increase" ? room[key] + 1 : room[key] - 1,
        });
        break;
      }
    }
    // broadcast to all players in the room
    players.get(wsRoomName)!.forEach((v) =>
      send(v, { type: "server", room: rooms.get(wsRoomName)! })
    );
  };

  ws.onerror = (err) => console.log(err);

  return response;
};
