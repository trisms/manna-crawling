<template>
	<panel>
		<panel-body>
			<div class="card border-0">
				<div class="note mb-0 border">
					<div class="note-content">
						<h4 class="d-flex justify-content-between">
							<p><i class="fa fa-info-circle fa-fw"></i> <b>가맹점 정보</b> - ( {{ store.form.stName }} )</p>
							<button type="button" class="btn btn-sm btn-white border" @click="router.push('/restaurant/')">
								<i class="fa fa-arrow-alt-circle-right"></i> 목록으로
							</button>
						</h4>
						<div class="card-group">
							<!-- BEGIN card -->
							<!-- END card -->
							<!-- BEGIN card -->
							<div class="card border-0">
								<div class="card-body bg-none">
									<table class="table table-condensed p-0 bg-none mb-0 p-1">
										<tbody>
											<!-- 📌 기본정보 -->
											<tr>
												<td nowrap="" class="">
													<div class="d-flex align-items-center">
														<div class="bg-indigo-200 w-15px h-15px rounded me-2"></div>
														<div><b>가맹점코드</b> : {{ store.form.stCode }}</div>
													</div>
												</td>
												<td nowrap="" class="">
													<div class="d-flex align-items-center">
														<div class="bg-indigo-100 w-15px h-15px rounded me-2"></div>
														<div><b>주문앱</b> : {{ getAppName(store.form.appType) }}</div>
													</div>
												</td>
											</tr>
											<tr>
												<td nowrap="" class="">
													<div class="d-flex align-items-center">
														<div class="bg-indigo-100 w-15px h-15px rounded me-2"></div>
														<div><b>수집일</b> : {{ store.form.putDate }}</div>
													</div>
												</td>
												<td nowrap="" class="">
													<div class="d-flex align-items-center">
														<div class="bg-indigo-200 w-15px h-15px rounded me-2"></div>
														<div><b>DB등록일</b> : {{ store.form.modDate }}</div>
													</div>
												</td>
											</tr>

											<!-- 📌 사업자 정보 -->
											<tr>
												<td nowrap="" class="">
													<div class="d-flex align-items-center">
														<div class="bg-indigo-200 w-15px h-15px rounded me-2"></div>
														<div><b>대표자</b> : {{ store.form.stOwner }}</div>
													</div>
												</td>
												<td nowrap="" class="">
													<div class="d-flex align-items-center">
														<div class="bg-indigo-100 w-15px h-15px rounded me-2"></div>
														<div><b>전화번호</b> : {{ store.form.stTel }}</div>
													</div>
												</td>
											</tr>

											<!-- 📌 연락처 / 주소 -->
											<tr>
												<td nowrap="" class="" colspan="2">
													<div class="d-flex align-items-center">
														<div class="bg-indigo-100 w-15px h-15px rounded me-2"></div>
														<div><b>가맹점주소</b> : {{ store.form.stAddr }}</div>
													</div>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
							<div class="card bg-none border-0">
								<div class="card-body info-left bg-none d-flex justify-content-between">
									<div class="info-block">
										<div class="block-title">
											매장소개
											<button class="toggle-btn" @click="isAppMemoExpanded = !isAppMemoExpanded">
												{{ isAppMemoExpanded ? '▲' : '▼' }}
											</button>
										</div>
										<pre class="block-content" :class="{ expanded: isAppMemoExpanded }">{{ store.form.stAppMemo }}</pre>
									</div>
									<div class="info-block">
										<div class="block-title">
											운영시간
											<button class="toggle-btn" @click="isWorkTimeExpanded = !isWorkTimeExpanded">
												{{ isWorkTimeExpanded ? '▲' : '▼' }}
											</button>
										</div>
										<pre class="block-content-time" :class="{ expanded: isWorkTimeExpanded }">{{ store.form.originWorkTime }}</pre>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="d-flex between nav nav-tabs nav-tabs-v2 pt-3 justify-content-between">
					<div class="grp-tabs-wrapper">
						<div class="nav-item me-2" role="presentation">
							<div class="nav-link btn btn-sm btn-white px-2" disabled>상품그룹 :</div>
						</div>
						<button class="grp-btn prev" @click="scrollGrp(-1)">‹</button>
						<div class="grp-tabs-container" ref="grpTabsContainer">
							<div class="nav nav-tabs nav-tabs-v2 border-bottom-0" role="tablist">
								<div class="nav-item me-2" role="presentation " v-for="(item, index) in store.grpList" :key="item.grStGrpNo">
									<div
										class="nav-link btn btn-sm btn-white px-2"
										:class="{ active: index == 0 }"
										data-bs-toggle="tab"
										aria-selected="false"
										role="tab"
										@click="selectGrpList(item.grStGrpNo)"
									>
										{{ item.grpName }}
									</div>
								</div>
							</div>
						</div>
						<button class="grp-btn next" @click="scrollGrp(1)">›</button>
					</div>
					<!--          <div class="nav nav-tabs nav-tabs-v2 border-bottom-0 " role="tablist">
            <div class="nav-item me-2" role="presentation "><div class="nav-link btn btn-sm btn-white   px-2"  aria-selected="false" role="tab" disabled="">상품그룹 :</div></div>
            <div class="nav-item me-2" role="presentation " v-for="(item, index) in store.grpList" :key="item.grStGrpNo">
              <div class="nav-link btn btn-sm btn-white   px-2"  :class="{ active: index == 0 }"  data-bs-toggle="tab" aria-selected="false" role="tab" @click="selectGrpList(item.grStGrpNo)">{{ item.grpName }}</div>
            </div>
          </div>-->
					<div class="nav nav-tabs nav-tabs-v2 border-bottom-0" role="tablist">
						<div class="nav-item me-2" role="presentation">
							<div class="nav-link btn btn-sm btn-white px-2" disabled>{{ checkedItems.length }} 개 이미지 선택</div>
						</div>
						<button type="button" class="btn btn-sm btn-gray" @click="deleteImage">
							<i class="far fa-lg fa-fw me-10px fa-circle-xmark ms-n1"></i> 선택 이미지 삭제
						</button>
					</div>
				</div>
				<div class="tab-content pt-4">
					<div class="tab-pane fade show active" id="allTab" role="tabpanel">
						<!-- BEGIN table -->
						<div class="table-responsive">
							<table class="table table-hover text-nowrap">
								<thead>
									<tr>
										<th class="pt-0 pb-2">
											<div class="form-check">
												<input type="checkbox" class="form-check-input" id="allCheck" v-model="allChecked" @change="toggleAll" />
												<label class="form-check-label" for="allCheck"></label>
											</div>
										</th>
										<th class="pt-0 pb-2">이미지</th>
										<th class="pt-0 pb-2">상품그룹</th>
										<th class="pt-0 pb-2">배달가격</th>
										<th class="pt-0 pb-2">포장가격</th>
										<th class="pt-0 pb-2">성인인증</th>
										<th class="pt-0 pb-2">상품설명</th>
										<th class="pt-0 pb-2">추가상품</th>
										<th class="pt-0 pb-2">시스템이미지</th>
										<th class="pt-0 pb-2">이미지 업로드</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(item, index) in paginatedData" :key="item.grStGoodsNo">
										<td class="w-10px align-middle" @click.stop="toggleItem(item.grStGoodsNo)">
											<div class="form-check">
												<input
													type="checkbox"
													class="form-check-input"
													:id="'product' + item.grStGoodsNo"
													:value="item.grStGoodsNo"
													:checked="checkedItems.includes(item.grStGoodsNo)"
												/>
												{{ index + 1 }}
												<label class="form-check-label" :for="'product' + item.grStGoodsNo"></label>
											</div>
										</td>
										<td>
											<div class="d-flex align-items-center">
												<div
													class="w-50px h-50px bg-light d-flex align-items-center justify-content-center"
													@click="openImageModal(item.image ? item.image.mainPath : '')"
													style="cursor: pointer"
												>
													<img alt="" class="mw-100 mh-100" style="" :src="item.image ? item.image.mainThumbPath : ''" />
												</div>
												<div class="ms-3">
													{{ item.goodsName }}
													<!--                        <a href="extra_product_details.html" class="text-dark text-decoration-none">{{ item.goodsName }}</a>-->
												</div>
											</div>
										</td>
										<td class="align-middle">{{ item.grpName }}</td>
										<td class="align-middle">{{ formatPrice(item.sellPrice) }} 원</td>
										<td class="align-middle">{{ formatPrice(item.ordPrice) }} 원</td>
										<td class="align-middle">{{ adultYn(item.adultYn) }}</td>
										<td class="align-middle text-ellipsis">{{ item.goodsMemo }}</td>
										<td class="align-middle">{{ item.goodsMappCnt }} 개</td>
										<td class="align-middle">
											<button type="button" class="btn btn-sm btn-white" @click="selectSystemImg(item.grStGoodsNo)">
												<i class="fa fa-fw fa-check ms-n1"></i> 이미지 선택
											</button>
										</td>
										<td class="align-middle">
											<input type="file" ref="fileInputs" class="d-none" accept="image/*" @change="handleFileChange($event, item)" />
											<button type="button" class="btn btn-sm btn-white" @click="triggerFileInput($event)">
												<i class="fa fa-fw fa-upload ms-n1"></i> 업로드
											</button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<!-- END table -->
						<Pagenation v-model="currentPage" :total="store.grpItems?.length ?? 0" :perPage="itemsPerPage" />
					</div>
				</div>
			</div>
		</panel-body>
	</panel>
	<SystemImgModal
		v-if="showSystemImgModal"
		:fetch-list="fetchSystemImages"
		@close="showSystemImgModal = false"
		@select="onSelectSystemImage"
	/>
	<div v-if="showImageModal" class="image-modal-backdrop" @click="closeImageModal">
		<div class="image-modal-content" @click.stop>
			<img :src="modalImageSrc || noImg" alt="이미지 확대" />
			<button class="btn-close" @click="closeImageModal">×</button>
		</div>
	</div>
	<!-- END panel -->
