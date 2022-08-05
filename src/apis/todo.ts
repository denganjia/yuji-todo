import { DELETE, GET, POST, PUT } from "./request";
import { ToDos } from "./types";

export function getTodoListApi(params: { listId: string }) {
	return GET<ToDos.Todo[]>({ url: "/todo/list", params });
}

/**
 * 添加待办
 * @param data
 * @returns
 */
export function addTodoApi(data: { title: string; listID: string }) {
	return POST({ url: "/todo/add-todo", data });
}

export function updateTodoApi(data: any) {
	return PUT({ url: "/todo/update-todo", data });
}

export function deleteTodoApi(data: { id: string }) {
	return DELETE({ url: "/todo/delete-todo", params: data });
}
