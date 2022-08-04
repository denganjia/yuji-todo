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
		createTime: string;
		device: [string];
		id: string;
	};
}

export namespace ToDos {
	type Todo = {
		title: string;
		desc?: string;
		finished: boolean;
		endTime: string;
	};
}

export namespace Menus {
	type AddList = {
		name: string;
	};
	type AddGroup = AddList;

	type MenuTree = {
		groupID: null | string;
		id: string;
		img: null | string;
		name: string;
		type: "itemOutside" | "itemInside" | "folder";
	}[];

	type RemoveList = {
		id: string;
	};
	type RemoveGroup = RemoveList;

	type MoveList = {
		id: string;
		groupID?: string;
	};

	type List = {
		name: string;
		img: string | null;
		icon: string | null;
		id: string;
		groupID: string | null;
	};
	type ListDetail = {
		list: List;
		todos: Partial<ToDos.Todo>[];
	};
}
