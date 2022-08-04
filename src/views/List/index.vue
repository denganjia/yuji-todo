<template>
	<div class="main-box">
		<div class="provider" v-if="dark"></div>
		<div class="body">
			<div class="head">
				<n-thing>
					<template #header>
						<span class="header">{{ item.name }}</span>
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
				<!-- <todo-list :list="todoList" @change="switchFinish" @star="switchStar" @delete="deleteItem"></todo-list> -->
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
import { getListDetailApi } from "@/apis";
import { Menus } from "@/apis/types";
const route = useRoute();
const router = useRouter();

const dark = ref(false);
const addTodo = () => {};

const item = computed(() => {
	return route.params;
});
const listDetail = ref<Partial<Menus.ListDetail>>({
	list: { name: "", img: "", icon: "", id: "", groupID: "" },
	todos: [{}],
});

watch(
	() => item.value.id,
	async value => {
		const { data } = await getListDetailApi({ id: value as string });
		console.log(data);
	},
);
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
