import { GET, POST } from "./request";
import { Menus } from "./types";

export function getListDetailApi(params: Pick<Menus.List, "id">) {
	return GET<Menus.ListDetail>({ url: "/menu/list-detail", params });
}
