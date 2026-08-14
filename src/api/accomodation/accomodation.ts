import { getApiCall, getJigBaeApiCall, getNoAuthApiCall } from '@/api/services';
import { getBoardV1, getV1 } from '@/utils/api/ApiPath';

export const accommodationAPI = {
	async list(params: any) {
		return await getApiCall().get(getV1(`/accomodation/list`), params);
	},
	async regionList() {
		return await getApiCall().get(getV1(`/store/region/list`));
	},
	async getIntro(accomId: number | string) {
		return await getApiCall().get(getV1(`/accomodation/${accomId}/intro`));
	},
	async getRoom(accomId: number | string) {
		return await getApiCall().get(getV1(`/accomodation/${accomId}/room`));
	},
	async updateAccomAPI(params: any) {
		return await getApiCall().patch(getV1(`/accomodation/accom-code/${params.accomId}`), { accomCode :params.accomCode });
	},
	async deleteCode(accomIdList: any) {
		return await getApiCall().delete(getV1(`/accomodation/`), accomIdList);
	},
	async deleteImage(imgList: any, type : string) {
		return await getApiCall().delete(getV1(`/accomodation/img?type=`+type), {imgList : imgList});
	},
};
