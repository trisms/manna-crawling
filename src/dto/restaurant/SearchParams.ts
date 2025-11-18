export class SearchParams {
	searchType: SearchType = '';
	keyword: string = null;

	sidoCode: string = '';
	sigunCode: string = '';
	appType: string = '';
	dataStatus: string = '';
	startDate: string = '';
	endDate: string = '';
}

export type SearchType = ''|'bizName' | 'bizNum' | 'stName';
