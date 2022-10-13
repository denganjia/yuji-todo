<template>
  <n-list-item
      @click="$emit('detail', item.id)"
      @contextmenu="handleContextMenu"
      style="margin-bottom: 5px; padding: 12px"
  >
    <template #prefix>
      <n-button text @click="update({ id: item.id, finished: !item.finished })">
        <template #icon>
          <n-icon :size="18" @mouseenter="hover = true" @mouseleave="hover = false">
            <Round theme="outline" v-if="!hover && !item.finished"></Round>
            <CheckOne theme="outline" v-else></CheckOne>
          </n-icon>
        </template>
      </n-button>
    </template>
    <template #suffix>
      <n-button text>
        <template #icon>
          <n-icon @click="update({ id: item.id, star: !item.star })">
            <Star :theme="item.star ? 'two-tone' : 'outline'" :strokeWidth="0"></Star>
          </n-icon>
        </template>
      </n-button>
    </template>
    <span :class="{ done: item.finished }">{{ item.title }}</span>
  </n-list-item>
  <n-dropdown
      placement="top-start"
      trigger="manual"
      :x="position.x"
      :y="position.y"
      :options="options"
      :show="showDropdown"
      :on-clickoutside="clickoutside"
      @select="handleSelect"
  />
</template>

<script setup lang="ts">
import {ref, reactive, nextTick, computed} from "vue";
import {ToDos} from "@/apis/types";
import {useDialog} from "naive-ui";
import {Round, CheckOne, Star, DeleteFive, Sun} from "@icon-park/vue-next";
import {renderIcon} from "@/utils";
import {useRoute} from "vue-router";
import {emiter} from "@/utils";

const dialog = useDialog();
const route = useRoute();

const update = (item: any) => {
  emiter.emit("update-todo", item);
};
type Props = {
  item: ToDos.Todo;
};
// props
const props = defineProps<Props>();
// hover状态改变prefix图标
const hover = ref(false);

// 是否已存在于 我的一天
const inMyDay = props.item.onDay;
// 当前页面是不是 我的一天
const isMyDay = route.params.type === "myDay";
// 需要根据isMyDay和inMyDay改变的option
const fakeOption = computed(() => {
  if (isMyDay) {
    return {
      label: "从'我的一天'移除",
      key: "remove-my-day",
      icon: renderIcon(Sun),
    };
  } else if (inMyDay) {
    return {
      label: "已添加到'我的一天'",
      key: "add-my-day",
      icon: renderIcon(Sun),
      disabled: true,
    };
  } else {
    return {
      label: "添加到'我的一天'",
      key: "add-my-day",
      icon: renderIcon(Sun),
    };
  }
});
// 右键展开
const options = ref([
  fakeOption.value,
  {label: "divider", type: "divider"},
  {label: "删除任务", key: "delete", icon: renderIcon(DeleteFive), props: {style: {color: "red"}}},
]);
const position = reactive({x: 0, y: 0});
const showDropdown = ref(false);
const handleSelect = (key: string) => {
  if (key === "delete") {
    showDropdown.value = false;
    dialog.warning({
      title: "警告",
      content: "删除任务后无法恢复，请三思！",
      positiveText: "删除",
      negativeText: "取消",
      onPositiveClick() {
        emiter.emit("delete-todo", {id: props.item.id});
      },
      onNegativeClick() {
      },
    });
  }
  if (key === "add-my-day") {
    emiter.emit("update-todo", {id: props.item.id, oneDay: true});
    showDropdown.value = false;
  }
  if (key === "remove-my-day") {
    emiter.emit("update-todo", {id: props.item.id, oneDay: false});
    showDropdown.value = false;
  }
};
const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  showDropdown.value = false;
  nextTick().then(() => {
    showDropdown.value = true;
    position.x = e.clientX;
    position.y = e.clientY;
  });
};
const clickoutside = () => {
  showDropdown.value = false;
};
</script>

<style scoped lang="scss">
.n-list.n-list--bordered .n-list-item:not(:last-child) {
  margin-bottom: 5px;
}

.n-list-item {
  background-color: var(--n-color);
  border-radius: 3px;
  box-sizing: border-box;
  opacity: 0.9;
  transition: opacity 0.3s;
  overflow: hidden;
  :deep(.n-list-item__divider){
    display: none;
  }
  &:hover {
    opacity: 1;
  }

  :deep(.n-list-item__prefix) {
    display: flex;
  }

  :deep(.n-list-item__suffix) {
    display: flex;
  }
}

.done {
  text-decoration: line-through;
}
</style>
