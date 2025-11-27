import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { Vue3ProgressPlugin } from '@marcoschulte/vue3-progress';
import { PerfectScrollbarPlugin } from 'vue3-perfect-scrollbar';
import mitt from 'mitt';
import 'perfect-scrollbar/css/perfect-scrollbar.css';
import '@marcoschulte/vue3-progress/dist/index.css';
import '@fortawesome/fontawesome-free/scss/fontawesome.scss';
import '@fortawesome/fontawesome-free/scss/regular.scss';
import '@fortawesome/fontawesome-free/scss/solid.scss';
import '@fortawesome/fontawesome-free/scss/brands.scss';
import '@fortawesome/fontawesome-free/scss/v4-shims.scss';
import 'bootstrap';
import './scss/vue.scss';
import VueAwesomePaginate from 'vue-awesome-paginate';

import App from './App.vue';
import router from './router';

import Swal from 'sweetalert2';
import Panel from '@/components/bootstrap/Panel.vue';
import PanelBody from '@/components/bootstrap/PanelBody.vue';
import PanelHeader from '@/components/bootstrap/PanelHeader.vue';
import PanelTitle from '@/components/bootstrap/PanelTitle.vue';
import PanelFooter from '@/components/bootstrap/PanelFooter.vue';
import PanelToolbar from '@/components/bootstrap/PanelToolbar.vue';

import VCalendar from 'v-calendar';
import 'v-calendar/dist/style.css';
const emitter = mitt();
const app = createApp(App);

window.Swal = Swal;

app.component('Panel', Panel);
app.component('PanelBody', PanelBody);
app.component('PanelHeader', PanelHeader);
app.component('PanelFooter', PanelFooter);
app.component('PanelToolbar', PanelToolbar);
app.component('PanelTitle', PanelTitle);

app.use(createPinia());
app.use(router);
app.use(Vue3ProgressPlugin);
app.use(PerfectScrollbarPlugin);
app.use(VCalendar);
app.use(VueAwesomePaginate); //pagination plugin

app.provide('emitter', emitter);
app.config.globalProperties.$emitter = emitter;

app.mount('#app');
