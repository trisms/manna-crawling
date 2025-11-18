
<template>
	<!-- BEGIN breadcrumb -->
<!--	<ol class="breadcrumb float-xl-end">
		<li class="breadcrumb-item"><a href="javascript:;">Home</a></li>
		<li class="breadcrumb-item"><a href="javascript:;">Library</a></li>
		<li class="breadcrumb-item active">Data</li>
	</ol>
	&lt;!&ndash; END breadcrumb &ndash;&gt;
	&lt;!&ndash; BEGIN page-header &ndash;&gt;
	<h1 class="page-header">음식점<small></small></h1>
	&lt;!&ndash; END page-header &ndash;&gt;-->

	<!-- BEGIN panel -->
<!--  <div class="list-group list-group-flush fw-bold">
    <div class="list-group-item d-flex align-items-center">
      <div class="flex-fill">
        <div>Name</div>
        <div class="text-body text-opacity-60">Sean Ngu</div>
      </div>
      <div class="w-100px">
        <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Edit</a>
      </div>
    </div>
    <div class="list-group-item d-flex align-items-center">
      <div class="flex-fill">
        <div>Username</div>
        <div class="text-body text-opacity-60">@seantheme</div>
      </div>
      <div>
        <a href="#modalEdit" data-bs-toggle="modal" class="btn btn-secondary w-100px">Edit</a>
      </div>
    </div>
  </div>-->

	<panel>
