import { getNoAuthApiCall } from '@/api/services';
import { getV1 } from '@/utils/api/ApiPath';

export const authAPI = {
	async login(params: any) {
		return await getNoAuthApiCall().post(getV1(`/auth/login`), params);
	},

};
