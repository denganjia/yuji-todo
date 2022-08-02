import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
	state: () => ({
		user: {
			avatar: "",
			createTime: "",
			device: [],
			email: "",
			id: "",
			name: "",
		},
		token: "",
		rememberMe: false,
		loginForm: {
			email: "",
			password: "",
		},
	}),
	getters: {
		id(state) {
			return state.user.id;
		},
	},
	actions: {
		login(payload: { token: string; user: any }) {
			this.token = payload.token;
			this.user = payload.user;
		},
		remember(payload: boolean) {
			this.rememberMe = payload;
		},
		logout() {
			this.token = "";
			this.user = { avatar: "", createTime: "", device: [], email: "", id: "", name: "" };
			this.rememberMe = false;
		},
		setLoginForm(payload: { email: string; password: string }) {
			this.loginForm = payload;
		},
	},
	persist: true,
});
