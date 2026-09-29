<template>
  <panel>
    <panel-body>
      <!-- 검색 및 필터 영역 -->
      <div class="row gx-2 pb-30px">
        <!-- 날짜 -->
        <div class="col-lg-3 d-lg-block d-none">
          <div class="d-flex align-items-center rounded-3 p-0">
            <VueDatePicker
                v-model="store.searchParams.startDate"
                format="yyyy-MM-dd"
                :auto-apply="true"
                :enable-time-picker="false"
                :max-date="today"
                placeholder="DB생성기간 (시작일)"
            />

            <span class="ms-1 me-1">~</span>

            <VueDatePicker
                v-model="store.searchParams.endDate"
                format="yyyy-MM-dd"
                :auto-apply="true"
                :enable-time-picker="false"
                :min-date="minSearchEndDate"
                :max-date="maxSearchEndDate"
                placeholder="DB생성기간 (종료일)"
            />
          </div>
        </div>

        <SelectLabel
            size="col-lg-1"
            icon="far fa-lg fa-map"
            v-model="store.searchParams.sidoCode"
            :options="store.sidoList"
        />

        <SelectLabel
            size="col-lg-2"
            icon="far fa-lg fa-map"
            v-model="store.searchParams.sigunCode"
            :options="filteredSigunList"
            :disabled="!store.searchParams.sidoCode"
        />

        <SelectLabel
            size="col-lg-1"
            icon="fas fa-lg fa-fw fa-mobile-screen-button"
            v-model="store.searchParams.appType"
            :options="[
            { label: '주문앱', value: '' },
            { label: '배민', value: '1' },
            { label: '쿠팡', value: '2' },
            { label: '요기요', value: '3' },
          ]"
        />

        <SelectLabel
            size="col-lg-1"
            icon="fas fa-lg fa-fw fa-database"
            v-model="store.searchParams.dataStatus"
            :options="[
            { label: 'DB등록여부', value: '' },
            { label: '미등록', value: '1' },
            { label: '등록완료', value: '2' },
            { label: '진행중', value: '3' },
            { label: '등록실패', value: '4' },
          ]"
        />

        <div class="col-lg-1" style="width: 40px"></div>

        <!-- 검색 -->
        <div class="col-lg-3 d-flex justify-content-end" style="width: 30%">
          <div class="input-group">
            <select
                class="form-select"
                v-model="store.searchParams.searchType"
            >
              <option value="">전체</option>
              <option value="bizName">사업자상호</option>
              <option value="bizNum">사업자번호</option>
              <option value="stName">등록상호</option>
              <option value="stCode">가맹점코드</option>
            </select>

            <div class="btn btn-white d-flex align-items-center w-75 p-0">
              <i class="fa-lg fa-fw fa fa-search ms-2 me-2 text-opacity-50"></i>

              <div class="input-group">
                <input
                    type="text"
                    class="form-control bg-light border-0"
                    v-model="store.searchParams.keyword"
                    placeholder="검색어를 입력해주세요."
                    @keypress.enter="search"
                />

                <button
                    type="button"
                    class="btn btn-sm btn-white border-0"
                    :disabled="searching"
                    @click="search"
                >
                  <i
                      class="fa fa-fw ms-n1"
                      :class="searching ? 'fa-spinner fa-spin' : 'fa-search'"
                  ></i>
                  {{ searching ? '검색중' : '검색' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 상단 -->
      <div class="d-flex justify-content-between align-items-center">
        <!-- 왼쪽 -->
        <div class="d-flex align-items-center">
          <button
              type="button"
              class="btn btn-danger btn-sm me-2"
              @click="deleteCode"
          >
            <i class="fa fa-cancel fa-fw me-1"></i>
            삭제
          </button>

          <div class="fw-bold text-secondary">
            전체
            <span class="text-primary">
              {{ (store.items?.length ?? 0).toLocaleString() }}
            </span>
            건
          </div>
        </div>

        <!-- 오른쪽 -->
        <div class="d-flex align-items-center action-area">
          <!-- 상품정보만 등록 -->
          <div class="only-goods-box">
            <div class="form-check form-switch mb-0">
              <input
                  class="form-check-input"
                  type="checkbox"
                  id="onlyGoods"
                  v-model="store.selectOnlyGoods"
              />

              <label class="form-check-label" for="onlyGoods">
                상품정보만 등록
              </label>
            </div>
          </div>
          <div class="segment-group me-2 ">
            <button
                type="button"
                class="segment-button"
                :disabled="excelDownloading"
                @click="excelDownload"
            >
              <i
                  class="fa fa-fw me-1"
                  :class="excelDownloading ? 'fa-spinner fa-spin' : 'fa-file-excel'"
              ></i>
              {{ excelDownloading ? '생성중' : '조회내역 엑셀 다운로드' }}
            </button>

          </div>
          <!-- 엑셀 그룹 -->
          <div class="segment-group me-2">
            <button
                type="button"
                class="segment-button"
                :disabled="excelUploading"
                @click="openExcelUpload"
            >
              <i
                  class="fa fa-fw me-1"
                  :class="excelUploading ? 'fa-spinner fa-spin' : 'fa-upload'"
              ></i>
              {{ excelUploading ? '등록중' : '가맹점코드 일괄등록' }}
            </button>


            <button
                type="button"
                class="segment-button"
                @click="excelTemplateDownload"
            >
              <i class="fa fa-file-arrow-down fa-fw me-1"></i>
              양식 다운로드
            </button>
          </div>

          <!-- 상품 업로드 그룹 -->
          <div class="segment-group me-2">
            <button
                type="button"
                class="segment-button"
                @click="goodsUpload(1)"
            >
              <i class="fa fa-rotate fa-fw me-1"></i>
              기존상품삭제후 신규업로드
            </button>

            <button
                type="button"
                class="segment-button"
                @click="goodsUpload(2)"
            >
              <i class="fa fa-plus fa-fw me-1"></i>
              기존상품유지후 추가
            </button>
          </div>

          <!-- 업로드 내역 -->
          <button
              type="button"
              class="btn btn-outline-secondary btn-sm upload-history-btn"
              @click="openModal"
          >
            <i class="fa fa-list fa-fw me-1"></i>
            업로드 내역
          </button>
        </div>

        <input
            ref="excelFileInput"
            type="file"
            accept=".xlsx,.xls"
            style="display: none"
            @change="excelUpload"
        />
      </div>

      <hr />

      <!-- 테이블 -->
      <div class="card border-0">
        <div class="table-responsive mb-3">
          <table
              class="table table-hover table-panel text-nowrap align-middle mb-0"
              style="min-width: 1400px; overflow-x: auto"
          >
            <thead>
            <tr>
              <th>
                <div class="form-check">
                  <input
                      type="checkbox"
                      class="form-check-input"
                      id="allCheck"
                      v-model="allChecked"
                      @change="toggleAll"
                  />

                  <label
                      class="form-check-label"
                      for="allCheck"
                  ></label>
                </div>
              </th>

              <th>일련번호</th>
              <th>음식점 앱 등록상호</th>
              <th>음식점 사업자번호</th>
              <th>사업자 상호</th>
              <th>주문앱</th>
              <th>주소</th>
              <th>상품수</th>
              <th>수집일</th>
              <th>DB등록상태</th>
              <th width="120px">DB 등록일</th>
              <th width="120px">가맹점코드</th>
            </tr>
            </thead>

            <tbody>
            <tr
                v-for="item in paginatedData"
                :key="item.grStNo"
                @click="goToDetail(item.grStNo)"
                style="cursor: pointer"
            >
              <td
                  class="w-10px align-middle"
                  @click.stop="toggleItem(item.grStNo, item.stCode)"
              >
                <div class="form-check">
                  <input
                      type="checkbox"
                      class="form-check-input"
                      :id="'product' + item.grStNo"
                      :value="item.grStNo"
                      :checked="checkedItems.includes(item.grStNo)"
                  />

                  <label
                      class="form-check-label"
                      :for="'product' + item.grStNo"
                  ></label>
                </div>
              </td>

              <td>{{ item.grStNo }}</td>
              <td>{{ item.stName }}</td>
              <td>{{ item.bizNum }}</td>
              <td>{{ item.bizName }}</td>

              <td>
                  <span
                      class="badge border px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"
                      :class="[
                      { 'border-success text-success': item.appType === '1' },
                      { 'border-danger text-danger': item.appType === '2' },
                      { 'border-warning text-warning': item.appType === '3' },
                    ]"
                  >
                    <i class="fa fa-circle fs-9px fa-fw me-5px"></i>
                    {{ getAppName(item.appType) }}
                  </span>
              </td>

              <td>{{ item.stAddr }}</td>
              <td>{{ item.goodsCnt }} 개</td>
              <td>{{ item.putDate }}</td>

              <td>
                  <span :class="dbResultFont(item.dataStatus)">
                    {{ convertDataStatus(item.dataStatus) }}
                  </span>
              </td>

              <td>{{ item.modDate }}</td>

              <td
                  style="min-width: 150px; max-width: 150px"
                  @click.stop
              >
                <div class="input-group" style="width: 150px">
                  <input
                      type="text"
                      class="form-control bg-light border-0"
                      v-model="item.stCode"
                      placeholder="가맹점코드"
                      style="width: 60px"
                  />

                  <button
                      type="button"
                      class="btn btn-sm btn-white"
                      @click.stop="updateStCode(item.grStNo, item.stCode)"
                  >
                    <i class="fa fa-fw fa-plus"></i>
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
            :total="store.items?.length ?? 0"
            :perPage="itemsPerPage"
        />
      </div>
    </panel-body>
  </panel>

  <UploadHistoryList
      :visible="modalVisible"
      @close="modalVisible = false"
  />
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import * as XLSX from 'xlsx';

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import 'vue3-toastify/dist/index.css';

import { useRestaurantStore } from '@/stores/restaurant/useRestaurantStore';
import SelectLabel from '@/components/common/SelectLabel.vue';
import Pagenation from '@/components/common/Pagenation.vue';
import UploadHistoryList from '@/views/restaurant/components/uploadHistoryList.vue';

const store = useRestaurantStore();
const router = useRouter();

const modalVisible = ref(false);

const allChecked = ref(false);
const checkedItems = ref<Array<string | number>>([]);
const checkStcodeItems = ref<string[]>([]);

const currentPage = ref(1);
const itemsPerPage = 13;

const excelFileInput = ref<HTMLInputElement | null>(null);

const excelUploading = ref(false);
const excelDownloading = ref(false);
const searching = ref(false);

/**
 * 최대 조회기간
 */
const MAX_SEARCH_MONTHS = 3;

const today = new Date();
today.setHours(0, 0, 0, 0);

const options = {
  onOpen: () => console.log('opened'),
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
};

/**
 * =========================================================
 * 날짜
 * =========================================================
 */

const toDate = (value: any): Date | null => {
  if (!value) return null;

  const date =
      value instanceof Date
          ? new Date(value)
          : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(0, 0, 0, 0);

  return date;
};

/**
 * 월 증가 시 31일 문제 방지
 *
 * 예:
 * 1/31 + 3개월
 * -> 4/30
 */
const addMonthsClamped = (
    source: Date,
    months: number
) => {
  const date = new Date(source);

  const originalDay = date.getDate();

  date.setDate(1);
  date.setMonth(date.getMonth() + months);

  const lastDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
  ).getDate();

  date.setDate(
      Math.min(originalDay, lastDay)
  );

  date.setHours(0, 0, 0, 0);

  return date;
};

