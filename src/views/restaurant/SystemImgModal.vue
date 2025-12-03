<template>
	<div class="modal-backdrop" @click.self="close">
		<div class="modal-window">
			<!-- HEADER -->
			<div class="modal-header">
				<h4><b>시스템 이미지 목록 (목록)</b></h4>
				<button class="btn-close" @click="close"></button>
			</div>

			<!-- FILTER AREA -->
			<div class="filter-box">
				<div class="row gx-2 gy-2 align-items-center">
					<!-- 라디오 -->
					<div class="col-auto d-flex align-items-center">
						<div class="col-md-12">
							<div class="form-check form-check-inline">
								<input class="form-check-input" type="radio" value="NM" id="NM" v-model="store.selectSyCode" name="inlineRadio" />
								<label class="form-check-label" for="NM">일반</label>
							</div>
							<div class="form-check form-check-inline">
								<input class="form-check-input" type="radio" value="FR" id="FR" v-model="store.selectSyCode" name="inlineRadio" />
								<label class="form-check-label" for="FR">프랜차이즈</label>
							</div>
						</div>
					</div>
					<SelectLabel
						size="col-lg-2"
						icon="fas fa-lg fa-fw me-10px fa-box "
						v-model="store.systemFrImgCodeParam.syCode"
						:options="store.frSubTypeCdList"
						v-show="store.selectSyCode === 'FR'"
					/>
					<SelectLabel
						v-show="store.selectSyCode === 'NM'"
						v-model="store.systemImgCodeParam.syCode"
						size="col-lg-2"
						icon="fas fa-lg fa-fw me-10px fa-box "
						:options="store.goodsTypeCdList"
					/>
					<SelectLabel
						v-show="store.selectSyCode === 'NM'"
						v-model="store.systemImgCodeParam.dtCode"
						size="col-lg-2"
						icon="fas fa-lg fa-fw me-10px fa-box"
						:options="store.goodsDetailCdList"
					/>
					<div class="col-1"></div>
					<!-- 입력 검색 -->
					<SelectLabel
						v-model="store.searchParams.searchType"
						size="col-lg-1"
						icon="fas fa-lg fa-fw fa-database"
						:options="[{ label: '상품명', value: '1' }]"
					/>
					<!-- 검색어 -->
					<div class="col-auto flex-grow-1">
						<input
							v-model="store.systemImgSearchParams.findVal"
							type="text"
							class="form-control"
							placeholder="검색어 입력"
							@keyup.enter="search"
						/>
					</div>

					<!-- 검색버튼 -->
					<div class="col-auto">
						<button class="btn btn-primary w-100" @click="search"><i class="fa fa-search"></i> 검색</button>
					</div>
				</div>
			</div>
			<!-- IMAGE LIST -->
			<div id="imgListZone" class="image-grid">
				<div class="image-card" v-for="(img, index) in store.systemImgList" :key="index" @click="select(img)">
					<img :src="img.imgTFile || noImg" alt="" />
					<div class="img-title">{{ img.goodsName }}</div>
				</div>
			</div>

			<!-- PAGINATION -->
			<div class="pagination-wrapper">
				<VueAwesomePaginate
					:total-items="store.systemImgCnt"
					:items-per-page="pageSize"
					:max-pages-shown="5"
					v-model="pageNo"
					class="mb-0"
				/>
			</div>
			<!--			<div class="pagination-box">
				<ul class="pagination mb-0 justify-content-center">
					<li class="page-item" @click="goPage(1)" :disabled="page === 1">
						<a class="page-link" href="javascript:void(0)"><<</a>
					</li>
					<li class="page-item" @click="goPage(page - 1)" :disabled="page === 1">
						<a class="page-link" href="javascript:void(0)"><</a>
					</li>
					<li class="page-item active" v-for="p in pages" :key="p" :class="p === page ? 'btn-primary' : 'btn-light'" @click="goPage(p)">
						<a class="page-link" href="javascript:void(0)"> {{ p }}</a>
					</li>
					<li class="page-item" @click="goPage(page + 1)" :disabled="page === totalPage">
						<a class="page-link" href="javascript:void(0)">></a>
					</li>
					<li class="page-item" @click="goPage(totalPage)" :disabled="page === totalPage">
						<a class="page-link" href="javascript:void(0)">>></a>
					</li>
				</ul>
				&lt;!&ndash;        <button
            class="btn"
            v-for="p in pages"
            :key="p"
            :class="p===page ? 'btn-primary' : 'btn-light'"
            @click="goPage(p)"
        >
          {{ p }}
        </button>&ndash;&gt;
			</div>-->

			<!-- FOOTER -->
			<div class="modal-footer">
				<button class="btn btn-secondary" @click="close">닫기</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import noImg from '@/assets/img/noimg.gif';
import { useRestaurantStore } from '@/stores/restaurant/useRestaurantStore';
import SelectLabel from '@/components/common/SelectLabel.vue';
import { isBlank, isEmpty } from '@/utils/ValidateUtils';
const emit = defineEmits(['close', 'select']);
const store = useRestaurantStore();
const currentPage = ref(1);
const itemsPerPage = 10;
// 외부에서 받아야 할 수도 있는 값들
const props = defineProps({
	api: Function, // API 콜백
});

const systemImgCateList = async (type: string) => {
	await store.callSystemImgCateList(type);
};

