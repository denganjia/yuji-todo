<template>
  <div
      class="menu-content"
      ref="menuContent"
      @dragover.self="preventDefault"
      @drop.self="sideOnDrop"
      @dragenter.self="ondragenter"
      @dragleave.self="dragLeave"
  >
    <n-scrollbar style="max-height: calc(100vh - 100px)">
      <n-menu
          :options="menu"
          key-field="id"
          children-field="lists"
          label-field="name"
          :node-props="menuItemProps"
          :default-expand-keys="defaultExpandKeys"
          :render-icon="renderMenuIcon"
          :root-indent="24"
          :value="defaultActive"
          @update:value="updateMenu"
      ></n-menu>
    </n-scrollbar>
    <n-dropdown
        placement="bottom-start"
        trigger="manual"
        :x="position.x"
        :y="position.y"
        :options="contentMenuOption"
        :show="showContentMenu"
        :on-clickoutside="clickOutside"
        @select="contentMenuSelect"
    />
  </div>
</template>

<script setup lang="ts">
import {
  SunOne,
  Star,
  Notepad,
  CategoryManagement,
  ListTwo,
  CheckCorrect,
  DeleteFive,
  Edit,
} from "@icon-park/vue-next";
import {MenuOption, useMessage} from "naive-ui";
import {getMenuApi, moveListApi, deleteFolderApi, deleteListApi} from "@/apis";
import {onBeforeMount, reactive, ref, h, computed, nextTick} from "vue";
import {renderIcon} from "@/utils";
import {useRouter} from "vue-router";
import {useMenuStore} from "@/stores/menuStore";
import {emiter} from "@/utils";
import {useGlobalStore} from "@/stores/globalStore";

const globalStore = useGlobalStore();
const menuStore = useMenuStore();
const router = useRouter();
const menuContent = ref<HTMLElement>();
const message = useMessage();
const defaultExpandKeys = ref([]);
const defaultActive = computed(() => {
  return globalStore.currentMenu?.id;
});
const menu = ref<any>([]);
//menu 更新
const updateMenu = (key: string, item: any) => {
  globalStore.setCurrentMenu({id: key, type: item.type});
};

