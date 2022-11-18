<template>
	<div class="main-box" :style="{ backgroundImage: `url(${backgroundImg})` }">
		<div class="provider" v-if="dark"></div>
		<p
			class="header-extra"
			v-if="showDrawerBtn"
			:style="{ '-webkit-app-region': GlobalStore.headerHeight === '0px' ? 'drag' : 'no-drag' }"
		>
			<n-button quaternary class="no-drag" @click="showDrawerMenu = true" size="small" style="--n-padding: 0 7px">
				<template #icon>
					<n-icon :component="HamburgerButton" :size="24" color="#fff"></n-icon>
				</template>
			</n-button>
			<n-space>
				<n-button
					v-if="GlobalStore.headerHeight === '0px'"
					quaternary
					class="no-drag"
					type="warning"
					@click="minWindow"
					size="tiny"
					style="--n-padding: 0 7px"
				>
					<template #icon>
						<n-icon :component="Minus" :size="18" color="#fff"></n-icon>
					</template>
				</n-button>
				<n-button
					v-if="GlobalStore.headerHeight === '0px'"
					quaternary
					class="no-drag"
					type="warning"
					@click="closeWindow"
					size="tiny"
					style="--n-padding: 0 7px"
				>
					<template #icon>
						<n-icon :component="Close" :size="18" color="#fff"></n-icon>
					</template>
				</n-button>
			</n-space>
		</p>
		<div class="body">
			<div class="head">
				<n-thing>
					<template #header>
						<div style="height: 40px; display: flex" v-click-outside="clickOutSide">
							<template v-if="listDetail.list.icon || showEditTitle">
								<span class="header" @click="iconClick">
									<span v-if="listDetail.list.icon">{{ listDetail.list.icon }}</span>
									<EmotionHappy v-else></EmotionHappy>
								</span>
							</template>
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
						<n-button quaternary size="tiny" style="--n-icon-size: 24px" @click="fixTopOrRestoreWindow">
							<template #icon>
								<n-icon :component="fixStatus ? InternalReduction : InternalExpansion" :size="24" color="#fff"></n-icon>
							</template>
						</n-button>
						<ListOption @set-img="setImg" @rename="editTitle">
							<n-button quaternary size="tiny" style="--n-icon-size: 24px">
								<template #icon>
									<n-icon :component="More" :size="24" color="#fff"></n-icon>
								</template>
							</n-button>
						</ListOption>
					</template>
				</n-thing>
			</div>
			<div class="content">
				<todo-list :list="listDetail.todos" :key="currentMenu.id"></todo-list>
			</div>
			<div class="footer">
				<AddTodo @add="addTodo" v-if="currentMenu?.type !== 'finished'"></AddTodo>
			</div>
		</div>
		<TodoDetail v-model:show="showTodoDetail"></TodoDetail>
		<n-drawer
			v-model:show="showDrawerMenu"
			placement="left"
			:z-index="10"
			:auto-focus="false"
			:width="200"
			display-directive="show"
		>
			<n-drawer-content
				closable
				:header-style="{
					'-webkit-app-region': 'no-drag',
					display: GlobalStore.headerHeight === '0px' ? 'none' : 'flex',
				}"
				:body-content-style="{ padding: 0, height: 'auto', '--header-height': GlobalStore.headerHeight }"
			>
				<AsiderVue />
			</n-drawer-content>
		</n-drawer>
	</div>
</template>

<script setup lang="ts">
import AddTodo from "@/components/AddTodo.vue";
import TodoDetail from "@/components/TodoDetail/index.vue";
import ListOption from "@/components/ListOption/index.vue";
import {
	More,
	EmotionHappy,
	HamburgerButton,
	InternalExpansion,
	InternalReduction,
	Close,
	Minus,
} from "@icon-park/vue-next";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { getListDetailApi, addTodoApi, updateTodoApi, getTodoListApi, deleteTodoApi, updateListApi } from "@/apis";
import { Menus } from "@/apis/types";
import { InputInst } from "naive-ui";
import TodoList from "@/components/TodoList/index.vue";
import { emiter } from "@/utils";
import dayjs from "dayjs";
import { useGlobalStore } from "@/stores/globalStore";
import { useMenuStore } from "@/stores/menuStore";
import AsiderVue from "@/layout/components/Asider.vue";
import { useTheme } from "@/stores/themeStore";
import { vClickOutside } from "@/utils/directives";

const theme = useTheme();
const { ipcRenderer } = require("electron");
const menuStore = useMenuStore();
const GlobalStore = useGlobalStore();

//背景图片
const backgroundImg = ref("");
//待办详情
const showTodoDetail = ref(false);

// 列表配置
const setImg = async (val: { thumb: string; full: string }) => {
	const listImg = listDetail.value.list.img;
	if (listImg !== null) {
		if (typeof listImg === "string" && listImg === val.full) return;
		if (typeof listImg === "object" && listImg.full === val.full) return;
	}
	await updateListApi({ id: listDetail.value.list.id, img: val as unknown as string });
	changeFullImage(val);
};
//标题能否被修改
const titleCanEdit = computed(() => {
	return currentMenu.value.type.includes("item");
});
const inputRef = ref<InputInst>();
const titleCache = ref("");
const showEditTitle = ref(false);

