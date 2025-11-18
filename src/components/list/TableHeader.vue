<template>
	<div class="table-header-wrapper mt-0">
		<div class="d-flex align-items-center">
			<div class="btn-group">
				<CountList :items="store.countList"></CountList>
			</div>
			<div class="d-flex align-items-center ml-auto">
				<div v-if="$slots['sort-option']">
					<slot name="sort-option"></slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useListStore } from '@/stores/common/useListStore';
import CountList from '@/ncomponents/app/CountList.vue';

const store = useListStore();
</script>

<style scoped></style>
