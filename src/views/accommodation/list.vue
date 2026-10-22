```
<template>
  <panel>
    <panel-body>
      <!-- 음식점 목록과 동일한 검색/필터 레이아웃 -->
      <div class="row gx-2 gy-2 pb-30px accom-search">
        <div class="col-xl-3 col-lg-6 col-12 d-flex align-items-center gap-2">
          <VueDatePicker
              v-model="dateRange.startDate"
              format="yyyy-MM-dd"
              :auto-apply="true"
              :enable-time-picker="false"
              placeholder="DB생성기간 (시작일)"
          />
          <span class="text-muted">
            ~
          </span>
          <VueDatePicker
              v-model="dateRange.endDate"
              format="yyyy-MM-dd"
              :auto-apply="true"
              :enable-time-picker="false"
              placeholder="DB생성기간 (종료일)"
          />
        </div>
        <div class="col-xl-1 col-lg-3 col-md-6">
          <select class="form-select" v-model="store.searchParams.sidoCode">
            <option value="">
              시/도
            </option>
            <option v-for="item in store.sidoList" :key="item.sidoCode" :value="item.sidoCode">
              {{ item.addrName }}
            </option>
          </select>
        </div>
        <div class="col-xl-2 col-lg-3 col-md-6">
          <select
              class="form-select"
              v-model="store.searchParams.sigunCode"
              :disabled="!store.searchParams.sidoCode"
          >
            <option value="">
              시/군/구
            </option>
            <option v-for="item in filteredSigunList" :key="item.sigunCode" :value="item.sigunCode">
              {{ item.addrName }}
            </option>
          </select>
        </div>
        <div class="col-xl-1 col-lg-3 col-md-4">
          <select class="form-select" v-model="store.searchParams.appType">
            <option value="">
              플랫폼 타입
            </option>
            <option value="1">
              여기어때
            </option>
            <option value="2">
              야놀자
            </option>
          </select>
        </div>
        <div class="col-xl-1 col-lg-3 col-md-4">
          <select class="form-select" v-model="store.searchParams.accomType">
            <option value="">
              숙소유형
            </option>
            <option value="1">
              모텔
            </option>
            <option value="2">
              호텔/리조트
            </option>
            <option value="3">
              펜션
            </option>
            <option value="4">
              홈 &amp; 빌라
            </option>
            <option value="5">
              캠핑
            </option>
            <option value="6">
              게하/한옥
            </option>
            <option value="7">
              레지던스
            </option>
          </select>
        </div>
        <div class="col-xl-1 col-lg-3 col-md-4">
          <select class="form-select" v-model="store.searchParams.dataStatus">
            <option value="">
              DB등록여부
            </option>
            <option value="1">
              미등록
            </option>
            <option value="2">
              등록완료
            </option>
            <option value="3">
              진행중
            </option>
            <option value="4">
              등록실패
            </option>
          </select>
        </div>
        <div class="col-xl-3 col-lg-6 col-12 d-flex align-items-stretch">
          <div class="input-group">
            <select class="form-select" v-model="store.searchParams.searchType">
              <option value="">
                전체
              </option>
              <option value="bizName">
                사업자상호
              </option>
              <option value="bizNum">
                사업자번호
              </option>
              <option value="accomName">
                등록상호
              </option>
              <option value="accomCode">
                숙소코드
              </option>
            </select>
            <div class="btn btn-white d-flex align-items-center p-0" style="flex: 3; min-width: 0;">
              <i class="fa fa-search ms-2 me-2 text-muted">
              </i>
              <div class="input-group">
                <input
                    class="form-control bg-light border-0"
                    v-model="store.searchParams.keyword"
                    placeholder="검색어를 입력해주세요."
                    @keyup.enter="search"
                />
                <button type="button" class="btn btn-sm btn-white border-0" :disabled="loading" @click="search">
                  <i class="fa fa-fw" :class="loading ? 'fa-spinner fa-spin' : 'fa-search'">
                  </i>
                  {{ loading ? '검색중' : '검색' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="accom-toolbar">
        <div class="accom-toolbar-left">
          <button type="button" class="btn btn-danger btn-sm" @click="deleteCode">
            <i class="fa fa-cancel fa-fw me-1">
            </i>
            삭제
          </button>
          <div class="fw-bold text-secondary">
            전체
            <span class="text-primary">
              {{ Number(store.totalSize || 0).toLocaleString() }}
            </span>
            건
          </div>
        </div>
        <div class="accom-toolbar-right">
          <div class="segment-group">
            <button type="button" class="segment-button" :disabled="excelDownloading" @click="excelDownload">
              <i class="fa fa-fw me-1" :class="excelDownloading ? 'fa-spinner fa-spin' : 'fa-file-excel'">
              </i>
              {{ excelDownloading ? '생성중' : '조회내역 엑셀 다운로드' }}
            </button>
          </div>
          <div class="segment-group">
            <button type="button" class="segment-button" :disabled="excelUploading" @click="openExcelUpload">
              <i class="fa fa-fw me-1" :class="excelUploading ? 'fa-spinner fa-spin' : 'fa-upload'">
              </i>
              {{ excelUploading ? '등록중' : '숙박 데이터 업로드' }}
            </button>
            <button type="button" class="segment-button" @click="excelTemplateDownload">
              <i class="fa fa-file-arrow-down fa-fw me-1">
              </i>
              양식 다운로드
            </button>
          </div>
          <div class="segment-group">
            <button
                type="button"
                class="segment-button"
                :disabled="selectedUploadRunning"
                @click="goodsUpload(1)"
            >
              <i class="fa fa-rotate fa-fw me-1"></i>
              기존데이터삭제후 신규업로드
            </button>
            <button
                type="button"
                class="segment-button"
                :disabled="selectedUploadRunning"
                @click="goodsUpload(2)"
            >
              <i class="fa fa-plus fa-fw me-1"></i>
              기존데이터유지후 추가
            </button>
          </div>
          <input
              ref="excelFileInput"
              type="file"
              accept=".xlsx,.xls"
              class="d-none"
              @change="excelUpload"
          />
        </div>
      </div>
      <hr />
      <div class="card border-0 accommodation-list-card" :aria-busy="loading">
        <div v-if="loading" class="list-progress-track" role="progressbar" aria-label="숙박업소 목록 조회 중">
          <div class="list-progress-indicator">
          </div>
        </div>
        <div v-if="loading" class="list-loading-overlay" aria-live="polite">
          <div class="list-loading-content">
            <i class="fa fa-spinner fa-spin list-loading-spinner">
            </i>
            <strong>
              조회 중입니다
            </strong>
            <span>
              숙박업소 목록을 불러오고 있습니다.
            </span>
          </div>
        </div>
        <div class="table-responsive mb-3">
          <table class="table table-hover table-panel text-nowrap align-middle mb-0" style="min-width: 1480px">
            <thead>
            <tr>
              <th class="w-10px">
                <div class="form-check">
                  <input id="allCheck" type="checkbox" class="form-check-input" v-model="allChecked" @change="toggleAll" />
                  <label for="allCheck" class="form-check-label">
                  </label>
                </div>
              </th>
              <th>
                일련번호
              </th>
              <th>
                숙박업소 앱 등록상호
              </th>
              <th>
                보유스킴
              </th>
              <th>
                플랫폼 타입
              </th>
              <th>
                숙소유형
              </th>
              <th>
                주소
              </th>
              <th>
                객실 수
              </th>
              <th>
                수집일
              </th>
              <th>
                DB등록상태
              </th>
              <th>
                DB 수정일
              </th>
              <th>
                숙소코드
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="!loading && store.items.length === 0">
              <td colspan="12" class="text-center py-4 text-muted">
                조회된 숙박업소가 없습니다.
              </td>
            </tr>
            <tr
                v-for="(item, index) in store.items"
                :key="item.accomId"
                @click="goToDetail(item.accomId)"
                style="cursor:pointer"
            >
              <td class="w-10px align-middle" @click.stop="toggleItem(item.accomId)">
                <div class="form-check">
                  <input
                      type="checkbox"
                      class="form-check-input"
                      :id="`accom-${item.accomId}`"
                      :checked="checkedItems.includes(item.accomId)"
                  />
                  <label class="form-check-label" :for="`accom-${item.accomId}`">
                  </label>
                </div>
              </td>
              <td>
                {{ rowNumber(index) }}
              </td>
              <td>
                {{ item.accomName || '-' }}
              </td>
              <td>
                <div class="platform-url-list">
                    <span v-if="item.yanoljaUrl" class="platform-url yanolja" title="야놀자 URL 보유">
                      야놀자
                    </span>
                  <span v-if="item.yeogiUrl" class="platform-url yeogi" title="여기어때 URL 보유">
                      여기어때
                    </span>
                  <span v-if="item.tripUrl" class="platform-url trip" title="트립닷컴 URL 보유">
                      트립닷컴
                    </span>
                  <span v-if="item.agodaUrl" class="platform-url agoda" title="아고다 URL 보유">
                      아고다
                    </span>
                  <span v-if="!item.yanoljaUrl && !item.yeogiUrl && !item.tripUrl && !item.agodaUrl" class="text-muted">
                      -
                    </span>
                </div>
              </td>
              <td>
                  <span
                      class="badge border px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"
                      :class="appTypeClass(item.appType)"
                  >
                    <i class="fa fa-circle fs-9px fa-fw me-5px">
                    </i>
                    {{ getAppName(item.appType) }}
                  </span>
              </td>
              <td>
                {{ getAccomTypeName(item.accomType) }}
              </td>
              <td>
                {{ item.accomAddr || '-' }}
              </td>
              <td>
                {{ item.roomCnt ?? 0 }} 실
              </td>
              <td>
                {{ item.putDate || '-' }}
              </td>
              <td>
                  <span :class="dbResultFont(item.dataStatus)">
                    {{ convertDataStatus(item.dataStatus) }}
                  </span>
              </td>
              <td>
                {{ formatDate(item.modDate) }}
              </td>
              <td style="min-width:150px;max-width:150px" @click.stop>
                <div class="input-group" style="width:150px">
                  <input
                      v-model="item.accomCode"
                      type="text"
                      class="form-control bg-light border-0"
                      placeholder="숙박코드"
                      style="width:60px"
                  />
                  <button
                      type="button"
                      class="btn btn-sm btn-white"
                      @click.stop="updateStCode(item.accomId, item.accomCode)"
                  >
                    <i class="fa fa-fw fa-plus">
                    </i>
                    수정
                  </button>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <Pagenation
            v-model="currentPage"
            :total="Number(store.totalSize || 0)"
            :perPage="Number(store.searchParams.size || 13)"
        />
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
import * as XLSX from 'xlsx';
import Pagenation from '@/components/common/Pagenation.vue';
const router = useRouter();
const store = useAccommodationStore();
const loading = ref(false);
const currentPage = computed({
  get: () => Number(store.currentPage || 1),
  set: (page: number) => { void movePage(page); },
});
const excelFileInput = ref<HTMLInputElement | null>(null);
const excelUploading = ref(false);

interface AccommodationUploadRow {
  accomId: number;
  accomCode: string;
  dbType: 1 | 2 | 3;
}

type AccommodationBatchStore = {
  excelBatchUpload?: (data: AccommodationUploadRow[], callback: () => void | Promise<void>) => Promise<unknown>;
  goodsUpload?: (
      params: { accomIdList: Array<string | number> },
      callback: () => void | Promise<void>,
      type: 1 | 2,
      dbType: number
  ) => Promise<unknown>;
};

// 추후 숙박 전용 Store/API 분리 시 이 두 메서드만 구현하면 된다.
const batchStore = store as unknown as AccommodationBatchStore;
const EXCEL_DB_TYPE_HEADER = '구분(1:기존데이터삭제후등록, 2:기존데이터유지후추가, 3:숙소코드매칭)';
const selectedUploadRunning = ref(false);

const openExcelUpload = () => {
  if (excelUploading.value) return;
  if (excelFileInput.value) excelFileInput.value.value = '';
  excelFileInput.value?.click();
};

const excelTemplateDownload = () => {
  const rows = [
    ['일련번호', '숙소코드', EXCEL_DB_TYPE_HEADER],
    [10001, '', 1],
    [10002, '', 2],
    [10003, 'ACCOM00003', 3],
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet['!cols'] = [{ wch: 18 }, { wch: 24 }, { wch: 65 }];
  worksheet['!autofilter'] = { ref: `A1:C${rows.length}` };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, '숙박데이터_일괄등록');
  XLSX.writeFile(workbook, '숙박데이터_일괄등록_양식.xlsx');
};

const excelUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file || excelUploading.value) return;

  excelUploading.value = true;
  try {
    const workbook = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    if (!worksheet) throw new Error('엑셀 시트를 찾을 수 없습니다.');

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
      raw: false,
      defval: '',
    });
    const data: AccommodationUploadRow[] = rows
        .filter((row) =>
            ['일련번호', '숙소코드', EXCEL_DB_TYPE_HEADER].some((key) =>
                String(row[key] ?? '').trim() !== ''
            )
        )
        .map((row, index) => {
          const excelRow = index + 2;
          const idValue = String(row['일련번호'] ?? '').trim();
          const accomId = Number(idValue);
          const accomCode = String(row['숙소코드'] ?? '').trim();
          const dbTypeValue = String(row[EXCEL_DB_TYPE_HEADER] ?? '').trim();
          const dbType = Number(dbTypeValue);

          if (!/^\d+$/.test(idValue) || !Number.isSafeInteger(accomId) || accomId <= 0) {
            throw new Error(`${excelRow}행의 일련번호가 올바르지 않습니다.`);
          }
          if (![1, 2, 3].includes(dbType)) {
            throw new Error(`${excelRow}행의 구분은 1, 2, 3 중 하나여야 합니다.`);
          }
          if (dbType === 3 && !accomCode) {
            throw new Error(`${excelRow}행은 숙소코드 매칭이므로 숙소코드가 필요합니다.`);
          }
          return { accomId, accomCode, dbType: dbType as 1 | 2 | 3 };
        });

    if (!data.length) throw new Error('등록할 데이터가 없습니다.');
    const ids = new Set(data.map((row) => row.accomId));
    if (ids.size !== data.length) throw new Error('중복된 일련번호가 있습니다.');

    if (!batchStore.excelBatchUpload) {
      window.$emitter.emit('warning', '숙박 일괄등록 API 연결 전입니다. 양식 확인과 검증까지만 가능합니다.');
      return;
    }

    window.$emitter.emit('confirm', {
      message: `숙박 데이터 ${data.length}건을 일괄 처리하시겠습니까?`,
      callback: async () => {
        try {
          await batchStore.excelBatchUpload!(data, async () => {
            window.$emitter.emit('success', `총 ${data.length}건의 숙박 데이터 처리가 완료되었습니다.`);
            await search();
          });
        } catch (error) {
          console.error('숙박 일괄등록 API 오류:', error);
          window.$emitter.emit('warning', '숙박 일괄등록 처리 중 오류가 발생했습니다.');
        }
      },
    });
  } catch (error: any) {
    console.error('숙박 데이터 업로드 오류:', error);
    window.$emitter.emit('warning', error?.message || '엑셀 파일을 확인해주세요.');
  } finally {
    excelUploading.value = false;
    input.value = '';
  }
};

const goodsUpload = async (type: 1 | 2) => {
  if (selectedUploadRunning.value) return;
  if (!checkedItems.value.length) {
    window.$emitter.emit('warning', '숙박업소를 한 개 이상 선택해주세요.');
    return;
  }
  const selected = store.items.filter((item: any) => checkedItems.value.includes(item.accomId));
  if (selected.some((item: any) => !String(item.accomCode ?? '').trim())) {
    window.$emitter.emit('warning', '숙소코드가 없는 숙박업소가 존재합니다.');
    return;
  }
  if (!batchStore.goodsUpload) {
    window.$emitter.emit('warning', '숙박 데이터 업로드 API 연결 전입니다.');
    return;
  }

  selectedUploadRunning.value = true;
  try {
    await batchStore.goodsUpload(
        { accomIdList: [...checkedItems.value] },
        async () => {
          window.$emitter.emit('success', '선택한 숙박 데이터 업로드 요청이 완료되었습니다.');
          await search();
        },
        type,
        1
    );
  } catch (error) {
    console.error('숙박 선택 업로드 오류:', error);
    window.$emitter.emit('warning', '숙박 데이터 업로드 요청 중 오류가 발생했습니다.');
  } finally {
    selectedUploadRunning.value = false;
  }
};

const allChecked = ref(false);
const checkedItems = ref<Array<string | number>>([]);

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

const excelDownloading = ref(false);

const excelDownload = async () => {
  if (excelDownloading.value) return;

  // 현재 검색 결과의 화면 페이지에 표시된 데이터만 다운로드한다.
  // searchParams.page/size를 변경하거나 목록 API를 재호출하지 않는다.
  const currentItems = [...(store.items ?? [])];

  if (currentItems.length === 0) {
    window.$emitter.emit('warning', '다운로드할 데이터가 없습니다.');
    return;
  }

  excelDownloading.value = true;

  try {
    const excelData = currentItems.map((item: any, index: number) => ({
      '번호': rowNumber(index),
      '숙박업소 앱 등록상호': item.accomName ?? '',
      '플랫폼 타입': getAppName(item.appType),
      '숙소유형': getAccomTypeName(item.accomType),
      '주소': item.accomAddr ?? '',
      '객실 수': item.roomCnt ?? 0,
      '수집일': formatExcelDate(item.putDate),
      'DB등록상태': convertDataStatus(item.dataStatus),
      'DB 수정일': formatExcelDate(item.modDate),
      '숙소코드': item.accomCode ?? '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet['!cols'] = [
      { wch: 8 },
      { wch: 35 },
      { wch: 15 },
      { wch: 18 },
      { wch: 50 },
      { wch: 12 },
      { wch: 18 },
      { wch: 15 },
      { wch: 18 },
      { wch: 20 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '숙박업소 목록');

    const now = new Date();
    const fileDate = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('');
    const fileTime = [
      String(now.getHours()).padStart(2, '0'),
      String(now.getMinutes()).padStart(2, '0'),
    ].join('');

    XLSX.writeFile(workbook, `숙박업소_조회내역_${fileDate}_${fileTime}.xlsx`);
  } catch (error) {
    console.error('엑셀 다운로드 오류:', error);
    window.$emitter.emit('warning', '엑셀 다운로드 중 오류가 발생했습니다.');
  } finally {
    excelDownloading.value = false;
  }
};

const formatExcelDate = (value: string | null | undefined) => {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return `${yyyy}-${MM}-${dd}`;
};
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
  /*  loading.value = true;
    try {
      await store.callRegionList();
      await store.callListAPI();
    } finally {
      loading.value = false;
    }*/
});

const toggleAll = () => {
  if (allChecked.value) {
    checkedItems.value = store.items.map((item: any) => item.accomId);
  } else {
    checkedItems.value = [];
  }
};

const toggleItem = (accomId: string | number) => {
  const index = checkedItems.value.indexOf(accomId);

  if (index > -1) {
    checkedItems.value.splice(index, 1);
  } else {
    checkedItems.value.push(accomId);
  }

  allChecked.value =
      store.items.length > 0 &&
      checkedItems.value.length === store.items.length;
};

const rowNumber = (index: number) => {
  return (Number(store.currentPage) - 1) * Number(store.searchParams.size) + index + 1;
};

// 삭제
const deleteCode = async () => {
  if (checkedItems.value.length === 0) {
    window.$emitter.emit(
        'warning',
        '삭제할 숙박업소를 최소 1개 이상 선택해주세요.'
    );
    return;
  }

  window.$emitter.emit('confirm', {
    message: `선택한 숙박업소 ${checkedItems.value.length}건을 삭제하시겠습니까?`,
    callback: async () => {
      /*
       * 숙박 삭제 API
       * Store의 deleteCodeAPI가 숙박 삭제 API라면 accomIdList로 전달.
       * 실제 Store 메서드명이 다르면 이 한 줄의 메서드명만 맞춰주면 됨.
       */
      await store.deleteCodeAPI(
          { accomIdList: [...checkedItems.value] },
          async () => {
            allChecked.value = false;
            checkedItems.value = [];
            await search();
          }
      );
    },
  });
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
  if (loading.value) return;
  allChecked.value = false;
  checkedItems.value = [];
  loading.value = true;
  try {
    store.searchParams.page = 1;
    await store.callListAPI();
  } finally {
    loading.value = false;
  }
};

const movePage = async (page: number) => {
  if (loading.value || page < 1 || page > store.totalPages) return;

  allChecked.value = false;
  checkedItems.value = [];
  loading.value = true;
  try {
    store.searchParams.page = page;
    await store.callListAPI();
  } finally {
    loading.value = false;
  }
};

// 숙소코드 수정 알림은 관리자 공통 알림을 사용합니다.
// vue3-toastify의 기본 SVG 아이콘이 공통 CSS와 충돌해 크게 보이는 문제를 방지합니다.
const updateStCode = async (accomId: number, accomCode: string) => {
  try {
    await store.updateAccomAPI(
        { accomId, accomCode },
        () => {
          window.$emitter.emit('success', `숙소코드가 수정되었습니다. (${accomCode || '-'})`);
          void search();
        }
    );
  } catch (error) {
    console.error('숙소코드 수정 오류:', error);
    window.$emitter.emit('warning', '숙소코드 수정 중 오류가 발생했습니다.');
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

.search-filter-wrap .form-select, .search-filter-wrap .form-control {
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
  .search-filter-row-top, .search-filter-row-bottom {
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
  .search-filter-row-top, .search-filter-row-bottom {
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

/* 숙박업소 목록 조회 프로그레스 및 로딩 오버레이 */
.accommodation-list-card {
  position: relative;
  min-height: 180px;
}

.list-progress-track {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  overflow: hidden;
  background: rgba(52, 143, 226, 0.13);
  z-index: 11;
}

.list-progress-indicator {
  width: 38%;
  height: 100%;
  background: #348fe2;
  border-radius: 999px;
  animation: accommodation-progress 1.35s ease-in-out infinite;
}

@keyframes accommodation-progress {
  from {
    transform: translateX(-110%);
  }
  to {
    transform: translateX(290%);
  }
}

.list-loading-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: blur(1px);
}

.list-loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  color: #344054;
  font-size: 14px;
}

.list-loading-spinner {
  color: #348fe2;
  font-size: 30px;
  margin-bottom: 3px;
}

.list-loading-content span {
  color: #667085;
  font-size: 12px;
}

:global(html.dark-mode) .list-loading-overlay {
  background: rgba(22, 27, 34, 0.88);
}

:global(html.dark-mode) .list-loading-content {
  color: #e5e7eb;
}

/* 음식점 목록과 동일한 상단 액션 그룹 */
.accom-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.accom-toolbar-left, .accom-toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.accom-toolbar-right {
  justify-content: flex-end;
}

.segment-group {
  display: inline-flex;
  align-items: stretch;
  overflow: hidden;
  border: 1px solid #d8dde5;
  border-radius: 8px;
  background: #f1f3f6;
}

.segment-button {
  height: 33px;
  padding: 0 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-right: 1px solid #d0d5dd;
  background: #f1f3f6;
  color: #292d32;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
}

.segment-button:last-child {
  border-right: 0;
}

.segment-button:hover:not(:disabled) {
  background: #e0e4ea;
}

.segment-button:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.platform-url-list {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  align-items: center;
}

.platform-url {
  display: inline-flex;
  align-items: center;
  padding: 3px 7px;
  border: 1px solid #d8dde5;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  background: #f5f7fa;
  color: #475467;
}

.platform-url.yanolja {
  color: #d83c68;
  background: #fff2f5;
  border-color: #f5c8d5;
}

.platform-url.yeogi {
  color: #d74747;
  background: #fff3f1;
  border-color: #f3c9c5;
}

.platform-url.trip {
  color: #2873b9;
  background: #eff7ff;
  border-color: #c9dff7;
}

.platform-url.agoda {
  color: #574caf;
  background: #f4f2ff;
  border-color: #dcd7fa;
}

:global(html.dark-mode) .segment-group, :global(html.dark-mode) .segment-button {
  background: #30353c;
  border-color: #474e57;
  color: #e2e8f0;
}

:global(html.dark-mode) .platform-url {
  background: #30353c;
  color: #e2e8f0;
  border-color: #505863;
}

@media(max-width:767px) {
  .accom-toolbar-right {
    justify-content: flex-start;
  }
  .accom-toolbar {
    align-items: flex-start;
  }
}
</style>

```
