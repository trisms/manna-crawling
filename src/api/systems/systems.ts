import { getApiCall } from '@/api/services';
import { getV1 } from '@/utils/api/ApiPath';

export const systemsAPI = {
	async list(params: any) {
		return await getApiCall().get(getV1(`/user/list`), params);
	},
	async detail(userNo) {
		return await getApiCall().get(getV1(`/user/${userNo}`));
	},
	async update(userNo: any, params: any) {
		return await getApiCall().put(getV1(`/user/${userNo}`), params);
	},
	async insert(params: any) {
		return await getApiCall().post(getV1(`/auth/register`), params);
	},
};
