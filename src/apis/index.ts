import { GET } from "./request";

/**
 * 获取菜单
 * @returns
 */
export function getMenuApi() {
	return GET({ url: "/todos/menu" });
}
