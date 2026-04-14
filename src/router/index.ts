import { createRouter, createWebHistory } from 'vue-router';
import { useRestaurantStore } from '@/stores/restaurant/useRestaurantStore';
import { useAppOptionStore } from '@/stores/app-option';
import { useAdminStore } from '@/stores/systems/useAdminStore';
import {useAccommodationStore} from "@/stores/accommodation/useAccommodationStore";

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/:pathMatch(.*)*',
			name: 'Error',
			component: () => import('@/components/common/Error-404.vue'),
		},
		{
			path: '/',
			redirect: '/restaurant/',
		},
		{
			path: '/login',
			component: () => import('@/views/Login.vue'),
		},
		{
			path: '/',
			component: () => import('@/layouts/MainLayout.vue'),
			children: [
				{
					path: '/restaurant/',
					component: () => import('@/views/restaurant/list.vue'),
					beforeEnter: async (to, from, next) => {
						const store = useRestaurantStore();
						await store.callListAPI(() => {});
						await store.callRegionList();
						next();
					},
				},
				{
					name: 'RestaurantMenu',
					path: '/restaurant/menu/:id',
					component: () => import('@/views/restaurant/menuList.vue'),
					beforeEnter: async (to, from, next) => {
						const store = useRestaurantStore();
						await store.callDetailAPI(parseInt(to.params.id as string));
						if (store.grpList) {
							await store.callGrpListAPI(store.form.grStNo, store.grpList[0].grStGrpNo, () => {});
						}
						next();
					},
				},
				{
					name: 'AccommodationList',
					path: '/accommodation/',
					component: () => import('@/views/accommodation/list.vue'),
					beforeEnter: async (to, from, next) => {
						const store = useAccommodationStore();
						await store.callListAPI(() => {});
						await store.callRegionList();
						next();
					},
				},
				{
					name: 'AccommodationDetail',
					path: '/accommodation/:id',
					component: () => import('@/views/accommodation/components/detail.vue'),
					beforeEnter: async (to, from, next) => {
						const store = useAccommodationStore();
						await store.callDetailAPI(parseInt(to.params.id as string));
						next();
					},
					meta: {
						title: '숙박업소 상세',
						nav: ['숙박업소 관리', '숙박업소 목록', '상세정보'],
						depth: 2,
					},
				},
				{
					path: '/system/',
					component: () => import('@/views/system/admin/list.vue'),
					beforeEnter: async (to, from, next) => {
						const store = useAdminStore();
						await store.callListAPI();
						next();
					},
				},
				{
					path: '/system/add',
					component: () => import('@/views/system/admin/add.vue'),
				},
			],
		},
		{ path: '/main', component: () => import('@/views/Home.vue') },
	],
});

const noAuthPath = ['/login'];
router.beforeEach((to, from, next) => {
	const appOption = useAppOptionStore();

	appOption.appSidebarMobileToggled = false;
	document.body.scrollTop = 0;
	document.documentElement.scrollTop = 0;

	const accessToken = localStorage.getItem('accessToken') || '';

	if (noAuthPath.includes(to.path)) {
		return next();
	} else {
		if (accessToken) {
			if (/*to.path.includes('/accommodation') || */ to.path.includes('/hairdressers')) {
				window.Swal.fire({
					icon: 'error',
					text: '해당페이지는 사용이 불가능합니다.',
					confirmButtonText: '확인',
				});
				return next({
					path: from.path,
					replace: true,
				});
			}
			return next();
		} else {
			return next({ path: '/login', replace: true });
		}
	}
});

export default router;
