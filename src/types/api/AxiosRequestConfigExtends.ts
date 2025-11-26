import type { AxiosRequestConfig } from 'axios';
export default interface AxiosRequestConfigExtends extends AxiosRequestConfig {
	retries: number;
	retryCount: number;
}
