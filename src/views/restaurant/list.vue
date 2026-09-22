<template>
  <panel>
    <panel-body>
      <!-- 검색 및 필터 영역 -->
      <div class="row gx-2 pb-30px">
        <div class="col-lg-3 d-lg-block d-none">
          <a href="#" class="btn d-flex align-items-center rounded-3 p-0">
            <VueDatePicker
                v-model="store.searchParams.startDate"
                format="yyyy-MM-dd"
                :auto-apply="true"
                :enable-time-picker="false"
                placeholder="DB생성기간 (시작일)"
            />

            <span class="ms-1 me-1">~</span>

            <VueDatePicker
                v-model="store.searchParams.endDate"
                format="yyyy-MM-dd"
                :auto-apply="true"
                :enable-time-picker="false"
                placeholder="DB생성기간 (종료일)"
            />
          </a>
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

        <div class="col-lg-3 d-flex justify-content-end" style="width: 30%">
          <div class="input-group">
            <select class="form-select" v-model="store.searchParams.searchType">
              <option value="">전체</option>
              <option value="bizName">사업자상호</option>
              <option value="bizNum">사업자번호</option>
              <option value="stName">등록상호</option>
              <option value="stCode">가맹점코드</option>
            </select>

            <a
                href="#"
                class="btn btn-white d-flex align-items-center w-75 p-0"
                aria-expanded="false"
            >
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
                    @click="search"
                >
                  <i class="fa fa-fw fa-search ms-n1"></i>
                  검색
                </button>
              </div>
            </a>
          </div>
        </div>
      </div>

      <!-- 상단 버튼 영역 -->
      <div class="d-flex justify-content-between align-items-center">
        <!-- 왼쪽 -->
        <div class="d-flex align-items-center">
          <div class="card border-0" @click="deleteCode()">
            <div class="d-md-flex fw-bold ms-auto">
              <div class="mt-md-0 mt-2 btn btn-danger btn-sm d-flex me-2 pe-3 rounded-3">
                <div class="text-white text-decoration-none rounded">
                  <i class="fa fa-cancel fa-fw me-1 text-white"></i>
                  삭제
                </div>
              </div>
            </div>
          </div>

          <div class="me-3 fw-bold text-secondary">
            전체
            <span class="text-primary">
              {{ (store.items?.length ?? 0).toLocaleString() }}
            </span>
            건
          </div>
        </div>

        <!-- 오른쪽 -->
        <div class="card border-0">
          <div class="d-md-flex fw-bold ms-auto">
            <div
                class="d-flex p-1 pe-3 ps-2 me-2 rounded-3 border"
                style="align-items: flex-end"
            >
              <div class="form-check form-switch">
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

            <!-- 가맹점코드 엑셀 일괄등록 -->
            <div
                class="mt-md-0 mt-2 btn btn-primary btn-sm d-flex me-2 pe-3 rounded-3"
                :class="{ disabled: excelUploading }"
                @click="openExcelUpload"
            >
              <div class="text-white text-decoration-none">
                <i
                    class="fa fa-fw me-1"
                    :class="excelUploading ? 'fa-spinner fa-spin' : 'fa-file-excel'"
                ></i>

                {{ excelUploading ? '등록중...' : '가맹점코드 일괄등록' }}
              </div>
            </div>

            <!-- 업로드용 파일 선택 -->
            <input
                ref="excelFileInput"
                type="file"
                accept=".xlsx,.xls"
                style="display: none"
                @change="excelUpload"
            />

            <!-- 상점일괄등록 양식 다운로드 -->
            <div
                class="mt-md-0 mt-2 btn btn-success btn-sm d-flex me-2 pe-3 rounded-3"
                :class="{ disabled: excelDownloading }"
                @click="excelDownload"
            >
              <div class="text-white text-decoration-none">
                <i
                    class="fa fa-fw me-1"
                    :class="excelDownloading ? 'fa-spinner fa-spin' : 'fa-file-excel'"
                ></i>

                {{ excelDownloading ? '엑셀 생성중...' : '엑셀 다운로드' }}
              </div>
            </div>

            <div
                class="mt-md-0 mt-2 btn btn-secondary btn-sm d-flex me-2 pe-3 rounded-3"
                @click="rebaseUplode()"
            >
              <div class="text-white text-decoration-none rounded">
                <i class="fa fa-upload fa-fw me-1 text-white"></i>
                기존상품삭제후 신규업로드
              </div>
            </div>

            <div
                class="mt-md-0 mt-2 btn btn-secondary btn-sm d-flex me-2 pe-3 rounded-3"
                @click="usageUpload()"
            >
              <div class="text-white text-decoration-none">
                <i class="fa fa-upload fa-fw me-1"></i>
                기존상품유지후 추가업로드
              </div>
            </div>

            <div
                class="mt-md-0 mt-2 btn btn-secondary btn-sm d-flex me-2 pe-3 rounded-3"
                @click="openModal()"
            >
              <div class="text-white text-decoration-none">
                <i class="fa fa-list fa-fw me-1"></i>
                업로드 내역
              </div>
            </div>
          </div>
        </div>
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
                  <label class="form-check-label" for="allCheck"></label>
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
import { computed, ref, watch } from 'vue';
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
 * ==============================
 * 엑셀 업로드
 * 일련번호 + 가맹점코드
 * ==============================
 */

