import { defineStore } from 'pinia';
import {useCallAPI, useCallUpdateDirectAPI} from '@/utils/FormUtils';
import { accommodationAPI } from '@/api/accomodation/accomodation';
import { isBlank } from '@/utils/ValidateUtils';
import {restaurantAPI} from "@/api/restaurant/restaurant";

class AccommodationSearchParams {
	sidoCode = '';
	sigunCode = '';
	page = 1;
	size = 10;
	appType = '';
	accomType = '';
	dataStatus = '';
	startDate = '';
	endDate = '';
	searchType = '';
	keyword = '';
}

export const useAccommodationStore = defineStore('useAccommodationStore', {
	state: () => ({
		items: [] as any[],
		totalPages: 0,
		totalSize: 0,
		currentPage: 1,
		pageSize: 10,

		sidoList: [] as any[],
		sigunList: [] as any[],

		form: {
			info: {},
			room: [] as any[],
		},

		searchParams: new AccommodationSearchParams(),
	}),

	actions: {
		async callListAPI(callback?: Function) {
			const searchParams = { ...this.searchParams };

			if (isBlank(searchParams.keyword)) {
				delete searchParams.searchType;
			}

			const res = await useCallAPI(() => accommodationAPI.list(searchParams));

			if (res) {
				const pageData = res.data?.data;
				const currentPage = Number(pageData?.page || searchParams.page || 1);
				const pageSize = Number(pageData?.size || searchParams.size || 10);

				this.items = Array.isArray(pageData?.accomodations) ? pageData.accomodations : [];
				this.totalPages = Number(pageData?.totalPages || 0);
				this.totalSize = Number(pageData?.totalSize || 0);
				this.currentPage = currentPage;
				this.pageSize = pageSize;

				this.searchParams.page = currentPage;
				this.searchParams.size = pageSize;

				if (callback) callback();
			} else {
				this.items = [];
				this.totalPages = 0;
				this.totalSize = 0;
				this.currentPage = 1;
				this.pageSize = 10;
			}
		},

		async updateAccomAPI(params: any, callback): Promise<void> | null {
			await useCallUpdateDirectAPI(() => accommodationAPI.updateAccomAPI(params), callback);
		},


		async callRegionList() {
			const res = await useCallAPI(() => accommodationAPI.regionList());

			if (res) {
				this.sidoList = res.data?.data?.sidoList || [];
				this.sigunList = res.data?.data?.sigunList || [];

				this.sidoList.unshift({ sidoCode: '', addrName: '시/도' });
				this.sigunList.unshift({ sigunCode: '', addrName: '시/군/구' });
			}
		},

		async callDetailAPI(accomId: number | string) {
			const resInfo = await useCallAPI(() => accommodationAPI.getIntro(accomId));
			const resRoom = await useCallAPI(() => accommodationAPI.getRoom(accomId));

			if (resInfo) {
				this.form.info = { ...(resInfo.data?.data || {}) };
			}

			if (resRoom) {
				this.form.room = resRoom.data?.data || [];
			}
		},

		resetSearchParams() {
			this.searchParams = new AccommodationSearchParams();
		},
	},
});
