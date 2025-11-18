<template>
	<!--	<tr v-if="isTable" class="linear-progress">
		<td :colspan="colspan" class="p-0">
			<div
				class="v-progress-linear v-progress-linear&#45;&#45;active v-theme&#45;&#45;light"
				role="progressbar"
				aria-hidden="false"
				aria-valuemin="0"
				aria-valuemax="100"
				style="bottom: 0; height: 4px; &#45;&#45;v-progress-linear-height: 4px; left: 50%; transform: translateX(-50%)"
			>
				&lt;!&ndash;&ndash;&gt;
				<div class="v-progress-linear__background bg-yellow-darken-2" style="width: 100%"></div>
				<div class="v-progress-linear__indeterminate">
					<div class="v-progress-linear__indeterminate long bg-yellow-darken-2"></div>
					<div class="v-progress-linear__indeterminate short bg-yellow-darken-2"></div>
				</div>
				&lt;!&ndash;&ndash;&gt;
			</div>
		</td>
	</tr>
	<div
		v-else
		class="v-progress-linear v-progress-linear&#45;&#45;active v-theme&#45;&#45;light"
		role="progressbar"
		aria-hidden="false"
		aria-valuemin="0"
		aria-valuemax="100"
		style="bottom: 0; height: 4px; &#45;&#45;v-progress-linear-height: 4px; left: 50%; transform: translateX(-50%)"
	>
		<div class="v-progress-linear__background bg-yellow-darken-2" style="width: 100%"></div>
		<div class="v-progress-linear__indeterminate">
			<div class="v-progress-linear__indeterminate long bg-yellow-darken-2"></div>
			<div class="v-progress-linear__indeterminate short bg-yellow-darken-2"></div>
		</div>
	</div>-->
	<div
		class="linear-progress v-progress-linear v-progress-linear--active v-theme--light"
		role="progressbar"
		aria-hidden="false"
		aria-valuemin="0"
		aria-valuemax="100"
		style="bottom: 0; height: 4px; --v-progress-linear-height: 4px; left: 50%"
	>
		<div class="v-progress-linear__background bg-yellow-darken-2" style="width: 100%"></div>
		<div class="v-progress-linear__indeterminate">
			<div class="v-progress-linear__indeterminate long bg-yellow-darken-2"></div>
			<div class="v-progress-linear__indeterminate short bg-yellow-darken-2"></div>
		</div>
	</div>
</template>

<script lang="ts" setup>
/*withDefaults(
	defineProps<{
		colspan: number;
		isTable?: boolean;
	}>(),
	{
		isTable: true,
	},
);*/
</script>
