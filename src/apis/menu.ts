import { GET, POST, PUT } from "./request";
import { Menus } from "./types";

/**
 * 获取菜单
 * @returns
 */
export function getMenuApi() {
	return GET<Menus.MenuTree>({ url: "/menu/menu" });
}

/**
 * 添加列表
 * @returns
 */
export function addListApi(data: Menus.AddList) {
	return POST({ url: "/menu/add-list", data });
}

/**
 * 添加组
 * @returns
 */
export function addGroupApi(data: Menus.AddGroup) {
	return POST({ url: "/menu/add-group", data });
}

export function moveListApi(data: Menus.MoveList) {
	return PUT({ url: "/menu/move-list", data });
}


export function getListDetailApi(params: Pick<Menus.List, "id">) {
	return GET<Menus.List>({ url: "/menu/list-detail", params });
}