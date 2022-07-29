<script setup lang="ts">
import { DEFAULT_ICON_CONFIGS, IconProvider } from "@icon-park/vue-next";
import Provider from "@/components/Provider.vue";
import { zhCN, dateZhCN } from "naive-ui";
IconProvider({
	...DEFAULT_ICON_CONFIGS,
	theme: "outline",
	strokeWidth: 2,
});
</script>

<template>
	<n-config-provider :locale="zhCN" :date-local="dateZhCN">
		<n-dialog-provider>
			<n-message-provider>
				<n-notification-provider>
					<n-loading-bar-provider>
						<Provider></Provider>
						<router-view></router-view>
					</n-loading-bar-provider>
				</n-notification-provider>
			</n-message-provider>
		</n-dialog-provider>
	</n-config-provider>
</template>

<style>
body {
	/* height: 100vh; */
}
#app {
	/* height: 100%; */
}
</style>
