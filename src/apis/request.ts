import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { APIBaseResult } from "./types";
import { router } from "@/routers";
// 根据环境变量区分接口的默认地址
switch (import.meta.env.MODE) {
	case "development":
		// 跨域使用代理
		axios.defaults.baseURL = "/api";
		break;
	case "production":
		axios.defaults.baseURL = "http://www.chiyu.site/doit/api";
		break;
}

// 设置超时时间（10s）
axios.defaults.timeout = 10000;
// 跨域时候允许携带凭证
axios.defaults.withCredentials = true;

// axios.defaults.withCredentials = false;

const serves = axios.create({
	timeout: 10000,
	method: "get",
	headers: {
		"Content-Type": "application/json",
		"Cache-Control": "no-cache",
	},
});
// 请求前的处理
serves.interceptors.request.use((config: AxiosRequestConfig) => {
	if (config.headers) {
		config.headers.token = localStorage.getItem("token") ?? "";
		config.headers["ws-key"] = localStorage.getItem("ws-key") ?? "";
	}
	return config;
});
// 请求后的处理
serves.interceptors.response.use(
	(res: AxiosResponse<{ code: number; data: any | any[]; msg: string }>) => {
		if (res.data.code !== 200) {
			window.$message.error(res.data.msg);
			return Promise.reject(res.data);
		}
		return res.data;
	},
	(err: { response: AxiosResponse }) => {
		const { response } = err;
		if (response) {
			if (response.status === 403) {
				window.$message.error("请先登录！");
				router.push("/login");
			} else if (response.data) {
				if (Array.isArray(response.data.message)) {
					window.$message.error(response.data.message.join(""));
				}
			}
		} else {
			window.$message.error("请求超时");
		}
		return response;
	},
);

export default serves;

export const request = async <T = any>(config: AxiosRequestConfig): Promise<APIBaseResult<T>> => {
	return new Promise(async (resolve, reject) => {
		serves(config)
			.then(value => {
				resolve(value as any);
			})
			.catch(err => {
				reject(err);
			});
	});
};

type RequestConfig = {
	url: string;
	data?: any;
	params?: any;
	contentType?: "application/json" | "application/x-www-form-urlencoded" | "multipart/form-data";
};

export const POST = <T = any>(config: AxiosRequestConfig): Promise<APIBaseResult<T>> => {
	return new Promise(async (resolve, reject) => {
		serves({
			url: config.url,
			data: config.data,
			headers: config.headers ?? {
				"Content-Type": "application/json",
			},
			method: "POST",
		})
			.then(value => {
				resolve(value as any);
			})
			.catch(err => {
				reject(err);
			});
	});
};

export const GET = <T = any>(config: RequestConfig): Promise<APIBaseResult<T>> => {
	return new Promise(async (resolve, reject) => {
		serves({
			url: config.url,
			params: config.params,
			headers: {
				"Content-Type": config.contentType ?? "application/json",
			},
			method: "GET",
		})
			.then(value => {
				resolve(value as any);
			})
			.catch(err => {
				reject(err);
			});
	});
};

export const PUT = <T = any>(config: RequestConfig): Promise<APIBaseResult<T>> => {
	return new Promise(async (resolve, reject) => {
		serves({
			url: config.url,
			data: config.data,
			headers: {
				"Content-Type": config.contentType ?? "application/json",
			},
			method: "PUT",
		})
			.then((value: any) => {
				resolve(value);
			})
			.catch(err => {
				reject(err);
			});
	});
};

export const DELETE = <T = any>(config: RequestConfig): Promise<APIBaseResult<T>> => {
	return new Promise(async (resolve, reject) => {
		serves({
			url: config.url,
			params: config.params,
			headers: {
				"Content-Type": config.contentType ?? "application/json",
			},
			method: "DELETE",
		})
			.then((value: any) => {
				resolve(value);
			})
			.catch(err => {
				reject(err);
			});
	});
};