</template>
<script setup lang="ts">
import { ref, computed, watch, onBeforeMount, nextTick } from 'vue';
import { useRestaurantStore } from '@/stores/restaurant/useRestaurantStore';
import Pagenation from '@/components/common/Pagenation.vue';
import FormMultipleImage from '@/components/form/FormMultipleImage.vue';
import noImg from '@/assets/img/noimg.gif';
import { useRouter } from 'vue-router';
import SystemImgModal from '@/views/restaurant/SystemImgModal.vue';
import axios, { type AxiosResponse } from 'axios';
import { isBlank } from '@/utils/ValidateUtils';

const store = useRestaurantStore();
const selectGrStGrpNo = ref(1);
onBeforeMount(() => {
	if (store.grpList) {
		selectGrStGrpNo.value = store.grpList[0].grStGrpNo;
	}
});
const router = useRouter();
const isAppMemoExpanded = ref(false);
const isWorkTimeExpanded = ref(false);

const showSystemImgModal = ref(false);
const currentTargetItem = ref<any>(null);

// 모든 체크박스 상태
const checkedItems = ref<string[]>([]); // grStNo를 기준으로 체크 상태 관리

const showImageModal = ref(false); // 모달 표시 여부
const modalImageSrc = ref(''); // 확대할 이미지 경로

