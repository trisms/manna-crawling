<template>
  <panel>
    <panel-body>
      <!-- 검색 영역 -->
      <!-- 검색 영역 -->
      <div class="search-filter-wrap mb-4">
        <!-- 1줄 -->
        <div class="search-filter-row search-filter-row-top">
          <div class="filter-item filter-date">
            <div class="filter-date-group">
              <VueDatePicker
                  v-model="dateRange.startDate"
                  format="yyyy-MM-dd"
                  :auto-apply="true"
                  :enable-time-picker="false"
                  placeholder="DB생성기간 (시작일)"
              />
              <span class="filter-date-tilde">~</span>
              <VueDatePicker
                  v-model="dateRange.endDate"
                  format="yyyy-MM-dd"
                  :auto-apply="true"
                  :enable-time-picker="false"
                  placeholder="DB생성기간 (종료일)"
              />
            </div>
          </div>

          <div class="filter-item filter-sido">
            <select class="form-select" v-model="store.searchParams.sidoCode">
              <option
                  v-for="item in store.sidoList"
                  :key="item.sidoCode"
                  :value="item.sidoCode"
              >
                {{ item.addrName }}
              </option>
            </select>
          </div>

          <div class="filter-item filter-sigun">
            <select
                class="form-select"
                v-model="store.searchParams.sigunCode"
                :disabled="!store.searchParams.sidoCode"
            >
              <option value="">시/군/구</option>
              <option
                  v-for="item in filteredSigunList"
                  :key="item.sigunCode"
                  :value="item.sigunCode"
              >
                {{ item.addrName }}
              </option>
            </select>
          </div>

          <div class="filter-item filter-app">
            <select class="form-select" v-model="store.searchParams.appType">
              <option value="">플랫폼 타입</option>
              <option value="1">여기어때</option>
              <option value="2">야놀자</option>
            </select>
          </div>

          <div class="filter-item filter-accom-type">
            <select class="form-select" v-model="store.searchParams.accomType">
              <option value="">숙소유형</option>
              <option value="1">모텔</option>
              <option value="2">호텔/리조트</option>
              <option value="3">펜션</option>
              <option value="4">홈 & 빌라</option>
              <option value="5">캠핑</option>
              <option value="6">게하/한옥</option>
              <option value="7">레지던스</option>
            </select>
          </div>

          <div class="filter-item filter-status">
            <select class="form-select" v-model="store.searchParams.dataStatus">
              <option value="">DB등록여부</option>
              <option value="1">미등록</option>
              <option value="2">등록완료</option>
              <option value="3">진행중</option>
              <option value="4">등록실패</option>
            </select>
          </div>
        </div>

        <!-- 2줄 -->
        <div class="search-filter-row search-filter-row-bottom">
          <div class="filter-item filter-search-type">
            <select class="form-select" v-model="store.searchParams.searchType">
              <option value="">전체</option>
              <option value="bizName">사업자상호</option>
              <option value="bizNum">사업자번호</option>
              <option value="accomName">등록상호</option>
              <option value="accomCode">숙소코드</option>
            </select>
          </div>

          <div class="filter-item filter-keyword">
            <div class="filter-keyword-box">
              <i class="fa fa-search filter-keyword-icon"></i>
              <input
                  type="text"
                  class="form-control filter-keyword-input"
                  v-model="store.searchParams.keyword"
                  placeholder="검색어를 입력해주세요."
                  @keyup.enter="search"
              />
              <button type="button" class="btn btn-dark filter-keyword-btn" @click="search">
                검색
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 보조 액션 -->
      <div class="d-flex justify-content-between">
        <div class="card border-0">
          <div class="d-md-flex fw-bold ms-auto">
            <div class="mt-md-0 mt-2 btn btn-white btn-sm d-flex me-2 pe-3 rounded-3 border" @click="resetSearch">
              <div class="text-decoration-none rounded">
                <i class="fa fa-rotate-right fa-fw me-1"></i> 초기화
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0">
          <div class="d-md-flex fw-bold ms-auto">
            <div class="mt-md-0 mt-2 btn btn-success btn-sm d-flex me-2 pe-3 rounded-3" @click="goToCreate">
              <div class="text-white text-decoration-none rounded">
                <i class="fa fa-plus fa-fw me-1 text-white"></i> 숙박업소 등록
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />

      <!-- 테이블 -->
      <div class="card border-0">
        <div class="table-responsive mb-3">
          <table class="table table-hover table-panel text-nowrap align-middle mb-0" style="min-width: 1400px; overflow-x: auto">
            <thead>
            <tr>
              <th>번호</th>
              <th>등록상호</th>
              <th>플랫폼 타입</th>
              <th>숙소유형</th>
              <th>주소</th>
              <th>객실 수</th>
              <th>수집일</th>
              <th>DB등록상태</th>
              <th width="140px">DB 수정일</th>
              <th>숙소코드</th>
            </tr>
            </thead>

            <tbody>
            <tr v-if="loading">
              <td colspan="10" class="text-center py-4 text-muted">
                조회중입니다.
              </td>
            </tr>

            <tr v-else-if="store.items.length === 0">
              <td colspan="10" class="text-center py-4 text-muted">
                조회된 숙박업소가 없습니다.
              </td>
            </tr>

            <tr
                v-for="(item, index) in store.items"
                :key="item.accomId"
                @click="goToDetail(item.accomId)"
                style="cursor: pointer"
            >
              <td>{{ rowNumber(index) }}</td>
              <td>{{ item.accomName || '-' }}</td>

              <td>
                  <span
                      class="badge border px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"
                      :class="appTypeClass(item.appType)"
                  >
                    <i class="fa fa-circle fs-9px fa-fw me-5px"></i>
                    {{ getAppName(item.appType) }}
                  </span>
              </td>

              <td>{{ getAccomTypeName(item.accomType) }}</td>
              <td>{{ item.accomAddr || '-' }}</td>
              <td>{{ item.roomCnt ?? 0 }} 실</td>
              <td>{{ formatDate(item.putDate) }}</td>
              <td>
                  <span :class="dbResultFont(item.dataStatus)">
                    {{ convertDataStatus(item.dataStatus) }}
                  </span>
              </td>
              <td>{{ formatDate(item.modDate) }}</td>
              <td style="min-width: 150px; max-width: 150px"   @click.stop>
                <div class="input-group" style="width: 150px">
                  <input
                      type="text"
                      @click.stop
                      class="form-control bg-light border-0"
                      v-model="item.accomCode"
                      placeholder="숙박코드"
                      style="width: 60px"
                  />
                  <button type="button" @click.stop="updateStCode(item.accomId, item.accomCode)" class="btn btn-sm btn-white">
                    <i class="fa fa-fw fa-plus"></i> 수정
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <!-- 페이지 -->
        <div class="d-flex justify-content-between align-items-center px-2 pb-2">
          <div>
            총 {{ store.totalSize }}건
            <span class="text-muted ms-2">
      {{ store.currentPage }} / {{ store.totalPages }} 페이지
    </span>
          </div>

          <ul class="pagination mb-0">
            <li class="page-item" :class="{ disabled: store.currentPage <= 1 }">
              <a class="page-link" href="#" @click.prevent="movePage(1)"><<</a>
            </li>

            <li class="page-item" :class="{ disabled: store.currentPage <= 1 }">
              <a class="page-link" href="#" @click.prevent="movePage(store.currentPage - 1)"><</a>
            </li>

            <li
                v-for="page in visiblePages"
                :key="page"
                class="page-item"
                :class="{ active: page === store.currentPage }"
            >
              <a class="page-link" href="#" @click.prevent="movePage(page)">
                {{ page }}
              </a>
            </li>

            <li class="page-item" :class="{ disabled: store.currentPage >= store.totalPages }">
              <a class="page-link" href="#" @click.prevent="movePage(store.currentPage + 1)">></a>
            </li>

            <li class="page-item" :class="{ disabled: store.currentPage >= store.totalPages }">
              <a class="page-link" href="#" @click.prevent="movePage(store.totalPages)">>></a>
            </li>
          </ul>
        </div>
      </div>
    </panel-body>
  </panel>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useRouter } from 'vue-router';
