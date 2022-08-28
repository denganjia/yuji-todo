import { GET, POST } from "./request";
import { User } from "./types";

const PORT = "/user";
export function loginApi(form: any) {
	return POST<User.LoginResult>({ url: `${PORT}/login`, data: form });
}

export function logoutApi() {
	return POST({ url: `${PORT}/logout` });
}

export function registerApi(data: any) {
	return POST({ url: `${PORT}/register`, data });
}

export function getVerifyCodeApi(params: { email: string }) {
	return GET({ url: "/user/verify-code", params });
}
