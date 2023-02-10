import { uniqueString } from "https://deno.land/x/uniquestring@v1.0.3/mod.ts";
import { useState } from "preact/hooks";

export default function PlayerName() {
	return (
		<div>
			<input
				type="text"
				name="name"
				value={localStorage.getItem("playerName") || uniqueString(5)}
				onChange={(e) =>
					localStorage.setItem("playerName", e.currentTarget.value)
				}
			/>
		</div>
	);
}