/**
 * 종료일 최소
 */
const minSearchEndDate = computed(() => {
  return (
      toDate(store.searchParams.startDate) ||
      undefined
  );
});

/**
 * 종료일 최대
 *
 * 시작일 + 3개월과
 * 오늘 중 더 빠른 날짜
 */
const maxSearchEndDate = computed(() => {
  const startDate =
      toDate(store.searchParams.startDate);

  if (!startDate) {
    return today;
  }

  const maxByRange =
      addMonthsClamped(
          startDate,
          MAX_SEARCH_MONTHS
      );

  return maxByRange < today
      ? maxByRange
      : today;
});

/**
 * 시작일 선택 시
 * 종료일 자동 지정
 *
 * 시작일이 최근 3개월 안이면 오늘
 * 그보다 과거면 시작일 + 3개월
 */
const setAutoEndDate = () => {
  const startDate =
      toDate(store.searchParams.startDate);

  if (!startDate) {
    return;
  }

  const maxByRange =
      addMonthsClamped(
          startDate,
          MAX_SEARCH_MONTHS
      );

  store.searchParams.endDate =
      maxByRange < today
          ? maxByRange
          : new Date(today);
};

/**
 * 조회기간 검증
 */
const validateSearchDate = () => {
  const startDate =
      toDate(store.searchParams.startDate);

  const endDate =
      toDate(store.searchParams.endDate);

  if (!startDate || !endDate) {
    window.$emitter.emit(
        'warning',
        '조회기간을 시작일과 종료일 모두 선택해주세요.'
    );

    return false;
  }

  if (startDate > today) {
    window.$emitter.emit(
        'warning',
        '시작일은 오늘 이후로 선택할 수 없습니다.'
    );

    return false;
  }

  if (endDate > today) {
    window.$emitter.emit(
        'warning',
        '종료일은 오늘 이후로 선택할 수 없습니다.'
    );

    return false;
  }

  if (startDate > endDate) {
    window.$emitter.emit(
        'warning',
        '시작일은 종료일보다 늦을 수 없습니다.'
    );

    return false;
  }

  const maxDate =
      addMonthsClamped(
          startDate,
          MAX_SEARCH_MONTHS
      );

  if (endDate > maxDate) {
    window.$emitter.emit(
        'warning',
        '조회기간은 최대 3개월까지 가능합니다.'
    );

    return false;
  }

  return true;
};

