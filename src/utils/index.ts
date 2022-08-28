import { MenuOption, NIcon, IconProps } from "naive-ui";
import { Component, h } from "vue";
import { Menus } from "../apis/types";
import mitt from "mitt";
export function renderIcon(icon: Component, props?: IconProps) {
	return () => h(NIcon, props, { default: () => h(icon) });
}

export function renderMenu(menuTree: Menus.MenuTree & MenuOption) {}

export const emiter = mitt();
