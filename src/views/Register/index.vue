<template>
  <div class="reg-main-box">
    <ToolBar></ToolBar>
    <n-button type="primary" @click="$router.push({name:'login'})">去登录
      <template #icon>
        <n-icon :component="Back"></n-icon>
      </template>
    </n-button>
    <div class="reg-form">
      <n-form label-placement="left" label-width="auto" ref="formInst" :model="formModel" :rules="formRules">
        <n-form-item label="昵称" path="name">
          <n-input placeholder="请输入昵称" v-model:value="formModel.name"></n-input>
        </n-form-item>
        <n-form-item label="邮箱" path="email" ref="emailInst">
          <n-input placeholder="请输入邮箱" v-model:value="formModel.email" @input="formModel.code = ''"></n-input>
        </n-form-item>
        <n-form-item label="验证码" path="code">
          <n-input-group>
            <n-input
                placeholder="请输入验证码"
                v-model:value="formModel.code"
                :disabled="formModel.email === ''"
            ></n-input>
            <n-button @click="getVerifyCode" :disabled="countDown || formModel.email === ''">
							<span v-if="countDown">
								重新发送(
								<n-countdown
                    :duration="59000"
                    :active="countDown"
                    :render="renderCountdown"
                    @finish="countDown = false"
                />秒)
							</span>
              <span v-else>获取验证码</span>
            </n-button>
          </n-input-group>
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input type="password" placeholder="请输入密码" v-model:value="formModel.password"></n-input>
        </n-form-item>
        <n-form-item label=" ">
          <n-button block type="primary" @click="register">立即注册
          </n-button>
        </n-form-item>
      </n-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import {CountdownProps, FormInst, FormRules, FormItemInst, useMessage} from "naive-ui";
import {registerApi, getVerifyCodeApi} from "@/apis";
import {Back} from "@icon-park/vue-next";
import {useRouter} from "vue-router";
import ToolBar from "@/components/ToolBar.vue";

const router = useRouter()
const message = useMessage();
const formInst = ref<FormInst>();
const emailInst = ref<FormItemInst>();
const formRules: FormRules = {
  name: [
    {
      required: true,
      message: "请输入用户昵称",
      trigger: "change",
      transform(value) {
        return value.trim();
      },
    },
  ],
  email: [
    {
      required: true,
      message: "请输入邮箱",
      trigger: "change",
      transform(value) {
        return value.trim();
      },
    },
    {
      type: 'email',
      trigger: "change",
      message: '请输入正确的邮箱'
    }
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "change",
      transform(value) {
        return value.trim();
      },
    },
  ],
  code: [
    {
      required: true,
      message: "请输入验证码",
      trigger: "change",
      transform(value) {
        return value.trim();
      },
    },
  ],
};
const formModel = reactive({
  name: "",
  email: "",
  password: "",
  code: "",
});
const countDown = ref(false);
const renderCountdown: CountdownProps["render"] = ({seconds}) => {
  return seconds;
};
const getVerifyCode = () => {
  emailInst.value?.validate({
    callback: async res => {
      if (!res) {
        const {code} = await getVerifyCodeApi({email: formModel.email});
        if (code === 200) {
          message.success("验证码发送成功！请查收");
          countDown.value = true
        } else {
          countDown.value = false
        }
      }
    },
  });
};
const register = () => {
  formInst.value?.validate(async err => {
    if (!err) {
      const avatar = `https://api.multiavatar.com/${formModel.email}.png`;
      const {code} = await registerApi({...formModel, avatar});
      if (code === 200) {
        message.success("注册成功");
        router.push({name: 'login'})
      }
    }
  });
};
</script>

<style scoped lang="scss">
.reg-main-box {
  width: 100%;
  height: 100vh;
  background-color: #fff;
  box-sizing: border-box;
  padding: 70px 20px 0;
  background-image: url("@/assets/1.png");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;

  .reg-form {
    max-width: 400px;
    min-width: 280px;
    margin: 20px auto 0;
    padding: 30px 30px 0 20px;
    border-radius: 8px;
    backdrop-filter: blur(24px);
  }
}
</style>
