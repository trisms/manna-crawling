import { AxiosError, type AxiosResponse } from 'axios';
import { isAxiosError } from '@/utils/api/CheckAxiosError';

const SUCCESS_CODE = [200, 201, 207, 304];

/*
 * @returns {boolean}: false: 에러 발생, true 정상 실행
 */
const validateAPIResult = (res: AxiosResponse | AxiosError): boolean => {
	// Axios 에러가 아닐 경우(정상일 경우)
	if (isAxiosError(res)) {
		return false;
	} else {
		if (res && 'data' in res) {
			const { code, msg } = res.data;
			//API는 정상 호출됐지만 API에서 던진 에러일 경우
			if (!SUCCESS_CODE.includes(code)) {
				if (msg) {
					window.$emitter.emit('error', msg);
					return false;
				}
			}
			return true;
		}
	}
	return true;
};

export default validateAPIResult;