/**
 * 시작일 변경
 *
 * API 검색은 하지 않고
 * 종료일만 자동 설정
 */
watch(
    () => store.searchParams.startDate,
    (newValue, oldValue) => {
      if (!newValue) {
        return;
      }

      const newDate = toDate(newValue);
      const oldDate = toDate(oldValue);

      /**
       * DatePicker 내부 갱신 등으로
       * 같은 날짜가 다시 들어오는 경우 방지
       */
      if (
          newDate &&
          oldDate &&
          newDate.getTime() === oldDate.getTime()
      ) {
        return;
      }

      setAutoEndDate();
    }
);

/**
 * 종료일 직접 변경 시에도
 * 범위를 넘는 값이면 최대값으로 보정
 */
watch(
    () => store.searchParams.endDate,
    (newValue) => {
      const startDate =
          toDate(store.searchParams.startDate);

      const endDate =
          toDate(newValue);

      if (!startDate || !endDate) {
        return;
      }

      const maxDate =
          maxSearchEndDate.value;

      if (!maxDate) {
        return;
      }

      if (endDate > maxDate) {
        store.searchParams.endDate =
            new Date(maxDate);

        window.$emitter.emit(
            'warning',
            '조회기간은 최대 3개월까지 가능합니다.'
        );
      }

      if (endDate < startDate) {
        store.searchParams.endDate =
            new Date(startDate);
      }
    }
);

