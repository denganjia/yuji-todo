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
    listID: string;
    oneDay: boolean;
    star: boolean;
    remindTime: number;
    id: string;
    createTime: number;
    steps: { title: string, finished: boolean }[]
    [key: string]: any;
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
    icon: string | null | (() => void);
    lists: MenuTree;
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
    img: string | null | { thumb: string; full: string };
    icon: string | null;
    id: string;
    groupID: string | null;
    type?: "itemOutside" | "itemInside" | "folder" | "task" | "finished" | "star" | "myDay";
  };
  type ListDetail = {
    list: List;
    todos: ToDos.Todo[];
  };
}