import { useAccommodationStore } from '@/stores/accommodation/useAccommodationStore';
import {toast} from "vue3-toastify";

const router = useRouter();
const store = useAccommodationStore();
const loading = ref(false);
const options = {
  onOpen: () => console.log('opened'),
  /*onClose: () => ,*/
  onClose: () => console.log(1),
  closeButton: true,
  closeOnClick: true,
  autoClose: 300,
  dangerouslyHTMLString: true,
  type: toast.TYPE.SUCCESS,
  hideProgressBar: true,
  position: toast.POSITION.BOTTOM_RIGHT,
  pauseOnHover: false,
  progress: 0.2,
  transition: 'slide',
  theme: 'auto',
  // and so on ...
};

const getDefaultDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 1);

  return { startDate, endDate };
};

const formatDateParam = (date: Date | null) => {
  if (!date) return '';
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${MM}-${dd}`;
};

const defaultDateRange = getDefaultDateRange();
const dateRange = ref({
  startDate: defaultDateRange.startDate,
  endDate: defaultDateRange.endDate,
});
const syncingDateRange = ref(false);

store.searchParams.startDate = formatDateParam(dateRange.value.startDate);
store.searchParams.endDate = formatDateParam(dateRange.value.endDate);

const filteredSigunList = computed(() => {
  const sido = store.searchParams.sidoCode;
  if (!sido) return store.sigunList;
  return store.sigunList.filter((item: any) =>
      String(item.sigunCode).startsWith(String(sido))
  );
});

const visiblePages = computed(() => {
  const current = Number(store.currentPage || 1);
  const total = Number(store.totalPages || 1);

  let start = Math.max(1, current - 2);
  let end = Math.min(total, current + 2);

  // 앞쪽 페이지 보정
  if (current <= 3) {
    end = Math.min(total, 5);
  }

  // 뒤쪽 페이지 보정
  if (current >= total - 2) {
    start = Math.max(1, total - 4);
  }

  const pages: number[] = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

watch(
    () => store.searchParams.sidoCode,
    () => {
      store.searchParams.sigunCode = '';
    }
);

watch(
    [() => dateRange.value.startDate, () => dateRange.value.endDate],
    () => {
      if (syncingDateRange.value) return;
      store.searchParams.startDate = formatDateParam(dateRange.value.startDate);
      store.searchParams.endDate = formatDateParam(dateRange.value.endDate);
      search();
    }
);

onMounted(async () => {
  loading.value = true;
  try {
    await store.callRegionList();
    await store.callListAPI();
  } finally {
    loading.value = false;
  }
});

const rowNumber = (index: number) => {
  return (Number(store.currentPage) - 1) * Number(store.searchParams.size) + index + 1;
};

const formatDate = (value: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${MM}-${dd}`;
};

