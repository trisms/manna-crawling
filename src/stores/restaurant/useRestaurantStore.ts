import { defineStore } from 'pinia';
import { useCallAPI, useCallDeleteMsgAPI, useCallUpdateDirectAPI, useCallUploadAPI } from '@/utils/FormUtils';
import { restaurantAPI } from '@/api/restaurant/restaurant';
import { isBlank, isNotBlank } from '@/utils/ValidateUtils';
import { SearchParams } from '@/dto/restaurant/SearchParams';

export const useRestaurantStore = defineStore('useRestaurantStore', {
	state: () => ({
		items: [],
		grpItems: [],
		selectSido: String,
		sidoList: [],
		sigunList: [],

		frSubTypeCdList: [{}],
		selectSyCode: 'NM',
		selectGrStGoodsNo: 0 as number,
		selectGoodsTypeCd: String,
		selectGoodsName: String,
		goodsTypeCdList: [{ dtCode: '', dtName: '상품분류' }],
		goodsDetailCdList: [{ dtCode: '', dtName: '상품구분' }],
		grpGoodsList: [],
		systemImgList: [],
		systemImgCnt: 0,
		systemImgCodeParam: {
			syCode: '',
			dtCode: '',
		},
		systemFrImgCodeParam: {
			syCode: '',
		},
		prevParentDtCode: '',
		prevDtCode: '',
		systemImgSearchParams: {
			pageNo: 1,
			pageSize: 30,
			parentDtCode: '',
			dtCode: '',
			findType: '1',
			findVal: '',
		},
		prevFrDtCode: '',
		systemFrImgSearchParams: {
			pageNo: 1,
			pageSize: 30,
			frDtCode: '',
			findType: '1',
			findVal: '',
		},
		form: { grStNo: 0 },
		mutableImage: {
			imageNo: null,
			path: null,
			thumbnailPath: null,
			imageFile: null,
			preview: null,
		},
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
			// delete searchParams.userNo;

			if (isBlank(searchParams.keyword)) {
				delete searchParams.searchType;
			}

			const res = await useCallAPI(() => restaurantAPI.list(searchParams));
			if (res) {
				this.items = res.data.data;
			}
		},
		async callGrpListAPI(grStNo: number | string, grStGrpNo: any) {
			/*const searchParams = { ...this.searchParams };
			delete searchParams.userNo;

			if (isBlank(searchParams.keyword)) {
				delete searchParams.searchType;
			}*/

			const res = await useCallAPI(() => restaurantAPI.grpList(grStNo, { grStGrpNo: grStGrpNo }));
			if (res) {
				this.grpItems = res.data.data;
			}
		},
		async callRegionList() {
			const res = await useCallAPI(() => restaurantAPI.regionList());
			if (res) {
				this.sidoList = res.data.data.sidoList;
				this.sidoList.unshift({ sidoType: 'A1', sidoCode: '', addrName: '시/도' });
				this.sigunList = res.data.data.sigunList;
				this.sigunList.unshift({ sidoType: 'A2', sigunCode: '', addrName: '시/군/구' });
			}
		},

		async deleteCodeAPI(grStNoList: any, callback: Function) {
			const message = '<h3>DB삭제시 복구가 불가능합니다 </h3>' + grStNoList.grStNoList.length + '개의 데이터를 삭제하시겠습니까?';
			await useCallDeleteMsgAPI(() => restaurantAPI.deleteCode(grStNoList), message, callback);
		},
		async deleteImageAPI(grStGoodsNoList: { grStGoodsNoList: [] }, callback: Function) {
			const message = '<h3>DB삭제시 복구가 불가능합니다 </h3>' + grStGoodsNoList.grStGoodsNoList.length + '개의 데이터를 삭제하시겠습니까?';
			await useCallDeleteMsgAPI(() => restaurantAPI.deleteImage(grStGoodsNoList), message, callback);
		},
		async rebaseUpload(grStNoList: any, callback: Function) {
			await useCallUploadAPI(() => restaurantAPI.rebaseUpload(grStNoList), callback);
		},
		async usageUpload(grStNoList: any, callback: Function) {
			await useCallUploadAPI(() => restaurantAPI.usageUpload(grStNoList), callback);
		},

		async updateStCodeAPI(params: any, callback): Promise<void> | null {
			await useCallUpdateDirectAPI(() => restaurantAPI.updateStCode(params), callback);
		},
		async callDetailAPI(id: number) {
			const res = await useCallAPI(() => restaurantAPI.detail(id));
			if (res) {
				this.form = { ...res.data.data.storeInfo };
				this.grpList = { ...res.data.data.grpList };
			}
		},

		async calluploadImgAPI(formData: FormData, query: { dest: string; grStGoodsNo: number }, callback: Function) {
			if (formData) {
				const res = await useCallAPI(() => restaurantAPI.upload(formData, query));
				if (res) {
					window.$emitter.emit('success', '이미지 등록이 완료되었습니다.');
					callback();
				}
			}
		},

		async callUploadSysImgAPI(query: { grStGoodsNo: number; imgTFile: string }, callback: Function) {
			const res = await useCallAPI(() => restaurantAPI.uploadSystem(query));
			if (res) {
				window.$emitter.emit('success', '이미지 등록이 완료되었습니다.');
				callback();
			}
		},

		async calluploadSystemImgAPI(params: any, callback: Function) {
			window.$emitter.emit('confirm', {
				message: '등록하시겠습니까?',
				callback: async () => {
					if (params) {
						const res = await useCallAPI(() => restaurantAPI.uploadSystem(params));
						if (res) {
							window.$emitter.emit('success', '이미지 등록이 완료되었습니다.');
							callback();
						}
					}
				},
			});
		},
		async callChageProductPrice(grStNo:number , params: any, callback: Function) {
			window.$emitter.emit('confirm', {
				message: '변경할 금액 : '+ params.minPrice +' <br><br>최소주문금액을 변경하시겠습니까?',
				callback: async () => {
					if (params) {
						const res = await useCallAPI(() => restaurantAPI.changeProductPrice(grStNo, params));
						if (res) {
							window.$emitter.emit('success', '변경에 성공하였습니다');
							callback();
						}
					}
				},
			});
		},

		async callSystemImgList() {
			let res = null;
			if (String(this.selectSyCode) === 'FR') {
				if (this.prevFrDtCode !== this.systemFrImgCodeParam.syCode) {
					this.systemFrImgSearchParams.pageNo = 1;
				}
				const systemFrImgSearchParams = { ...this.systemFrImgSearchParams };
				systemFrImgSearchParams.frDtCode = this.systemFrImgCodeParam.syCode;
				this.prevFrDtCode = this.systemFrImgCodeParam.syCode;
				res = await useCallAPI(() => restaurantAPI.systemImgFrList(systemFrImgSearchParams));
			} else {
				if (this.prevParentDtCode !== this.systemImgCodeParam.syCode || this.prevDtCode !== this.systemImgCodeParam.dtCode) {
					this.systemImgSearchParams.pageNo = 1;
				}
				const systemImgSearchParams = { ...this.systemImgSearchParams };
				systemImgSearchParams.parentDtCode = this.systemImgCodeParam.syCode;
				systemImgSearchParams.dtCode = this.systemImgCodeParam.dtCode;
				this.prevParentDtCode = this.systemImgCodeParam.syCode;
				this.prevDtCode = this.systemImgCodeParam.dtCode;
				res = await useCallAPI(() => restaurantAPI.systemImgCommonList(systemImgSearchParams));
			}
			if (res) {
				this.systemImgList = res.data.DATA.list;
				this.systemImgCnt = res.data.DATA.totalCount;
			} else {
				this.systemImgList = [];
				this.systemImgCnt = 0;
			}
		},
		async callGrpGoodsList(grStNo:any, grStGoodsNo:any, callback: Function) {
			const res = await useCallAPI(() => restaurantAPI.grpGoodsList(grStNo,grStGoodsNo));
			if (res) {
				this.grpGoodsList = res.data.data;
			}
		},
		async callSystemImgCateList(type: string) {
			const systemImgCodeParam = { ...this.systemImgCodeParam };

			let res = null;

			if (type === 'FR') {
				res = await useCallAPI(() => restaurantAPI.systemImgCateList({ syCode: 'FT' }));
				this.frSubTypeCdList = res.data.DATA.filter(({ dtCode, dtName }) => isNotBlank(dtCode) && isNotBlank(dtName));
				this.frSubTypeCdList.unshift({ dtCode: '', dtName: '프랜차이즈 선택' });
			}
			if (type === 'NM') {
				res = await useCallAPI(() => restaurantAPI.systemImgCateList({ syCode: 'G1' }));
				this.goodsTypeCdList = res.data.DATA.filter(({ dtCode, dtName }) => isNotBlank(dtCode) && isNotBlank(dtName));
				this.goodsTypeCdList.unshift({ dtCode: '', dtName: '상품분류' });
			}
			if (type === 'G2') {
				res = await useCallAPI(() =>
					restaurantAPI.systemImgCateList({ syCode: 'G2', parentSyCode: 'G1', parentDtCode: systemImgCodeParam.syCode }),
				);
				this.goodsDetailCdList = res.data.DATA.filter(({ dtCode, dtName }) => isNotBlank(dtCode) && isNotBlank(dtName));
				this.goodsDetailCdList.unshift({ dtCode: '', dtName: '상품구분' });
			}
		},
	},
});
