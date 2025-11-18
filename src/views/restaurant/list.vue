<template>
  <panel>
    <panel-body>
      <!-- 검색 및 필터 영역 -->
      <div class="row gx-2 pb-30px">
        <div class="col-lg-3 d-lg-block d-none ">
          <a href="#" class="btn  d-flex align-items-center rounded-3 p-0">
            <VueDatePicker v-model="store.searchParams.startDate" format="yyyy-MM-dd" :auto-apply="true"   :enable-time-picker="false" placeholder="DB생성기간 (시작일)" />
            <span class="ms-2">~</span>
            <VueDatePicker v-model="store.searchParams.endDate" format="yyyy-MM-dd" :auto-apply="true"   :enable-time-picker="false"placeholder="DB생성기간 (종료일)" />
          </a>
        </div>

        <SelectLabel
            size="col-lg-1"
            icon="far fa-lg fa-map "
            v-model="store.searchParams.sidoCode"
            :options="store.sidoList"
        />
          <SelectLabel
              size="col-lg-2"
              icon="far fa-lg fa-map "
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
                { label: '쿠팡', value: '2' }
              ]"
          />
          <SelectLabel
              size="col-lg-1"
              icon="fas fa-lg fa-fw fa-database"
              v-model="store.searchParams.dataStatus"
              :options="[
                { label: 'DB등록여부', value: '' },
                { label: '미등록', value: '1' },
                { label: '등록', value: '2' }
              ]"
          />
        <div class="col-lg-1"></div>
        <div class="col-lg-3 d-flex ">
          <div class=" input-group">
            <select class="form-select w-25" v-model="store.searchParams.searchType">
              <option value="">전체</option>
              <option value="bizName">사업자상호</option>
              <option value="bizNum">사업자번호</option>
              <option value="stName">등록상호</option>
            </select>
            <a href="#" class="btn btn-white d-flex align-items-center w-75  p-0" aria-expanded="false">
              <i class=" fa-lg fa-fw me-10px fa fa-search me-10px ms-2  text-opacity-50"></i>
              <div class="input-group">
                <input type="text" class="form-control  bg-light  border-0"  v-model="store.searchParams.keyword" placeholder="검색어를 입력해주세요." />
                <button type="button" class="btn btn-sm btn-white  border-0" 	@click="search"><i class="fa fa-fw fa-search ms-n1"></i> 검색</button>
              </div>
            </a>
          </div>
        </div>
        <!-- 중략 (기존 필터 버튼/검색창 부분 그대로 유지) -->

      </div>

      <div class="d-flex justify-content-between">
        <div class="card border-0">
          <div class=" d-md-flex fw-bold ms-auto">
            <div class="mt-md-0 mt-2 btn btn-danger btn-sm d-flex me-2 pe-3 rounded-3"><div  class="text-white text-decoration-none rounded " @click="deleteCode()"><i class="fa fa-cancel fa-fw me-1 text-white"></i> 삭제</div></div>
          </div>
        </div>
        <div class="card border-0">
          <div class=" d-md-flex fw-bold ms-auto">
            <div class="mt-md-0 mt-2 btn btn-secondary btn-sm d-flex me-2 pe-3 rounded-3"><div  class="text-white text-decoration-none rounded " @click="rebaseUplode()"><i class="fa fa-upload fa-fw me-1 text-white"></i> 기존상품삭제후 신규업로드</div></div>
            <div class="mt-md-0 mt-2 btn btn-secondary btn-sm d-flex me-2 pe-3 rounded-3"><div  class="text-white text-decoration-none" @click="usageUpload()"><i class="fa fa-upload fa-fw me-1 "></i> 기존상품유지후 추가업로드</div></div>
          </div>
        </div>
      </div>
      <!-- 업로드 버튼 -->


      <hr />
      <!-- 테이블 -->
      <div class="card border-0">
        <div class="table-responsive mb-3">
          <table class="table table-hover table-panel text-nowrap align-middle mb-0">
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
              <th>음식점 코드 </th>
              <th>음식점 상호</th>
              <th>음식점 사업자번호</th>
              <th>음식점 앱 등록상호</th>
              <th>주문앱</th>
              <th>주소</th>
              <th>상품수</th>
              <th>등록일</th>
              <th>DB 생성일</th>
              <th>가맹점코드</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in store.items" :key="item.grStNo"  @click="goToDetail(item.grStNo)">
              <td class="w-10px align-middle"  @click.stop="toggleItem(item.grStNo)">
                <div class="form-check">
                  <input
                      type="checkbox"
                      class="form-check-input"
                      :id="'product' + item.grStNo"
                      :value="item.grStNo"
                      :checked="checkedItems.includes(item.grStNo)"
                  />
                  <label class="form-check-label" :for="'product' + item.grStNo"></label>
                </div>
              </td>
              <td>{{ item.grStNo }}</td>
              <td>{{ item.stName }}</td>
              <td>{{ item.bizNum }}</td>
              <td>{{ item.bizName }}</td>
              <td>
                  <span
                      class="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"
                  >
                    <i class="fa fa-circle fs-9px fa-fw me-5px"></i> {{ getAppName(item.appType) }}
                  </span>
              </td>
              <td>{{ item.stAddr }}</td>
              <td>{{ item.goodsCnt }} 개</td>
              <td>{{ item.putDate }}</td>
              <td>{{ item.modDate }}</td>
              <td >
                <div class="input-group">
                  <input type="text" @click.stop class="form-control  bg-light  border-0 w-80px"  v-model="item.stCode" placeholder="가맹점코드를 입력해주세요" />
                  <button type="button" @click.stop="updateStCode(item.grStNo,item.stCode )" class="btn btn-sm btn-white  " ><i class="fa fa-fw fa-plus "></i> 수정</button>
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
</template>

