<template>
	<div class="list-body-wrapper">
		<div class="card border-0">
			<slot name="search-zone"></slot>
			<div class="tab-content p-3">
				<div class="tab-pane fade show active">
					<div class="table-responsive">
						<slot name="header"></slot>
						<slot name="body"></slot>
					</div>
				</div>
			</div>
		</div>
		<div class="pagination-wrapper" style="display: flex; justify-content: space-between">
			<slot name="button"></slot>
			<VueAwesomePaginate
				v-model="store.pageParams.pageNo"
				:total-items="totalCount"
				:items-per-page="store.pageParams.pageSize"
				:max-pages-shown="5"
				class="mb-0"
			/>
		</div>
		<a
			id="initScrollBtn"
			class="btn btn-icon btn-circle btn-theme btn-scroll-to-top show"
			data-toggle="scroll-to-top"
			@click.prevent="initTableScroll"
		>
			<i class="fa fa-angle-left"></i>
		</a>
	</div>
</template>

<script setup lang="ts">
import { useListStore } from '@/stores/common/useListStore';
import { computed, nextTick, onBeforeUnmount, onMounted, watch } from 'vue';

const store = useListStore();

const totalCount = computed(() => (store.totalCount > 0 ? store.totalCount : 1));

const initTableScroll = () => {
	const tBodyEl: HTMLElement = document.getElementById('TBody');
	tBodyEl.scrollTo({
		left: 0,
		behavior: 'smooth',
	});
};

const hideAndShowScrollBtn = () => {
	const tBodyEl: HTMLElement = document.getElementById('TBody');
	const initScrollBtnEl: HTMLElement = document.getElementById('initScrollBtn');

	if (tBodyEl && tBodyEl.scrollLeft > 0) {
		initScrollBtnEl.style.display = 'block';
	} else {
		initScrollBtnEl.style.display = 'none';
	}
};

const noDataRowResponse = () => {
	nextTick(() => {
		const noDatasEl = document.getElementById('noDatas');
		if (noDatasEl) {
			const tHeadEl = document.getElementById('THead');
			const tHeadHeight = tHeadEl.offsetHeight;

			noDatasEl.style.height = `${tHeadHeight}px`;
		}

		const tableWrapperEl = document.getElementById('TableWrapper');
		if (tableWrapperEl) {
			if (store.loading) {
				tableWrapperEl.style.marginTop = '0px';
			} else {
				tableWrapperEl.style.marginTop = '12px';
			}
		}
	});
};

watch(
	() => store.loading,
	() => {
		noDataRowResponse();
	},
);

onMounted(() => {
	noDataRowResponse();
	const tBodyEl: HTMLElement = document.getElementById('TBody');
	tBodyEl.addEventListener('scroll', hideAndShowScrollBtn);
	window.addEventListener('resize', () => {
		hideAndShowScrollBtn();
		noDataRowResponse();
	});
});

onBeforeUnmount(() => {
	const tBodyEl: HTMLElement = document.getElementById('TBody');
	tBodyEl.removeEventListener('scroll', hideAndShowScrollBtn);
	window.removeEventListener('resize', () => {
		hideAndShowScrollBtn();
		noDataRowResponse();
	});
});
</script>

<style lang="scss"></style>