/**
 * =========================================================
 * 검색
 * =========================================================
 */

const search = async () => {
  if (searching.value) {
    return;
  }

  if (!validateSearchDate()) {
    return;
  }

  searching.value = true;

  try {
    await store.callListAPI(() => {});
  } catch (error) {
    console.error(
        '검색 오류:',
        error
    );

    window.$emitter.emit(
        'warning',
        '검색 중 오류가 발생했습니다.'
    );
  } finally {
    searching.value = false;
  }
};
/**
 * =========================================================
 * Excel 업로드
 * =========================================================
 */

interface StCodeUploadItem {
  grStNo: number;
  stCode: string;
  dbType: number;
}

const EXCEL_DB_TYPE_HEADER =
    'DB등록여부(1:등록, 2:미등록, 3:가맹점코드등록)';

const openExcelUpload = () => {
  if (excelUploading.value) {
    return;
  }

  if (excelFileInput.value) {
    excelFileInput.value.value = '';
  }

  excelFileInput.value?.click();
};

const excelUpload = async (
    event: Event
) => {
  const input =
      event.target as HTMLInputElement;

  const file =
      input.files?.[0];

  if (!file) {
    return;
  }

  excelUploading.value = true;

  try {
    /**
     * =====================================================
     * Excel 읽기
     * =====================================================
     */

    const arrayBuffer =
        await file.arrayBuffer();

    const workbook =
        XLSX.read(
            arrayBuffer,
            {
              type: 'array',
            }
        );

    const sheetName =
        workbook.SheetNames[0];

    if (!sheetName) {
      throw new Error(
          '엑셀 시트를 찾을 수 없습니다.'
      );
    }

    const worksheet =
        workbook.Sheets[sheetName];

    const rows =
        XLSX.utils.sheet_to_json<any>(
            worksheet,
            {
              raw: false,
              defval: '',
            }
        );

    if (rows.length === 0) {
      throw new Error(
          '엑셀에 등록할 데이터가 없습니다.'
      );
    }

    /**
     * =====================================================
     * 데이터 변환
     * =====================================================
     */

    const data: StCodeUploadItem[] =
        rows
            .filter((row: any) => {
              const grStNo =
                  String(
                      row['일련번호'] ?? ''
                  ).trim();

              const stCode =
                  String(
                      row['가맹점코드'] ?? ''
                  ).trim();

              const dbType =
                  String(
                      row[EXCEL_DB_TYPE_HEADER] ?? ''
                  ).trim();

              /**
               * 완전히 빈 행 제거
               */
              return (
                  grStNo !== '' ||
                  stCode !== '' ||
                  dbType !== ''
              );
            })
            .map(
                (
                    row: any,
                    index: number
                ) => {
                  const rowNumber =
                      index + 2;

                  const grStNoValue =
                      String(
                          row['일련번호'] ?? ''
                      ).trim();

                  const stCode =
                      String(
                          row['가맹점코드'] ?? ''
                      ).trim();

                  const dbTypeValue =
                      String(
                          row[EXCEL_DB_TYPE_HEADER] ?? ''
                      ).trim();

                  /**
                   * 일련번호 체크
                   */
                  if (!grStNoValue) {
                    throw new Error(
                        `${rowNumber}행의 일련번호가 없습니다.`
                    );
                  }

                  const grStNo =
                      Number(grStNoValue);

                  if (
                      Number.isNaN(grStNo)
                  ) {
                    throw new Error(
                        `${rowNumber}행의 일련번호 형식이 올바르지 않습니다.`
                    );
                  }

                  /**
                   * DB등록여부 체크
                   */
                  if (!dbTypeValue) {
                    throw new Error(
                        `${rowNumber}행의 DB등록여부가 없습니다.`
                    );
                  }

                  const dbType =
                      Number(dbTypeValue);

                  if (
                      ![1, 2, 3].includes(
                          dbType
                      )
                  ) {
                    throw new Error(
                        `${rowNumber}행의 DB등록여부는 1, 2, 3 중 하나여야 합니다.`
                    );
                  }

                  /**
                   * 3번
                   * 가맹점코드 등록일 때만
                   * stCode 필수
                   */
                  if (
                      dbType === 3 &&
                      !stCode
                  ) {
                    throw new Error(
                        `${rowNumber}행의 가맹점코드가 없습니다.`
                    );
                  }

                  return {
                    grStNo,
                    stCode,
                    dbType,
                  };
                }
            );

    if (
        data.length === 0
    ) {
      throw new Error(
          '처리할 데이터가 없습니다.'
      );
    }

    /**
     * =====================================================
     * 중복 일련번호 확인
     * =====================================================
     */

    const duplicateCheck =
        new Set<number>();

    for (
        const item of data
        ) {
      if (
          duplicateCheck.has(
              item.grStNo
          )
      ) {
        throw new Error(
            `중복된 일련번호가 있습니다. (${item.grStNo})`
        );
      }

      duplicateCheck.add(
          item.grStNo
      );
    }

    console.log(
        '===== 엑셀 원본 처리 데이터 =====',
        data
    );

    /**
     * =====================================================
     * Store에서 분기 처리
     * =====================================================
     */

    await store.excelBatchUpload(
        data,
        async () => {
          window.$emitter.emit(
              'success',
              `총 ${data.length}건의 엑셀 데이터 처리가 완료되었습니다.`
          );

          await search();
        }
    );

  } catch (error: any) {
    console.error(
        '엑셀 업로드 오류:',
        error
    );

    window.$emitter.emit(
        'warning',
        error?.message ||
        '엑셀 처리 중 오류가 발생했습니다.'
    );

  } finally {
    excelUploading.value =
        false;

    if (
        excelFileInput.value
    ) {
      excelFileInput.value.value =
          '';
    }
  }
};

