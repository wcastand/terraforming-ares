import { Head } from "$fresh/runtime.ts";
import CreateRoom from "../islands/CreateRoom.tsx";
import PlayerName from "../islands/PlayerName.tsx";

export default function Home() {
	return (
		<>
			<Head>
				<title>Fresh App</title>
			</Head>
			<div>
				<CreateRoom />
				<PlayerName />
			</div>
		</>
	);
}
