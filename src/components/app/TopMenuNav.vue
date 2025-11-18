<script setup lang="ts">
import {useRouter, RouterLink, useRoute} from 'vue-router';
import SidebarNav from '@/components/app/SidebarNav.vue';

const route = useRoute();

defineProps<{
  menu: {
    icon: string;
    text: string;
    url: string;
    highlight: boolean;
    children: Array<Object>;
    img: string;
    title: string;
    label: string;
  };
}>();

function subIsActive(urls) {
  const currentRoute = useRouter().currentRoute.value.path;
  let match = false;

  for (let x = 0; x < urls.length; x++) {
    if (urls[x].url == currentRoute) {
      match = true;
    }
  }

  return match;
}

function includeUrl() {

}
</script>
<template>
  <!-- menu with submenu -->
  <div v-if="menu.children" class="menu-item has-sub cursor-pointer" :class="{ active: subIsActive(menu.children) }">
    <a class="menu-link">
			<span v-if="menu.icon" class="menu-icon">
				<i :class="menu.icon"></i>
				<span v-if="menu.highlight" class="w-5px h-5px rounded-3 bg-theme position-absolute top-0 end-0 mt-3px me-3px"></span>
			</span>
      <span v-if="menu.img" class="menu-icon-img">
				<img :src="menu.img" alt="" />
			</span>
      <span class="menu-text">
				{{ menu.title }}
				<span v-if="menu.label" class="menu-label">{{ menu.label }}</span>
			</span>
      <span v-if="menu.children" class="menu-caret"></span>
    </a>
    <div class="menu-submenu">
      <template v-for="submenu in menu.children" :key="submenu.title">
        <sidebar-nav :menu="submenu"></sidebar-nav>
      </template>
    </div>
  </div>

  <!-- menu without submenu -->
  <router-link v-else v-slot="{ navigate, href, isActive }" :to="menu.url" custom>
    <div class="menu-item" :class="{
      active: route.path.startsWith(menu.url),
    }">
      <a :href="href" class="menu-link" @click="navigate">
				<span v-if="menu.icon" class="menu-icon">
					<i :class="menu.icon"></i>
				</span>
        <span v-if="menu.img" class="menu-icon-img">
					<img :src="menu.img" alt="" />
				</span>
        <span class="menu-text">
          {{menu.title}}
					<span v-if="menu.label" class="menu-label">{{ menu.label }}</span>
				</span>
      </a>
    </div>
    <hr class="p-0 m-0">
  </router-link>
</template>