//右键菜单
const showContentMenu = ref(false);
const currentMenu = ref({id: ""});
const contentMenuOption = ref<MenuOption[]>([]);
const folderMenu: MenuOption[] = [
  {label: "重命名分类", key: "rename-folder", icon: renderIcon(Edit)},
  {type: "divider", key: "divider"},
  {
    label: () => h("span", {style: "color:red;"}, "删除分类"),
    key: "remove-folder",
    icon: renderIcon(DeleteFive, {color: "red"}),
  },
];
const itemMenu: MenuOption[] = [
  {
    label: () => h("span", {style: "color:red;"}, "删除列表"),
    key: "remove-list",
    icon: renderIcon(DeleteFive, {color: "red"}),
  },
];
const contentMenuSelect = (key: string) => {
  if (key === "remove-folder") {
    deleteFolderApi({id: currentMenu.value.id});
  } else if (key === "remove-list") {
    deleteListApi({id: currentMenu.value.id});
  } else if (key === "rename-folder") {
  }
  joinMenu();
  showContentMenu.value = false;
  globalStore.setCurrentMenu({id: menu.value[0].id, type: menu.value[0].type});
};
const position = reactive({
  x: 0,
  y: 0,
});
const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  showContentMenu.value = false;
  nextTick().then(() => {
    showContentMenu.value = true;
    position.x = e.clientX;
    position.y = e.clientY;
  });
};
const clickOutside = () => {
  showContentMenu.value = false;
};
// 设置菜单节点属性
const menuItemProps = (option: MenuOption) => {
  if (option.type === "folder") {
    return {
      ondragover(e: DragEvent) {
        e.preventDefault();
        document.getElementById(option.id as string)?.classList.add("drop-active");
      },
      ondragenter(e: DragEvent) {
        e.preventDefault();
      },
      ondragleave(e: DragEvent) {
        e.preventDefault();
        document.getElementById(option.id as string)?.classList.remove("drop-active");
      },
      async ondrop(e: DragEvent) {
        e.stopPropagation();
        const {id, groupID} = JSON.parse(e.dataTransfer?.getData("text/plain") ?? "");
        if (groupID !== option.id) {
          const {code} = await moveListApi({id, groupID: option.id as string});
          if (code === 200) {
            message.success("操作成功!");
            await joinMenu();
          }
        }
        document.getElementById(option.id as string)?.classList.remove("drop-active");
      },
      oncontextmenu(e: MouseEvent) {
        //@ts-ignore
        contentMenuOption.value = folderMenu;
        currentMenu.value.id = option.id as string;
        handleContextMenu(e);
      },
      style: "margin:6px 2px 0",
      id: option.id,
    };
  } else if (option.type === "itemOutside" || option.type === "itemInside") {
    return {
      draggable: true,
      ondragstart(e: DragEvent) {
        e.dataTransfer!.effectAllowed = "move";
        e.dataTransfer?.setData("text/plain", JSON.stringify({id: option.id as string, groupID: option.groupID}));
      },
      oncontextmenu(e: MouseEvent) {
        //@ts-ignore
        contentMenuOption.value = itemMenu;
        currentMenu.value.id = option.id as string;
        handleContextMenu(e);
      },
    };
  } else {
    return {
      ondragover(e: DragEvent) {
        e.preventDefault();
        menuContent.value?.classList.add("drop-active");
      },
      ondragenter(e: DragEvent) {
        e.preventDefault();
      },
      ondragleave(e: DragEvent) {
        e.preventDefault();
        menuContent.value?.classList.remove("drop-active");
      },
      async ondrop(e: DragEvent) {
        e.stopPropagation();
        const {id, groupID} = JSON.parse(e.dataTransfer?.getData("text/plain") ?? "");
        if (groupID) {
          const {code} = await moveListApi({id, groupID: ""});
          if (code === 200) {
            message.success("操作成功!");
            await joinMenu();
          }
        }
        menuContent.value?.classList.remove("drop-active");
      },
    };
  }
};
//取消默认事件
const preventDefault = (e: DragEvent) => {
  e.preventDefault();
};
// 拖拽进入
const ondragenter = (e: DragEvent) => {
  e.stopPropagation();
  (e.target as Element).classList.add("drop-active");
};
//拖拽离开
const dragLeave = (e: DragEvent) => {
  (e.target as Element).classList.remove("drop-active");
};
// 监听侧边栏被放置
const sideOnDrop = async (e: DragEvent) => {
  const {id, groupID} = JSON.parse(e.dataTransfer?.getData("text/plain") ?? "");

  if (groupID) {
    const {code} = await moveListApi({id, groupID: ""});
    if (code === 200) {
      message.success("操作成功!");
      await joinMenu();
    }
  }
  (e.target as Element).classList.remove("drop-active");
};
//挂载前获取菜单
onBeforeMount(async () => {
  await joinMenu();
  await router.push({name: "list"});
  if (globalStore.currentMenu.id) return
  globalStore.setCurrentMenu({id: menu.value[0].id, type: menu.value[0].type});
});
// 渲染菜单icon
const renderMenuIcon = (menu: MenuOption) => {
  if (menu.type == "folder") {
    return renderIcon(CategoryManagement)();
  } else if ((menu.type as string).includes("item")) {
    if (!menu.icon) return renderIcon(ListTwo)();
    return menu.icon;
  } else if (menu.type === "myDay") {
    return renderIcon(SunOne)();
  } else if (menu.type === "task") {
    return renderIcon(Notepad)();
  } else if (menu.type === "star") {
    return renderIcon(Star)();
  } else if (menu.type === "finished") {
    return renderIcon(CheckCorrect)();
  }
};
// 拼接菜单
const joinMenu = async () => {
  const {data} = await getMenuApi();
  menu.value = data;
  menuStore.setMenu(data);
};
emiter.on("joinMenu", joinMenu);
// 暴露出去
defineExpose({
  joinMenu,
});
</script>

<style scoped lang="scss">
.menu-content {
  width: 100%;
  height: calc(100% - 2px);
  box-sizing: border-box;
  user-select: none;
}

:deep(.drop-active) {
  outline: 1px solid #36ad6a;
  border-radius: 3px;
  box-shadow: 0 0 0 2px rgba(24, 160, 88, 0.2);
}

.drop-active {
  outline: 1px solid #36ad6a;
  border-radius: 3px;
  box-shadow: 0 0 0 2px rgba(24, 160, 88, 0.2);
}

:deep(.n-scrollbar) {
  height: fit-content;
}
</style>
