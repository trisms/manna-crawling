import { defineStore } from 'pinia';
import { useCallAPI } from '@/utils/FormUtils';
import { authAPI } from '@/api/auth/auth';
export const useAuthStore = defineStore('authStore', {
	state: () => ({
		form: {
			id: '' as string,
			password: '' as string,
		},
		userInfo: {
			userNo: 0,
			loginId: '',
			name: '',
			departName: '',
			phone: '',
			role: '',
			useYn: '',
		},
	}),
	actions: {
		async callLoginAPI(callback: Function) {
			const res = await useCallAPI(() => authAPI.login(this.form));
			if (res) {
				const { accessToken,name,role } = res.data.data;
				this.userInfo.name = res.data.data.name;
				this.userInfo.role = res.data.data.role;
				localStorage.setItem('accessToken', accessToken);

			/*	const adminStore = useAdminStore();
				const infoRes = await adminStore.callDetailAPI(res.data.data.userNo);*/

				/*if (infoRes) {
					this.info = { ...infoRes.data.data };
					localStorage.setItem('userInfo', JSON.stringify(this.info));
				}*/
				callback();
			}
		},
		logout() {
			localStorage.removeItem('userInfo');
			localStorage.removeItem('accessToken');
		},
	},
});