// 设置标题
const editTitle = () => {
	if (!titleCanEdit.value) return;
	titleCache.value = listDetail.value.list?.name;
	showEditTitle.value = true;
	nextTick(() => {
		inputRef.value.focus();
	});
};
//输入框失焦
const inputBlur = () => {
	if (titleCache.value !== listDetail.value.list.name && titleCache.value.trim().length > 0) {
		listDetail.value.list.name = titleCache.value;
		updateListApi({ id: listDetail.value.list.id, name: titleCache.value }).then(() => {
			emiter.emit("joinMenu");
		});
	}
};
//点击外部的触发事件
const clickOutSide = () => {
	if (showEditTitle.value) {
		showEditTitle.value = false;
	}
};
// 图标点击
const iconClick = (e: MouseEvent) => {
	const iconInput = document.createElement("input");
	iconInput.id = "icon-input";
	iconInput.setAttribute("style", `position:absolute;left:${e.clientX}px;top:${e.clientY}px;z-index:-10;`);
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

// 暗黑模式
const dark = computed(() => {
	return theme.systemTheme === "dark";
});
//添加待办
const addTodo = async (title: string) => {
	let listID = currentMenu.value.id as string;
	console.log(currentMenu.value.type.includes("item"));

	if (!currentMenu.value.type.includes("item")) {
		listID = menuStore.getTaskId;
	}
	const { code } = await addTodoApi({
		title,
		listID: listID,
		oneDay: currentMenu.value.type === "myDay",
		star: currentMenu.value.type === "star",
	});
	if (code === 200) {
		getTodoList();
	}
};

const currentMenu = computed(() => {
	return GlobalStore.currentMenu;
});
const listDetail = ref<Menus.ListDetail>({
	list: { name: "", img: "", icon: "", id: "", groupID: "" },
	todos: [],
});

// 获取待办列表
const getTodoList = () => {
	if (!currentMenu.value.id) return;
	getTodoListApi({ listId: currentMenu.value.id as string }).then(({ data }) => {
		listDetail.value.todos = data;
	});
};
// 获取当前列表详情
const getListDetail = async () => {
	if (!currentMenu.value.id) return;
	const { data } = await getListDetailApi({ id: currentMenu.value.id as string });
	listDetail.value.list = data;
	changeFullImage(data.img);
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
	await updateTodoApi(e);
	getTodoList();
});
emiter.on("delete-todo", async (e: any) => {
	const index = listDetail.value.todos.findIndex(todo => todo.id === e.id);
	listDetail.value.todos.splice(index, 1);
	await deleteTodoApi(e);
	// getTodoList();
});

watch(
	() => currentMenu.value,
	nValue => {
		if (!nValue) return;
		getListDetail();
		getTodoList();
	},
	{ immediate: true },
);
//监听屏幕缩小显示 drawer
const showDrawerBtn = ref(false);
const resizeListener = (e: any) => {
	if (e.target.outerWidth < 771) {
		if (!showDrawerBtn.value) {
			showDrawerBtn.value = true;
		}
	}
	if (e.target.outerWidth > 771) {
		if (showDrawerBtn.value) {
			showDrawerBtn.value = false;
			showDrawerMenu.value = false;
		}
	}
};
onMounted(() => {
	window.addEventListener("resize", resizeListener);
	if (window.outerWidth <= 771) {
		showDrawerBtn.value = true;
	}
});
onUnmounted(() => {
	window.removeEventListener("resize", resizeListener);
	emiter.off("update-todo");
	emiter.off("delete-todo");
});
//
const showDrawerMenu = ref(false);

//
const fixStatus = ref(false);
//置顶窗口或者还原
const fixTopOrRestoreWindow = () => {
	if (!fixStatus.value) {
		ipcRenderer.send("fix-top");
	} else {
		ipcRenderer.send("restore-window");
	}
	fixStatus.value = !fixStatus.value;
};
//关闭
const closeWindow = () => {
	ipcRenderer.send("win-close");
	GlobalStore.setHeaderHeight("50px");
};
//最小化
const minWindow = () => {
	ipcRenderer.send("win-minimize");
};

// 先使用缩略图，在整个大图加载后，切换至大图
const changeFullImage = (src: string | { thumb: string; full: string }) => {
	const img = new Image();
	if (typeof src === "string") {
		img.src = src;
	} else if (typeof src === "object" && src !== null) {
		backgroundImg.value = src.thumb;
		img.src = src.full;
	} else {
		backgroundImg.value = GlobalStore.bgImg[0].thumb;
		img.src = GlobalStore.bgImg[0].full;
	}
	document.body.style.cursor = "wait";
	let id = setInterval(() => {
		if (img.complete) {
			clearInterval(id);
			document.body.style.cursor = "";
			backgroundImg.value = img.src;
		}
	}, 50);
};

// 监听 Drawer里的update-menu事件
emiter.on("update-menu", () => {
	showDrawerMenu.value = false;
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
