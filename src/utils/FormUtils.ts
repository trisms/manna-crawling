import { type Ref, unref } from 'vue';
import type { AxiosResponse } from 'axios';
import validateAPIResult from '@/utils/api/ValidateAPIResult';
import { useAppLoadingStore } from '@/stores/useAppLoadingStore';
import { isBlank, isNotBlank } from '@/utils/ValidateUtils';

/**
 * 재귀를 이용한 객체 깊은 복사
 * @param obj 복사할 객체
 * @returns 깊은 복사된 객체
 */
export function cloneDeepObj<T>(obj: T): T {
	if (obj === null || typeof obj !== 'object') {
		return obj;
	}

	let copy: any;

	if (Array.isArray(obj)) {
		copy = [] as any[];
		obj.forEach((item) => {
			copy.push(cloneDeepObj(item));
		});
	} else {
		copy = {} as { [key: string]: any };
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				copy[key] = cloneDeepObj((obj as any)[key]);
			}
		}
	}

	return copy as T;
}

const toggleLoading = (loading: boolean) => {
	const loadingStore = useAppLoadingStore();

	loadingStore.isLoading = loading;
};

export const validateForm = async (form: Ref<HTMLFormElement> | HTMLFormElement) => {
	const result: any = await unref(form).validate();

	if (!result.valid) {
		window.$emitter.emit('warning', '붉은색 항목을 확인해주세요.');
	}

	return result;
};

export const validatePassword = (password: string, passwordChk: string) => {
	const passwordRegex =
		/^(?![A-Za-z]+$)(?!\d+$)(?![!@#$%^&*(),.?":{}|<>]+$)[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;

	if (isNotBlank(password)) {
		if (isBlank(passwordChk)) {
			window.$emitter.emit('warning', 'Password 확인을 입력해주세요.');
			return false;
		}
		if (!passwordRegex.test(password)) {
			window.$emitter.emit(
				'warning',
				'비밀번호는 영문/숫자/특수문자 중 2가지 이상의 조합으로 최소 8자리로 생성하세요.',
			);
			return false;
		}

		if (password !== passwordChk) {
			window.$emitter.emit('warning', '입력하신 비밀번호가 서로 다릅니다.');
			return false;
		}
	}

	return true;
};

// API실행 후 response 자체를 받고 싶을 경우 사용하는 composable
export const useCallAPI = async (api: Function): Promise<AxiosResponse<any> | null> => {
	try {
		toggleLoading(true);

		const res: AxiosResponse<any> = await api();
		/*if (validateAPIResult(res)) {
			return res;
		}*/
		if (validateAPIResult(res)) {
			return res;
		} else {
			if(res.response){
				window.$emitter.emit('success', res.response.data.message)
			}
		}
	} catch (e) {
		console.error('useCallAPI Error: ', e);
	} finally {
		toggleLoading(false);
	}

	return null;
};

//등록할 때 사용하는 composable
export const useCallInsertAPI = async (
	api: Function,
	callback: Function,
	formEl?: Ref<HTMLFormElement> | HTMLFormElement,
): Promise<void> => {
	//form엘리먼트가 있을 경우에만 vee-validate 체크
	const result = formEl ? await validateForm(formEl) : { valid: true };

	if (result.valid) {
		window.$emitter.emit('confirm', {
			message: '등록하시겠습니까?',
			callback: async () => {
				toggleLoading(true);

				try {
					const res = await api();
					if (validateAPIResult(res)) {
						window.$emitter.emit('success', '등록이 완료되었습니다.');
						if (res.data) {
							await callback(res.data);
						} else {
							await callback();
						}
					} else {
						if(res.response){
							window.$emitter.emit('success', res.response.data.message)
						}
					}
				} catch (e) {
					console.error('useCallInsertAPI Error: ', e);
				} finally {
					toggleLoading(false);
				}
			},
		});
	} else {
		return result.errors;
	}
};

//수정할 때 사용하는 composable
export const useCallUpdateAPI = async (
	api: Function,
	callback: Function,
	formEl?: Ref<HTMLFormElement> | HTMLFormElement,
): Promise<void> => {
	//form엘리먼트가 있을 경우에만 vee-validate 체크
	const result = formEl ? await validateForm(formEl) : { valid: true };

	if (result.valid) {
		window.$emitter.emit('confirm', {
			message: '수정하시겠습니까?',
			callback: async () => {
				toggleLoading(true);

				try {
					const res = await api();

					if (validateAPIResult(res)) {
						window.$emitter.emit('success', '수정이 완료되었습니다.');
						callback(res);
					}
				} catch (e) {
					console.error('useCallUpdateAPI Error: ', e);
				} finally {
					toggleLoading(false);
				}
			},
		});
	} else {
		return result.errors;
	}
};

//바로 수정용
export const useCallUpdateDirectAPI = async (
	api: Function,
	callback: Function,
	formEl?: Ref<HTMLFormElement> | HTMLFormElement,
): Promise<void> => {
	//form엘리먼트가 있을 경우에만 vee-validate 체크
	const result = formEl ? await validateForm(formEl) : { valid: true };

	if (result.valid) {
		try {
			const res = await api();
			if (validateAPIResult(res)) {
				/*window.$emitter.emit('success', '수정이 완료되었습니다.');*/
				callback(res);
			} else {
					window.$emitter.emit('success', res.response.data.message)
			}
		} catch (e) {
			console.error('useCallUpdateAPI Error: ', e);
		} finally {
			toggleLoading(false);
		}
	} else {
		return result.errors;
	}
};

//삭제할 때 사용하는 composable
export const useCallDeleteAPI = async (api: Function, callback: Function): Promise<void> => {
	window.$emitter.emit('confirm', {
		message: '삭제하시겠습니까?',
		callback: async () => {
			toggleLoading(true);

			try {
				const res = await api();

				if (validateAPIResult(res)) {
					window.$emitter.emit('success', '삭제가 완료되었습니다.');
					await callback();
				}
			} catch (e) {
				console.error('useCallDeleteAPI Error: ', e);
			} finally {
				toggleLoading(false);
			}
		},
	});
};

//삭제할 때 사용하는 composable 메시지 변경버전
export const useCallDeleteMsgAPI = async (api: Function,message: string, callback: Function): Promise<void> => {
	window.$emitter.emit('confirm', {
		message: message,
		callback: async () => {
			toggleLoading(true);
			try {
				const res = await api();

				if (validateAPIResult(res)) {
					window.$emitter.emit('success', '삭제가 완료되었습니다.');
					await callback();
				}
			} catch (e) {
				console.error('useCallDeleteAPI Error: ', e);
			} finally {
				toggleLoading(false);
			}
		},
	});
};


//업로드용할 때 사용하는 composable
export const useCallUploadAPI = async (
	api: Function,
	callback: Function,
	formEl?: Ref<HTMLFormElement> | HTMLFormElement,
): Promise<void> => {
	//form엘리먼트가 있을 경우에만 vee-validate 체크
	const result = formEl ? await validateForm(formEl) : { valid: true };

	if (result.valid) {
		window.$emitter.emit('confirm', {
			message: '업로드 하시겠습니까?',
			callback: async () => {
				toggleLoading(true);
				try {
					const res = await api();
					if (validateAPIResult(res)) {
						window.$emitter.emit('success', '업로드에 성공하였습니다.');
						callback(res);
					} else {
						window.$emitter.emit('success', res.response.data.message)
					}
				} catch (e) {
					console.error('useCallUpdateAPI Error: ', e);
				} finally {
					toggleLoading(false);
				}
			},
		});
	} else {
		return result.errors;
	}
};