const search = async () => {
  loading.value = true;
  try {
    store.searchParams.page = 1;
    await store.callListAPI();
  } finally {
    loading.value = false;
  }
};

const movePage = async (page: number) => {
  if (page < 1 || page > store.totalPages) return;
  loading.value = true;
  try {
    store.searchParams.page = page;
    await store.callListAPI();
  } finally {
    loading.value = false;
  }
};


const updateStCode = async (accomId: number, accomCode: string) => {
  try {
    /*		if (isBlank(stCode)) {
          window.$emitter.emit('warning', '가맹점 코드를 입력해주세요.');
          return;
        }*/
    await store.updateAccomAPI({ accomId: accomId, accomCode: accomCode }, () => {
      toast.success(
          '<div class="d-flex space-between flex-start">' +
          ' <h5>수정에 성공하였습니다.</h5>' +
          ' <h4 ></h4>' +
          '</div>' +
          '<hr class="mt-0 mb-2" /><strong> 변경된 숙박코드: ' +
          accomCode +
          '</strong> ',
          options,
      );
      search(); // 필요시 리스트 새로고침
    });
  } catch (error) {
    toast.error(
        '<div class="d-flex space-between flex-start">' +
        ' <h5>수정에 실패하였습니다.</h5>' +
        ' <h4 ></h4>' +
        '</div>' +
        '<hr class="mt-0 mb-2" /><strong> 변경된값 : {{ stCode }}</strong> ',
        options,
    );
  }
};
const resetSearch = async () => {
  store.resetSearchParams();
  const resetDateRange = getDefaultDateRange();
  syncingDateRange.value = true;
  dateRange.value.startDate = resetDateRange.startDate;
  dateRange.value.endDate = resetDateRange.endDate;
  syncingDateRange.value = false;
  store.searchParams.startDate = formatDateParam(resetDateRange.startDate);
  store.searchParams.endDate = formatDateParam(resetDateRange.endDate);

  loading.value = true;
  try {
    await store.callListAPI();
  } finally {
    loading.value = false;
  }
};