/**
 * =========================================================
 * 일괄등록 양식 다운로드
 * =========================================================
 */

const excelTemplateDownload = () => {
  const rows = [
    [
      '일련번호',
      '가맹점코드',
      EXCEL_DB_TYPE_HEADER,
    ],

    /**
     * 샘플
     */
    [10001, '', 1],
    [10002, '', 2],
    [10003, 'ST00003', 3],
  ];

  const worksheet =
      XLSX.utils.aoa_to_sheet(
          rows
      );

  worksheet['!cols'] = [
    {
      wch: 18,
    },
    {
      wch: 22,
    },
    {
      wch: 45,
    },
  ];

  worksheet['!autofilter'] = {
    ref:
        `A1:C${rows.length}`,
  };

  const workbook =
      XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      '가맹점코드_일괄등록'
  );

  XLSX.writeFile(
      workbook,
      '가맹점코드_일괄등록_양식.xlsx'
  );
};

/**
 * =========================================================
 * 기존 데이터 Excel 다운로드
 * =========================================================
 */

const excelDownload = async () => {
  if (excelDownloading.value) {
    return;
  }

  if (!store.items?.length) {
    window.$emitter.emit(
        'warning',
        '다운로드할 데이터가 없습니다.'
    );

    return;
  }

  excelDownloading.value = true;

  try {
    await nextTick();

    await new Promise(
        (resolve) =>
            setTimeout(
                resolve,
                20
            )
    );

    const headers = [
      '총판코드(5)(필수)',
      '배송그룹코드(4)',
      '가맹점명(15)(필수)',
      '앱표시명 (사업자명으로 등록)(15)',
      '로그인ID(20)(필수)',
      '비밀번호(50)(필수)',
      '인증용휴대전화(11)(필수)',
      '주소 (실제주소) (필수)',
      '상세주소',
      '가상계좌은행코드(생략)',
      '사업자번호(12)(필수)',
      '사업장명(필수)',
      '대표자명(13)(필수)',
      '사업장주소 (사업자등록증상)(필수)',
      '계산서용이메일(필수)',
      '업태',
      '업종',
      '대표자생년월일(6)(필수)',
      '가맹점전화번호(필수)',
      '마스터가맹점코드(7)',
      '가맹점코드',
      '처리상태',
      '처리메시지',
      'DUA 상점일련번호',
    ];

    const usedBizNums = new Set<string>();

    const getRandomAlpha = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

      return Array.from(
          { length: 2 },
          () => chars[
              Math.floor(
                  Math.random() * chars.length
              )
              ]
      ).join('');
    };

    const rows =
        store.items.map(
            (item: any) => {
              const bizNum =
                  String(
                      item.bizNum ?? ''
                  ).trim();

              let exportBizNum = '';

              if (bizNum) {
                let retryCount = 0;

                do {
                  const randomSuffix =
                      getRandomAlpha();

                  exportBizNum =
                      `${bizNum}${randomSuffix}`;

                  retryCount++;
                } while (
                    usedBizNums.has(exportBizNum) &&
                    retryCount < 100
                    );

                usedBizNums.add(exportBizNum);
              }

              return [
                '',
                '',
                item.stName ?? '',
                item.bizName ?? '',

                // 로그인 ID
                exportBizNum
                    ? `on${exportBizNum}`
                    : '',

                '0000',
                '01011112222',
                item.stAddr ?? '',
                '',
                '',

                // 사업자번호
                item.bizNum,

                item.bizName ?? '',
                '',
                item.stAddr ?? '',
                'a@naver.com',
                '',
                '',
                '123456',
                '123456',
                '',
                String(item.stCode ?? ''),
                '',
                '',
                String(item.grStNo ?? ''),
              ];
            }
        );

    const worksheet =
        XLSX.utils.aoa_to_sheet([
          headers,
          ...rows,
        ]);

    worksheet['!cols'] = [
      { wch: 18 },
      { wch: 18 },
      { wch: 25 },
      { wch: 32 },
      { wch: 25 },
      { wch: 18 },
      { wch: 23 },
      { wch: 45 },
      { wch: 30 },
      { wch: 25 },
      { wch: 22 },
      { wch: 25 },
      { wch: 20 },
      { wch: 45 },
      { wch: 30 },
      { wch: 18 },
      { wch: 18 },
      { wch: 25 },
      { wch: 22 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 35 },
      { wch: 22 },
    ];

    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        '상점일괄등록'
    );

    const now =
        new Date();

    const fileDate = [
      now.getFullYear(),
      String(
          now.getMonth() + 1
      ).padStart(2, '0'),
      String(
          now.getDate()
      ).padStart(2, '0'),
    ].join('');

    const fileTime = [
      String(
          now.getHours()
      ).padStart(2, '0'),
      String(
          now.getMinutes()
      ).padStart(2, '0'),
    ].join('');

    XLSX.writeFile(
        workbook,
        `상점일괄등록_${fileDate}_${fileTime}.xlsx`
    );

  } catch (error) {
    console.error(
        '엑셀 다운로드 오류:',
        error
    );

    window.$emitter.emit(
        'warning',
        '엑셀 다운로드 중 오류가 발생했습니다.'
    );

  } finally {
    excelDownloading.value =
        false;
  }
};

