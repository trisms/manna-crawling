<template>
  <div v-if="visible" class="modal-backdrop">
    <div class="modal-window">
      <div class="modal-body">
        <div class="list-group list-group-flush rounded-bottom overflow-hidden panel-body p-0">
            <div class="list-group-item d-flex border-top-0">
              <div class="flex-fill border-bottom">
                <div class="d-flex justify-content-between">
                <div class="fs-14px lh-12 mb-2px fw-bold text-dark"> 추가 상품리스트</div>
                  <div class="ms-auto">
                    <div class="btn btn-outline-default text-gray-600 btn-xs cursor-default rounded-pill fs-10px px-2" >
                      그룹개수 ({{store.grpGoodsList.length}} 개)
                    </div>
                  </div>
                </div>

                <div class="mb-1 fs-12px">
                  <div class="text-gray-600 flex-1">상품명 : [1인]한돈 순살 돼지갈비찜 혼밥</div>
                </div>
                <hr class="mb-10px bg-gray-600">
                <table class="table  table-borderless table-sm m-0 text-nowrap ">
                  <thead class="thead-sticky">
                  <tr >
                    <th class="w-10px p-0"> <div class="border-bottom px-10px pb-1">상품그룹</div></th>
                    <th class=" p-0"><div class="border-bottom px-10px pb-1">추가상품명</div></th>
                    <th class="w-50px p-0"><div class="border-bottom px-10px pb-1">최소선택수</div></th>
                    <th class="w-50px p-0"><div class="border-bottom px-10px pb-1">최대선택수</div></th>
                    <th class="w-120px p-0"><div class="border-bottom px-10px pb-1" >가격</div></th>
                    <th class="w-100px  p-0"><div class="border-bottom px-10px pb-1" >성인인증구분</div></th>
                  </tr>
                  </thead>
                </table>
                <div class="fs-12px  text-dark fw-bold w-100 table-wrapper" >
                  <div class="file-tree" v-for="(item) in store.grpGoodsList" v-bind:key="item.grStGoodsNo">
                    <div class="file-node has-sub expand" style="padding-inline-start:0rem;">
                      <a href="javascript:;" class="file-link">
                        <span class="file-info">
																<span class="file-icon"><i class="fas fa-lg fa-fw  fa-cart-plus text-warning fa-lg"></i></span>
																<span class="file-text" style="flex:1.7">{{item.grpName}}</span>
																<span class="file-text" style="flex:0.3">{{item.selMin}} 개</span>
																<span class="file-text">{{item.selMax}} 개</span>
															</span>
                      </a>
                      <div class="file-tree bg-light" v-for="(subItem, index) in item.mappGoodsList" v-bind:key="subItem.goodsName">
                        <div class="file-node has-sub expand">
                          <a href="javascript:;" class="file-link">
                            <span class="file-info">
                              	<span class="file-icon"><i class="fas fa-lg fa-fw me-10px fa-circle-dot fs-6 text-info"></i></span>
                              <div class="d-flex justify-content-between w-100">
                                <span class="file-text" style="flex:3">{{subItem.goodsName}} </span>
                                <span class="file-text" style="flex:0.5"></span>
                                <span class="file-text" style="flex:0.5"></span>
                                <span class="file-text"> {{subItem.sellPrice}} 원</span>
                                <span class="file-text" style="flex: 0.5"> {{adultYn(subItem.adultYn)}} </span>
                              </div>
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>


<!--                <table class="table  table-borderless table-sm m-0 text-nowrap ">
                    <thead class="thead-sticky">
                    <tr >
                      <th class="w-10px p-0"><div class="border-bottom ps-10px pb-1"></div></th>
                      <th class="p-0"> <div class="border-bottom px-10px pb-1">상품그룹</div></th>
                      <th class="p-0"><div class="border-bottom px-10px pb-1">추가상품명</div></th>
                      <th class="p-0"><div class="border-bottom px-10px pb-1" >가격</div></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr class="file-tree">
                      <td class="ps-10px border-0 text-center">
                        <div class="file-tree" style="display:block;">
                          <div class="file-node" >
                            <span class="file-info">
                              <span class="file-icon"><i class="fas fa-lg fa-fw  fa-cart-plus text-warning fa-lg"></i></span>
                              <span class="file-text"></span>
                            </span>
                          </div>
                        </div>
                      </td>
                      <td class="px-10px border-0">상품그룹명 A</td>
                      <td class="px-10px"></td>
                      <td class="px-10px"></td>
                    </tr>
                    <tr class="bg-light file-tree file-node ">
                      <td class="ps-10px border-0 text-center">

                      </td>
                      <td class="px-10px border-0"></td>
                      <td class="px-10px">김밥</td>
                      <td class="px-10px">{{ formatPrice(2000) }} 원</td>
                    </tr>
                    </tbody>
                  </table>-->
                </div>
              </div>
            </div>
          </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">닫기</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  visible: Boolean,
  addList: {
    type: Array,
    default: () => []
  }
});
import {useRestaurantStore} from "@/stores/restaurant/useRestaurantStore";

const store = useRestaurantStore();

function formatPrice(value: number | string) {
  if (value === null || value === undefined) return '';
  return Number(value).toLocaleString('ko-KR');
}

const adultYn = (appType: string | number) => {
  if (appType === 'Y') return '인증';
  if (appType === 'N') return '미인증';
  if (appType === '0') return '알수없음';
  return '';
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-window {
  background: #fff;
  width: 900px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.modal-header,
.modal-footer {
  padding: 15px;
  border-bottom: 1px solid #eee;
}
.modal-footer {
  border-top: 1px solid #eee;
}
.modal-body {
  padding: 15px;
}

.table-wrapper {
  max-height: 500px;   /* 원하는 높이 */
  overflow-y: auto;
}

:deep(.thead-sticky) {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 20;
}
.file-tree .file-node {
  position: relative;
  padding-inline-start: 3rem;
}

.file-tree .file-node.has-sub > .file-tree {
  display: block;
}
.text-right {
  text-align: right;
}
.w-120px {
  width: 120px;
}
</style>
