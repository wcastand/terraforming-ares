import { PageProps } from "$fresh/server.ts";
import Room from "../islands/Room.tsx";

export default function RoomPage(props: PageProps) {
	const room = props.params.room;
	return (
		<div>
			<a href="/">Home</a>
			<Room room={room} />
		</div>
	);
}
