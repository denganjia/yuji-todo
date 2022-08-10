import { GET } from "./request";

export * from "./login";
export * from "./menu";
export * from "./todo";

export function getBgImg() {
	return GET<[string]>({ url: "/bg-img" });
}
