<template>
	<div class="main-box">
		<ToolBar></ToolBar>
		<div class="content-box">
			<div class="left" v-if="showLeft">
				<img src="https://addert.oss-cn-chengdu.aliyuncs.com/login_bg.png" alt="" />
			</div>
			<div class="login-box">
				<p class="title">欢迎使用</p>
				<n-form label-placement="left" :model="form" ref="formRef" :rules="rules">
					<n-form-item path="email">
						<n-input placeholder="请输入邮箱" v-model:value="form.email">
							<template #prefix>
								<n-icon :component="Mail"></n-icon>
							</template>
						</n-input>
					</n-form-item>
					<n-form-item path="password">
						<n-input
							type="password"
							placeholder="请输入密码"
							show-password-on="mousedown"
							v-model:value="form.password"
						>
							<template #prefix>
								<n-icon :component="Key"></n-icon>
							</template>
						</n-input>
					</n-form-item>
					<n-button type="primary" block @click="login" :loading="btnLoading" :disabled="btnLoading">立即登录</n-button>
				</n-form>
				<p class="extra">
					<n-checkbox v-model:checked="rememberMe">记住我</n-checkbox>
					<span>
						<n-button text type="primary">忘记密码?</n-button>
						<n-divider vertical></n-divider>

						<n-button text type="primary" @click="toRegis">没有账号?</n-button>
					</span>
				</p>
			</div>
		</div>
	</div>
	<Register v-model:show="showRegister" @update-form="updateForm"></Register>
</template>

<script setup lang="ts">
import { Mail, Key } from "@icon-park/vue-next";
import ToolBar from "@/components/ToolBar.vue";
import { FormRules, FormInst, useMessage } from "naive-ui";
import { onBeforeMount, onMounted, onUnmounted, reactive, ref } from "vue";
import { loginApi } from "@/apis";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import Register from "@/views/Register/index.vue";

const userStore = useUserStore();
const message = useMessage();
const router = useRouter();
const formRef = ref<FormInst>();
const form = reactive({
	email: "",
	password: "",
});
const updateForm = (val: { email: string; password: string }) => {
	form.email = val.email;
	form.password = val.password;
};
const rules: FormRules = {
	email: [{ required: true, message: "请输入邮箱", trigger: ["input", "blur"] }],
	password: [{ required: true, message: "请输入密码", trigger: ["input", "blur"] }],
};

const showLeft = ref(true);
const changeShowLeft = (e: any) => {
	if (e.target.outerWidth < 700) {
		if (showLeft.value) {
			showLeft.value = false;
		}
	}
	if (e.target.outerWidth > 700) {
		if (!showLeft.value) {
			showLeft.value = true;
		}
	}
};
onBeforeMount(() => {
	if (window.outerWidth < 770) {
		showLeft.value = false;
	}
});
onMounted(() => {
	window.addEventListener("resize", changeShowLeft);
});
onUnmounted(() => {
	window.removeEventListener("resize", changeShowLeft);
});
//记住我
const rememberMe = ref(false);
//跳转注册
const toRegis = () => {
	formRef.value?.restoreValidation();
	showRegister.value = true;
};
//显示注册
const showRegister = ref(false);
//回显记住我操作
if (userStore.rememberMe) {
	rememberMe.value = true;
	form.email = userStore.loginForm.email;
	form.password = userStore.loginForm.password;
}

//登录loading
const btnLoading = ref(false);
//登录
const login = async () => {
	btnLoading.value = true;
	await formRef.value?.validate(async err => {
		if (!err) {
			const { code, data, msg } = await loginApi({ ...form, remember: rememberMe.value });
			if (code === 200) {
				message.success("登录成功!");
				localStorage.setItem("token", data.token);
				userStore.login(data);
				if (rememberMe.value) {
					userStore.remember(true);
					userStore.setLoginForm(form);
				} else {
					userStore.remember(false);
					userStore.setLoginForm({ email: "", password: "" });
				}
				router.push("/");
			} else {
				message.error(msg);
			}
		} else {
			btnLoading.value = false;
		}
	});
	btnLoading.value = false;
};
</script>

<style scoped lang="scss">
.main-box {
	height: 100vh;
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	box-sizing: border-box;
	padding-bottom: 50px;

	.title {
		font-size: 24px;
	}

	.content-box {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 50px;
	}

	.left {
		margin-right: 50px;

		img {
			width: 100%;
			display: block;
			margin: auto;
		}
	}

	.login-box {
		min-width: 250px;

		.extra {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
}
</style>
