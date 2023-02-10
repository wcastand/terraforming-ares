// deno-lint-ignore-file no-explicit-any
import { IS_BROWSER } from "$fresh/runtime.ts";

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
export function replacer(_: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
export function reviver(_: string, value: any) {
  if (typeof value === "object" && value !== null) {
    if (value.dataType === "Map") {
      return new Map(value.value);
    }
  }
  return value;
}

export function send(ws: WebSocket, msg: ServerMsg | ClientMsg) {
  ws.send(JSON.stringify(msg, replacer));
}

export function getLocalStorage() {
  if (IS_BROWSER) return localStorage;
  return undefined;
}
