import { AxiosError, type AxiosResponse } from 'axios';

const NETWORK_ERROR = 'ERR_NETWORK';
const BAD_REQUEST = 'ERR_BAD_REQUEST';
const ERR_BAD_RESPONSE = 'ERR_BAD_RESPONSE';
const ERR_NAME_NOT_RESOLVED = 'ERR_NAME_NOT_RESOLVED';
const ECONNABORTED = 'ECONNABORTED';
const ERR_CANCELED = 'ERR_CANCELED';

function errorAlert(msg?: string) {
	const text: string = msg ? msg : '관리자에게 문의하세요.';
	window.Swal.fire({
		icon: 'error',
		title: '서버 호출 중 에러가 발생하였습니다.',
		text,
		confirmButtonText: '확인',
	});
}

export const isAxiosError = (res: AxiosResponse | AxiosError<any>) => {
	if (res instanceof AxiosError) {
		switch (res.code) {
			case NETWORK_ERROR:
				errorAlert('네트워크 연결 에러!');
				return true;
			case BAD_REQUEST:
				if (
					res.response.data &&
					typeof res.response.data === 'object' &&
					'msg' in res.response.data
				) {
					errorAlert(res.response.data.msg);
				} else {
					errorAlert();
				}
				return true;
			case ERR_BAD_RESPONSE:
			case ERR_NAME_NOT_RESOLVED:
				errorAlert();
				return true;
			case ECONNABORTED:
				errorAlert('API Request Timeout');
				return true;
			case ERR_CANCELED:
				return true;
		}
	} else {
		return false;
	}
};
