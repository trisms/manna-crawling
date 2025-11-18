<template>
	<div
		class="mailbox text-center justify-content-between"
		@dragover.prevent="onDragOver"
		@dragleave.prevent="onDragLeave"
		@drop.prevent="onDrop"
		:class="{ 'drag-over': isDragOver }"
		v-if="props.sortable"
	>
		<!-- 드래그 가능한 이미지 목록 -->
		<Draggable
			v-model="files"
			:item-key="'id'"
			tag="ul"
			class="attached-document clearfix"
			ghost-class="drag-ghost"
			handle=".document-file"
			:animation="200"
			@update="updateValue"
		>
			<template #item="{ element: file, index }">
				<li class="document-item">
					<div class="document-file cursor-pointer">
						<div class="order-num">{{ index + 1 }}</div>
						<img
							:src="file.preview"
							alt=""
							class="image-preview"
							@error="replaceByDefault($event)"
						/>
						<button type="button" class="remove-btn" @click="removeFile(index)">×</button>
					</div>
					<!--						<div class="document-name">
							<span class="text-truncate">{{ file.name }}</span>
						</div>-->
				</li>
			</template>
		</Draggable>
		<!-- 파일 업로드 영역 -->
		<div class="upload-area cursor-pointer" @click="triggerFileInput">
			<div class="btn btn-outline-cyan img-add-btn">+ <slot>이미지 등록</slot></div>
			<input
				ref="fileInput"
				type="file"
				multiple
				hidden
				accept="image/*"
				@change="handleFiles($event.target.files)"
			/>
			<p class="hint">또는 이미지를 끌어다 놓으세요</p>
		</div>
	</div>

	<div
		class="mailbox text-center justify-content-between"
		@dragover.prevent="onDragOver"
		@dragleave.prevent="onDragLeave"
		@drop.prevent="onDrop"
		:class="{ 'drag-over': isDragOver }"
		v-else
	>
		<!-- ✅ 정렬 OFF (일반 ul) -->
		<ul class="attached-document clearfix">
			<li v-for="(file, index) in files" :key="file.id" class="document-item">
				<div class="document-file cursor-pointer">
					<div class="order-num">{{ index + 1 }}</div>
					<img :src="file.preview" alt="" class="image-preview" @error="replaceByDefault($event)" />
					<button type="button" class="remove-btn" @click="removeFile(index)">×</button>
				</div>
				<!--					<div class="document-name">
					<span class="text-truncate">{{ file.name }}</span>
				</div>-->
			</li>
		</ul>
		<!-- 파일 업로드 영역 -->
		<div class="upload-area cursor-pointer" @click="triggerFileInput">
			<div class="btn btn-outline-cyan img-add-btn">+ <slot>이미지 등록</slot></div>
			<input
				ref="fileInput"
				type="file"
				multiple
				hidden
				accept="image/*"
				@change="handleFiles($event.target.files)"
			/>
			<p class="hint">또는 이미지를 끌어다 놓으세요</p>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import Draggable from 'vuedraggable';
import noImg from '@/assets/img/noimg.gif';
import { ImageType, ImageTypeWithFile } from '@/types/common/ImageType';

interface UploadFile {
	id: string;
	imageFile: File | null;
	name: string;
	preview: string;
	isExisting?: boolean; // 서버에서 가져온 이미지 표시
}

const props = withDefaults(
	defineProps<{
		setValueFn?: (val: any) => void;
		sortable?: boolean;
		validateName?: string;
	}>(),
	{ sortable: true },
);
const emit = defineEmits<{ 'complete:remove': [image: any] }>();

const modelValue = defineModel<Array<ImageTypeWithFile>>({
	required: false,
});

const files = ref<UploadFile[]>([]);
const fileInput = ref<HTMLInputElement>();
const isDragOver = ref(false);

// ---------------------------
// modelValue 초기화
// ---------------------------
const initializeFilesFromModel = () => {
  console.log(modelValue.value)
	if (!modelValue.value) return;
	files.value = modelValue.value.map((item: ImageTypeWithFile, index) => ({
		id: `model_${index}`,
		imageNo: item.imageNo ? item.imageNo : null,
		imageFile: item.imageFile ? item.imageFile : null,
		name: `image_${item.imageNo}`,
		path: item.imageNo ? item.path : null,
		thumbnailPath: item.imageNo ? item.thumbnailPath : null,
		preview: item.imageNo ? (item.thumbnailPath ? item.thumbnailPath : item.path) : item.preview,
		isExisting: true,
	}));
};

onMounted(() => initializeFilesFromModel());

watch(modelValue, () => initializeFilesFromModel());

// ---------------------------
// 파일 입력 처리
// ---------------------------
const triggerFileInput = () => {
	fileInput.value?.click();
};

