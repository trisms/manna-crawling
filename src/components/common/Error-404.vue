<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
	<div class="error">
		<div class="error-code">404</div>
		<div class="error-content">
			<div class="error-message mb-4">페이지를 찾을 수 없습니다.</div>
			<div>
				<a class="btn btn-success px-3" @click.prevent="router.go(-1)">이전으로</a>
			</div>
		</div>
	</div>
</template>
