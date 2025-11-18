<!--
<template>
	<div class="list-layout-wrapper">
		<slot :route-page="routePage" :with-name="routePageWithName"></slot>
	</div>
</template>

<script setup lang="ts">
import { routePageContainSearchParams, routePageContainSearchParamsWithName } from '@/utils/list/ListUtils';
import { useRouter } from 'vue-router';
import menus from '@/main';

const router = useRouter();

//검색 조건 유지하며 페이지 이동
const routePage = (url: string) => {
	routePageContainSearchParams(url, router);
};

/*const routePageWithName = (name: string, params?: any) => {
	if (router.hasRoute(name)) {
		const findRoute = menus.find((route) => route.path === '/').children.find((route) => route.name === name);

		if (findRoute && 'children' in findRoute) {
			if ((findRoute.children as Array<any>).length === 0) {
				window.$emitter.emit('warning', '접근 권한이 없습니다.');
				return;
			}
		}
		let routeParams = null;
		if (params) {
			routeParams = { params: { ...params } };
		}

		routePageContainSearchParamsWithName(name, routeParams, router);
	} else {
		window.$emitter.emit('warning', '접근 권한이 없습니다.');
	}
};*/
</script>

<style scoped></style>
-->
