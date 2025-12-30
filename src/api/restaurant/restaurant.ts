import { getApiCall, getJigBaeApiCall, getNoAuthApiCall } from '@/api/services';
import { getBoardV1, getV1 } from '@/utils/api/ApiPath';

export const restaurantAPI = {
	async list(params: any) {
		return await getApiCall().get(getV1(`/store/list`), params);
	},
	async grpList(grStNo: number | string, params: any) {
		return await getApiCall().get(getV1(`/store/${grStNo}/grp`), params);
	},
	async grpGoodsList(grStNo: number | string, grStGoodsNo: number | string) {
		return await getApiCall().get(getV1(`/store/${grStNo}/goods-mapp/${grStGoodsNo}`));
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
	async changeProductPrice(grStNo : number ,params: any) {
		return await getApiCall().patch(getV1(`/store/${grStNo}/min-price`), params);
	},
	/*async rebaseUpload(grStNoList: any) {
		return await getJigBaeApiCall().post(`https://api-d.jigbae.co.kr:8443/broad/v1/upload-data?type=1`, grStNoList);
	},*/
	async rebaseUpload(grStNoList: any, onlyGoods:any) {
		return await getJigBaeApiCall().post(getBoardV1(`/upload-data?type=1&onlyGoods=${onlyGoods}`), grStNoList );
	},
	async usageUpload(grStNoList: any, onlyGoods:any) {
		return await getJigBaeApiCall().post(getBoardV1(`/upload-data?type=2&onlyGoods=${onlyGoods}`), grStNoList);
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
	async upload(params: any, query: any) {
		return await getApiCall().post(getV1(`/store/img?dest=${query.dest}&grStGoodsNo=${query.grStGoodsNo}`), params);
	},
	async uploadSystem(params: any) {
		return await getApiCall().post(getV1('/store/system/img'), params);
	},

	async systemImgFrList(params: any) {
		return await getJigBaeApiCall().get(getBoardV1(`/system/fr/image-list`), params);
	},
	async systemImgCommonList(params: any) {
		return await getJigBaeApiCall().get(getBoardV1(`/system/common/image-list`), params);
	},
	async systemImgCateList(params: any) {
		return await getJigBaeApiCall().get(getBoardV1(`/system/image-code`), params);
	},
};
