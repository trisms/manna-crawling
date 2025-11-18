<script setup>
import { useAppOptionStore } from '@/stores/app-option';
import {useAuthStore} from "@/stores/auth/useAuthStore";
import {useRouter} from "vue-router";
import { isBlank } from '@/utils/ValidateUtils';
const store = useAuthStore();
const appOption = useAppOptionStore();
const router = useRouter();
/*onMounted() {
  appOption.appSidebarHide = true;
  appOption.appHeaderHide = true;
  appOption.appTopMenu = false;
  appOption.appContentClass = 'p-0';
},
beforeRouteLeave (to, from, next) {
  appOption.appSidebarHide = false;
  appOption.appHeaderHide = false;
  appOption.appTopMenu = true;
  appOption.appSidebarHide = true;
  appOption.appContentClass = '';
  next();
},*/

const checkForm = async () => {
  if (isBlank(store.form.id)) {
    window.$emitter.emit('warning', 'ID를 입력하세요.');
    return;
  } else if (isBlank(store.form.password)) {
    window.$emitter.emit('warning', 'Password를 입력하세요.');
    return;
  }

  await store.callLoginAPI(() => {
    router.replace('/restaurant');
  });
};
</script>
<template>
	<!-- BEGIN login -->
	<div class="login login-v1">
		<!-- BEGIN login-container -->
		<div class="login-container">
			<!-- BEGIN login-header -->
			<div class="login-header">
				<div class="brand">
					<div class="d-flex align-items-center">
            <span class="logo"></span> Data Upload<b class="ms-2">  Admin</b>
					</div>
				</div>
				<div class="icon">
					<i class="fa fa-lock"></i>
				</div>
			</div>
			<!-- END login-header -->

			<!-- BEGIN login-body -->
			<div class="login-body">
				<!-- BEGIN login-content -->
				<div class="login-content fs-13px">
					<form v-on:submit="checkForm" method="GET">
						<div class="form-floating mb-20px">
							<input type="email"
                     class="form-control fs-13px h-45px"
                     v-model="store.form.id"
                     id="emailAddress"
                     placeholder="Email Address" />
							<label for="emailAddress" class="d-flex align-items-center py-0">ID</label>
						</div>
						<div class="form-floating mb-20px">
							<input type="password"
                     class="form-control fs-13px h-45px"
                     v-model="store.form.password"
                     id="password"
                     @keyup.enter="checkForm"
                     placeholder="Password" />
							<label for="password" class="d-flex align-items-center py-0">Password</label>
						</div>
						<div class="form-check mb-20px">
							<input class="form-check-input" type="checkbox" id="rememberMe"/>
							<label class="form-check-label" for="rememberMe">
								ID 저장
							</label>
						</div>
						<div class="login-buttons">
							<button type="submit" class="btn h-45px btn-success d-block w-100 btn-lg"
                      @click.prevent="checkForm"
              >Login</button>
						</div>
					</form>
				</div>
				<!-- END login-content -->
			</div>
			<!-- END login-body -->
		</div>
		<!-- END login-container -->
	</div>
	<!-- END login -->
</template>
