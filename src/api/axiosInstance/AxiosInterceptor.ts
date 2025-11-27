import { type AxiosInstance, type AxiosResponse } from 'axios';
import { parseISOStrToyyyyMMddHHmmss } from '@/utils/DateUtils';
import type AxiosRequestConfigExtends from '@/types/api/AxiosRequestConfigExtends';
import { useAuthStore } from '@/stores/auth/useAuthStore';

function convertIsoDates(obj: any) {
	const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.000Z$/;

	for (const key in obj) {
		let val = obj[key];

		if (isoRegex.test(val) || val instanceof Date) {
			obj[key] = parseISOStrToyyyyMMddHHmmss(val);
		}
	}
}

export function setInterceptors(instance: AxiosInstance, isRequireAuth?: boolean | undefined) {
	//request
	instance.interceptors.request.use(
		(config) => {
			if (isRequireAuth) {
				config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`; //setToken
			}
			if (config.data) {
				convertIsoDates(config.data);
			}

			if (config.params) {
				convertIsoDates(config.params);
			}
			return config;
		},
		(error) => {
			return Promise.reject(error);
		},
	);
	//response
	instance.interceptors.response.use(
		(response: AxiosResponse) => {
			return response;
		},
		async (error) => {
			if (!('response' in error)) {
				return Promise.reject(error);
			}

			const {
				config, //request 객체
				response: { status }, //httpStatusCode
			}: { config: AxiosRequestConfigExtends; response: AxiosResponse } = error;
			if (status === 401) {
				// 로그인 API 또는 계정 리스트 API 호출 시 401발생하면 여기서 에러 핸들링.
				if (config.url.includes('login')) {
					if (error.response.data.message) {
						await window.Swal.fire({
							icon: 'error',
							text: error.response.data.message,
							showCancelButton: false,
							confirmButtonText: '확인',
						});
					} else {
						await window.Swal.fire({
							icon: 'error',
							text: '서버 호출 중 에러가 발생하였습니다. 관리자에게 문의하세요.',
							showCancelButton: false,
							confirmButtonText: '확인',
						});
					}
					return;
				} else {
					// 이외 API에서 401발생하면 여기서 에러 핸들링.
					const { isConfirmed } = await window.Swal.fire({
						icon: 'error',
						text: '토큰이 만료되었습니다. 로그인 화면으로 이동합니다.',
						showCancelButton: false,
						confirmButtonText: '확인',
					});
					if (isConfirmed) {
						const store = useAuthStore();
						store.logout();
						location.reload();
						return;
					}
				}
			}
			//401 외 에러는 return하여 CheckAxiosError.ts에서 에러 처리
			return Promise.reject(error);
		},
	);
	// interceptor 로직이 들어있는 axios instance 반환
	return instance;
}
