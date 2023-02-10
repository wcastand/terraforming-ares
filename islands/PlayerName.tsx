import { uniqueString } from "https://deno.land/x/uniquestring@v1.0.3/mod.ts";
import { useState } from "preact/hooks";
import { getLocalStorage } from "../utils.ts";

export default function PlayerName() {
	return (
		<div>
			<input
				type="text"
				name="name"
				value={getLocalStorage()?.getItem("playerName") || uniqueString(5)}
				onChange={(e) =>
					getLocalStorage()?.setItem("playerName", e.currentTarget.value)
				}
			/>
		</div>
	);
}