interface StCodeUploadItem {
  grStNo: number;
  stCode: string;
}

const openExcelUpload = () => {
  if (excelUploading.value) return;

  if (excelFileInput.value) {
    excelFileInput.value.value = '';
  }

  excelFileInput.value?.click();
};

const excelUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  excelUploading.value = true;

  try {
    const arrayBuffer = await file.arrayBuffer();

    const workbook = XLSX.read(arrayBuffer, {
      type: 'array',
    });

    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      throw new Error('엑셀 시트를 찾을 수 없습니다.');
    }

    const worksheet = workbook.Sheets[sheetName];

    /**
     * 업로드 Excel 형식
     *
     * 일련번호 | 가맹점코드
     * 10001   | ST00001
     * 10002   | ST00002
     */
    const rows = XLSX.utils.sheet_to_json<any>(worksheet, {
      raw: false,
      defval: '',
    });

    if (rows.length === 0) {
      throw new Error('엑셀에 등록할 데이터가 없습니다.');
    }

    const data: StCodeUploadItem[] = rows
        .filter((row: any) => {
          const grStNo = String(row['일련번호'] ?? '').trim();
          const stCode = String(row['가맹점코드'] ?? '').trim();

          return grStNo !== '' || stCode !== '';
        })
        .map((row: any, index: number) => {
          const grStNoValue = String(row['일련번호'] ?? '').trim();
          const stCode = String(row['가맹점코드'] ?? '').trim();

          const rowNumber = index + 2;

          if (!grStNoValue) {
            throw new Error(`${rowNumber}행의 일련번호가 없습니다.`);
          }

          if (!stCode) {
            throw new Error(`${rowNumber}행의 가맹점코드가 없습니다.`);
          }

          const grStNo = Number(grStNoValue);

          if (Number.isNaN(grStNo)) {
            throw new Error(
                `${rowNumber}행의 일련번호 형식이 올바르지 않습니다.`
            );
          }

          return {
            grStNo,
            stCode,
          };
        });

    if (data.length === 0) {
      throw new Error('등록할 가맹점코드가 없습니다.');
    }

    /**
     * 동일 일련번호 중복 체크
     */
    const duplicateCheck = new Set<number>();

    for (const item of data) {
      if (duplicateCheck.has(item.grStNo)) {
        throw new Error(
            `중복된 일련번호가 있습니다. (${item.grStNo})`
        );
      }

      duplicateCheck.add(item.grStNo);
    }

    /**
     * 최종 API Request
     *
     * {
     *   "data": [
     *     {
     *       "grStNo": 10001,
     *       "stCode": "ST00001"
     *     }
     *   ]
     * }
     */
    const params = {
      data,
    };

    console.log(
        '가맹점코드 일괄등록 Request:',
        JSON.stringify(params, null, 2)
    );

    await store.updateStCodeBatchAPI(
        params,
        async () => {
          window.$emitter.emit(
              'success',
              `${data.length}건의 가맹점코드가 등록되었습니다.`
          );

          await search();
        }
    );
  } catch (error: any) {
    console.error('가맹점코드 엑셀 업로드 오류:', error);

    window.$emitter.emit(
        'warning',
        error?.message || '엑셀 처리 중 오류가 발생했습니다.'
    );
  } finally {
    excelUploading.value = false;

    if (excelFileInput.value) {
      excelFileInput.value.value = '';
    }
  }
};

