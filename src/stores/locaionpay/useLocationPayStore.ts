import { defineStore } from 'pinia';
import { useCallAPI } from '@/utils/FormUtils';
import { restaurantAPI } from '@/api/restaurant/restaurant';
import { isBlank, isNotBlank } from '@/utils/ValidateUtils';
import { SearchParams } from '@/dto/restaurant/SearchParams';
import {SearchHistoryParams} from "@/dto/restaurant/SearchHistoryParams";

export const useLocaionPayStore = defineStore('useLocaionPayStore', {
	state: () => ({
		items: [],
		grpItems: [],
		addForm: {},
		searchParams: new SearchParams() as SearchParams,
	}),
	actions: {
		async callListAPI(callback: Function) {
			const searchParams = {
				...this.searchParams,
				startDate: formatDateOnly(this.searchParams.startDate),
				endDate: formatDateOnly(this.searchParams.endDate),
			};
			if (isBlank(searchParams.keyword)) {
				delete searchParams.searchType;
			}
			const res = await useCallAPI(() => restaurantAPI.list(searchParams));
			if (res) {
				this.items = res.data.data;
			}
		},

		/* 가맹점코드 일괄등록용 */

		/* 엑셀 일괄등록 */
		async callDetailAPI(id: number) {
			const res = await useCallAPI(() => restaurantAPI.detail(id));
			if (res) {
				this.form = { ...res.data.data.storeInfo };
				this.grpList = { ...res.data.data.grpList };
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
