<script setup lang="ts">
import { getCurrentInstance, onMounted } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import { useAppOptionStore } from '@/stores/app-option';
import { ProgressFinisher, useProgress } from '@marcoschulte/vue3-progress';
import AppSidebar from '@/components/app/Sidebar.vue';
import AppSidebarRight from '@/components/app/SidebarRight.vue';
import AppHeader from '@/components/app/Header.vue';
import AppTopMenu from '@/components/app/TopMenu.vue';
import AppFooter from '@/components/app/Footer.vue';
import AppThemePanel from '@/components/app/ThemePanel.vue';
import AccountModal from '@/views/system/SystemModal.vue';
import { slideUp } from '@/composables/slideUp.js';
import router from '@/router';

const appOption = useAppOptionStore();
const toggleMobileMenu = () => {
  if (window.innerWidth < 768) {
    const elm = document.querySelector('.app-top-menu');
    if (!(window.getComputedStyle(elm).display === 'none')) {
      slideUp(elm, 300);
    }
  }
};
import { ref } from 'vue';
import SystemModal from "@/views/system/SystemModal.vue";


const modalVisible = ref(false);
const modalType = ref<'account' | 'edit' | null>(null);

function handleOpenModal(type) {
  modalType.value = type;
  modalVisible.value = true;
}
</script>

<template>
  <div class="app" v-bind:class="{
		'app-header-menu-search-toggled': appOption.appHeaderSearchToggled,
		'app-header-fixed': appOption.appHeaderFixed,
		'app-sidebar-fixed': appOption.appSidebarFixed,
		'app-sidebar-grid': appOption.appSidebarGrid,
		'app-sidebar-toggled': appOption.appSidebarToggled,
		'app-sidebar-collapsed': appOption.appSidebarCollapsed,
		'app-sidebar-mobile-toggled': appOption.appSidebarMobileToggled,
		'app-sidebar-mobile-closed': appOption.appSidebarMobileClosed,
		'app-sidebar-end-toggled': appOption.appSidebarEndToggled,
		'app-sidebar-end-mobile-toggled': appOption.appSidebarEndMobileToggled,
		'app-content-full-height': appOption.appContentFullHeight,
		'app-content-full-width': appOption.appSidebarHide,
		'app-without-sidebar': appOption.appSidebarHide,
		'app-with-end-sidebar': appOption.appSidebarEnd,
		'app-with-wide-sidebar': appOption.appSidebarWide,
		'app-with-light-sidebar': appOption.appSidebarLight,
		'app-with-hover-sidebar': appOption.appSidebarHover,
		'app-with-top-menu': appOption.appTopMenu,
		'app-with-two-sidebar': appOption.appSidebarTwo,
		'pt-0': appOption.appHeaderHide,
		'app-boxed-layout': appOption.appBoxedLayout,
		'app-footer-fixed': appOption.appFooterFixed,
		'app-sidebar-minified': appOption.appSidebarMinified,
		'app-gradient-enabled': appOption.appGradientEnabled
	}">
    <vue3-progress-bar />
    <app-header v-if="!appOption.appHeaderHide" />
    <app-sidebar v-if="!appOption.appSidebarHide" @open-modal="handleOpenModal" />
    <app-sidebar-right v-if="appOption.appSidebarTwo"  />
    <app-top-menu v-if="appOption.appTopMenu" />
    <div
        id="app-content"
        class="app-content"
        :class="appOption.appContentClass"
        @click="toggleMobileMenu"
    >
<!--      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>-->
      <router-view></router-view>
    </div>
    <app-footer v-if="appOption.appFooter" />
    <SystemModal
        :visible="modalVisible"
        :type="modalType"
        @close="modalVisible = false"
    ></SystemModal>
<!--    <app-theme-panel />-->
  </div>
</template>
