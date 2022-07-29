export type APIBaseResult<D = any> = {
	code: number;
	data: D;
	msg: string;
};

export namespace User {
	type LoginForm = {
		email: string;
		password: string;
	};
	type RegisterForm = {
		email: string;
		name: string;
		password: string;
		code: string;
	};
	type LoginResult = {
		token: string;
		user: UserInfo;
	};
	type UserInfo = {
		name: string;
		avatar: string;
		email: string;
	};
}

export namespace Todos {
	type Todo = {};
}

export type Menu = {
	type: "folder";
	_id: string;
};
