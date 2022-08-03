import { POST } from "./request";
import { User } from "./types";

const PORT = "/user";
export function loginApi(form: any) {
	return POST<User.LoginResult>({ url: `${PORT}/login`, data: form });
}

export function logoutApi() {
	return POST({ url: `${PORT}/logout` });
}
