import { defineStore } from 'pinia';
import { useCallAPI, useCallDeleteMsgAPI, useCallUpdateDirectAPI, useCallUploadAPI } from '@/utils/FormUtils';
import { restaurantAPI } from '@/api/restaurant/restaurant';
import { isBlank, isNotBlank } from '@/utils/ValidateUtils';
import { SearchParams } from '@/dto/restaurant/SearchParams';
import {SearchHistoryParams} from "@/dto/restaurant/SearchHistoryParams";

export const useRestaurantStore = defineStore('useRestaurantStore', {
	state: () => ({
		items: [],
		grpItems: [],
		selectSido: String,
		sidoList: [],
		sigunList: [],
		uploadHistoryList: [],
		frSubTypeCdList: [{}],
		selectOnlyGoods:0,
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
		searchParamsHistory: new SearchHistoryParams() as SearchHistoryParams,
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
			const searchParams = {
				...this.searchParams,
				startDate: formatDateOnly(this.searchParams.startDate),
				endDate: formatDateOnly(this.searchParams.endDate),
			};
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
	/*	/!* 기존상품삭제후 신규 업로드 *!/
		async rebaseUpload(grStNoList: any, callback: Function) {
			const selectOnlyGoods = this.selectOnlyGoods ? 1 : 2
			const userId = localStorage.getItem('userId');
			await useCallUploadAPI(() => restaurantAPI.rebaseUpload(grStNoList ,selectOnlyGoods,userId), callback);
		},
		/!* 기존상품유지후 신규 업로드 *!/
		async usageUpload(grStNoList: any, callback: Function) {
			const selectOnlyGoods = this.selectOnlyGoods ? 1 : 2
			const userId = localStorage.getItem('userId');
			await useCallUploadAPI(() => restaurantAPI.usageUpload(grStNoList, selectOnlyGoods,userId), callback);
		},*/
		/* 가맹점코드 일괄등록용 */
		async goodsUpload(grStNoList: any, callback: Function, type: any, uploadType: any) {
			/* Type  : 1 (기존상품삭제후 신규 업로드) , 2 (기존상품유지후 추가) */
			/* UploadType  : 1 (일반 버튼등록) , 2 (가맹점코드 일괄등록) */

			const selectOnlyGoods = this.selectOnlyGoods ? 1 : 2;
			const userId = localStorage.getItem('userId');

		/*	if (uploadType === 1) {
				userId = localStorage.getItem('userId');
			} else {
				userId = 'SYSTEM';
			}*/

			console.log('STORE goodsUpload', {
				grStNoList,
				type,
				uploadType,
				selectOnlyGoods,
				userId,
			});

			await useCallUploadAPI(
				() => restaurantAPI.goodsUpload(grStNoList, selectOnlyGoods, userId, type),
				callback,
			);
		},

		/* 엑셀 일괄등록 */
		async excelBatchUpload(data: any[], callback: Function) {
			/*
             * dbType
             * 1 : 기존상품삭제후 신규 업로드
             * 2 : 기존상품유지후 추가
             * 3 : 가맹점코드 등록
             */

			const type1Items = data.filter((item: any) => item.dbType === 1);
			const type2Items = data.filter((item: any) => item.dbType === 2);

			// 가맹점코드는 엑셀로 들어온 전체 데이터 등록
			const type3Items = data;

			console.log('엑셀 일괄등록 분류', {
				type1Items,
				type2Items,
				type3Items,
			});

			if (type3Items.length === 0) {
				throw new Error('처리할 데이터가 없습니다.');
			}

			const selectOnlyGoods = this.selectOnlyGoods ? 1 : 2;
			const userId = localStorage.getItem('userId');

			/*
             * 1. 가맹점코드 먼저 일괄등록
             */
			const stCodeParams = {
				data: type3Items.map((item: any) => ({
					grStNo: item.grStNo,
					stCode: item.stCode,
				})),
			};

		/*	console.log('엑셀 updateStCodeBatch', stCodeParams);*/

			const stCodeRes = await restaurantAPI.updateStCodeBatch(stCodeParams);

		/*	console.log('엑셀 updateStCodeBatch 결과', stCodeRes);*/

			/*
             * updateStCodeBatch 성공 여부 확인
             */
			if (!stCodeRes || stCodeRes.data?.success !== true) {
				throw new Error(
					stCodeRes?.data?.message || '가맹점코드 일괄등록에 실패하였습니다.',
				);
			}

			/*
             * 여기까지 왔다는 것은
             * 가맹점코드 일괄등록 성공
             *
             * 이제 dbType 1 / 2 상품등록 진행
             */
			const requests: Promise<any>[] = [];

			/*
             * 2. 기존상품삭제후 신규 업로드
             */
			if (type1Items.length > 0) {
				const params = {
					grStNoList: type1Items.map((item: any) => item.grStNo),
				};

				console.log('엑셀 goodsUpload type 1', params);

				requests.push(
					restaurantAPI.goodsUpload(
						params,
						selectOnlyGoods,
						userId,
						1,
					),
				);
			}

			/*
             * 3. 기존상품유지후 추가
             */
			if (type2Items.length > 0) {
				const params = {
					grStNoList: type2Items.map((item: any) => item.grStNo),
				};

				console.log('엑셀 goodsUpload type 2', params);

				requests.push(
					restaurantAPI.goodsUpload(
						params,
						selectOnlyGoods,
						userId,
						2,
					),
				);
			}

			/*
             * type 1 / 2 상품등록
             */
			if (requests.length > 0) {
				await Promise.all(requests);
			}

			if (callback) {
				await callback();
			}
		},
		async callUploadHistory() {
			const searchParams = { ...this.searchParamsHistory };
			// delete searchParams.userNo;

			if (isBlank(searchParams.keyword)) {
				delete searchParams.searchType;
			}

			const res = await useCallAPI(() => restaurantAPI.callUploadHistory(searchParams));
			if (res) {
				this.uploadHistoryList = res.data.data;
			}
		},

		async updateStCodeAPI(params: any, callback): Promise<void> | null {
			await useCallUpdateDirectAPI(() => restaurantAPI.updateStCode(params), callback);
		},
		async updateStCodeBatchAPI(params: any, callback: Function) {
			await useCallUpdateDirectAPI(
				() => restaurantAPI.updateStCodeBatch(params),
				callback
			);
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
		async callChageAppScheme(
			grStNo: number,
			params: any,
			field?: string,
			callback: Function

		) {
			const appSchemeFields: Record<string, string> = {
				baeminAppScheme: '배민',
				coupangAppScheme: '쿠팡',
				yogiyoAppScheme: '요기요',
				ddangyoAppScheme: '땡겨요',
				mukkebiAppScheme: '먹깨비'
			};

			const targetField = field || Object.keys(appSchemeFields).find(
				key => Object.prototype.hasOwnProperty.call(params ?? {}, key)
			);

			if (!targetField || !appSchemeFields[targetField]) {
				window.$emitter.emit('warning', '변경할 앱 스킴을 확인해주세요.');
				return;
			}

			const appName = appSchemeFields[targetField];
			const appScheme = params[targetField] ?? '';

			// 기존 API에 맞게 appScheme으로 변환
			const payload = {
				appScheme: appScheme
			};

			const displayScheme = String(appScheme).replace(
				/[&<>"']/g,
				char => ({
					'&': '&amp;',
					'<': '&lt;',
					'>': '&gt;',
					'"': '&quot;',
					"'": '&#39;'
				}[char] || char)
			);

			window.$emitter.emit('confirm', {
				message: `${appName} 앱 스킴 : ${displayScheme || '(비어 있음)'}<br><br>해당 스킴을 변경하시겠습니까?`,
				callback: async () => {
					const res = await useCallAPI(() =>
						restaurantAPI.changeAppScheme(grStNo, payload)
					);

					if (res) {
						window.$emitter.emit('success', `${appName} 스킴 변경에 성공하였습니다.`);
						callback();
					}
				}
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
const formatDateOnly = (value: any): string => {
	if (!value) return '';

	if (value instanceof Date) {
		const year = value.getFullYear();
		const month = String(value.getMonth() + 1).padStart(2, '0');
		const day = String(value.getDate()).padStart(2, '0');

		return `${year}-${month}-${day}`;
	}

	return String(value).substring(0, 10);
};
