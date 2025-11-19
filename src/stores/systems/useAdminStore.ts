import { defineStore } from 'pinia';
import { useCallAPI, validatePassword } from '@/utils/FormUtils';
import { systemsAPI } from '@/api/systems/systems';
import { useCallInsertAPI, useCallUpdateAPI } from '@/utils/FormUtils';
import { SearchParams } from '@/dto/systems/SearchParams';
import { isBlank, isNotBlank } from '@/utils/ValidateUtils';
import { useAuthStore } from '@/stores/auth/useAuthStore';

export const useAdminStore = defineStore('useAdminStore', {
	state: () => ({
		items: [],
		searchParams: new SearchParams() as SearchParams,
		form: {
			userNo: 0,
			id: '',
			name: '',
			phone: '',
			role: '',
			dataStatus: '',
		},
		addForm: {
			id: '',
			name: '',
			phone: '',
			role: '',
			dataStatus: '1',
		},
		/*form: {
			useYn: '0',
		},*/
	}),
	actions: {
		async callListAPI() {
			try {
				const searchParams = { ...this.searchParams };
				delete searchParams.userNo;

				if (isBlank(searchParams.keyword)) {
					delete searchParams.searchType;
				}

				const res = await useCallAPI(() => systemsAPI.list(searchParams));
				if (res) {
					this.items = res.data.data;
				}
			} catch (e) {
				console.error('useAdminStore.getInfo Error: ', e);
			}
		},
		async callDetailAPI(userNo) {
			try {
				const res = await useCallAPI(() => systemsAPI.detail(userNo));
				if (res) {
					this.form = res.data.data;

					return res;
				}
				return null;
			} catch (e) {
				console.error('useFirstAidStore.getInfo Error: ', e);
			}
		},
		async callUpdateAPI(form, callback: Function) {
			const result = validatePassword(form.password, form.passwordChk);

			if (result) {
				const reqBody = { ...form };
				delete reqBody['userNo'];
				delete reqBody['passwordChk'];

				await useCallUpdateAPI(() => systemsAPI.update(this.form.userNo, reqBody), callback);
			}
		},
		async callInsertAPI(addForm: any, callback: Function) {
			const result = validatePassword(addForm.password, addForm.passwordChk);

			if (result) {
				const reqBody = { ...addForm };
				delete reqBody['userNo'];
				delete reqBody['dataStatus'];
				delete reqBody['passwordChk'];
				console.log(result)
				await useCallInsertAPI(() => systemsAPI.insert(reqBody), callback);
			}
		},
	},
});
