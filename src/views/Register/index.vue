<template>
	<div class="reg-main-box" v-if="show">
		<n-button type="primary" @click="$emit('update:show', false)">返回</n-button>
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
					<n-button block type="primary" @click="register">立即注册</n-button>
				</n-form-item>
			</n-form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { CountdownProps, FormInst, FormRules, FormItemInst, useMessage } from "naive-ui";
import { registerApi, getVerifyCodeApi } from "@/apis";

defineProps<{ show: boolean }>();
const emits = defineEmits<{
	(e: "update:show", val: boolean): void;
	(e: "updateForm", val: { email: string; password: string }): void;
}>();
//2402225817@qq.com
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
			message: "请输入用户邮箱",
			trigger: "change",
			transform(value) {
				return value.trim();
			},
		},
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
const renderCountdown: CountdownProps["render"] = ({ seconds }) => {
	return seconds;
};
const getVerifyCode = () => {
	emailInst.value?.validate({
		callback: async res => {
			if (!res) {
				const { code, msg } = await getVerifyCodeApi({ email: formModel.email });
				if (code === 200) {
					message.success("验证码发送成功！请查收");
				} else {
					message.error(msg);
				}
			}
		},
	});
};
const register = () => {
	formInst.value?.validate(async err => {
		if (!err) {
			const avatar = `https://api.multiavatar.com/${formModel.email}.png`;
			const { code, msg } = await registerApi({ ...formModel, avatar });
			if (code === 200) {
				message.success("注册成功");
				emits("updateForm", { email: formModel.email, password: formModel.password });
				emits("update:show", false);
			} else {
				message.error(msg);
			}
		}
	});
};
</script>

<style scoped lang="scss">
.reg-main-box {
	width: 100%;
	height: calc(100vh - 60px);
	position: absolute;
	left: 0;
	bottom: 0;
	background-color: #fff;
	box-sizing: border-box;
	padding: 20px;

	.reg-form {
		width: 400px;
		margin: auto;
	}
}
</style>
