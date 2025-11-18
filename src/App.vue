<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
import {inject, onMounted, watch} from 'vue';
import { useFavicon, useTitle } from '@vueuse/core';
import { RouterView, useRoute } from 'vue-router';
import hdcFavicon from '@/assets/logo.svg';

const emitter = inject<any>('emitter');
const route = useRoute();

const alert = (type: string, message: string) => {
  window.Swal.fire({
    icon: type,
    text: message,
    confirmButtonText: '확인',
    focusConfirm: true,
  });
};
const confirm = (message: string, callback: Function) => {
  window.Swal.fire({
    icon: 'question',
    html: message,
    showCancelButton: true,
    confirmButtonText: '확인',
    cancelButtonText: '취소',
    focusConfirm: true,
  }).then(({ isConfirmed }) => {
    if (isConfirmed) {
      if (callback) {
        callback();
      }
    }
  });
};

const title = useTitle();

watch(
    () => route.path,
    () => {
      title.value = route.meta.title ? `DUA | ${route.meta.title}` : '';
    },
);

useFavicon(hdcFavicon);

onMounted(() => {
  emitter.on('success', (message) => alert('success', message));
  emitter.on('warning', (message) => alert('warning', message));
  emitter.on('error', (message) => alert('error', message));
  emitter.on('confirm', ({ message, callback }) => confirm(message, callback));

  window.$emitter = emitter;
});
</script>
