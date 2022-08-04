<template>
	<div class="header-content">
		<div class="logo"> Logo </div>
		<div class="header">
			<n-input class="no-drag" style="width: 200px" placeholder="搜索">
				<template #prefix>
					<n-icon>
						<Search theme="outline"></Search>
					</n-icon>
				</template>
			</n-input>
			<div class="no-drag header-action">
				<n-space :size="5" align="center" :wrap-item="false">
					<n-dropdown trigger="hover" :options="option" :show-arrow="true" @select="select">
						<n-avatar
							:size="30"
							round
							:src="userStore.user.avatar ?? 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'"
						>
						</n-avatar>
					</n-dropdown>
					<n-button quaternary size="small">
						<template #icon>
							<n-icon>
								<SettingTwo theme="outline"></SettingTwo>
							</n-icon>
						</template>
					</n-button>
				</n-space>
				<div class="divider"></div>
				<div style="flex: none; display: flex; align-items: center">
					<n-space :size="5">
						<n-popover trigger="hover" :delay="500" :show-arrow="false" style="padding: 5px">
							<template #trigger>
								<n-button quaternary size="small" @click="handleWindow('minimize')">
									<template #icon>
										<n-icon>
											<Minus></Minus>
										</n-icon>
									</template>
								</n-button>
							</template>
							<span>最小化</span>
						</n-popover>
						<n-popover trigger="hover" :delay="500" :show-arrow="false" style="padding: 5px">
							<template #trigger>
								<n-button quaternary size="small" @click="handleWindow('maximize')">
									<template #icon>
										<n-icon>
											<Square v-if="!isWindowMax" theme="outline"></Square>
											<Copy v-else theme="outline"></Copy>
										</n-icon>
									</template>
								</n-button>
							</template>
							<span> {{ isWindowMax ? "向下还原" : "最大化" }} </span>
						</n-popover>
						<n-popover trigger="hover" :delay="500" :show-arrow="false" style="padding: 5px">
							<template #trigger>
								<n-button quaternary size="small" @click="handleWindow('close')">
									<template #icon>
										<n-icon>
											<Close></Close>
										</n-icon>
									</template>
								</n-button>
							</template>
							<span> 退出 </span>
						</n-popover>
					</n-space>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Square, Copy, Search, SettingTwo, Close, Minus, Logout, User } from "@icon-park/vue-next";
import { DropdownOption } from "naive-ui";
import { ref } from "vue";
import { renderIcon } from "@/utils";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";
import { logoutApi } from "@/apis";

const userStore = useUserStore();
const router = useRouter();
//头像下拉菜单
const option: DropdownOption[] = [
	{ label: "个人信息设置", key: "set-user-info", icon: renderIcon(User) },
	{ type: "divider", key: "divider1" },
	{ label: "注销登录", key: "logout", icon: renderIcon(Logout) },
];
// 下拉选择
const select = (key: string) => {
	if (key === "logout") {
		logoutApi();
		router.push("/login");
		userStore.logout();
	}
};
// 窗口事件处理
const { ipcRenderer } = require("electron");
const handleWindow = (event: "close" | "minimize" | "maximize") => {
	ipcRenderer.send(`win-${event}`);
};
const isWindowMax = ref(false);
ipcRenderer.on("window-maxed", (e: any, arg: boolean) => {
	isWindowMax.value = arg;
});
</script>

<style scoped lang="scss">
.header-content {
	height: 60px;
	box-sizing: border-box;
	background-color: #f5f5f5;
	padding: 10px;
	-webkit-app-region: drag;
	padding: 10px;
	display: flex;
	justify-content: space-between;
	align-items: center;

	.logo {
		width: 200px;
		height: 40px;
		margin-right: 10px;
	}
	.header {
		flex: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-left: 10px;
	}
	.no-drag {
		-webkit-app-region: no-drag;
	}

	.header-action {
		display: flex;

		.divider {
			height: auto;
			width: 1px;
			background-color: #a1a2a3;
			margin: 0 5px;
		}
	}
}
</style>
