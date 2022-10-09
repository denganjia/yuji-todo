import { NIcon, IconProps } from "naive-ui";
import { Component, h } from "vue";
import mitt from "mitt";
export function renderIcon(icon: Component, props?: IconProps) {
	return () => h(NIcon, props, { default: () => h(icon) });
}

export const emiter = mitt();
