<template>
	<div
		class="main-box"
		:style="{
			'--n-color': isDark ? 'rgb(16,16,20)' : '#fff',
			'--n-text-color': isDark ? 'rgba(255,255,255,0.82)' : 'rgb(51,54,57)',
		}"
	>
		<div class="fix-top">
			<HeaderVue :style="{ '--header-height': globalStore.headerHeight }"></HeaderVue>
		</div>
		<div class="page-header">
			<n-space align="center">
				<n-button text @click="goBack">
					<template #icon>
						<n-icon :size="24">
							<ArrowCircleLeft :strokeWidth="4"></ArrowCircleLeft>
						</n-icon>
					</template>
				</n-button>
				<span class="title">设置</span>
			</n-space>
		</div>
		<n-divider style="margin-top: 12px"></n-divider>
		<div class="content">
			<n-descriptions title="界面设置" :column="1" label-placement="top">
				<n-descriptions-item label="主题">
					<n-radio-group v-model:value="themeType" @update:value="changeTheme">
						<n-radio value="light">浅色主题</n-radio>
						<n-radio value="dark">深色主题</n-radio>
						<n-radio value="auto">使用系统主题</n-radio>
					</n-radio-group>
				</n-descriptions-item>
				<n-descriptions-item label="主题色">
					<n-color-picker
						v-model:value="primaryColor"
						placement="bottom-end"
						:to="false"
						size="small"
						:show-alpha="false"
						:swatches="['#18A058', '#2080F0', '#F0A020']"
					></n-color-picker>
				</n-descriptions-item>
			</n-descriptions>
			<NDescriptions title="系统设置" :column="1" label-placement="top">
				<NDescriptionsItem label="开机自启动">
					<NSwitch v-model:value="startAtLogin"></NSwitch>
				</NDescriptionsItem>
			</NDescriptions>
			<!-- <NDescriptions title="个人信息设置" :column="1" label-placement="left">
				<NDescriptionsItem label="头像"></NDescriptionsItem>
				<NDescriptionsItem label="账号">
          <NInput disabled :value="'12'"></NInput>
        </NDescriptionsItem>
				<NDescriptionsItem label="密码"></NDescriptionsItem>
			</NDescriptions> -->
		</div>
	</div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { useTheme } from "@/stores/themeStore";
import { ArrowCircleLeft } from "@icon-park/vue-next";
import HeaderVue from "@/layout/components/Header.vue";
import { useGlobalStore } from "@/stores/globalStore";
import { computed } from "vue";
import { ipcRenderer } from "electron";

const globalStore = useGlobalStore();
const theme = useTheme();
const router = useRouter();

const isDark = computed(() => {
	return theme.systemTheme === "dark";
});
const goBack = () => {
	router.back();
};

const themeType = computed({
	get() {
		return theme.themeType;
	},
	set(val: "light" | "dark" | "auto") {
		theme.setThemeType(val);
	},
});

const primaryColor = computed({
	get() {
		return theme.primaryColor;
	},
	set(v) {
		theme.setPrimaryColor(v);
		location.reload();
	},
});
const changeTheme = (e: string) => {
	if (e === "auto") {
		const shouldDark = ipcRenderer.sendSync("get-system-theme");
		theme.setSystemTheme(shouldDark);
		ipcRenderer.on("change-system-theme", (e, args) => {
			theme.setSystemTheme(args);
		});
	}
};

const startAtLogin = computed({
	get() {
		return globalStore.startAtLogin;
	},
	set(val: boolean) {
		ipcRenderer.send("set-launch-with-windows", val);
		globalStore.setStartAtLogin(val);
	},
});
</script>

<style scoped lang="scss">
.main-box {
	height: 100vh;
	background: var(--n-color);

	.fix-top {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		z-index: 100;
	}

	.page-header {
		//display: flex;
		padding: 62px 24px 0;
		height: 100px;
		box-sizing: border-box;
		backdrop-filter: blur(18px);

		.title {
			font-size: 24px;
			color: var(--n-text-color);
		}
	}

	.content {
		min-width: 180px;
		max-width: 500px;
		margin: auto;
		padding: 0 30px;
		box-sizing: border-box;
		overflow: hidden;
		height: calc(100vh - 100px - 37px);
	}
}
</style>