/**
 * =========================================================
 * 체크
 * =========================================================
 */

function toggleAll() {
  const pageItems =
      paginatedData.value;

  if (allChecked.value) {
    checkedItems.value =
        pageItems.map(
            (item: any) =>
                item.grStNo
        );

    checkStcodeItems.value =
        pageItems.map(
            (item: any) =>
                item.stCode
                    ? item.stCode
                    : '-1'
        );

  } else {
    checkedItems.value = [];
    checkStcodeItems.value = [];
  }
}

function toggleItem(
    grStNo: string | number,
    stCode: string
) {
  const index =
      checkedItems.value.indexOf(
          grStNo
      );

  if (index > -1) {
    checkedItems.value.splice(
        index,
        1
    );

    checkStcodeItems.value.splice(
        index,
        1
    );

  } else {
    checkedItems.value.push(
        grStNo
    );

    checkStcodeItems.value.push(
        stCode || '-1'
    );
  }

  allChecked.value =
      paginatedData.value.length > 0 &&
      checkedItems.value.length ===
      paginatedData.value.length;
}

/**
 * 업로드 내역
 */
const openModal = async () => {
  await store.callUploadHistory();

  modalVisible.value = true;
};

/**
 * 주문앱
 */
const getAppName = (
    appType: string | number
) => {
  if (String(appType) === '1') {
    return '배민';
  }

  if (String(appType) === '2') {
    return '쿠팡';
  }

  if (String(appType) === '3') {
    return '요기요';
  }

  return '';
};

