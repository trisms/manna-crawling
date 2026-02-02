export class SearchHistoryParams {
	searchType: SearchType = '';
	keyword: string = null;

	appType: string = '';
	dataStatus: string = '';

}

export type SearchType = ''|'stCode' | 'bizNum' | 'stName';
