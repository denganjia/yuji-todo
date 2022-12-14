<template>
  <n-drawer v-model:show="show" width="350" @update:show="$emit('update:show', $event)" @after-leave="drawerClosed"
            style="--n-footer-padding:0">
    <n-drawer-content closable :native-scrollbar="false">
      <n-space vertical size="large">
        <n-list bordered hoverable>
          <n-list-item>
            <n-thing>
              <template #header>
                <div style="display: flex" @click="showInput">
                  <n-button text style="font-size: 18px;margin-right: 1em" @click.stop="handleDetail('finished')">
                    <n-icon>
                      <CheckOne v-if="detail.finished"></CheckOne>
                      <Round v-else></Round>
                    </n-icon>
                  </n-button>
                  <n-input v-model:value="title" v-if="showTitleInput" ref="inputRef" @blur="blur"></n-input>
                  <span v-else>{{ ' ' + detail.title }}</span>
                </div>
              </template>
              <template #header-extra>
                <n-button text size="small" @click.stop="handleDetail('star')">
                  <template #icon>
                    <n-icon>
                      <Star :theme="detail.star ? 'two-tone' : 'outline'" :strokeWidth="0"></Star>
                    </n-icon>
                  </template>
                </n-button>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>
        <n-list bordered clickable hoverable>
          <n-list-item @click="handleDetail('oneDay',true)">
            <template #prefix>
              <n-icon>
                <SunOne/>
              </n-icon>
            </template>
            <span v-if="!detail.oneDay">添加到“我的一天”</span>
            <span v-else>已添加到“我的一天”</span>
            <template #suffix v-if="detail.oneDay">
              <n-button quaternary size="small" @click.stop="handleDetail('oneDay',false)">
                <n-icon>
                  <Close></Close>
                </n-icon>
              </n-button>
            </template>
          </n-list-item>
        </n-list>
        <n-list bordered clickable hoverable>
          <n-dropdown trigger="click" :options="remindMeOption" @select="remindMeSelect">
            <n-list-item>
              <template #prefix>
                <n-icon>
                  <AlarmClock/>
                </n-icon>
              </template>
              <span v-if="!detail.remindTime">提醒我</span>
              <div v-else>
                <p>在{{ dayjs(detail.remindTime).format('HH:mm') }}时提醒我</p>
                <p>{{ dayjs(detail.remindTime).calendar(dayjs()) }}</p>
              </div>
              <template #suffix v-if="detail.remindTime">
                <n-button quaternary size="small" @click.stop="handleDetail('remindTime')">
                  <n-icon>
                    <Close></Close>
                  </n-icon>
                </n-button>
              </template>
            </n-list-item>
          </n-dropdown>
          <n-dropdown :options="endTimeOptions" trigger="click" @select="endTimeSelect">
            <n-list-item>
              <template #prefix>
                <n-icon>
                  <CalendarThirty/>
                </n-icon>
              </template>
              <span v-if="!detail.endTime">添加截止日期</span>
              <span v-else>{{ dayjs(detail.endTime).calendar() }}截止</span>
              <template #suffix v-if="detail.endTime">
                <n-button quaternary size="small" @click.stop="handleDetail('endTime')">
                  <n-icon>
                    <Close></Close>
                  </n-icon>
                </n-button>
              </template>
            </n-list-item>
          </n-dropdown>
          <n-list-item v-if="false">
            <template #prefix>
              <n-icon>
                <Refresh/>
              </n-icon>
            </template>
            重复
            <template #suffix v-if="false">
              <n-icon>
                <Close></Close>
              </n-icon>
            </template>
          </n-list-item>
        </n-list>
        <n-input type="textarea" placeholder="添加备注" v-model:value="desc" @blur="handleDetail('desc')"
                 :resizable="false"></n-input>
      </n-space>
      <template #footer>
        <div class="footer">
          <p class="info" v-if="detail.createTime">创建于{{ dayjs(detail.createTime).format('MM月DD日,周dd') }}</p>
          <n-button quaternary size="large" @click="remove">
            <template #icon>
              <n-icon>
                <DeleteFive></DeleteFive>
              </n-icon>
            </template>
          </n-button>
        </div>
      </template>
    </n-drawer-content>
    <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
      <n-dropdown
          :x="remindPickerPosition.x"
          :y="remindPickerPosition.y"
          :show="showRemindPicker"
          @clickoutside="showRemindPicker = false"
          :options="remindDropdownOption"
          trigger="manual"
      />
      <NDropdown
          :x="remindPickerPosition.x"
          :y="remindPickerPosition.y"
          :show="showEndTimePicker"
          @clickoutside="showEndTimePicker = false"
          trigger="manual"
          :options="endTimePicker"
      ></NDropdown>
    </n-config-provider>
  </n-drawer>
