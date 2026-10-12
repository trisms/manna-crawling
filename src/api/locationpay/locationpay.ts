import { getApiCall, getJigBaeApiCall, getNoAuthApiCall } from '@/api/services';
import { getBoardV1, getV1 } from '@/utils/api/ApiPath';

export const locationPayAPI = {
	async list(params: any) {
		return await getApiCall().get(getV1(`/store/list`), params);
	},
	async detail(grStNo: number | string) {
		return await getApiCall().get(getV1(`/store/${grStNo}`));
	},
	async insert(districtNo: number, params: any) {
		return await getApiCall().post(getV1(`/equip/${districtNo}/loc`), params);
	},
	async update(districtNo: number, equipNo: number, params: any) {
		return await getApiCall().put(getV1(`/equip/${districtNo}/loc/${equipNo}`), params);
	},
};
