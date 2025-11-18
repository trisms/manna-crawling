<template>
	<div class="d-flex justify-content-between">
		<button class="btn btn-cyan px-3 border ml-2" @click="excelExport"><i class="fa fa-download"></i> Excel</button>
	</div>
</template>

<script setup lang="ts">
import { exportExcel } from '@/utils/ExcelUtils';

const props = defineProps<{
	fileName: string;
	itemKeyStr: string;
}>();

const excelExport = () => {
	exportExcel(props.fileName, props.itemKeyStr);
};
</script>

<style scoped lang="scss"></style>
