<template>
	<div class="asider-content">
		<MenuVue />
		<div class="resize" @mousedown="mouseDown"></div>
		<div class="footer">
			<div class="footer_btn" v-if="!showAdd">
				<n-button block quaternary style="flex: 1" icon-placement="left" @click="add('list')"
					>添加列表
					<template #icon>
						<Plus></Plus>
					</template>
				</n-button>
				<n-popover trigger="hover" :delay="500" :show-arrow="false" placement="top" style="padding: 5px">
					<template #trigger>
						<n-button quaternary @click="add('group')">
							<template #icon>
								<n-icon> <Group></Group></n-icon>
							</template>
						</n-button>
					</template>
					<span> 创建组 </span>
				</n-popover>
			</div>
			<n-input
				v-else
				placeholder="请输入名称,回车添加"
				@blur="inputBlur"
				v-model:value="inputValue"
				@keyup.enter="addGroupOrList"
			></n-input>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { Group, Plus } from "@icon-park/vue-next";
import { useMessage } from "naive-ui";
import MenuVue from "./Menu.vue";

const message = useMessage();

const currentAdd = ref<"list" | "group">("list");
//添加 列表/组
const add = (tag: "list" | "group") => {
	showAdd.value = true;
	currentAdd.value = tag;
};
// 底部输入框
const showAdd = ref(false);
const inputValue = ref("");
const inputBlur = () => {
	showAdd.value = false;
};
// 添加列表名或组名
const addGroupOrList = () => {
	if (inputValue.value.length > 0) {
		message.success("添加成功");
	}
	inputValue.value = "";
	showAdd.value = false;
};
// 侧边栏拖动
const emits = defineEmits<{ (e: "resize", val: number): void }>();
const mouseMove = (e: MouseEvent) => {
	if (e.x <= 400 && e.x >= 200) {
		emits("resize", e.x);
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
	height: calc(100vh - 60px);
	position: relative;
	box-sizing: border-box;
	padding-bottom: 40px;
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
		.footer_btn {
			display: flex;
			flex: 1;
		}
	}
}
</style>
