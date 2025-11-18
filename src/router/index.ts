import { createRouter, createWebHistory } from "vue-router";
import {useRestaurantStore} from "@/stores/restaurant/useRestaurantStore";
import {useAppOptionStore} from "@/stores/app-option";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:pathMatch(.*)*',
      name: 'Error',
      component: () => import('@/components/common/Error-404.vue'),
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
            const store = useRestaurantStore()
            await store.callListAPI(()=>{});
            await store.callRegionList();
           /* const districtStore = useDistrictStore();
            await districtStore.callListAPI();
            const store = useFacilityStore();

            if (districtStore.districts.length > 0) {
              store.searchParams.districtNo = districtStore.districts[0].districtNo;
              await store.callListAPI();
            }*/

            next();
          },
          meta: {
            title: '설비관리',
            nav: ['설비관리', '목록'],
            depth: 2,
          },
        },
        {
          name:'RestaurantMenu',
          path: '/restaurant/menu/:id',
          component: () => import('@/views/restaurant/menuList.vue'),
          beforeEnter: async (to, from, next) => {
            const store = useRestaurantStore();
            await store.callDetailAPI(to.params.id);
            if(store.grpList) {
             await store.callGrpListAPI(store.form.grStNo, store.grpList[0].grStGrpNo, ()=> {})
            }


           /* if (districtStore.districts.length > 0) {
              store.searchParams.districtNo = districtStore.districts[0].districtNo;
              await store.callListAPI();
            }*/
            next();
          },
          meta: {
            title: '설비관리',
            nav: ['설비관리', '설비위치관리', '목록'],
            depth: 1,
          },
        },
/*        { path: '/restaurant/list', component: () => import('@/views/restaurant/list.vue') },
        { path: '/restaurant/menu', component: () => import('@/views/restaurant/menuList.vue') },*/
      ]
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
      if (to.path.includes('/accommodation') || to.path.includes('/hairdressers')) {

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