const systemImgList = async () => {
	await store.callSystemImgList();
};

const pageNo = computed({
	get() {
		return store.selectSyCode === 'NM' ? store.systemImgSearchParams.pageNo : store.systemFrImgSearchParams.pageNo;
	},
	set(val) {
		if (store.selectSyCode === 'NM') {
			store.systemImgSearchParams.pageNo = val;
		} else {
			store.systemFrImgSearchParams.pageNo = val;
		}
	},
});

const pageSize = computed(() => {
	return store.selectSyCode === 'NM' ? store.systemImgSearchParams.pageSize : store.systemFrImgSearchParams.pageSize;
});

// 데이터 목록
const page = ref(1);
const totalPage = ref(1);

// 페이징 숫자 배열 생성
const pages = computed(() => {
	const arr = [];
	let start = Math.max(1, page.value - 3);
	let end = Math.min(totalPage.value, page.value + 3);
	for (let i = start; i <= end; i++) arr.push(i);
	return arr;
});

// ✅ 페이지 계산
const paginatedData = computed(() => {
	const arr = store.systemImgList || []; // store.items가 proxy면 자체가 배열임
	const start = (currentPage.value - 1) * itemsPerPage;
	return arr.slice(start, start + itemsPerPage);
});

watch(
	() => store.systemImgCodeParam.syCode,
	async (val) => {
		store.systemImgCodeParam.dtCode = '';

		if (isBlank(val)) {
			store.goodsDetailCdList = [{ dtCode: '', dtName: '상품구분' }];
		}
		await store.callSystemImgCateList('G2');
	},
);
watch(
	() => store.selectSyCode,
	() => {
		if (store.selectSyCode === 'NM') {
			store.systemImgSearchParams.pageNo = 1;
		} else {
			store.systemFrImgSearchParams.pageNo = 1;
		}
		store.callSystemImgCateList(store.selectSyCode);
	},
);
watch(
	() => store.systemImgSearchParams.pageNo,
	() => {
		document.getElementById('imgListZone').scrollTo(0, 0);
		systemImgList();
	},
);
watch(
	() => store.systemFrImgSearchParams.pageNo,
	() => {
		document.getElementById('imgListZone').scrollTo({
			top: 0,
			behavior: 'smooth',
		});
		systemImgList();
	},
);

const filteredGoodsCategoryList = computed(() => {
	const parentDtCode = store.systemImgSearchParams.parentDtCode;
	if (!parentDtCode) return store.goodsTypeCdList;

	return store.goodsDetailCdList;
});

function search() {
	pageNo.value = 1;
	systemImgList();
	/*  systemImgCateList();*/
	/*loadList();*/
}

function select(img: any) {
	emit('select', img);
}

function close() {
	emit('close');
}

function goPage(p: number) {
	if (p < 1 || p > totalPage.value) return;
	page.value = p;
}

function dataURLtoFile(dataUrl: string, filename: string): File {
	const arr = dataUrl.split(',');
	const mimeMatch = arr[0].match(/:(.*?);/);
	const mime = mimeMatch ? mimeMatch[1] : 'image/png';
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], filename, { type: mime });
}

// 최초 로드
/*loadList();*/
</script>

<style lang="scss" scoped>
.modal-backdrop {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 1020;
}

.modal-window {
	background: white;
	width: 1200px;
	max-height: 90vh;
	border-radius: 6px;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.modal-header,
.modal-footer {
	padding: 15px;
	border-bottom: 1px solid #ddd;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.filter-box {
	padding: 8px 25px;
	border-bottom: 1px solid #eee;
}

.image-grid {
	padding: 20px;
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
	gap: 15px;
	overflow-y: auto;
	min-height: 633.7px;
}

.image-card {
	border: 1px solid #ddd;
	border-radius: 6px;
	padding: 8px;
	cursor: pointer;
	text-align: center;
	background: white;
	transition: 0.2s;
	max-height: 167px;
}

.image-card:hover {
	border-color: #0d6efd;
	box-shadow: 0 3px 20px rgba(0, 0, 0, 0.1);
}

.image-card img {
	width: 100%;
	height: 120px;
	object-fit: cover;
}

.img-title {
	margin-top: 8px;
	font-size: 14px;
	font-weight: 600;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.pagination-box {
	padding: 15px;
	display: flex;
	justify-content: center;
	gap: 4px;
}

.modal-footer {
	border-top: 1px solid #ddd;
}
.pagination-wrapper::v-deep(.pagination-container) {
	column-gap: 10px;
	list-style: none;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 10px !important;
	.paginate-buttons {
		height: 35px;
		width: 35px;
		padding: 0;
		border-radius: 0.25rem;
		cursor: pointer;
		background-color: rgb(242, 242, 242);
		//background-color: #f34e4e;
		border: 1px solid rgb(217, 217, 217);
		color: black;
	}
	.paginate-buttons:hover {
		background-color: #d8d8d8;
	}
	.active-page {
		background-color: #f34e4e;
		border: 1px solid #f34e4e;
		color: #ffffff;
		//background-color: #3498db;
		//border: 1px solid #3498db;
	}
	.active-page:hover {
		//background-color: #2988c8;
		background-color: #e64848;
		border: 1px solid #e64848;
	}
	.back-button:active,
	.next-button:active {
		background-color: #c4c4c4;
	}
}
</style>
