import type { Canceler } from 'axios';

export interface CancelTokenItem {
	key: number;
	fn: Canceler;
}
