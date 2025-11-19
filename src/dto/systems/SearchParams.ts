export class SearchParams {
	userNo: number | string = null;
	searchType: SearchType = 'id';
	keyword: string = null;
	role: string = '1';
	dataStatus: string = '1';
}

export type SearchType = 'name' | 'id'  | 'phone';
