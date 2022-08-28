import { DELETE, GET, POST, PUT } from "./request";
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
//移动列表
export function moveListApi(data: Menus.MoveList) {
	return PUT({ url: "/menu/move-list", data });
}

//获取列表详情
export function getListDetailApi(params: Pick<Menus.List, "id">) {
	return GET<Menus.List>({ url: "/menu/list-detail", params });
}

//更新列表
export function updateListApi(params: Partial<Pick<Menus.List, "id" | "name" | "icon" | "img">>) {
	return PUT({ url: "/menu/update-list", data: params });
}

// 删除列表
export function deleteListApi(params: Pick<Menus.List, "id">) {
	return DELETE({ url: "/menu/delete-list", params });
}
// 删除分类
export function deleteFolderApi(params: Pick<Menus.List, "id">) {
	return DELETE({ url: "/menu/delete-group", params });
}
