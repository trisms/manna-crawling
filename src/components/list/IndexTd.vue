<template>
	<td>{{ store.getIdx($props.idx) }}</td>
</template>

<script setup lang="ts">
import { useListStore } from '@/stores/common/useListStore';

defineProps<{
	idx: number;
}>();

const store = useListStore();
</script>

<style scoped lang="scss"></style>
