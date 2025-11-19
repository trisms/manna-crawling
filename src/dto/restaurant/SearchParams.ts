export class SearchParams {
	searchType: SearchType = '';
	keyword: string = null;

	sidoCode: string = '';
	sigunCode: string = '';
	appType: string = '';
	dataStatus: string = '';

	startDate: Date = new Date();  // ← 오늘 날짜
	endDate: Date = new Date();    // ← 오늘 날짜
}

export type SearchType = ''|'bizName' | 'bizNum' | 'stName';