function openImageModal(src: string) {
	modalImageSrc.value = src;
	showImageModal.value = true;
}

function closeImageModal() {
	showImageModal.value = false;
	modalImageSrc.value = '';
}
const allChecked = ref(false);
// allCheck 클릭 시 토글
function toggleAll() {
	if (allChecked.value) {
		// 전체 체크
		checkedItems.value = store.grpItems.map((item) => item.grStGoodsNo);
	} else {
		// 전체 해제
		checkedItems.value = [];
	}
}

function toggleItem(grStGoodsNo: string) {
	const index = checkedItems.value.indexOf(grStGoodsNo);
	if (index > -1) {
		checkedItems.value.splice(index, 1);
	} else {
		checkedItems.value.push(grStGoodsNo);
	}

	// allChecked 상태 자동 반영
	allChecked.value = checkedItems.value.length === store.grpList.length;
}

const paginatedData = computed(() => {
	const arr = store.grpItems || [];
	const start = (currentPage.value - 1) * itemsPerPage;
	return arr.slice(start, start + itemsPerPage);
});

const currentPage = ref(1);

const itemsPerPage = 10;
const getAppName = (appType: string | number) => {
	if (appType === '1' || appType === 1) return '배민';
	if (appType === '2' || appType === 2) return '쿠팡';
	return '';
};

const adultYn = (appType: string | number) => {
	if (appType === 'Y') return '인증';
	if (appType === 'N') return '미인증';
	if (appType === '0') return '알수없음';
	return '';
};
function formatPrice(value: number | string) {
	if (value === null || value === undefined) return '';
	return Number(value).toLocaleString('ko-KR');
}

const selectGrpList = (grStGrpNo: number | string) => {
	currentPage.value = 1;
	selectGrStGrpNo.value = grStGrpNo;
	store.callGrpListAPI(store.form.grStNo, grStGrpNo, () => {});
};
const deleteImage = async () => {
	if (checkedItems.value.length > 0) {
		await store.deleteImageAPI({ grStGoodsNoList: checkedItems.value }, () => {
			allChecked.value = false;
			checkedItems.value = [];
			if (store.grpList) {
				store.callGrpListAPI(store.form.grStNo, selectGrStGrpNo.value, () => {
					checkedItems.value.map((item) => {
						toggleItem(item);
					});
					checkedItems.value = [];
				});
			}
		});
	} else {
		alert('삭제할 이미지를 최소 1개 이상 선택해주세요.');
	}
};
const fileInputs = ref<HTMLInputElement[]>([]);

