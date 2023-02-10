import { PageProps } from "$fresh/server.ts";
import Room from "../islands/Room.tsx";

export default function RoomPage(props: PageProps) {
	const room = props.params.room;
	const origin = props.url.host;
	return (
		<div>
			<a href="/">Home</a>
			<Room origin={origin} room={room} />
		</div>
	);
}