<!--		<panel-header>
			<panel-title>


      </panel-title>
			<panel-toolbar />
		</panel-header>-->

		<panel-body>

      <div class="card border-0">
        <div class="note  mb-0 border">
          <div class="note-content ">
            <h4> <i class="fa fa-info-circle fa-fw"></i> <b>가맹점 정보</b> - ( {{ store.form.stName }} ) </h4>
            <table class="table table-condensed p-0 bg-none mb-0">
              <tbody>
              <!-- 📌 기본정보 -->
              <tr>
                <td nowrap="" class="w-50">
                  <div class="d-flex align-items-center">
                    <div class="bg-indigo-200 w-15px h-15px rounded me-2"></div>
                    <div><b>가맹점번호</b> : {{ store.form.grStNo }}</div>
                  </div>
                </td>
                <td nowrap="" class="w-50">
                  <div class="d-flex align-items-center">
                    <div class="bg-indigo-100 w-15px h-15px rounded me-2"></div>
                    <div><b>가입경로</b> : {{ getAppName(store.form.appType) }}</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td nowrap="">
                  <div class="d-flex align-items-center">
                    <div class="bg-indigo-200 w-15px h-15px rounded me-2"></div>
                    <div><b>가맹점코드</b> : {{ store.form.stCode }}</div>
                  </div>
                </td>
                <td nowrap="">
                  <div class="d-flex align-items-center">
                    <div class="bg-indigo-100 w-15px h-15px rounded me-2"></div>
                    <div><b>생성일</b> : {{ store.form.putDate }}</div>
                  </div>
                </td>
              </tr>

              <!-- 📌 사업자 정보 -->
              <tr>
                <td nowrap="">
                  <div class="d-flex align-items-center">
                    <div class="bg-indigo-200 w-15px h-15px rounded me-2"></div>
                    <div><b>대표자</b> : {{ store.form.stOwner }}</div>
                  </div>
                </td>
                <td nowrap="">
                  <div class="d-flex align-items-center">
                    <div class="bg-indigo-100 w-15px h-15px rounded me-2"></div>
                    <div><b>전화번호</b> : {{ store.form.stTel }}</div>
                  </div>
                </td>
              </tr>

              <!-- 📌 연락처 / 주소 -->
              <tr>
                <td nowrap="">
                  <div class="d-flex align-items-center">
                    <div class="bg-indigo-300 w-15px h-15px rounded me-2"></div>
                    <div><b>가맹점주소</b> : {{ store.form.stAddr }}</div>
                  </div>
                </td>
                <td nowrap="" >
                  <div class="d-flex align-items-center">
                    <div class="bg-indigo-300 w-15px h-15px rounded me-2"></div>
                    <div><b>영업시간</b> : {{ store.form.originWorkTime }}</div>
                  </div>
                </td>
              </tr>
              <tr>
                <td nowrap="" colspan="2">
                  <div class="d-flex align-items-center">
                    <div class="bg-indigo-300 w-15px h-15px rounded me-2"></div>
                    <div><b>매장소개</b> : {{ store.form.stAppMemo }}</div>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="d-flex between nav nav-tabs nav-tabs-v2 pt-3 justify-content-between">
          <div class="nav nav-tabs nav-tabs-v2 border-bottom-0 " role="tablist">
            <div class="nav-item me-2" role="presentation "><div class="nav-link btn btn-sm btn-white   px-2"  aria-selected="true" role="tab" disabled="">상품그룹 :</div></div>
            <div class="nav-item me-2" role="presentation " v-for="(item, index) in store.grpList" :key="item.grStGrpNo">
              <div class="nav-link btn btn-sm btn-white   px-2"  :class="{ active: index == 0 }"  data-bs-toggle="tab" aria-selected="false" role="tab" @click="selectGrpList(item.grStGrpNo)">{{ item.grpName }}</div>
            </div>
          </div>
          <div class="nav nav-tabs nav-tabs-v2 border-bottom-0" role="tablist">
            <button type="button" class="btn btn-sm btn-gray" @click="deleteImage" ><i class="far fa-lg fa-fw me-10px fa-circle-xmark ms-n1"></i> 선택 이미지 삭제</button>
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
                <tr v-for="item in store.grpItems" :key="item.grStGoodsNo">
                  <td class="w-10px align-middle"  @click.stop="toggleItem(item.grStGoodsNo)">
                    <div class="form-check">
                      <input
                          type="checkbox"
                          class="form-check-input"
                          :id="'product' + item.grStGoodsNo"
                          :value="item.grStGoodsNo"
                          :checked="checkedItems.includes(item.grStGoodsNo)"
                      />
                      {{ item.grStGoodsNo }}
                      <label class="form-check-label" :for="'product' + item.grStGoodsNo"></label>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <div
                          class="w-50px h-50px bg-light d-flex align-items-center justify-content-center"
                          @click="openImageModal(item.image ? item.image.mainPath : '')"
                          style="cursor: pointer;"
                      >
                        <img alt="" class="mw-100 mh-100" style=""  :src="item.image ? item.image.mainThumbPath : ''">

                      </div>
                      <div class="ms-3">
                        <a href="extra_product_details.html" class="text-dark text-decoration-none">{{ item.goodsName }}</a>
                      </div>
                    </div>
                  </td>
                  <td class="align-middle">{{ item.grpName}}</td>
                  <td class="align-middle">{{ formatPrice(item.sellPrice)}} 원</td>
                  <td class="align-middle">{{ formatPrice(item.ordPrice)}} 원</td>
                  <td class="align-middle">{{ adultYn(item.adultYn)}}</td>
                  <td class="align-middle text-ellipsis">{{ item.goodsMemo}}</td>
                  <td class="align-middle">{{ item.goodsMappCnt}} 개</td>
                  <td class="align-middle"><button type="button" class="btn btn-sm btn-white"><i class="fa fa-fw fa-check ms-n1"></i> 이미지 선택</button>
                  </td>
                  <td class="align-middle">
                    <input
                        type="file"
                        ref="fileInputs"
                        class="d-none"
                        accept="image/*"
                        @change="handleFileChange($event, item)"
                    />
                    <button
                        type="button"
                        class="btn btn-sm btn-white"
                        @click="triggerFileInput($event)"
                    >
                      <i class="fa fa-fw fa-upload ms-n1"></i> 업로드
                    </button>
                  </td>

                </tr>
                </tbody>
              </table>
            </div>
            <!-- END table -->
            <Pagenation
                v-model="currentPage"
                :total="store.grpItems?.length ?? 0"
                :perPage="itemsPerPage"
            />
          </div>
        </div>
      </div>
		</panel-body>
	</panel>
  <div v-if="showImageModal" class="image-modal-backdrop" @click="closeImageModal">
    <div class="image-modal-content" @click.stop>
      <img :src="modalImageSrc" alt="이미지 확대" />
      <button class="btn-close" @click="closeImageModal">×</button>
    </div>
  </div>
	<!-- END panel -->
</template>
<script setup lang="ts">
import {ref, computed, watch, onBeforeMount} from 'vue'
import {useRestaurantStore} from "@/stores/restaurant/useRestaurantStore";
import Pagenation from "@/components/common/Pagenation.vue";
import FormMultipleImage from "@/components/form/FormMultipleImage.vue";
const store = useRestaurantStore();
const selectGrStGrpNo = ref(1);
onBeforeMount(()=>  {
  if( store.grpList){
    selectGrStGrpNo.value = store.grpList[0].grStGrpNo;
  }
})