// 버튼 클릭 → 해당 row의 input 클릭
function triggerFileInput(event: Event) {
	const button = event.currentTarget as HTMLElement;
	const td = button.closest('td');
	const input = td?.querySelector("input[type='file']") as HTMLInputElement;
	input?.click();
}

// 파일 선택 시 처리
async function handleFileChange(e: Event, item: any) {
	const target = e.target as HTMLInputElement;
	if (!target.files || target.files.length === 0) return;

	const file = target.files[0];

	const formData = new FormData();
	formData.append('image', file);

	const query = { dest: 'goods', grStGoodsNo: item.grStGoodsNo };
	// 🚀 API 호출 (예시)
	await store.calluploadImgAPI(formData, query, (res) => {
		allChecked.value = false;
		checkedItems.value = [];
		// 업로드 후 이미지 경로 업데이트
		if (store.grpList) {
			store.callGrpListAPI(store.form.grStNo, selectGrStGrpNo.value, () => {});
		}
	});
	// input 파일 초기화
	target.value = '';
}

// 파일 선택 시 처리
async function handleFileChangeSystem(e: Event, item: any) {
	const target = e.target as HTMLInputElement;
	if (!target.files || target.files.length === 0) return;

	const file = target.files[0];

	const formData = new FormData();
	formData.append('image', file);

	const query = { dest: 'goods', grStGoodsNo: item.grStGoodsNo };
	// 🚀 API 호출 (예시)
	await store.calluploadSystemImgAPI(formData, query, (res) => {
		allChecked.value = false;
		checkedItems.value = [];
		// 업로드 후 이미지 경로 업데이트
		if (store.grpList) {
			store.callGrpListAPI(store.form.grStNo, selectGrStGrpNo.value, () => {});
		}
	});
	// input 파일 초기화
	target.value = '';
}

const grpTabsContainer = ref<HTMLElement | null>(null);

function scrollGrp(direction: number) {
	if (!grpTabsContainer.value) return;
	const scrollAmount = grpTabsContainer.value.clientWidth * 0.5; // 반 너비 정도 이동
	grpTabsContainer.value.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
}

// 탭이 바뀔 때 활성 탭이 보이도록 포커스 맞추기
watch(selectGrStGrpNo, (newVal) => {
	// 약간의 delay 혹은 nextTick 필요할 수 있음
	nextTick(() => {
		const activeEl = grpTabsContainer.value?.querySelector('.nav-link.active');
		if (activeEl && grpTabsContainer.value) {
			const el = activeEl as HTMLElement;
			const container = grpTabsContainer.value;
			const elLeft = el.offsetLeft;
			const elRight = elLeft + el.offsetWidth;
			const contLeft = container.scrollLeft;
			const contRight = contLeft + container.clientWidth;

			if (elLeft < contLeft) {
				container.scrollTo({ left: elLeft, behavior: 'smooth' });
			} else if (elRight > contRight) {
				container.scrollTo({ left: elRight - container.clientWidth, behavior: 'smooth' });
			}
		}
	});
});

//모달팝업 페이징

async function fetchSystemImages({ page, size, search }) {
	const res = await store.callSystemImgList({
		page,
		size,
	});

	return {
		list: res.data, // [{ id, thumb, full }]
		totalCount: res.total, // 전체 개수
	};
}

const systemImages = ref([
	{ id: 1, thumb: '/sys/img1_thumb.jpg', full: '/sys/img1.jpg' },
	{ id: 2, thumb: '/sys/img2_thumb.jpg', full: '/sys/img2.jpg' },
	// 여기에 실제 API로 받아도 됨
]);

async function selectSystemImg(grStGoodsNo: any) {
	store.selectGrStGoodsNo = grStGoodsNo;

	await store.callSystemImgCateList('NM');
	await store.callSystemImgList();
	showSystemImgModal.value = true;
}