<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import {useRestaurantStore} from "@/stores/restaurant/useRestaurantStore";
import SelectLabel from "@/components/common/SelectLabel.vue";
import Pagenation from "@/components/common/Pagenation.vue";
import 'vue3-toastify/dist/index.css';
/*import { Toast } from 'bootstrap';*/
import { toast } from 'vue3-toastify';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import {useRouter} from "vue-router";
const date = ref<Date | null>(null);
const store = useRestaurantStore();
const list = ref([]);
const router = useRouter();

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
}

const allChecked = ref(false);
// 모든 체크박스 상태
const checkedItems = ref<string[]>([]); // grStNo를 기준으로 체크 상태 관리
// allCheck 클릭 시 토글
function toggleAll() {
  if (allChecked.value) {
    // 전체 체크
    checkedItems.value = store.items.map(item => item.grStNo);
  } else {
    // 전체 해제
    checkedItems.value = [];
  }
}
// 개별 체크박스 클릭 시 checkedItems 업데이트
function toggleItem(grStNo: string) {
  const index = checkedItems.value.indexOf(grStNo);
  if (index > -1) {
    checkedItems.value.splice(index, 1);
  } else {
    checkedItems.value.push(grStNo);
  }

  // allChecked 상태 자동 반영
  allChecked.value = checkedItems.value.length === store.items.length;
}



const currentPage = ref(1)
const itemsPerPage = 10
const getAppName = (appType: string | number) => {
  if (appType === '1' || appType === 1) return '배민';
  if (appType === '2' || appType === 2) return '쿠팡';
  return '';
};

// ✅ 페이지 계산
const paginatedData = computed(() => {
  const arr = store.items || []        // store.items가 proxy면 자체가 배열임
  const start = (currentPage.value - 1) * itemsPerPage
  return arr.slice(start, start + itemsPerPage)
})

const filteredSigunList = computed(() => {
  const sido = store.searchParams.sidoCode;

  // 시도가 선택 안되면 전체 시군구 반환
  if (!sido) return store.sigunList;

  return store.sigunList.filter(item =>
      String(item.sigunCode).startsWith(String(sido))
  );
});

watch(() => store.searchParams.sidoCode, () => {
  store.searchParams.sigunCode = "";
});


watch(() => filteredSigunList.value, () => {
  console.log(filteredSigunList.value)
});


// ✅ 검색 적용
function applySearch() {
  currentPage.value = 1
}

const search = async () => {
  await store.callListAPI(() => {
  });
};


//기존상품유지후 추가업로드
const rebaseUplode = () => {

}

//기존상품삭제후 신규업로드
const usageUpload = () => {

}

const updateStCode =  async (grStNo: number , stCode: string) => {
  try {

   await store.updateStCodeAPI({grStNo : grStNo,stCode : stCode},() => {
    toast.success(
        '<div class="d-flex space-between flex-start">' +
        ' <h5>수정에 성공하였습니다.</h5>' +
        ' <h4 ></h4>' +
        '</div>' +
        '<hr class="mt-0 mb-2" /><strong> 변경된 가맹점 코드: '+stCode+'</strong> ',
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

const deleteCode = async () => {
  await store.deleteCodeAPI({grStNoList : checkedItems.value},() => {
    search();
  })
}

function goToDetail(grStNo: string | number) {
  router.push({ name: 'RestaurantMenu', params: { id: grStNo } });
}
</script>

<style scoped>
.input-group .btn {
  z-index: unset;
}
</style>