/**
 * 페이지
 */
const paginatedData =
    computed(() => {
      const arr =
          store.items || [];

      const start =
          (currentPage.value - 1) *
          itemsPerPage;

      return arr.slice(
          start,
          start + itemsPerPage
      );
    });

/**
 * 지역
 */
const filteredSigunList =
    computed(() => {
      const sido =
          store.searchParams.sidoCode;

      const allOption = {
        label: '시/군/구',
        value: '',
      };

      if (!sido) {
        return [
          allOption,
          ...store.sigunList,
        ];
      }

      const list =
          store.sigunList.filter(
              (item: any) =>
                  String(
                      item.sigunCode
                  ).startsWith(
                      String(sido)
                  )
          );

      return [
        allOption,
        ...list,
      ];
    });

watch(
    currentPage,
    () => {
      allChecked.value = false;
      checkedItems.value = [];
      checkStcodeItems.value = [];
    }
);

watch(
    () => store.items?.length,
    () => {
      currentPage.value = 1;

      allChecked.value = false;
      checkedItems.value = [];
      checkStcodeItems.value = [];
    }
);

watch(
    () =>
        store.searchParams.sidoCode,
    () => {
      store.searchParams.sigunCode =
          '';
    }
);

/**
 * 기존상품삭제후 신규
 */
