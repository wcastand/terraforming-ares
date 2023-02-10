import { PageProps } from "$fresh/server.ts";
import Room from "../islands/Room.tsx";

export default function RoomPage(props: PageProps) {
	return (
		<div>
			<a href="/">Home</a>
			<Room url={props.url} room={props.params.room} />
		</div>
	);
}