/**
 * ==============================
 * 체크박스
 * ==============================
 */

function toggleAll() {
  const pageItems = paginatedData.value;

  if (allChecked.value) {
    checkedItems.value = pageItems.map((item: any) => item.grStNo);

    checkStcodeItems.value = pageItems.map((item: any) =>
        item.stCode ? item.stCode : '-1'
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
  const index = checkedItems.value.indexOf(grStNo);

  if (index > -1) {
    checkedItems.value.splice(index, 1);
    checkStcodeItems.value.splice(index, 1);
  } else {
    checkedItems.value.push(grStNo);
    checkStcodeItems.value.push(stCode || '-1');
  }

  allChecked.value =
      paginatedData.value.length > 0 &&
      checkedItems.value.length === paginatedData.value.length;
}

/**
 * ==============================
 * 업로드 히스토리
 * ==============================
 */

const openModal = async () => {
  await store.callUploadHistory();
  modalVisible.value = true;
};

/**
 * ==============================
 * 주문앱
 * ==============================
 */

const getAppName = (appType: string | number) => {
  if (String(appType) === '1') return '배민';
  if (String(appType) === '2') return '쿠팡';
  if (String(appType) === '3') return '요기요';

  return '';
};

/**
 * ==============================
 * 페이지
 * ==============================
 */

const paginatedData = computed(() => {
  const arr = store.items || [];
  const start = (currentPage.value - 1) * itemsPerPage;

  return arr.slice(start, start + itemsPerPage);
});

/**
 * ==============================
 * 시/군/구
 * ==============================
 */

const filteredSigunList = computed(() => {
  const sido = store.searchParams.sidoCode;

  const allOption = {
    label: '시/군/구',
    value: '',
  };

  if (!sido) {
    return [allOption, ...store.sigunList];
  }

  const list = store.sigunList.filter((item: any) =>
      String(item.sigunCode).startsWith(String(sido))
  );

  return [allOption, ...list];
});

/**
 * ==============================
 * Watch
 * ==============================
 */

watch(currentPage, () => {
  allChecked.value = false;
  checkedItems.value = [];
  checkStcodeItems.value = [];
});

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
    () => store.searchParams.sidoCode,
    () => {
      store.searchParams.sigunCode = '';
    }
);

watch(
    () => store.searchParams.startDate,
    () => {
      search();
    }
);

watch(
    () => store.searchParams.endDate,
    () => {
      search();
    }
);

/**
 * ==============================
 * 검색
 * ==============================
 */

const search = async () => {
  await store.callListAPI(() => {});
};

/**
 * ==============================
 * 기존상품삭제후 신규업로드
 * ==============================
 */

const rebaseUplode = async () => {
  if (checkedItems.value.length === 0) {
    window.$emitter.emit(
        'warning',
        '가맹점을 한개 이상 선택해주세요.'
    );
    return;
  }

  if (checkStcodeItems.value.includes('-1')) {
    window.$emitter.emit(
        'warning',
        '가맹점 코드가 없는 음식점이 존재합니다.'
    );
    return;
  }

  await store.rebaseUpload(
      {
        grStNoList: checkedItems.value,
      },
      () => {
        search();
      }
  );
};

/**
 * ==============================
 * 기존상품유지후 추가업로드
 * ==============================
 */

const usageUpload = async () => {
  if (checkedItems.value.length === 0) {
    window.$emitter.emit(
        'warning',
        '가맹점을 한개 이상 선택해주세요.'
    );
    return;
  }

  if (checkStcodeItems.value.includes('-1')) {
    window.$emitter.emit(
        'warning',
        '가맹점 코드가 없는 음식점이 존재합니다.'
    );
    return;
  }

  await store.usageUpload(
      {
        grStNoList: checkedItems.value,
      },
      () => {
        search();
      }
  );
};

/**
 * ==============================
 * 가맹점코드 단건 수정
 * ==============================
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
 * ==============================
 * 삭제
 * ==============================
 */

const deleteCode = async () => {
  if (checkedItems.value.length === 0) {
    window.$emitter.emit(
        'warning',
        '삭제할 가맹점을 최소 1개 이상 선택해주세요.'
    );
    return;
  }

  await store.deleteCodeAPI(
      {
        grStNoList: checkedItems.value,
      },
      () => {
        search();
      }
  );
};

/**
 * ==============================
 * 상세
 * ==============================
 */

function goToDetail(grStNo: string | number) {
  router.push({
    name: 'RestaurantMenu',
    params: {
      id: grStNo,
    },
  });
}

/**
 * ==============================
 * 엑셀 다운로드
 *
 * 상점일괄등록 Excel 양식
 * ==============================
 */
const excelDownload = () => {
  if (!store.items || store.items.length === 0) {
    window.$emitter.emit(
        'warning',
        '다운로드할 데이터가 없습니다.'
    );
    return;
  }

  /**
   * 실제 상점일괄등록 Excel 양식 컬럼
   */
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

  /**
   * 목록 데이터를 상점일괄등록 양식으로 변환
   */
  const rows = store.items.map((item: any) => {
    const bizNum = String(item.bizNum ?? '').trim();

    return [
      '',                          // 총판코드
      '',                          // 배송그룹코드
      item.stName ?? '',           // 가맹점명
      item.bizName ?? '',          // 앱표시명
      bizNum ? `on${bizNum}` : '', // 로그인ID
      '0000',                      // 비밀번호
      '01011112222',               // 인증용휴대전화
      item.stAddr ?? '',           // 실제 주소
      '',                          // 상세주소
      '',                          // 가상계좌은행코드
      bizNum,                      // 사업자번호
      item.bizName ?? '',          // 사업장명
      '',                          // 대표자명
      item.stAddr ?? '',           // 사업장주소
      'a@naver.com',               // 계산서용이메일
      '',                          // 업태
      '',                          // 업종
      '123456',                    // 대표자생년월일
      '123456',                    // 가맹점전화번호
      '',                          // 마스터가맹점코드
      String(item.stCode ?? ''),   // 가맹점코드
      '',                          // 처리상태
      '',                          // 처리메시지
      String(item.grStNo ?? ''),   // DUA 상점일련번호
    ];
  });

  /**
   * 엑셀 생성
   */
  const worksheet = XLSX.utils.aoa_to_sheet([
    headers,
    ...rows,
  ]);

  /**
   * 컬럼 너비
   */
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

  /**
   * 코드/전화번호/사업자번호 등이
   * Excel에서 숫자로 변형되지 않게 문자열 처리
   */
/*  for (let rowIndex = 1; rowIndex <= rows.length; rowIndex++) {
    [
      0, 1, 4, 5, 6, 9, 10,
      17, 18, 19, 20, 23,
    ].forEach((columnIndex) => {
      const cell = XLSX.utils.encode_cell({
        r: rowIndex,
        c: columnIndex,
      });

      if (worksheet[cell]) {
        worksheet[cell].t = 's';
      }
    });
  }*/

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      '상점일괄등록'
  );

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

  XLSX.writeFile(
      workbook,
      `상점일괄등록_${fileDate}_${fileTime}.xlsx`
  );
};

/**
 * ==============================
 * DB 상태
 * ==============================
 */

const convertDataStatus = (val: string | number) => {
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

const dbResultFont = (val: string | number) => {
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
  font-weight: bold;
}

.btn.disabled {
  pointer-events: none;
  opacity: 0.65;
}
</style>
