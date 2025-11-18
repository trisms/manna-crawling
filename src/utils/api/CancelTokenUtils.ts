import axios, { type Canceler, type CancelToken, type CancelTokenSource } from 'axios';
import { useCancelTokenStore } from '@/stores/api/useCancelTokenStore';
import type { CancelTokenItem } from '@/types/api/CancelTokenItem';

export function storeCancelToken(): { key: number; token: CancelToken } {
	const store = useCancelTokenStore();
	//취소 토큰 source 생성
	const source: CancelTokenSource = axios.CancelToken.source();
	// 생성된 source 에 대한 취소 함수 생성
	const fn: Canceler = () => source.cancel();
	// source를 구분할 수 있는 키 생성
	const key: number = store.cancelFns.length;
	const item: CancelTokenItem = { key, fn };
	store.putCancelItem(item);

	return { key, token: source.token };
}

export function delCancelToken(cancelTokenKey: number): void {
	const store = useCancelTokenStore();

	store.delCancelItem(cancelTokenKey);
}
