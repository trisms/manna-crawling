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
            <div class="col-md-12" >
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" @change="systemImgCateList('NM')" value="NM" id="NM" v-model="store.selectSyCode" name="inlineRadio" data-gtm-form-interact-field-id="4">
                <label class="form-check-label" for="NM">일반</label>
              </div>
              <div class="form-check form-check-inline">
                <input class="form-check-input" type="radio" @change="systemImgCateList('FR')" value="FR" id="FR" v-model="store.selectSyCode" name="inlineRadio" data-gtm-form-interact-field-id="6">
                <label class="form-check-label" for="FR">프랜차이즈</label>
              </div>
            </div>
          </div>
          <SelectLabel
              size="col-lg-2"
              icon="fas fa-lg fa-fw me-10px fa-box "
              v-model="store.systemFrImgCodeParam.syCode"
              :options="store.selectFrList"
              v-if="store.selectSyCode === 'FR'"
          />
          <SelectLabel
              size="col-lg-2"
              icon="fas fa-lg fa-fw me-10px fa-box "
              v-model="store.systemImgCodeParam.syCode"
              :options="store.parentDtCodeList"
              v-if="store.selectSyCode === 'NM'"
          />
          <SelectLabel
              size="col-lg-2"
              icon="fas fa-lg fa-fw me-10px fa-box"
              v-model="store.systemImgCodeParam.dtCode"
              :options="store.dtCodeList"
              :disabled="!store.systemImgCodeParam.syCode"
              v-if="store.selectSyCode === 'NM'"
          />
          <div class="col-1"></div>
          <!-- 입력 검색 -->
          <SelectLabel
              size="col-lg-1"
              icon="fas fa-lg fa-fw fa-database"
              v-model="store.searchParams.findType"
              :options="[
                { label: '상품명', value: '1' },
              ]"
          />
          <!-- 검색어 -->
          <div class="col-auto flex-grow-1">
            <input
                type="text"
                v-model="store.systemImgSearchParams.findVal"
                class="form-control"
                placeholder="검색어 입력"
            />
          </div>

          <!-- 검색버튼 -->
          <div class="col-auto">
            <button class="btn btn-primary w-100" @click="search">
              <i class="fa fa-search"></i> 검색
            </button>
          </div>

        </div>
      </div>
      <!-- IMAGE LIST -->
      <div class="image-grid">
        <div
            class="image-card"
            v-for="(img,index) in store.systemImgList"
            :key="index"
            @click="select(img)"
        >
          <img :src="img.imgTFile || noImg" />
          <div class="img-title">{{ img.goodsName }}</div>
        </div>
      </div>

      <!-- PAGINATION -->
     <div class="pagination-box">
       <ul class="pagination mb-0 justify-content-center">
         <li class="page-item" @click="goPage(1)" :disabled="page===1" ><a  class="page-link" href="javascript:void(0)"><<</a></li>
         <li  class="page-item"  @click="goPage(page-1)" :disabled="page===1" ><a  class="page-link" href="javascript:void(0)"><</a></li>
         <li  class="page-item active"
              v-for="p in pages"
              :key="p"
              :class="p===page ? 'btn-primary' : 'btn-light'"
              @click="goPage(p)"
         ><a  class="page-link" href="javascript:void(0)"> {{ p }}</a></li>
         <li  class="page-item" @click="goPage(page+1)" :disabled="page===totalPage"><a  class="page-link" href="javascript:void(0)">></a></li>
         <li  class="page-item" @click="goPage(totalPage)" :disabled="page===totalPage"><a  class="page-link" href="javascript:void(0)">>></a></li>
       </ul>
<!--        <button
            class="btn"
            v-for="p in pages"
            :key="p"
            :class="p===page ? 'btn-primary' : 'btn-light'"
            @click="goPage(p)"
        >
          {{ p }}
        </button>-->

      </div>


      <!-- FOOTER -->
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="close">닫기</button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, computed, onMounted} from "vue";
import noImg from '@/assets/img/noimg.gif';
import {useRestaurantStore} from "@/stores/restaurant/useRestaurantStore";
import SelectLabel from "@/components/common/SelectLabel.vue";
import {isEmpty} from "@/utils/ValidateUtils";
const emit = defineEmits(["close", "select"]);
const store = useRestaurantStore();
const currentPage = ref(1);
const itemsPerPage = 10;
// 외부에서 받아야 할 수도 있는 값들
const props = defineProps({
  api: Function, // API 콜백
});

onMounted(()=> {
  search();
  systemImgCateList('NM');
})

const systemImgCateList= async (type: string) => {
    await store.callSystemImgCateList(type);
}

const systemImgList= async () => {
  await store.callSystemImgList();
}

// 데이터 목록
const page = ref(1);
const totalPage = ref(1);
const pageSize = 30;


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
  const arr = store.systemImgList || []        // store.items가 proxy면 자체가 배열임
  const start = (currentPage.value - 1) * itemsPerPage
  return arr.slice(start, start + itemsPerPage)
})

watch(() => store.systemImgCodeParam.syCode,async ()=> {
  await store.callSystemImgCateList('G2');
});
watch(() => store.systemImgCodeParam.dtCode, ()=> {
  console.log(store.systemImgCodeParam.dtCode)
});

const filteredGoodsCategoryList = computed(() => {
  const parentDtCode = store.systemImgSearchParams.parentDtCode;
  if (!parentDtCode) return store.parentDtCodeList;

  return store.dtCodeList;
});

function search() {
  page.value = 1;
  systemImgList();
/*  systemImgCateList();*/
  /*loadList();*/
}

function select(img: any) {
  emit("select", img);
}

function close() {
  emit("close");
}

function goPage(p: number) {
  if (p < 1 || p > totalPage.value) return;
  page.value = p;
}


// 최초 로드
/*loadList();*/
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex; justify-content: center; align-items: center;
  z-index: 9999;
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
}

.image-card {
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  text-align: center;
  background: white;
  transition: 0.2s;
}

.image-card:hover {
  border-color: #0d6efd;
  box-shadow: 0 3px 20px rgba(0,0,0,0.1);
}

.image-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.img-title {
  margin-top: 8px;
  font-size: 14px;
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
</style>
