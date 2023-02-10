import { PageProps } from "$fresh/server.ts";
import Room from "../islands/Room.tsx";

export default function RoomPage(props: PageProps) {
	return (
		<div>
			<a href="/">Home</a>
			<Room
				origin={props.url.host}
				protocol={props.url.protocol}
				room={props.params.room}
			/>
		</div>
	);
}
