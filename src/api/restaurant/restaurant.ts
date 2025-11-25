import { getApiCall } from '@/api/services';
import { getV1 } from '@/utils/api/ApiPath';

export const restaurantAPI = {
	async list(params: any) {
		return await getApiCall().get(getV1(`/store/list`), params);
	},
	async grpList(grStNo: number | string ,params: any) {
		return await getApiCall().get(getV1(`/store/${grStNo}/grp`), params);
	},
	async regionList() {
		return await getApiCall().get(getV1(`/store/region/list`));
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
	async rebaseUpload(params: any) {
		return await getApiCall().put(getV1(`/rebase/`), params);
	},
	async usageUpload(districtNo: number, equipNo: number, params: any) {
		return await getApiCall().put(getV1(`/equip/${districtNo}/loc/${equipNo}`), params);
	},
	async updateStCode(params: any) {
		return await getApiCall().patch(getV1(`/store/stcode`), params);
	},
	async deleteCode(grStNoList: any) {
		return await getApiCall().delete(getV1(`/store/`), grStNoList);
	},
	async deleteImage(grStGoodsNoList: any) {
		return await getApiCall().delete(getV1(`/store/img`), grStGoodsNoList);
	},
	async upload(params: any,query : any) {
		return await getApiCall().post(getV1(`/store/img?dest=${query.dest}&grStGoodsNo=${query.grStGoodsNo}`), params);
	},
	async uploadSystem(params: any,query : any) {
		return await getApiCall().post(getV1(`/store/img?dest=${query.dest}&grStGoodsNo=${query.grStGoodsNo}`), params);
	},
};
