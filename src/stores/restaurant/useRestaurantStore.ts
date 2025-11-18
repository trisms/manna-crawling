import { defineStore } from 'pinia';
import {
	useCallAPI,
	useCallDeleteAPI,
	useCallDeleteMsgAPI,
	useCallUpdateAPI,
	useCallUpdateDirectAPI,
	validateForm
} from '@/utils/FormUtils';
import { authAPI } from '@/api/auth/auth'
import {restaurantAPI} from "@/api/restaurant/restaurant";
import {isBlank} from "@/utils/ValidateUtils";
import {SearchParams} from "@/dto/restaurant/SearchParams";
import { ref, unref} from "vue";
export const useRestaurantStore = defineStore('useRestaurantStore', {
	state: () => ({
		items: ref([]),
		grpItems: [],
		sidoList: [],
		selectSido: String,
		sigunList: [],
		form: {},
		mutableImage: {
			imageNo: null,
			path: null,
			thumbnailPath: null,
			imageFile: null,
			preview: null,
		} ,
		addForm: {},
		grpList: [],
		searchParams: new SearchParams() as SearchParams,
		/*userInfo: {
			userNo: 0,
			loginId: '',
			userName: '',
			departName: '',
			phone: '',
			role: '',
			useYn: '',
		},
		info: JSON.parse(localStorage.getItem('userInfo')) || {},*/
	}),
	actions: {
		async callListAPI(callback: Function) {

			const searchParams = { ...this.searchParams };
			delete searchParams.userNo;

			if (isBlank(searchParams.keyword)) {
				delete searchParams.searchType;
			}

			const res = await useCallAPI(() => restaurantAPI.list(searchParams));
			if (res) {
				this.items = res.data.data;
			}
		},
		async callGrpListAPI(grStNo:number | string, grStGrpNo: any ,callback: Function) {
			/*const searchParams = { ...this.searchParams };
			delete searchParams.userNo;

			if (isBlank(searchParams.keyword)) {
				delete searchParams.searchType;
			}*/

			const res = await useCallAPI(() => restaurantAPI.grpList(grStNo,{grStGrpNo : grStGrpNo}));
			if (res) {
				this.grpItems = res.data.data;
			}
		},
		async callRegionList() {
			const res = await useCallAPI(() => restaurantAPI.regionList());

			if (res) {
				this.sidoList = res.data.data.sidoList
				this.sidoList.unshift({sidoType : 'A1' ,sidoCode : '', addrName : '시/도'})
				this.sigunList = res.data.data.sigunList
				this.sigunList.unshift({sidoType: 'A2', sigunCode : '', addrName : '시/군/구'})
			}
		},
		async deleteCodeAPI(grStNoList : any, callback: Function) {
			const message =
				'<h3>DB삭제시 복구가 불가능합니다 </h3>' +
				grStNoList.grStNoList.length +
				'개의 데이터를 삭제하시겠습니까?';
			await useCallDeleteMsgAPI(() => restaurantAPI.deleteCode(grStNoList),message, callback);
		},
		async deleteImageAPI(grStGoodsNoList : [], callback: Function) {
			const message =
				'<h3>DB삭제시 복구가 불가능합니다 </h3>' +
				grStGoodsNoList.grStGoodsNoList.length +
				'개의 데이터를 삭제하시겠습니까?';
			await useCallDeleteMsgAPI(() => restaurantAPI.deleteImage(grStGoodsNoList),message, callback, );
		},
		async updateStCodeAPI(params: any, callback): Promise<void> | null {
			await useCallUpdateDirectAPI(() => restaurantAPI.updateStCode(params), callback);
		},
		async callDetailAPI(id: number | string) {
			const res = await useCallAPI(() => restaurantAPI.detail(id));
			if (res) {
				this.form = { ...res.data.data.storeInfo };
				this.grpList = { ...res.data.data.grpList }
			}
		},

		async calluploadImgAPI(form: FormData | HTMLFormElement, query ,callback: Function) {

				window.$emitter.emit('confirm', {
					message: '등록하시겠습니까?',
					callback: async () => {
						if (form) {
							const res = await useCallAPI(() => restaurantAPI.upload(form,query));
							if (res) {
								window.$emitter.emit('success', '이미지 등록이 완료되었습니다.');
								callback();
							}
						}
					},
				});
		},
	},
});