function goToDetail(accomId: string | number) {
  router.push({ name: 'AccommodationDetail', params: { id: accomId } });
}

const goToCreate = () => {
  router.push({ path: '/accommodation/create' });
};

const getAppName = (appType: string | number) => {
  if (String(appType) === '1') return '여기어때';
  if (String(appType) === '2') return '야놀자';
  return '-';
};

const getAccomTypeName = (type: string | number) => {
  switch (String(type)) {
    case '1': return '모텔';
    case '2': return '호텔/리조트';
    case '3': return '펜션';
    case '4': return '홈 & 빌라';
    case '5': return '캠핑';
    case '6': return '게하/한옥';
    case '7': return '레지던스';
    default: return '-';
  }
};

const convertDataStatus = (val: string | number) => {
  switch (String(val)) {
    case '1': return '미등록';
    case '2': return '등록완료';
    case '3': return '진행중';
    case '4': return '등록실패';
    default: return '-';
  }
};

const dbResultFont = (val: string | number) => {
  switch (String(val)) {
    case '1': return '';
    case '2': return 'text-bold';
    case '3': return 'text-info';
    case '4': return 'text-danger';
    default: return '';
  }
};

const appTypeClass = (appType: string | number) => {
  switch (String(appType)) {
    case '1': return 'border-success text-success';
    case '2': return 'border-warning text-warning';
    default: return 'border-secondary text-secondary';
  }
};
</script>

<style scoped>
.input-group .btn {
  z-index: unset;
}

.search-line-wrap {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 4px;
}

.search-line {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 1560px;
}

.search-line-item {
  flex: 0 0 auto;
}

.date-range-item {
  width: 420px;
}

.select-sm {
  width: 130px;
}

.select-md {
  width: 170px;
}

.select-type {
  width: 140px;
}

.keyword-item {
  width: 320px;
}


.keyword-inline {
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
}

.keyword-inline-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #98a2ad;
  z-index: 2;
}

.keyword-inline-input {
  padding-left: 36px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.keyword-inline-btn {
  min-width: 72px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}


.search-line-wrap :deep(.dp__main) {
  width: 100%;
}



.search-filter-wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-filter-row {
  display: grid;
  gap: 12px;
  align-items: center;
}

.search-filter-row-top {
  grid-template-columns: 2.2fr 0.9fr 1.2fr 0.9fr 1fr 1fr;
}

.search-filter-row-bottom {
  grid-template-columns: 180px minmax(320px, 1fr);
}

.filter-item {
  min-width: 0;
}

.filter-date-group {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 8px;
  align-items: center;
  width: 100%;
}

.filter-date-tilde {
  color: #6c757d;
  font-weight: 600;
}

.filter-keyword-box {
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
}

.filter-keyword-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #98a2ad;
  z-index: 2;
}

.filter-keyword-input {
  padding-left: 36px;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.filter-keyword-btn {
  min-width: 84px;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.search-filter-wrap .form-select,
.search-filter-wrap .form-control {
  height: 42px;
}

.search-filter-wrap :deep(.dp__main) {
  width: 100%;
}

.search-filter-wrap :deep(.dp__input) {
  height: 42px;
}

@media (max-width: 1400px) {
  .search-filter-row-top {
    grid-template-columns: repeat(3, minmax(180px, 1fr));
  }

  .search-filter-row-bottom {
    grid-template-columns: 180px minmax(240px, 1fr);
  }
}

@media (max-width: 991px) {
  .search-filter-row-top,
  .search-filter-row-bottom {
    grid-template-columns: repeat(2, minmax(180px, 1fr));
  }

  .filter-date-group {
    grid-template-columns: 1fr;
  }

  .filter-date-tilde {
    display: none;
  }
}

@media (max-width: 767px) {
  .search-filter-row-top,
  .search-filter-row-bottom {
    grid-template-columns: 1fr;
  }
}

 .input-group .btn {
   z-index: unset;
 }

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.text-bold {
  font-weight: bold
}
</style>
