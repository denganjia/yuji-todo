<template>
	<div class="asider-content">
		<MenuVue ref="menuRef" />
		<div class="resize" @mousedown="mouseDown"></div>
		<div class="footer">
			<div class="footer_btn" v-if="!showAdd">
				<n-button block quaternary style="flex: 1" icon-placement="left" @click="add('list')"
					>添加列表
					<template #icon>
						<AddFour></AddFour>
					</template>
				</n-button>
				<n-popover trigger="hover" :delay="500" :show-arrow="false" placement="top" style="padding: 5px">
					<template #trigger>
						<n-button quaternary @click="add('group')">
							<template #icon>
								<n-icon> <CategoryManagement></CategoryManagement></n-icon>
							</template>
						</n-button>
					</template>
					<span> 添加分类 </span>
				</n-popover>
			</div>
			<n-input
				v-else
				placeholder="请输入名称,回车添加"
				@blur="inputBlur"
				v-model:value="inputValue"
				@keyup.enter="addGroupOrList"
				ref="inputRef"
			></n-input>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from "vue";
import { CategoryManagement, AddFour } from "@icon-park/vue-next";
import { useMessage, InputInst } from "naive-ui";
import { addListApi, addGroupApi } from "@/apis";
import MenuVue from "./Menu.vue";
import { APIBaseResult } from "../../apis/types";

const message = useMessage();
const inputRef = ref<InputInst>();
const currentAdd = ref<"list" | "group">("list");
//添加 列表/组
const add = (tag: "list" | "group") => {
	showAdd.value = true;
	currentAdd.value = tag;
	nextTick(() => {
		inputRef.value?.focus();
	});
};
// 底部输入框
const showAdd = ref(false);
const inputValue = ref("");
const inputBlur = () => {
	showAdd.value = false;
};

// 菜单ref
const menuRef = ref();
// 添加列表名或组名
const addGroupOrList = async () => {
	if (inputValue.value.length > 0 && inputValue.value.trim().length > 0) {
		let result: APIBaseResult | null;
		const form = { name: inputValue.value };
		if (currentAdd.value === "list") {
			result = await addListApi(form);
		} else {
			result = await addGroupApi(form);
		}
		const { code, msg } = result;
		if (code === 200) {
			message.success("添加成功");
			menuRef.value.joinMenu();
		} else {
			message.error(msg);
		}
	}
	inputValue.value = "";
	showAdd.value = false;
};

// footer width
const footerWidth = ref(200);
// 侧边栏拖动
const emits = defineEmits<{ (e: "resize", val: number): void }>();
const mouseMove = (e: MouseEvent) => {
	if (e.x <= 400 && e.x >= 200) {
		emits("resize", e.x);
		footerWidth.value = e.x;
	}
};
const mouseDown = () => {
	document.body.style.cursor = "ew-resize";
	document.addEventListener("mousemove", mouseMove);
	document.addEventListener("mouseup", () => {
		document.body.style.cursor = "auto";
		document.removeEventListener("mousemove", mouseMove);
	});
};
</script>

<style scoped lang="scss">
.asider-content {
	width: 100%;
	height: calc(100vh - 48px);
	position: relative;
	box-sizing: border-box;
	padding: 2px 2px 40px;
	.resize {
		position: absolute;
		height: 100%;
		width: 5px;
		cursor: ew-resize;
		top: 0;
		right: 0;
	}
	.footer {
		width: 100%;
		position: absolute;
		bottom: 0;
		left: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 3px;
		box-sizing: border-box;
		background-color: var(--n-color);
		.footer_btn {
			display: flex;
			flex: 1;
		}
	}
}
</style>
