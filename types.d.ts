type GameState = {
  oxygen: number;
  temperature: number;
  room: string;
  players: Map<string, number>;
};

type JoinMsg = {
  type: "join";
  payload: { playerName: string; roomName: string };
};
type UpdateClientMsg = {
  type: "update";
  payload: { playerName: string; roomName: string };
  data: { key: "oxygen" | "temperature"; op: "increase" | "decrease" };
};

type ClientMsg = JoinMsg | UpdateClientMsg;

type UpdateServerMsg = {
  type: "server";
  room: GameState;
};
type MaxPlayerReachMsg = {
  type: "max_player_reach";
  availablePlayers: string[];
};
type ServerMsg = UpdateServerMsg | MaxPlayerReachMsg;
