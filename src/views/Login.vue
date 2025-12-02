<script setup>
import { onMounted, ref } from 'vue';
import { useAppOptionStore } from '@/stores/app-option';
import {useAuthStore} from "@/stores/auth/useAuthStore";
import {useRouter} from "vue-router";
import { isBlank } from '@/utils/ValidateUtils';

const store = useAuthStore();
const appOption = useAppOptionStore();
const router = useRouter();

// 🔥 체크박스 v-model용
const rememberMe = ref(false);

// 🔥 페이지 진입 시 localStorage에서 ID 불러오기
onMounted(() => {
  const savedId = localStorage.getItem("savedId");
  if (savedId) {
    store.form.id = savedId;
    rememberMe.value = true;  // 체크박스 자동 체크
  }
});

// 🔥 폼 검사 & 로그인 실행
const checkForm = async () => {
  if (isBlank(store.form.id)) {
    window.$emitter.emit('warning', 'ID를 입력하세요.');
    return;
  } else if (isBlank(store.form.password)) {
    window.$emitter.emit('warning', 'Password를 입력하세요.');
    return;
  }

  // ✔ ID 저장 체크 시 localStorage 저장
  if (rememberMe.value) {
    localStorage.setItem("savedId", store.form.id);
  } else {
    localStorage.removeItem("savedId");
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
              <input class="form-check-input" type="checkbox" id="rememberMe" v-model="rememberMe" />
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
