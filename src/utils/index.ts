import { MenuOption, NIcon } from "naive-ui";
import { Component, h } from "vue";
import { Menus } from "../apis/types";

export function renderIcon(icon: Component) {
	return () => h(NIcon, null, { default: () => h(icon) });
}

export function renderMenu(menuTree: Menus.MenuTree & MenuOption) {
  
}
