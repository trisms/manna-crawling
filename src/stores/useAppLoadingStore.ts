import { defineStore } from 'pinia';

export const useAppLoadingStore = defineStore('appLoading', {
	state: () => ({
		isLoading: false,
	}),
});