const handleFiles = (fileList: FileList | null) => {
	if (!fileList) return;
	for (let i = 0; i < fileList.length; i++) {
		const file = fileList[i];

		if (!file.type.startsWith('image/')) {
			alert('이미지 파일만 업로드할 수 있습니다.');
			continue;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			files.value.push({
				id: `${file.name}_${Date.now()}_${i}`,
				imageFile: file,
				name: file.name,
				preview: e.target?.result as string,
			});

			updateValue();
		};
		reader.readAsDataURL(file);
	}
};

// ---------------------------
// 삭제 처리
// ---------------------------
const removeFile = (index: number) => {
	const removeFile = modelValue.value[index];
	emit('complete:remove', removeFile);
	files.value.splice(index, 1);
	updateValue();
};

// ---------------------------
// Drag & Drop
// ---------------------------
const onDragOver = () => (isDragOver.value = true);
const onDragLeave = () => (isDragOver.value = false);
const onDrop = (e: DragEvent) => {
	isDragOver.value = false;
	if (!e.dataTransfer) return;
	handleFiles(e.dataTransfer.files);
};

// ---------------------------
// 이미지 로딩 실패 시 기본 이미지
// ---------------------------
const replaceByDefault = (e: Event) => {
	(e.target as HTMLImageElement).src = noImg;
};

// ---------------------------
// modelValue 업데이트
// ---------------------------
const updateValue = () => {
	// 서버 업로드용: file 있는 것만 FormData 등으로 전송 가능
	// modelValue 동기화용: path 정보를 담아 서버와 맞춤
	const value: Array<ImageTypeWithFile> = files.value.map((f, index) => ({
		imageNo: f.imageNo ? f.imageNo : null,
		path: f.path ? f.path : null,
		thumbnailPath: f.thumbnailPath ? f.thumbnailPath : null,
		imageFile: f.imageFile ? f.imageFile : null,
		preview: f.preview,
	}));

	modelValue.value = value;

	props.setValueFn?.(props.validateName, value);
};
</script>

<style lang="scss" scoped>
.mailbox {
	display: flex;
	flex-direction: column;
	align-items: center;
	&.drag-over {
		border: 2px dashed #00acac;
		background-color: #f0fdfa;
	}

	.attached-document {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		padding: 0;
		list-style: none;
		margin: 30px 0 0;

		& > li {
			margin: 0;
		}

		.document-item {
			flex: 0 0 20%; // 항상 한 줄 최대 3개 기준
			width: 20%; // 이미지 개수와 상관없이 동일
			box-sizing: border-box;
			position: relative;
			text-align: center;

			.document-file {
				position: relative;
				width: 100%;
				padding-top: 100%; // 정사각형 유지
				background: #f8f8f8;
				border: 2px dashed #000;
				border-radius: 5px;
				overflow: hidden;
				display: flex;
				align-items: center;
				justify-content: center;
				transition: background-color 0.2s ease;

				&:hover {
					cursor: pointer;
					background-color: #e0e0e0;
				}

				img.image-preview {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					height: 100%;
					object-fit: cover;
				}

				.remove-btn {
					position: absolute;
					top: 2px;
					right: 2px;
					background: rgba(0, 0, 0, 0.5);
					color: white;
					border: none;
					border-radius: 50%;
					width: 20px;
					height: 20px;
					font-size: 14px;
					line-height: 20px;
					cursor: pointer;
					display: flex;
					align-items: center;
					justify-content: center;

					&:hover {
						background: rgba(0, 0, 0, 0.8);
					}
				}

				.order-num {
					position: absolute;
					top: 2px;
					left: 2px;
					background: rgba(0, 0, 0, 0.5);
					color: white;
					border-radius: 50%;
					width: 20px;
					height: 20px;
					font-size: 10px;
					line-height: 20px;
					display: flex;
					align-items: center;
					justify-content: center;
					z-index: 1000;
				}
			}

			.document-name {
				.text-truncate {
					display: block;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			}
		}
	}

	/*.upload-area {
		margin-top: 1rem;
		padding: 1rem;
		width: 100%;
		border: 2px dashed #aaa;
		border-radius: 5px;
		text-align: center;
		cursor: pointer;
		color: #555;
		font-weight: bold;
		transition: background-color 0.2s ease;

		&:hover {
			background-color: #f0f0f0;
		}
	}*/

	.upload-area {
		margin-top: 10px;
		.hint {
			margin-bottom: 5px;
		}
		.img-add-btn {
			padding: 2px 10px;
		}
	}

	.upload-area.drag-over {
		border: 2px dashed #00acac;
		background-color: #f0fdfa;
	}

	&.is-valid {
		border: 1px solid #00acac;
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23009688' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 0.5rem top 0.5rem;
		background-size: calc(0.75em + 0.4375rem) calc(0.75em + 0.4375rem);
	}

	&.is-invalid {
		border: 1px solid #ff5b57;
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23ff5b57'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23ff5b57' stroke='none'/%3e%3c/svg%3e");
		background-repeat: no-repeat;
		background-position: right 0.5rem top 0.5rem;
		background-size: calc(0.75em + 0.4375rem) calc(0.75em + 0.4375rem);
	}
}
.drag-ghost {
	opacity: 0.5;
}
</style>
