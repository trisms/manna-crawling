import { defineStore } from 'pinia';
import type { CancelTokenItem } from '@packages/types/api/CancelTokenItem';

export const useCancelTokenStore = defineStore('cancelTokenStore', {
	state: () => ({
		cancelFns: [] as Array<CancelTokenItem>,
	}),
	actions: {
		putCancelItem(source: CancelTokenItem): void {
			this.cancelFns.push(source);
		},
		delCancelItem(key: number): void {
			this.cancelFns = this.cancelFns.filter((item) => item.key !== key);
		},
		cancelAllRequests(): void {
			this.cancelFns.forEach((item: CancelTokenItem) => item.fn());
			this.cancelFns = [];
		},
	},
});
