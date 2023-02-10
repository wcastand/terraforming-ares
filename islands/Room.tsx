import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import { getLocalStorage, reviver, send } from "../utils.ts";
import { uniqueString } from "https://deno.land/x/uniquestring@v1.0.3/mod.ts";

export default function Room(props: {
	origin: string;
	room: string;
	protocol: string;
}) {
	const ws = useRef<WebSocket>();
	const protocol = props.protocol === "https" ? "wss" : "ws";
	const playerName = useMemo(() => {
		let name = getLocalStorage()?.getItem("playerName");
		if (!name) {
			name = uniqueString(5);
			getLocalStorage()?.setItem("playerName", name);
		}
		return name;
	}, []);

	const [inGame, setInGame] = useState(true);

	const [room, set] = useState<GameState>({
		oxygen: 0,
		temperature: 0,
		room: props.room,
		players: new Map(),
	});

	function handleMessage(e: MessageEvent) {
		const msg: ServerMsg = JSON.parse(e.data, reviver);
		switch (msg.type) {
			case "server": {
				set(msg.room);
				setInGame(true);
				break;
			}
			case "max_player_reach": {
				setInGame(false);
				console.log("max player reached");
				console.log("available players: ", msg.availablePlayers);
			}
		}
	}

	function update(key: "oxygen" | "temperature", op: "increase" | "decrease") {
		if (ws.current)
			send(ws.current, {
				type: "update",
				payload: { playerName, roomName: room.room },
				data: { key, op },
			});
	}

	useEffect(() => {
		try {
			const socket = new WebSocket(`${protocol}://${props.origin}/api/ws`);
			socket.onopen = () => {
				send(socket, {
					type: "join",
					payload: { roomName: props.room, playerName },
				});
			};
			socket.onmessage = handleMessage;
			socket.onerror = (e) => console.error("Error connecting to server", e);
			ws.current = socket;
		} catch (err) {
			console.log("Failed to connect to server ... exiting");
		}
	}, []);

	return (
		<div>
			<h3>Room {props.room}</h3>
			<h1>
				{playerName} : {room.players.get(playerName)}
			</h1>
			<p>{inGame ? "In Game" : "Not a player"}</p>
			<div>
				<h4>Oxygen: {room.oxygen}</h4>
				<button onClick={() => update("oxygen", "increase")}>+</button>
				<button onClick={() => update("oxygen", "decrease")}>-</button>
			</div>
			<div>
				<h4>Temperature: {room.temperature}</h4>
				<button onClick={() => update("temperature", "increase")}>+</button>
				<button onClick={() => update("temperature", "decrease")}>-</button>
			</div>
			<h2>Players</h2>
			<ul>
				{Array.from(room.players.entries())
					.filter(([name]) => name !== playerName)
					.map(([name, nt]) => (
						<li>
							{name}: {nt}
						</li>
					))}
			</ul>
		</div>
	);
}
