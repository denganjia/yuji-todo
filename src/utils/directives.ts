import { Directive } from "vue";

export const vClickOutside: Directive = {
	mounted(el: HTMLElement, binding: any) {
		document.onclick = ev => {
			const rect = el.getBoundingClientRect();
			let position = {
				x: [rect.x, rect.x + el.clientWidth],
				y: [rect.y, rect.y + el.clientHeight],
			};
			if (ev.x < position.x[0] || ev.x > position.x[1] || ev.y < position.y[0] || ev.y > position.y[1]) {
				if (typeof binding.value === "function") {
						binding.value();
				}
			}
		};
	},
	unmounted(el, binding) {
		document.onclick = null;
	},
};