async function onSelectSystemImage(img: any) {
	if (isBlank(img.imgTFile)) {
		window.$emitter.emit('warning', '시스템 이미지가 없습니다.');
		return;
	}
	window.$emitter.emit('confirm', {
		message: '등록하시겠습니까?',
		callback: async () => {
			const query = { grStGoodsNo: store.selectGrStGoodsNo, imgTFile: img.imgTFile };
			await store.callUploadSysImgAPI(query, () => {
				showSystemImgModal.value = false;
				// 업로드 후 이미지 경로 업데이트
				if (store.grpList) {
					store.callGrpListAPI(store.form.grStNo, selectGrStGrpNo.value, () => {});
				}
			});
		},
	});
}

async function dataURLtoFile(dataUrl: string, filename: string): Promise<File> {
	const res = await fetch(dataUrl);
	const blob = await res.blob();
	const ext = convertExt(dataUrl);
	const metadata = { type: `image/${ext}` };
	return new File([blob], filename, metadata);
}

function convertExt(fileName): string {
	return fileName.substring(fileName.lastIndexOf('.'), fileName.length);
}
</script>
<style scoped>
.borde-radius-0 {
	border-radius: 0px;
}
.card-body {
	flex: 1 1 auto;
	padding: var(--bs-card-spacer-y) var(--bs-card-spacer-x);
	color: var(--bs-card-color);
	background: #f4f4f4;
}

.image-modal-backdrop {
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background: rgba(0, 0, 0, 0.6);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1050;
}

.image-modal-content {
	position: relative;
	background: #fff;
	padding: 10px;
	border-radius: 8px;
	max-width: 90%;
	max-height: 90%;
}

.image-modal-content img {
	max-width: 100%;
	max-height: 850px;
	display: block;
}

.image-modal-content .btn-close {
	position: absolute;
	top: 5px;
	right: 5px;
	background: none;
	border: none;
	font-size: 24px;
	cursor: pointer;
}

.text-ellipsis {
	max-width: 150px; /* 원하는 너비 */
	white-space: nowrap; /* 한 줄로 */
	overflow: hidden; /* 넘치면 숨김 */
	text-overflow: ellipsis; /* ... 처리 */
}

/* LEFT */
.info-left {
	flex: 2;
	min-width: 300px;
	display: flex;
	flex-direction: row;
	gap: 8px;
}

.info-table th {
	width: 90px;
	color: #555;
	font-weight: 600;
}

.info-table td {
	color: #222;
}

.toggle-btn {
	border: none;
	background: none;
	color: #ddd;
	font-size: 12px;
	cursor: pointer;
	padding: 2px 0;
}

.info-block {
	position: relative; /* 버튼 절대 위치 기준 */
	border: 1px solid #ddd;
	background: white;
	border-radius: 6px;
	padding: 10px;
}

.block-title {
	font-weight: 600;
	margin-bottom: 6px;
	font-size: 13px;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.toggle-btn {
	border: none;
	background: none;
	font-size: 12px;
	cursor: pointer;
	padding: 0;
	color: black;
}

.block-content {
	width: 450px;
	white-space: pre-wrap;
	max-height: 90px;
	overflow-y: scroll;
	margin: 0;
	font-size: 13px;
	transition: max-height 0.3s ease;
}

.block-content.expanded {
	max-height: 500px; /* 전체 높이 */
}

.block-content-time {
	white-space: pre-wrap;
	max-height: 90px;
	overflow-y: scroll;
	margin: 0;
	font-size: 13px;
	transition: max-height 0.3s ease;
}

.block-content-time.expanded {
	max-height: 500px; /* 전체 높이 */
}

.grp-tabs-wrapper {
	display: flex;
	align-items: center;
	width: 80%;
}

.grp-tabs-container {
	overflow-x: auto;
	flex: 1;
	scrollbar-width: none;
}
.grp-tabs-container::-webkit-scrollbar {
	display: none;
}

/* ✨ 이게 핵심! 탭들이 절대 줄바꿈되지 않음 */
.grp-tabs-container .nav {
	white-space: nowrap;
}

.grp-btn {
	background: transparent;
	border: none;
	font-size: 18px;
	margin-bottom: 5px;
	width: 25px;
	height: 40px;
	cursor: pointer;
}

.nav {
	--bs-nav-link-padding-x: 1rem;
	--bs-nav-link-padding-y: 0.5rem;
	--bs-nav-link-font-weight: 600;
	--bs-nav-link-color: rgba(var(--app-component-color-rgb), 0.5);
	--bs-nav-link-hover-color: var(--app-component-color);
	--bs-nav-link-disabled-color: #ced4da;
	display: flex;
	flex-wrap: nowrap;
	padding-left: 0;
	margin-bottom: 0;
	list-style: none;
}
</style>