// 모든 체크박스 상태
const checkedItems = ref<string[]>([]); // grStNo를 기준으로 체크 상태 관리

const showImageModal = ref(false)      // 모달 표시 여부
const modalImageSrc = ref('')          // 확대할 이미지 경로

function openImageModal(src: string) {
  modalImageSrc.value = src
  showImageModal.value = true
}

function closeImageModal() {
  showImageModal.value = false
  modalImageSrc.value = ''
}
const allChecked = ref(false);
// allCheck 클릭 시 토글
function toggleAll() {
  if (allChecked.value) {
    // 전체 체크
    checkedItems.value = store.grpItems.map(item => item.grStGoodsNo);
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


// ✅ 페이지 계산
const paginatedData = computed(() => {
  const arr = store.grpList || []        // store.items가 proxy면 자체가 배열임
  const start = (currentPage.value - 1) * itemsPerPage
  return arr.slice(start, start + itemsPerPage)
})


const currentPage = ref(1)
const itemsPerPage = 10
const getAppName = (appType: string | number) => {
  if (appType === '1' || appType === 1) return '배민';
  if (appType === '2' || appType === 2) return '쿠팡';
  return '';
};


const adultYn = (appType: string | number) => {
  if (appType === 'Y' ) return '인증';
  if (appType === 'N' ) return '미인증';
  return '';
};
function formatPrice(value: number | string) {
  if (value === null || value === undefined) return '';
  return Number(value).toLocaleString('ko-KR');
}


const selectGrpList = (grStGrpNo : number | string) => {
  selectGrStGrpNo.value = grStGrpNo;
  store.callGrpListAPI(store.form.grStNo, grStGrpNo, ()=> {

  })
}
const deleteImage = async () => {
  if( checkedItems.value.length > 0){
    await store.deleteImageAPI({grStGoodsNoList : checkedItems.value},() => {
      allChecked.value = false;
      checkedItems.value= [];
      if(store.grpList) {
        store.callGrpListAPI(store.form.grStNo,  selectGrStGrpNo.value, ()=> {
          checkedItems.value.map((item) => {
            toggleItem(item)
          });
          checkedItems.value= [];
        })
      }
    })
  } else {
    alert('삭제할 이미지를 최소 1개 이상 선택해주세요.');
  }

}
const fileInputs = ref<HTMLInputElement[]>([])

// 버튼 클릭 → 해당 row의 input 클릭
function triggerFileInput(event: Event) {
  const button = event.currentTarget as HTMLElement
  const td = button.closest("td")
  const input = td?.querySelector("input[type='file']") as HTMLInputElement
  input?.click()
}

// 파일 선택 시 처리
async function handleFileChange(e: Event, item: any) {
  const target = e.target as HTMLInputElement
  if (!target.files || target.files.length === 0) return

  const file = target.files[0]

  const formData = new FormData()
  formData.append("image", file)

  const query = { dest : 'goods', grStGoodsNo : item.grStGoodsNo }
  // 🚀 API 호출 (예시)
  await store.calluploadImgAPI(formData,query, (res) => {
    allChecked.value = false;
    checkedItems.value= [];
    // 업로드 후 이미지 경로 업데이트
    if(store.grpList) {
      store.callGrpListAPI(store.form.grStNo,  selectGrStGrpNo.value, ()=> {

      })
    }
  })

  // input 파일 초기화
  target.value = ""
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
.info-section {
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  padding: 12px 14px;
  margin-bottom: 12px;
  background: #fafafa;
}

.info-title {
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  row-gap: 6px;
  column-gap: 20px;
}

.info-row {
  display: flex;
  align-items: center;
}

.info-label {
  color: #777;
  width: 100px;       /* 라벨 정렬이 핵심 */
  font-size: 13px;
}

.info-value {
  font-weight: 500;
  color: #222;
  font-size: 13px;
}

.image-modal-backdrop {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.6);
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
  max-height: 100%;
  display: block;
}

.image-modal-content .btn-close {
  position: absolute;
  top: 5px; right: 5px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.text-ellipsis {
  max-width: 150px;      /* 원하는 너비 */
  white-space: nowrap;   /* 한 줄로 */
  overflow: hidden;      /* 넘치면 숨김 */
  text-overflow: ellipsis; /* ... 처리 */
}
</style>
