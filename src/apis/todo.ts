import {DELETE, GET, POST, PUT} from "./request";
import {ToDos} from "./types";

export function getTodoListApi(params: { listId: string }) {
  return GET<ToDos.Todo[]>({url: "/todo/list", params});
}

/**
 * 添加待办
 * @param data
 * @returns
 */
export function addTodoApi(data: { title: string; listID: string; oneDay?: boolean; star?: boolean }) {
  return POST({url: "/todo/add-todo", data});
}

/**
 * 更新待办
 * @param data
 * @returns
 */
export function updateTodoApi(data: any) {
  return PUT({url: "/todo/update-todo", data});
}

/**
 * 删除待办
 * @param data
 * @returns
 */
export function deleteTodoApi(data: { id: string }) {
  return DELETE({url: "/todo/delete-todo", params: data});
}

/**
 * 待办详情
 * @returns
 * @param id String
 */
export function getTodoDetailApi(id: string) {
  return GET({url: '/todo/detail', params: {id}})
}