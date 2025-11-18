import {AxiosError, type AxiosInstance, type AxiosResponse, CancelToken} from 'axios';
import { baseInstance as axiosInstance } from '@/api/axiosInstance/AxiosInstance';
import {storeCancelToken} from "@/utils/api/CancelTokenUtils";

export class BaseApiCall {
	constructor() {
		this.instance = axiosInstance;
	}

	instance: AxiosInstance;

	async get<T>(url: string, params?: any): Promise<AxiosResponse<T> | AxiosError> {
		const { key, token }: { key: number; token: CancelToken } = storeCancelToken();
		try {
			const res = await this.instance.get<T>(url, { params , cancelToken: token});
			return res;
		} catch (e: AxiosError<any> | any) {
			return e;
		}
	}

	async post<T>(url: string, data: any): Promise<AxiosResponse<T, any> | AxiosError> {
		try {
			return await this.instance.post(url, data);
		} catch (e: AxiosError<any> | any) {
			return e;
		}
	}

	async postForm<T>(url: string, data: any): Promise<AxiosResponse<T> | AxiosError> {
		try {
			return await this.instance.postForm(url, data);
		} catch (e: AxiosError<any> | any) {
			return e;
		}
	}

	async put<T>(url: string, data: any, params?: any): Promise<AxiosResponse<T> | AxiosError> {
		try {
			return await this.instance.put(url, data);
		} catch (e: AxiosError<any> | any) {
			return e;
		}
	}

	async patch<T>(url: string, data: any, params?: any): Promise<AxiosResponse<T> | AxiosError> {
		try {
			return await this.instance.patch(url, data, { params: params });
		} catch (e: AxiosError<any> | any) {
			return e;
		}
	}

	async delete<T>(url: string, data?: any, params?: any): Promise<AxiosResponse<T> | AxiosError> {
		try {
			return await this.instance.delete(url, { data: data, params: params });
		} catch (e: AxiosError<any> | any) {
			return e;
		}
	}

	/**
	 * stream Axios Call
	 * @param url
	 * @param method
	 * @param param
	 * @param data
	 * @param path
	 * @returns {Promise<AxiosResponse<any>>} writer :Fs.createWriteStream(path)
	 */
	async stream(url, method, param, data, path) {
		try {
			const response = await axiosInstance({
				url: url,
				params: param,
				method: method,
				data: data,
				responseType: 'stream',
			});

			const writer = fs.createWriteStream(path);
			response.data.pipe(writer);
			return writer;
		} catch (e: AxiosError<any> | any) {
			return e;
		}
	}
}
