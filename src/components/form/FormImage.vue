<template>
	<div class="mailbox text-center justify-content-around">
		<div class="attached-document single clearfix">
			<div class="document-item">
				<div class="document-file cursor-pointer">
					<label :for="props.imageId">
						<img
							:src="file?.preview || noImg"
							alt="preview"
							@error="replaceByDefault"
							v-if="file?.preview"
						/>
						<div class="square" v-else>
							<div class="plus"></div>
						</div>
					</label>
					<input
						ref="fileInput"
						:id="props.imageId"
						type="file"
						hidden
						accept="image/*"
						@change="handleFile($event.target.files)"
					/>
					<button v-if="file && file.preview" type="button" class="remove-btn" @click="removeFile">
						×
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import noImg from '@/assets/img/noimg.gif';
import { ImageTypeWithFile } from '@/types/common/ImageType';

interface UploadFile {
	id: string;
	imageNo: number;
	imageFile: File | null;
	name: string;
	preview: string;
	isExisting?: boolean;
}

const props = defineProps<{ imageId: string }>();
const emit = defineEmits<{ 'comp:remove': ImageTypeWithFile }>();

// 단일 이미지 modelValue
const modelValue = defineModel<ImageTypeWithFile | null>({ required: false });

const file = ref<UploadFile | null>({
	id: '',
	imageNo: null,
	imageFile: null,
	name: '',
	preview: '',
});
const fileInput = ref<HTMLInputElement>();

// 초기 modelValue로부터 file 세팅
watch(
	modelValue,
	(val) => {
		if (!val) {
			file.value = null;
			return;
		}

		file.value = {
			id: val.imageNo ? `model_${val.imageNo}` : null,
			imageFile: val.imageFile || null,
			imageNo: val.imageNo ? val.imageNo : null,
			name: val.imageFile?.name || 'image',
			preview: val.preview || val.thumbnailPath || val.path || null,
			isExisting: !!val.imageNo,
		};
	},
	{ immediate: true },
);

const handleFile = (fileList: FileList | null) => {
	if (!fileList || !fileList.length) return;

	const selected = fileList[0];

	if (!selected.type.startsWith('image/')) {
		alert('이미지 파일만 업로드할 수 있습니다.');
		return;
	}

	const reader = new FileReader();
	reader.onload = (e) => {
		const preview = e.target?.result as string;

		const newFile: UploadFile = {
			id: `${selected.name}_${Date.now()}`,
			imageFile: selected,
			name: selected.name,
			preview,
		};

		file.value = newFile;

		if (modelValue.value && modelValue.value.imageNo) {
			emit('comp:remove', { ...modelValue.value });
		}

		modelValue.value = {
			imageNo: null,
			path: null,
			thumbnailPath: null,
			imageFile: selected,
			preview: newFile.preview,
		};
	};

	reader.readAsDataURL(selected);
};

const removeFile = () => {
	emit('comp:remove', modelValue.value);
	file.value = null;
	modelValue.value = { imageNo: null, path: null, thumbnailPath: null };
};

const replaceByDefault = (e: Event) => {
	(e.target as HTMLImageElement).src = noImg;
};
</script>

<style lang="scss" scoped>
.mailbox {
	display: flex;
	flex-direction: column;
	align-items: center;
}
.attached-document.single {
	display: flex;
	justify-content: center;

	.document-item {
		position: relative;
		text-align: center;

		.document-file {
			position: relative;
			width: 200px;
			height: 200px;
			background: #f8f8f8;
			border-radius: 8px;
			overflow: hidden;
			display: flex;
			align-items: center;
			justify-content: center;

			img {
				width: 200px;
				height: 200px;
				object-fit: cover;
				&:hover {
					opacity: 0.9;
					cursor: pointer;
				}
			}

			.remove-btn {
				position: absolute;
				top: 5px;
				right: 5px;
				width: 24px;
				height: 24px;
				background: rgba(0, 0, 0, 0.6);
				color: white;
				border: none;
				border-radius: 50%;
				font-size: 16px;
				line-height: 24px;
				cursor: pointer;
				display: flex;
				align-items: center;
				justify-content: center;

				&:hover {
					background: rgba(0, 0, 0, 0.8);
				}
			}
		}
	}
}
.square {
	width: 200px;
	height: 200px;
	border: 3px dashed rgb(100, 100, 100); // 굵은 점선 테두리
	display: flex;
	justify-content: center;
	align-items: center;
	position: relative;
	background-color: #fff; // 기본 배경
	transition: background-color 0.2s ease; // 배경 색 변화 부드럽게

	&:hover {
		cursor: pointer;
		background-color: #f0f0f0; // 살짝 어둡게
	}

	.plus {
		position: absolute;
		width: 60px;
		height: 60px;

		&::before,
		&::after {
			content: '';
			position: absolute;
			background-color: black;
		}

		// 세로 막대
		&::before {
			left: 50%;
			top: 0;
			transform: translateX(-50%);
			width: 4px;
			height: 100%;
		}

		// 가로 막대
		&::after {
			top: 50%;
			left: 0;
			transform: translateY(-50%);
			width: 100%;
			height: 4px;
		}
	}
}
</style>
