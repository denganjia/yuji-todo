<template>
	<div class="main-box" :style="{ backgroundImage: `url(${listDetail.list.img ?? GlobalStore.bgImg[0]})` }">
		<div class="provider" v-if="dark"></div>
		<div class="body">
			<div class="head">
				<n-thing>
					<template #avatar v-if="listDetail.list.icon || showEditTitle">
						<n-button quaternary class="header" @click="iconClick" :focusable="false">
							<span v-if="listDetail.list.icon">{{ listDetail.list.icon }}</span>
							<EmotionHappy v-else></EmotionHappy>
						</n-button>
					</template>
					<template #header>
						<div style="height: 40px">
							<n-input
								v-if="showEditTitle"
								class="header"
								v-model:value="titleCache"
								ref="inputRef"
								@blur="inputBlur"
							></n-input>
							<span class="header" v-else @click="editTitle">{{ listDetail.list?.name }}</span>
						</div>
					</template>
					<template #description>
						<span class="desc" v-text="today()"></span>
					</template>
					<template #header-extra>
						<ListOption @set-img="setImg" @rename="editTitle"
							><n-button quaternary size="small" style="--n-icon-size: 24px">
								<template #icon>
									<n-icon :component="More" :size="24" color="#fff"></n-icon>
								</template> </n-button
						></ListOption>
					</template>
				</n-thing>
			</div>
			<div class="content">
				<todo-list :list="listDetail.todos"></todo-list>
			</div>
			<div class="footer">
				<AddTodo @add="addTodo" v-if="item.type !== 'finished'"></AddTodo>
			</div>
		</div>
		<TodoDetail v-model:show="showTodoDetail"></TodoDetail>
	</div>
</template>

<script setup lang="ts">
import AddTodo from "@/components/AddTodo.vue";
import TodoDetail from "@/components/TodoDetail/index.vue";
import ListOption from "@/components/ListOption/index.vue";
import { More, EmotionHappy } from "@icon-park/vue-next";
import { useRoute, useRouter } from "vue-router";
import { computed, ref, watch } from "vue";
import { getListDetailApi, addTodoApi, updateTodoApi, getTodoListApi, deleteTodoApi, updateListApi } from "@/apis";
import { Menus } from "@/apis/types";
import { InputInst, useMessage } from "naive-ui";
import TodoList from "@/components/TodoList/index.vue";
import { emiter } from "@/utils";
import dayjs from "dayjs";
import { useGlobalStore } from "@/stores/globalStore";
import { useMenuStore } from "@/stores/menuStore";

const { ipcRenderer } = require("electron");
const menuStore = useMenuStore();
const message = useMessage();
const route = useRoute();
const router = useRouter();
const GlobalStore = useGlobalStore();

//待办详情
const showTodoDetail = ref(false);

// 列表配置
const setImg = (val: string) => {
	if (val === listDetail.value.list.img) return;
	updateListApi({ id: listDetail.value.list.id, img: val });
	getListDetail();
};

//标题能否被修改
const titleCanEdit = computed(() => {
	return item.value.type.includes("item");
});
const inputRef = ref<InputInst>();
const titleCache = ref("");
const showEditTitle = ref(false);
const editTitle = () => {
	if (!titleCanEdit.value) return;
	titleCache.value = listDetail.value.list?.name;
	showEditTitle.value = true;
};
//输入框失焦
const inputBlur = () => {
	if (titleCache.value !== listDetail.value.list.name && titleCache.value.trim().length > 0) {
		listDetail.value.list.name = titleCache.value;
		updateListApi({ id: listDetail.value.list.id, name: titleCache.value }).then(() => {
			// getListDetail();
			emiter.emit("joinMenu");
		});
	}
	showEditTitle.value = false;
};
// 图标点击
const iconClick = () => {
	const iconInput = document.createElement("input");
	iconInput.id = "icon-input";
	iconInput.setAttribute("style", "position:absolute;left:250px;top:130px;z-index:-10;");
	iconInput.maxLength = 1;
	document.body.appendChild(iconInput);
	iconInput.focus();
	ipcRenderer.send("open-emoji");
	iconInput.oninput = (e: Event) => {
		let icon = (e.target as HTMLInputElement).value;
		if (icon.length > 0) {
			if (icon == listDetail.value.list.icon || icon.includes(listDetail.value.list.icon ?? "null")) return;
			listDetail.value.list.icon = icon;
			updateListApi({ id: listDetail.value.list.id, icon }).then(() => {
				// getListDetail();
				emiter.emit("joinMenu");
			});
		}
	};
	iconInput.onblur = () => {
		iconInput.remove();
		showEditTitle.value = false;
	};
};
// 时间处理
const date = dayjs();
const today = () => {
	const weekDay = ["日", "一", "二", "三", "四", "五", "六"];
	return `${date.month() + 1}月${date.date()}日,星期${weekDay[date.day()]}`;
};

const dark = ref(false);
//添加待办
const addTodo = async (title: string) => {
	let listID = item.value.id as string;
	console.log(item.value.type.includes("item"));

	if (!item.value.type.includes("item")) {
		listID = menuStore.getTaskId;
	}
	const { code, msg } = await addTodoApi({
		title,
		listID: listID,
		oneDay: item.value.type === "myDay",
		star: item.value.type === "star",
	});
	if (code === 200) {
		getTodoList();
	} else {
		message.error(msg);
	}
};

const item = computed(() => {
	return route.params;
});
const listDetail = ref<Menus.ListDetail>({
	list: { name: "", img: "", icon: "", id: "", groupID: "" },
	todos: [],
});

const getTodoList = () => {
	if (!item.value.id) return;
	getTodoListApi({ listId: item.value.id as string }).then(({ data }) => {
		listDetail.value.todos = data;
	});
};
const getListDetail = () => {
	if (!item.value.id) return;
	getListDetailApi({ id: item.value.id as string }).then(({ data }) => {
		listDetail.value.list = data;
	});
};

//事件处理
emiter.on("update-todo", async (e: any) => {
	listDetail.value.todos.forEach(todo => {
		if (todo.id === e.id) {
			Object.keys(e).forEach(key => {
				todo[key] = e[key];
			});
		}
	});
	updateTodoApi(e);
	getTodoList();
});
emiter.on("delete-todo", async (e: any) => {
	const index = listDetail.value.todos.findIndex(todo => todo.id === e.id);
	listDetail.value.todos.splice(index, 1);
	deleteTodoApi(e);
	// getTodoList();
});
watch(
	() => item.value.id,
	() => {
		getListDetail();
		getTodoList();
	},
	{ immediate: true },
);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