</template>

<script setup lang="ts">
import {
  AlarmClock,
  CalendarThirty,
  Refresh,
  SunOne,
  DeleteFive,
  Close,
  Star,
  Round,
  CheckOne, Time, ArrowCircleRight, CircleDoubleRight, CalendarThree
} from "@icon-park/vue-next";
import {ToDos} from "@/apis/types";
import dayjs from "dayjs";
import {getTodoDetailApi, deleteTodoApi, updateTodoApi} from "@/apis"
import {computed, h, nextTick, reactive, ref, watch} from "vue";
import {MenuOption, NDatePicker, useDialog, zhCN, dateZhCN, InputInst,} from "naive-ui";
import {renderIcon} from "@/utils";
import {useTheme} from "@/stores/themeStore";


const theme = useTheme()
const dialog = useDialog()
const props = defineProps<{ show: boolean, id?: string }>();
const emits = defineEmits<{ (e: "update:show", val: boolean): void; (e: 'update'): void }>();

const detail = ref<Partial<ToDos.Todo>>({})
const desc = ref('')
// 获取当前待办详情
const getDetail = async () => {
  detail.value = await (await getTodoDetailApi(props.id)).data
  desc.value = detail.value.desc
  title.value = detail.value.title
}
watch(() => props.show, async () => {
  if (props.show) {
    await getDetail()
  }
})

// 操作当前待办
const handleDetail = async (event: keyof ToDos.Todo, value: any = null) => {
  let shouldUpdate = true;
  switch (event) {
    case "oneDay":
      await updateTodoApi({id: props.id, oneDay: value});
      detail.value.oneDay = value
      break
    case "desc":
      if (desc.value !== detail.value.desc) {
        await updateTodoApi({id: props.id, desc: desc.value})
      }
      shouldUpdate = false
      break
    case "endTime":
      await updateTodoApi({id: props.id, endTime: value});
      detail.value.endTime = value
      break
    case "remindTime":
      await updateTodoApi({id: props.id, remindTime: value});
      detail.value.remindTime = value;
      remindTimeValue.value = value
      break
    case "star":
      await updateTodoApi({id: props.id, star: !detail.value.star});
      detail.value.star = !detail.value.star
      break
    case "finished":
      await updateTodoApi({id: props.id, finished: !detail.value.finished});
      detail.value.finished = !detail.value.finished
      break
    case 'title':
      await updateTodoApi({id: props.id, title: value});
      break
  }
  if (shouldUpdate) {
    emits('update')
  }
}
//
const showTitleInput = ref(false)
const inputRef = ref<InputInst>()
const title = ref('')
const showInput = () => {
  showTitleInput.value = true;
  nextTick(() => {
    inputRef.value.focus()
  })
}
const blur = () => {
  if (title.value !== detail.value.title) {
    handleDetail('title', title.value)
    detail.value.title = title.value
  }
  showTitleInput.value = false
}
// 删除待办
const remove = async () => {
  dialog.warning({
    title: "警告",
    content: "删除任务后无法恢复，请三思！",
    positiveText: "删除",
    negativeText: "取消",
    async onPositiveClick() {
      await deleteTodoApi({id: props.id})
      emits('update:show', false);
      emits('update')
    },
    onNegativeClick() {
    },
  });

}
// drawer closed
const drawerClosed = () => {
  detail.value = {}
  desc.value = ''
}
// 时间选择器位置
const remindPickerPosition = reactive({
  x: 0,
  y: 0,
});
//显示时间选择器
const showRemindPicker = ref(false);

