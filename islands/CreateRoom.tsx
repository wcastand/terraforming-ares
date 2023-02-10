import { uniqueString } from "https://deno.land/x/uniquestring@v1.0.3/mod.ts";
import { useState } from "preact/hooks";

export default function CreateRoom() {
	const [roomName, setRoomName] = useState(uniqueString(5));
	return (
		<div>
			<input
				type="text"
				name="name"
				value={roomName}
				onChange={(e) => setRoomName(e.currentTarget.value)}
			/>
			<a href={`/${roomName}`}>Create/Join</a>
		</div>
	);
}
