/*
import { useListStore } from '@/stores/common/useListStore';
import { type Router } from 'vue-router';
import { onBeforeMount, onMounted, type Ref, watch } from 'vue';
import { storeToRefs } from 'pinia';

export function hasDateKey(searchParams: any): boolean {
	return Object.keys(searchParams).some((key) => {
		const lowerKey = key.toLowerCase();
		return lowerKey.includes('startdate') || lowerKey.includes('enddate');
	});
}

export function getRowNum(index: number): number {
	const store = useListStore();

	return store.totalCount - store.pageParams.pageSize * (store.pageParams.pageSize - 1) - index;
}

// 하위 메뉴 체크 후 아닐 경우 listStore 초기화
export const isEqualMenu = (to, from) => {
	const store = useListStore();
	const toPaths = to.path.split('/');
	const fromPaths = from.path.split('/');
	const toRootPath = toPaths[1];
	const fromRootPath = fromPaths[1];

	if (fromRootPath) {
		if (toRootPath !== fromRootPath) {
			store.$reset();
		} else {
			if (toPaths[2] !== fromPaths[2]) {
				store.$reset();
			} else if (toPaths[3] !== fromPaths[3]) {
				store.$reset();
			}
		}
	}
};

//검색 searchParams get
export const getSearchParamsObj = (store: any) => {
	if (store.searchParams) {
		return { ...store.searchParams };
	}

	return null;
};

//검색조건 url query string에 세팅
export const routePageContainSearchParams = async (url: string, router: Router, replace: boolean = false) => {
	const store = useListStore();
	await router.push({ path: url, query: getSearchParamsObj(store), replace: replace });
};
export const routePageContainSearchParamsWithName = async (name: string, params: any, router: Router, replace: boolean = false) => {
	const store = useListStore();
	const route = { name: name, ...params, query: getSearchParamsObj(store), replace: replace };
	await router.push(route);
};

//리스트 검색 searchParams 유지
export const useSetInitialSearchParams = (store: any, searchParams: any) => {
	return onBeforeMount(() => {
		if (store.searchParams !== null) {
			searchParams.value = { ...store.searchParams };
			store.pageParams = {
				pageNo: parseInt(store.searchParams.pageNo),
				pageSize: parseInt(store.searchParams.pageSize),
			};
		} else {
			store.searchParams = { ...searchParams.value };
		}
	});
};

// 검색 searchParams 유지 후 리스트로 돌아왔을 때 재검색
export const getPageParamsWatcher = (immediate: boolean = true) => {
	return (searchFn?: Function) => {
		const {
			pageParams,
			searchParams: storeSearchParams,
		}: { pageParams: Ref<{ pageNo: number; pageSize: number }>; searchParams: Ref<any> } = storeToRefs(useListStore());

		watch(
			() => pageParams.value,
			async () => {
				if (storeSearchParams.value !== null) {
					searchFn();
				}
			},
			{ deep: true },
		);

		if (immediate && searchFn && !storeSearchParams.value) {
			(() =>
				onMounted(() => {
					searchFn();
				}))();
		}
	};
};
*/