const goodsUpload = async (type) => {
  if (
      checkedItems.value.length === 0
  ) {
    window.$emitter.emit(
        'warning',
        '가맹점을 한개 이상 선택해주세요.'
    );

    return;
  }

  if (
      checkStcodeItems.value.includes(
          '-1'
      )
  ) {
    window.$emitter.emit(
        'warning',
        '가맹점 코드가 없는 음식점이 존재합니다.'
    );

    return;
  }

  await store.goodsUpload(
      {
        grStNoList:
        checkedItems.value,
      },
      () => {
        search();
      }, type, 1
  );
};

/**
 * 기존상품유지후 추가
 */
/*const usageUpload = async () => {
  if (
      checkedItems.value.length === 0
  ) {
    window.$emitter.emit(
        'warning',
        '가맹점을 한개 이상 선택해주세요.'
    );

    return;
  }

  if (
      checkStcodeItems.value.includes(
          '-1'
      )
  ) {
    window.$emitter.emit(
        'warning',
        '가맹점 코드가 없는 음식점이 존재합니다.'
    );

    return;
  }

  await store.usageUpload(
      {
        grStNoList:
        checkedItems.value,
      },
      () => {
        search();
      },2
  );
};*/

/**
 * 단건 수정
 */
const updateStCode = async (
    grStNo: number,
    stCode: string
) => {
  try {
    await store.updateStCodeAPI(
        {
          grStNo,
          stCode,
        },
        () => {
          toast.success(
              '<div class="d-flex space-between flex-start">' +
              '<h5>수정에 성공하였습니다.</h5>' +
              '</div>' +
              '<hr class="mt-0 mb-2" />' +
              '<strong>변경된 가맹점 코드: ' +
              stCode +
              '</strong>',
              options
          );

          search();
        }
    );

  } catch (error) {
    console.error(error);

    toast.error(
        '<div class="d-flex space-between flex-start">' +
        '<h5>수정에 실패하였습니다.</h5>' +
        '</div>',
        options
    );
  }
};

/**
 * 삭제
 */
const deleteCode = async () => {
  if (
      checkedItems.value.length === 0
  ) {
    window.$emitter.emit(
        'warning',
        '삭제할 가맹점을 최소 1개 이상 선택해주세요.'
    );

    return;
  }

  await store.deleteCodeAPI(
      {
        grStNoList:
        checkedItems.value,
      },
      () => {
        search();
      }
  );
};

/**
 * 상세
 */
function goToDetail(
    grStNo: string | number
) {
  router.push({
    name: 'RestaurantMenu',
    params: {
      id: grStNo,
    },
  });
}

/**
 * 상태
 */
const convertDataStatus = (
    val: string | number
) => {
  switch (String(val)) {
    case '1':
      return '미등록';

    case '2':
      return '등록완료';

    case '3':
      return '진행중';

    case '4':
      return '등록실패';

    default:
      return '';
  }
};

const dbResultFont = (
    val: string | number
) => {
  switch (String(val)) {
    case '1':
      return '';

    case '2':
      return 'text-bold';

    case '3':
      return 'text-info';

    case '4':
      return 'text-danger';

    default:
      return '';
  }
};
</script>

<style scoped>
.input-group .btn {
  z-index: unset;
}

.text-bold {
  font-weight: bold;
}

/* ============================= */
/* 오른쪽 액션 영역 */
/* ============================= */

.action-area {
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0;
}

/* 상품정보만 등록 */
.only-goods-box {
  height: 33px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  margin-right: 8px;
  border: 1px solid #d9dde3;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  white-space: nowrap;
}

/* ============================= */
/* 스크린샷 스타일 세그먼트 버튼 */
/* ============================= */

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

  transition:
      background-color 0.15s ease,
      color 0.15s ease;
}

.segment-button:last-child {
  border-right: 0;
}

.segment-button:hover:not(:disabled) {
  background: #e0e4ea;
}

.segment-button:active:not(:disabled) {
  background: #cdd3dc;
}

.segment-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 업로드 내역 */
.upload-history-btn {
  height: 33px;
  border-radius: 8px;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 600;
}

/* 모바일/좁은 화면 */
@media (max-width: 1400px) {
  .action-area {
    row-gap: 8px;
  }

  .segment-button {
    padding-left: 10px;
    padding-right: 10px;
  }
}
</style>
