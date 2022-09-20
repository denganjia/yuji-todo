import { GET } from "./request";

export * from "./login";
export * from "./menu";
export * from "./todo";

export function getBgImg() {
	return GET<[{thumb:string,full:string}]>({ url: "/bg-img" });
}
