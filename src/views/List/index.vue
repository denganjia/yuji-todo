<template>
	<div class="main-box">
		<div class="provider" v-if="dark"></div>
		<div class="body">
			<div class="head">
				<n-thing>
					<template #header>
						<span class="header">{{ listDetail.list?.name }}</span>
					</template>
					<template #description>
						<!-- <span class="desc" v-text="today()"></span> -->
					</template>
					<template #header-extra>
						<n-button quaternary size="small" style="--n-icon-size: 24px">
							<template #icon>
								<n-icon :component="More" :size="24" color="#fff"></n-icon>
							</template>
						</n-button>
					</template>
				</n-thing>
			</div>
			<div class="content">
				<todo-list :list="listDetail.todos" @star.capture="updateTodo"></todo-list>
			</div>
			<div class="footer">
				<AddTodo @add="addTodo"></AddTodo>
			</div>
		</div>
		<!-- <TodoDetail v-model:show="showDrawer"></TodoDetail> -->
	</div>
</template>

<script setup lang="ts">
import AddTodo from "@/components/AddTodo.vue";
import { More } from "@icon-park/vue-next";
import { useRoute, useRouter } from "vue-router";
import { computed, ref, watch } from "vue";
import { getListDetailApi, addTodoApi, updateTodoApi, getTodoListApi, deleteTodoApi } from "@/apis";
import { Menus } from "@/apis/types";
import { useMessage } from "naive-ui";
import TodoList from "@/components/TodoList/index.vue";
import { emiter } from "@/utils";

const message = useMessage();
const route = useRoute();
const router = useRouter();

//事件处理
emiter.on("update-todo", async e => {
	await updateTodoApi(e);
	getTodoList();
});
emiter.on("delete-todo", async (e: any) => {
	await deleteTodoApi(e);
	getTodoList();
});

const dark = ref(false);
//添加待办
const addTodo = async (title: string) => {
	if (!listDetail.value.list?.id) return;
	const { code, msg } = await addTodoApi({ title, listID: listDetail.value.list?.id });
	if (code === 200) {
		message.success("操作成功");
		getTodoList();
	} else {
		message.error(msg);
	}
};

const updateTodo = (id: string, args: any) => {
	console.log(id, args);
};

const item = computed(() => {
	return route.params;
});
const listDetail = ref<Menus.ListDetail>({
	list: { name: "", img: "", icon: "", id: "", groupID: "" },
	todos: [],
});

const getTodoList = async () => {
	const { data } = await getTodoListApi({ listId: item.value.id as string });
	listDetail.value.todos = data;
};

watch(
	() => item.value.id,
	async value => {
		const res = await Promise.all([
			getListDetailApi({ id: value as string }),
			getTodoListApi({ listId: value as string }),
		]);
		listDetail.value = {
			list: res[0].data,
			todos: res[1].data,
		};
	},
);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