const remindTimeValue = ref(null)
// 提醒我
const remindMeOption = computed<MenuOption[]>(() => [
  {label: `今天 ${dayjs().add(4, "hour").set("minute", 0).format("HH:mm")}`, key: "later", icon: renderIcon(Time)},
  {label: "明天 9:00", key: "tomorrow", icon: renderIcon(ArrowCircleRight)},
  {label: "下周一 9:00", key: "next-week", icon: renderIcon(CircleDoubleRight)},
  {type: "divider"},
  {label: "选择日期和时间", key: "customer", icon: renderIcon(CalendarThirty)},
]);
// 提醒我 选择事件
const remindMeSelect = (key: string) => {
  switch (key) {
    case 'customer':
      remindPickerPosition.x = window.innerWidth - 20;
      remindPickerPosition.y = window.innerHeight - 349 - 90;
      showRemindPicker.value = true;
      break
    case "later":
      remindTimeValue.value = dayjs().add(4, "hour").set("minute", 0).valueOf();
      handleDetail('remindTime', remindTimeValue.value)
      break
    case 'tomorrow':
      remindTimeValue.value = dayjs().add(1, "day").set("hour", 9).set("minute", 0).valueOf();
      handleDetail('remindTime', remindTimeValue.value)

      break
    case 'next-week':
      remindTimeValue.value = dayjs()
          .add(8 - dayjs().day(), "day")
          .set("hour", 9)
          .set("minute", 0)
          .valueOf();
      handleDetail('remindTime', remindTimeValue.value)
      break
  }
};
//时间选择器的render
const remindDropdownOption: MenuOption[] = [
  {
    key: "datetime",
    type: "render",
    render() {
      return h("div", {}, [
        h(NDatePicker, {
          panel: true,
          type: "datetime",
          value: detail.value.remindTime,
          onConfirm(val) {
            handleDetail('remindTime', val)
            showRemindPicker.value = false;
          },
          "onUpdate:value"(val) {
            detail.value.remindTime = val
          },
          actions: ["confirm"],
        }),
      ]);
    },
  },
];

// 截止日期picker
const showEndTimePicker = ref(false);
//截止日期
const endTimeValue = ref(null);
//截止日期自定义选择render
const endTimePicker: MenuOption[] = [
  {
    key: "datetime",
    type: "render",
    render() {
      return h("div", {}, [
        h(NDatePicker, {
          panel: true,
          type: "date",
          value: detail.value.endTime,
          "onUpdate:value"(val) {
            handleDetail('endTime', val);
            showEndTimePicker.value = false;
          },
        }),
      ]);
    },
  },
];
// 截止日期下拉菜单
const endTimeOptions = computed<MenuOption[]>(() => [
  {label: `今天`, key: "today"},
  {label: "明天", key: "tomorrow"},
  {label: "下周一", key: "next-week"},
  {type: "divider"},
  {label: "选择日期和时间", key: "customer", icon: renderIcon(CalendarThree)},
]);
// 截止时间选择
const endTimeSelect = (key: string) => {
  switch (key) {
    case "customer":
      remindPickerPosition.x = window.innerWidth - 20;
      remindPickerPosition.y = window.innerHeight - 349 - 42;
      showEndTimePicker.value = true;
      break;
    case "today":
      endTimeValue.value = dayjs().set("hour", 23).set("minute", 59).set("second", 59).valueOf();
      handleDetail('endTime', endTimeValue.value)
      break;
    case "tomorrow":
      endTimeValue.value = dayjs().add(1, "day").set("hour", 23).set("minute", 59).set("second", 59).valueOf();
      handleDetail('endTime', endTimeValue.value)
      break;
    case "next-week":
      endTimeValue.value = dayjs()
          .add(8 - dayjs().day(), "day")
          .set("hour", 0)
          .set("minute", 0)
          .set("second", 0)
          .valueOf();
      handleDetail('endTime', endTimeValue.value)
      break;
  }
};
</script>

<style scoped lang="scss">
.footer {
  display: flex;
  width: 100%;

  .info {
    flex: 1;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-left: 9px;
  }
}

</style>
