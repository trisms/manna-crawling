`````
````
```
<template>
  <panel>
    <panel-body class="accom-admin-page">
      <div v-if="loading" class="accom-loading">
        숙소 정보를 불러오는 중입니다.
      </div>

      <template v-else>
        <!-- =====================================================
             상단 숙소 정보
        ====================================================== -->
        <div class="card border-0">
          <div class="note mb-0 border accom-info-note">
            <div class="note-content">
              <div class="accom-page-head">
                <h4 class="mb-0">
                  <i class="fa fa-info-circle fa-fw"></i>
                  <b>숙소 정보</b>
                  <span class="accom-page-head__name">
                    - ( {{ info.accomName || '-' }} )
                  </span>
                </h4>

                <div class="d-flex align-items-center gap-2">
                  <span class="platform-badge">
                    {{ getPlatformTypeName(platformType) }}
                  </span>

                  <button
                      v-if="hasBizInfo"
                      type="button"
                      class="btn btn-sm btn-white border"
                      @click="openSellerModal"
                  >
                    <i class="fa fa-briefcase me-1"></i>
                    판매자 정보
                  </button>
                </div>
              </div>

              <div class="card border-0">
                <div class="card-body bg-none accom-summary-body">
                  <table class="table table-condensed p-0 bg-none mb-0 accom-info-table">
                    <tbody>
                    <tr>
                      <td class="w-50">
                        <div class="accom-info-cell">
                          <div class="info-dot bg-indigo-200"></div>
                          <div>
                            <b>숙소번호</b>
                            <span>:</span>
                            {{ info.accomId ?? accomId ?? '-' }}
                          </div>
                        </div>
                      </td>

                      <td>
                        <div class="accom-info-cell">
                          <div class="info-dot bg-indigo-100"></div>
                          <div>
                            <b>플랫폼 타입</b>
                            <span>:</span>
                            {{ getPlatformTypeName(platformType) }}
                          </div>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <div class="accom-info-cell">
                          <div class="info-dot bg-indigo-100"></div>
                          <div>
                            <b>숙소구분</b>
                            <span>:</span>
                            {{ getAccomTypeName(info.accomType) }}
                          </div>
                        </div>
                      </td>

                      <td>
                        <div class="accom-info-cell">
                          <div class="info-dot bg-indigo-200"></div>
                          <div>
                            <b>수집일</b>
                            <span>:</span>
                            {{ formatDate(info.putDate) }}
                          </div>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td colspan="2">
                        <div class="accom-info-cell">
                          <div class="info-dot bg-indigo-100"></div>
                          <div class="accom-info-address">
                            <b>숙소주소</b>
                            <span>:</span>
                            {{ info.accomAddr || '-' }}
                          </div>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td colspan="2">
                        <div class="accom-info-cell">
                          <div class="info-dot bg-indigo-200"></div>
                          <div class="accom-info-address">
                            <b>위치 추가정보</b>
                            <span>:</span>
                            {{ info.accomAddrMemo || '-' }}
                          </div>
                        </div>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- 숙소 소개 / 부대시설 -->
              <div class="card bg-none border-0">
                <div class="card-body bg-none accom-mini-info-wrap">
                  <div class="accom-mini-info">
                    <div class="accom-mini-info__title">
                      숙소 소개
                    </div>

                    <div class="accom-mini-info__body">
                      <template v-if="previewContents.length">
                        <div
                            v-for="(content, index) in previewContents"
                            :key="`preview-${index}`"
                            class="mini-info-line"
                        >
                          {{ content }}
                        </div>
                      </template>

                      <div v-else class="text-muted">
                        등록된 숙소 소개 정보가 없습니다.
                      </div>
                    </div>
                  </div>

                  <div class="accom-mini-info">
                    <div class="accom-mini-info__title">
                      서비스 및 부대시설
                    </div>

                    <div class="accom-mini-info__body">
                      <div v-if="facilities.length" class="facility-inline-list">
                        <span
                            v-for="facility in facilities"
                            :key="facility.sfId"
                            class="facility-inline-item"
                        >
                          <i class="fa fa-check me-1"></i>
                          {{ facility.sfName }}
                        </span>
                      </div>

                      <div v-else class="text-muted">
                        등록된 시설 정보가 없습니다.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- =====================================================
             이미지 리스트 세로 배치
        ====================================================== -->
        <div class="image-list-vertical mt-3">
          <!-- 1. 메인 이미지 -->
          <section class="image-list-panel image-list-panel--main vertical-image-panel">
            <div class="image-list-panel__head">
              <div class="d-flex align-items-center gap-2">
                <b>메인 이미지</b>
                <span class="section-count">{{ mainImages.length }}장</span>
              </div>

              <div class="image-list-panel__actions">
                <span class="selected-text">
                  {{ selectedMainImageIds.length }}개 선택
                </span>

                <button
                    type="button"
                    class="btn btn-xs btn-gray"
                    :disabled="selectedMainImageIds.length === 0 || deleting"
                    @click="deleteSelectedMainImages"
                >
                  <i class="far fa-circle-xmark me-1"></i>
                  삭제
                </button>
              </div>
            </div>

            <div class="image-list-panel__toolbar">
              <label class="form-check d-flex align-items-center gap-2 mb-0">
                <input
                    type="checkbox"
                    class="form-check-input"
                    :checked="areAllMainImagesSelected"
                    @change="toggleAllMainImages"
                />
                <span>전체선택</span>
              </label>
            </div>

            <div class="image-list-panel__scroll">
              <div
                  v-if="mainImages.length"
                  class="compact-image-list"
              >
                <div
                    v-for="(image, index) in mainImages"
                    :key="getMainImageKey(image, index)"
                    class="compact-image-row"
                    :class="{ selected: isMainImageSelected(image) }"
                >
                  <div
                      class="compact-image-row__check"
                      @click.stop="toggleMainImage(image)"
                  >
                    <input
                        type="checkbox"
                        class="form-check-input"
                        :checked="isMainImageSelected(image)"
                        tabindex="-1"
                    />
                  </div>

                  <div class="compact-image-row__num">
                    {{ index + 1 }}
                  </div>

                  <button
                      type="button"
                      class="compact-image-thumb"
                      @click="openImageModal(mainImageList, index, '메인 이미지')"
                  >
                    <img
                        :src="image.imgPath"
                        :alt="`메인 이미지 ${index + 1}`"
                        @error="handleImageError"
                    />
                  </button>

                  <div class="compact-image-row__info">
                    <div class="compact-image-row__title">
                      {{ image.imgType || '메인 이미지' }}
                    </div>

                    <!--                    <div class="compact-image-row__sub">
                                          정렬 {{ image.viewOrder ?? index + 1 }}
                                        </div>

                                        <div
                                            class="compact-image-row__path"
                                            :title="image.imgPath"
                                        >
                                          {{ image.imgPath || '-' }}
                                        </div>-->
                  </div>

                  <button
                      type="button"
                      class="compact-image-row__zoom"
                      @click="openImageModal(mainImageList, index, '메인 이미지')"
                  >
                    <i class="fa fa-search-plus"></i>
                  </button>
                </div>
              </div>

              <div v-else class="admin-empty compact-empty">
                등록된 메인 이미지가 없습니다.
              </div>
            </div>
          </section>

          <!-- 2. 리뷰 이미지 -->
          <section class="image-list-panel image-list-panel--review vertical-image-panel">
            <div class="image-list-panel__head">
              <div class="d-flex align-items-center gap-2">
                <b>리뷰 이미지</b>
                <span class="section-count">{{ reviewImages.length }}장</span>
              </div>

              <div class="image-list-panel__actions">
                <span class="selected-text">
                  {{ selectedReviewImageIds.length }}개 선택
                </span>

                <button
                    type="button"
                    class="btn btn-xs btn-gray"
                    :disabled="selectedReviewImageIds.length === 0 || deleting"
                    @click="deleteSelectedReviewImages"
                >
                  <i class="far fa-circle-xmark me-1"></i>
                  삭제
                </button>
              </div>
            </div>

            <div class="image-list-panel__toolbar">
              <label class="form-check d-flex align-items-center gap-2 mb-0">
                <input
                    type="checkbox"
                    class="form-check-input"
                    :checked="areAllReviewImagesSelected"
                    @change="toggleAllReviewImages"
                />
                <span>전체선택</span>
              </label>
            </div>

            <div class="image-list-panel__scroll">
              <div
                  v-if="reviewImages.length"
                  class="compact-image-list"
              >
                <div
                    v-for="(review, index) in reviewImages"
                    :key="getReviewImageKey(review, index)"
                    class="compact-image-row"
                    :class="{ selected: isReviewImageSelected(review) }"
                >
                  <div
                      class="compact-image-row__check"
                      @click.stop="toggleReviewImage(review)"
                  >
                    <input
                        type="checkbox"
                        class="form-check-input"
                        :checked="isReviewImageSelected(review)"
                        tabindex="-1"
                    />
                  </div>

                  <div class="compact-image-row__num">
                    {{ index + 1 }}
                  </div>

                  <button
                      type="button"
                      class="compact-image-thumb"
                      @click="openImageModal(reviewImageList, index, '리뷰 이미지')"
                  >
                    <img
                        :src="review.imgPath"
                        :alt="`리뷰 이미지 ${index + 1}`"
                        @error="handleImageError"
                    />
                  </button>

                  <div class="compact-image-row__info">
                    <div class="compact-image-row__title">
                      <i class="fa fa-star text-warning me-1"></i>
                      {{ formatScore(review.score) }}
                    </div>

                    <!--                    <div class="compact-image-row__sub">
                                          {{ formatDate(review.createdAt) }}
                                        </div>

                                        <div
                                            class="compact-image-row__path"
                                            :title="review.imgPath"
                                        >
                                          {{ review.imgPath || '-' }}
                                        </div>-->
                  </div>

                  <button
                      type="button"
                      class="compact-image-row__zoom"
                      @click="openImageModal(reviewImageList, index, '리뷰 이미지')"
                  >
                    <i class="fa fa-search-plus"></i>
                  </button>
                </div>
              </div>

              <div v-else class="admin-empty compact-empty">
                등록된 리뷰 이미지가 없습니다.
              </div>
            </div>
          </section>

          <!-- 3. 객실 이미지 -->
          <section class="image-list-panel image-list-panel--room vertical-image-panel">
            <div class="image-list-panel__head">
              <div class="d-flex align-items-center gap-2">
                <b>객실 이미지</b>
                <span class="section-count">{{ activeRoomImages.length }}장</span>
              </div>

              <div class="image-list-panel__actions">
                <span class="selected-text">
                  {{ selectedRoomImageCount }}개 선택
                </span>

                <button
                    type="button"
                    class="btn btn-xs btn-gray"
                    :disabled="selectedRoomImageCount === 0 || deleting"
                    @click="deleteSelectedRoomImages"
                >
                  <i class="far fa-circle-xmark me-1"></i>
                  삭제
                </button>
              </div>
            </div>

            <div class="image-list-panel__room-tabs">
              <button
                  type="button"
                  class="room-tab-arrow compact"
                  @click="scrollRoomTabs(-1)"
              >
                ‹
              </button>

              <div ref="roomTabsRef" class="compact-room-tabs">
                <button
                    v-for="roomItem in rooms"
                    :key="roomItem.roomId"
                    type="button"
                    class="compact-room-tab"
                    :class="{ active: activeRoom?.roomId === roomItem.roomId }"
                    @click="selectRoom(roomItem.roomId)"
                >
                  {{ roomItem.roomName || '객실명 없음' }}
                </button>
              </div>

              <button
                  type="button"
                  class="room-tab-arrow compact"
                  @click="scrollRoomTabs(1)"
              >
                ›
              </button>
            </div>

            <div class="image-list-panel__toolbar">
              <label class="form-check d-flex align-items-center gap-2 mb-0">
                <input
                    type="checkbox"
                    class="form-check-input"
                    :checked="areAllActiveRoomImagesSelected"
                    :disabled="activeRoomImages.length === 0"
                    @change="toggleAllActiveRoomImages"
                />
                <span>전체선택</span>
              </label>

              <span v-if="activeRoom" class="current-room-name">
                {{ activeRoom.roomName || '-' }}
              </span>
            </div>

            <div class="image-list-panel__scroll">
              <div
                  v-if="activeRoomImages.length"
                  class="compact-image-list"
              >
                <div
                    v-for="(image, index) in activeRoomImages"
                    :key="getRoomImageKey(image, index)"
                    class="compact-image-row"
                    :class="{ selected: isActiveRoomImageSelected(image) }"
                >
                  <div
                      class="compact-image-row__check"
                      @click.stop="toggleActiveRoomImage(image)"
                  >
                    <input
                        type="checkbox"
                        class="form-check-input"
                        :checked="isActiveRoomImageSelected(image)"
                        tabindex="-1"
                    />
                  </div>

                  <div class="compact-image-row__num">
                    {{ index + 1 }}
                  </div>

                  <button
                      type="button"
                      class="compact-image-thumb"
                      @click="
                        openImageModal(
                          activeRoomImageList,
                          index,
                          activeRoom?.roomName || '객실 이미지'
                        )
                      "
                  >
                    <img
                        :src="image.imgPath"
                        alt="객실 이미지"
                        @error="handleImageError"
                    />
                  </button>

                  <div class="compact-image-row__info">
                    <div class="compact-image-row__title">
                      {{ activeRoom?.roomName || '-' }}
                    </div>

                    <!--                    <div class="compact-image-row__sub">
                                          정렬 {{ image.viewOrder ?? index + 1 }}
                                        </div>

                                        <div
                                            class="compact-image-row__path"
                                            :title="image.imgPath"
                                        >
                                          {{ image.imgPath || '-' }}
                                        </div>-->
                  </div>

                  <button
                      type="button"
                      class="compact-image-row__zoom"
                      @click="
                        openImageModal(
                          activeRoomImageList,
                          index,
                          activeRoom?.roomName || '객실 이미지'
                        )
                      "
                  >
                    <i class="fa fa-search-plus"></i>
                  </button>
                </div>
              </div>

              <div v-else class="admin-empty compact-empty">
                등록된 객실 이미지가 없습니다.
              </div>
            </div>


          </section>
        </div>


        <!-- =====================================================
             객실 상품 정보
        ====================================================== -->
        <div class="admin-section-card mt-3">
          <div class="admin-section-head">
            <div>
              <b>객실 상품 정보</b>
              <span v-if="activeRoom" class="section-count">
                {{ activeRoom.roomName || '-' }}
              </span>
            </div>
          </div>

          <div v-if="activeRoom" class="table-responsive">
            <table class="table table-hover text-nowrap admin-room-table mb-0">
              <thead>
              <tr>
                <th>구분</th>
                <th>기준인원</th>
                <th>최대인원</th>
                <th>이용시간</th>
                <th>체크인</th>
                <th>체크아웃</th>
                <th class="text-end">정상가</th>
                <th class="text-end">판매가</th>
                <th class="text-end">할인율</th>
              </tr>
              </thead>

              <tbody>
              <tr
                  v-for="roomInfo in activeRoom.roomInfo || []"
                  :key="roomInfo.roomInfoId"
              >
                <td class="align-middle">
                  <span
                      class="room-type-label"
                      :class="{
                        stay: String(roomInfo.roomType) === '1',
                        rent: String(roomInfo.roomType) === '2'
                      }"
                  >
                    {{ getRoomTypeName(roomInfo.roomType) }}
                  </span>
                </td>

                <td class="align-middle">
                  {{ formatNumber(roomInfo.baseCnt) }}명
                </td>

                <td class="align-middle">
                  {{ formatNumber(roomInfo.maxCnt) }}명
                </td>

                <td class="align-middle">
                  <template v-if="String(roomInfo.roomType) === '2'">
                    {{ formatUseTime(roomInfo.availUseTime) }}
                  </template>
                  <template v-else>
                    {{ formatCheckTime(roomInfo.checkInTime) }}
                    ~
                    {{ formatCheckTime(roomInfo.checkOutTime) }}
                  </template>
                </td>

                <td class="align-middle">
                  {{ formatCheckTime(roomInfo.checkInTime) }}
                </td>

                <td class="align-middle">
                  {{ formatCheckTime(roomInfo.checkOutTime) }}
                </td>

                <td class="align-middle text-end text-muted">
                  {{ formatPrice(roomInfo.roomPrice) }}
                </td>

                <td class="align-middle text-end fw-bold">
                  {{
                    formatPrice(
                        Number(roomInfo.roomDisPrice) > 0
                            ? roomInfo.roomDisPrice
                            : roomInfo.roomPrice
                    )
                  }}
                </td>

                <td class="align-middle text-end">
                  <span
                      v-if="getDiscountRate(roomInfo.roomPrice, roomInfo.roomDisPrice) > 0"
                      class="discount-label"
                  >
                    {{ getDiscountRate(roomInfo.roomPrice, roomInfo.roomDisPrice) }}%
                  </span>
                  <span v-else>-</span>
                </td>
              </tr>

              <tr v-if="!activeRoom.roomInfo?.length">
                <td colspan="9" class="text-center text-muted py-4">
                  등록된 객실 상품 정보가 없습니다.
                </td>
              </tr>
              </tbody>
            </table>
          </div>

          <div v-else class="admin-empty">
            등록된 객실 정보가 없습니다.
          </div>
        </div>


        <!-- =====================================================
             상세 숙소 정보
        ====================================================== -->
        <div class="admin-section-card mt-3">
          <div class="admin-section-head">
            <div><b>상세 숙소 정보</b></div>
          </div>

          <div class="detail-info-list">
            <template v-if="detailInfos.length">
              <div
                  v-for="item in detailInfos"
                  :key="item.accomInfoId"
                  class="detail-info-row"
              >
                <div class="detail-info-row__title">
                  {{ item.title || '-' }}
                </div>

                <div class="detail-info-row__content">
                  <template v-if="parseContents(item.contents).length">
                    <div
                        v-for="(content, index) in parseContents(item.contents)"
                        :key="`${item.accomInfoId}-${index}`"
                        class="detail-info-line"
                    >
                      {{ content }}
                    </div>
                  </template>

                  <span v-else>
                    {{ item.contents || '-' }}
                  </span>
                </div>
              </div>
            </template>

            <div v-else class="admin-empty">
              등록된 숙소 상세 정보가 없습니다.
            </div>
          </div>
        </div>
      </template>
    </panel-body>
  </panel>

  <!-- =====================================================
       판매자 정보 모달
  ====================================================== -->
  <div
      v-if="sellerModalVisible"
      class="simple-modal-backdrop"
      @click="closeSellerModal"
  >
    <div class="simple-modal seller-modal" @click.stop>
      <div class="simple-modal__head">
        <h5 class="mb-0">
          <i class="fa fa-briefcase me-2"></i>
          판매자 정보
        </h5>

        <button
            type="button"
            class="btn-close"
            @click="closeSellerModal"
        ></button>
      </div>

      <table class="table table-condensed mb-0 seller-info-table">
        <tbody>
        <tr>
          <th>대표자명</th>
          <td>{{ bizInfo.bizOwner || '-' }}</td>
        </tr>
        <tr>
          <th>상호명</th>
          <td>{{ bizInfo.bizName || '-' }}</td>
        </tr>
        <tr>
          <th>사업자등록번호</th>
          <td>{{ formatBizNumber(bizInfo.bizNum) }}</td>
        </tr>
        <tr>
          <th>사업장 주소</th>
          <td>{{ bizInfo.bizAddr || '-' }}</td>
        </tr>
        <tr>
          <th>이메일</th>
          <td>{{ bizInfo.bizEmail || '-' }}</td>
        </tr>
        <tr>
          <th>숙소 연락처</th>
          <td>{{ formatPhoneNumber(sellerPhone) }}</td>
        </tr>
        </tbody>
      </table>

      <div class="simple-modal__footer">
        <button
            type="button"
            class="btn btn-sm btn-gray"
            @click="closeSellerModal"
        >
          확인
        </button>
      </div>
    </div>
  </div>

  <!-- =====================================================
       이미지 확대 / 스와이프
  ====================================================== -->
  <div
      v-if="imageModalVisible"
      class="simple-modal-backdrop image-viewer-backdrop"
      @click="closeImageModal"
  >
    <div
        class="image-viewer"
        @click.stop
        @touchstart.passive="handleModalTouchStart"
        @touchend.passive="handleModalTouchEnd"
    >
      <div class="image-viewer__head">
        <div>
          <b>{{ modalTitle }}</b>
          <span>
            {{ modalImageIndex + 1 }} / {{ modalImages.length }}
          </span>
        </div>

        <button
            type="button"
            class="image-viewer__close"
            @click="closeImageModal"
        >
          ×
        </button>
      </div>

      <button
          v-if="modalImages.length > 1"
          type="button"
          class="image-viewer__nav prev"
          @click="moveModalImage(-1)"
      >
        ‹
      </button>

      <img
          :src="modalImage"
          alt="이미지 확대"
          @error="handleImageError"
      />

      <button
          v-if="modalImages.length > 1"
          type="button"
          class="image-viewer__nav next"
          @click="moveModalImage(1)"
      >
        ›
      </button>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAccommodationStore } from '@/stores/accommodation/useAccommodationStore';

type Id = number | string;
type DeleteImageType = 'MAIN' | 'ROOM' | 'REVIEW';

interface MainImage {
  imgId?: Id;
  accomImgId?: Id;
  imgType?: string;
  imgPath: string;
  viewOrder?: number;
}

interface ReviewImage {
  reviewImgId?: Id;
  imgId?: Id;
  imgPath: string;
  createdAt?: string;
  score?: number;
}

interface RoomImage {
  roomImgId?: Id;
  imgPath: string;
  viewOrder?: number;
}

interface RoomInfo {
  roomInfoId: Id;
  roomType?: string | number;
  roomPrice?: number;
  roomDisPrice?: number;
  baseCnt?: number;
  maxCnt?: number;
  availUseTime?: number;
  checkInTime?: string;
  checkOutTime?: string;
  isSoldOut?: string | number;
}

interface RoomItem {
  roomId: Id;
  roomName?: string;
  roomInfo?: RoomInfo[];
  roomImgs?: RoomImage[];
}

interface AccomInfoItem {
  accomInfoId: Id;
  title?: string;
  contents?: string;
}

interface Facility {
  sfId: Id;
  sfName: string;
}

interface BizInfo {
  bizOwner?: string;
  bizName?: string;
  bizAddr?: string;
  bizNum?: string;
  bizEmail?: string;
  accomTel?: string;
  bizTel?: string;
}

const route = useRoute();
const store = useAccommodationStore();

const NO_IMAGE_URL = new URL('@/assets/img/noimg.gif', import.meta.url).href;

/* =========================================================
 * 화면 상태
 * ======================================================= */
const loading = ref(false);
const deleting = ref(false);

const selectedMainImage = ref('');
const activeRoomId = ref<Id | null>(null);

const selectedMainImageIds = ref<Id[]>([]);
const selectedReviewImageIds = ref<Id[]>([]);
const selectedRoomImages = ref<Record<string, Id[]>>({});

/* =========================================================
 * 판매자 모달
 * ======================================================= */
const sellerModalVisible = ref(false);

/* =========================================================
 * 이미지 확대 모달
 * ======================================================= */
const imageModalVisible = ref(false);
const modalImages = ref<string[]>([]);
const modalImageIndex = ref(0);
const modalTitle = ref('이미지');
const touchStartX = ref<number | null>(null);

const modalImage = computed(
    () => modalImages.value[modalImageIndex.value] || NO_IMAGE_URL
);

/* =========================================================
 * DOM
 * ======================================================= */
const roomTabsRef = ref<HTMLElement | null>(null);
const mainThumbsRef = ref<HTMLElement | null>(null);
const roomImageSliderRef = ref<HTMLElement | null>(null);
const mainManageSliderRef = ref<HTMLElement | null>(null);
const reviewSliderRef = ref<HTMLElement | null>(null);

/* =========================================================
 * API 데이터
 * ======================================================= */
const accomId = computed(() =>
    Number(route.query.accomId || route.params.id || 0)
);

const info = computed<any>(() => store.form.info || {});
const rawRoom = computed<any>(() => store.form.room || []);

/**
 * 플랫폼 타입
 *
 * 백엔드 실제 응답 key가 확정되지 않은 상태라 아래 순서로 대응.
 * 실제 key가 platformType 하나로 확정되면 info.value.platformType만 남겨도 됨.
 */
const platformType = computed(() =>
    info.value.platformType ??
    info.value.appType ??
    info.value.platform ??
    info.value.orderAppType ??
    ''
);

const bizInfo = computed<BizInfo>(() =>
    info.value.bizInfo && typeof info.value.bizInfo === 'object'
        ? info.value.bizInfo
        : {}
);

const sellerPhone = computed(() =>
    bizInfo.value.accomTel ||
    bizInfo.value.bizTel ||
    info.value.accomTel ||
    ''
);

const hasBizInfo = computed(() =>
    Boolean(
        bizInfo.value.bizOwner ||
        bizInfo.value.bizName ||
        bizInfo.value.bizAddr ||
        bizInfo.value.bizNum ||
        bizInfo.value.bizEmail ||
        sellerPhone.value
    )
);

/* =========================================================
 * 숙소 기본정보
 * ======================================================= */
const accomInfos = computed<AccomInfoItem[]>(() =>
    Array.isArray(info.value.accomInfo)
        ? info.value.accomInfo
        : []
);

const previewInfo = computed(() => accomInfos.value[0] || null);
const detailInfos = computed(() => accomInfos.value.slice(1));

const previewContents = computed(() =>
    parseContents(previewInfo.value?.contents)
);

const facilities = computed<Facility[]>(() =>
    Array.isArray(info.value.serviceFacilities)
        ? info.value.serviceFacilities
        : []
);

const regionLabel = computed(() => {
  const address = String(info.value.accomAddr || '').trim();

  return address
      ? address.split(/\s+/).slice(0, 2).join(' ')
      : '지역정보';
});

/* =========================================================
 * 메인 이미지
 * ======================================================= */
const mainImages = computed<MainImage[]>(() =>
    sortByOrder(
        Array.isArray(info.value.mainImgs)
            ? info.value.mainImgs
            : []
    )
);

const mainImageList = computed(() =>
    mainImages.value.map((image) => image.imgPath)
);

const mainImage = computed(() => {
  const exists = mainImages.value.some(
      (image) => image.imgPath === selectedMainImage.value
  );

  if (exists) {
    return selectedMainImage.value;
  }

  return mainImages.value[0]?.imgPath || NO_IMAGE_URL;
});

const mainImageIndex = computed(() => {
  const index = mainImages.value.findIndex(
      (image) => image.imgPath === mainImage.value
  );

  return index >= 0 ? index : 0;
});

const areAllMainImagesSelected = computed(() => {
  if (!mainImages.value.length) return false;

  return mainImages.value.every((image) =>
      selectedMainImageIds.value.includes(getMainImageValue(image))
  );
});

/* =========================================================
 * 리뷰 이미지
 * ======================================================= */
const reviewImages = computed<ReviewImage[]>(() => {
  const images = Array.isArray(info.value.reviewImgs)
      ? info.value.reviewImgs
      : [];

  return [...images]
      .filter(hasImagePath)
      .sort(
          (a, b) =>
              toTimestamp(b.createdAt) -
              toTimestamp(a.createdAt)
      );
});

const reviewImageList = computed(() =>
    reviewImages.value.map((image) => image.imgPath)
);

const areAllReviewImagesSelected = computed(() => {
  if (!reviewImages.value.length) return false;

  return reviewImages.value.every((image) =>
      selectedReviewImageIds.value.includes(getReviewImageValue(image))
  );
});

/* =========================================================
 * 객실
 * ======================================================= */
const rooms = computed<RoomItem[]>(() => {
  const value = rawRoom.value;

  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.rooms)) return value.rooms;
  if (Array.isArray(value?.roomList)) return value.roomList;
  if (value?.roomId !== undefined) return [value];

  return [];
});

const activeRoom = computed(() =>
    rooms.value.find(
        (room) => room.roomId === activeRoomId.value
    ) ||
    rooms.value[0] ||
    null
);

const activeRoomImages = computed<RoomImage[]>(() =>
    sortByOrder(activeRoom.value?.roomImgs || [])
);

const activeRoomImageList = computed(() =>
    activeRoomImages.value.map((image) => image.imgPath)
);

const activeRoomKey = computed(() =>
    activeRoom.value
        ? String(activeRoom.value.roomId)
        : ''
);

const activeSelectedImages = computed(() =>
    selectedRoomImages.value[activeRoomKey.value] || []
);

const selectedRoomImageCount = computed(() =>
    activeSelectedImages.value.length
);

const areAllActiveRoomImagesSelected = computed(() => {
  if (!activeRoomImages.value.length) return false;

  return activeRoomImages.value.every((image) =>
      activeSelectedImages.value.includes(
          getRoomImageValue(image)
      )
  );
});

/* =========================================================
 * 데이터 조회
 * ======================================================= */
/*
async function loadDetail() {
  if (!accomId.value) return;

  loading.value = true;

  try {
    await store.callDetailAPI(accomId.value);
  } finally {
    loading.value = false;
  }
}
*/

/* =========================================================
 * 객실 탭
 * ======================================================= */
function selectRoom(roomId: Id) {
  activeRoomId.value = roomId;
  ensureRoomSelection(roomId);
}

function scrollRoomTabs(direction: -1 | 1) {
  roomTabsRef.value?.scrollBy({
    left: direction * 260,
    behavior: 'smooth',
  });
}

/* =========================================================
 * 공통 가로 슬라이더
 * ======================================================= */
function scrollImageSlider(
    element: HTMLElement | null,
    direction: -1 | 1
) {
  if (!element) return;

  const scrollAmount = Math.max(
      element.clientWidth * 0.8,
      240
  );

  element.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth',
  });
}

function handleHorizontalWheel(
    event: WheelEvent,
    element: HTMLElement | null
) {
  if (!element) return;

  const delta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
          ? event.deltaX
          : event.deltaY;

  if (!delta) return;

  event.preventDefault();
  element.scrollLeft += delta;
}

/* =========================================================
 * 메인 이미지 다중 선택
 * ======================================================= */
function getMainImageValue(image: MainImage): Id {
  return (
      image.accomImgId ??
      image.imgId ??
      image.imgPath
  );
}

function getMainImageKey(
    image: MainImage,
    index: number
) {
  return (
      image.accomImgId ??
      image.imgId ??
      `${image.imgPath}-${image.viewOrder ?? index}`
  );
}

function isMainImageSelected(image: MainImage) {
  return selectedMainImageIds.value.includes(
      getMainImageValue(image)
  );
}

function toggleMainImage(image: MainImage) {
  toggleValue(
      selectedMainImageIds.value,
      getMainImageValue(image)
  );
}

function toggleAllMainImages() {
  selectedMainImageIds.value =
      areAllMainImagesSelected.value
          ? []
          : mainImages.value.map(getMainImageValue);
}

/* =========================================================
 * 객실 이미지 다중 선택
 * ======================================================= */
function getRoomImageValue(image: RoomImage): Id {
  return image.roomImgId ?? image.imgPath;
}

function getRoomImageKey(
    image: RoomImage,
    index: number
) {
  return (
      image.roomImgId ??
      `${image.imgPath}-${index}`
  );
}

function ensureRoomSelection(roomId: Id) {
  const key = String(roomId);

  if (!selectedRoomImages.value[key]) {
    selectedRoomImages.value[key] = [];
  }
}

function isActiveRoomImageSelected(
    image: RoomImage
) {
  return activeSelectedImages.value.includes(
      getRoomImageValue(image)
  );
}

function toggleActiveRoomImage(
    image: RoomImage
) {
  if (!activeRoom.value) return;

  ensureRoomSelection(activeRoom.value.roomId);

  toggleValue(
      selectedRoomImages.value[activeRoomKey.value],
      getRoomImageValue(image)
  );
}

function toggleAllActiveRoomImages() {
  if (!activeRoom.value) return;

  selectedRoomImages.value[activeRoomKey.value] =
      areAllActiveRoomImagesSelected.value
          ? []
          : activeRoomImages.value.map(getRoomImageValue);
}

/* =========================================================
 * 리뷰 이미지 다중 선택
 * ======================================================= */
function getReviewImageValue(
    image: ReviewImage
): Id {
  return (
      image.reviewImgId ??
      image.imgId ??
      image.imgPath
  );
}

function getReviewImageKey(
    image: ReviewImage,
    index: number
) {
  return (
      image.reviewImgId ??
      image.imgId ??
      `${image.imgPath}-${image.createdAt || index}`
  );
}

function isReviewImageSelected(
    image: ReviewImage
) {
  return selectedReviewImageIds.value.includes(
      getReviewImageValue(image)
  );
}

function toggleReviewImage(
    image: ReviewImage
) {
  toggleValue(
      selectedReviewImageIds.value,
      getReviewImageValue(image)
  );
}

function toggleAllReviewImages() {
  selectedReviewImageIds.value =
      areAllReviewImagesSelected.value
          ? []
          : reviewImages.value.map(getReviewImageValue);
}

function toggleValue(
    list: Id[],
    value: Id
) {
  const index = list.indexOf(value);

  if (index >= 0) {
    list.splice(index, 1);
  } else {
    list.push(value);
  }
}

/* =========================================================
 * 이미지 삭제
 *
 * 현재 제공된 Accommodation Store에는 이미지 삭제 API 함수가
 * 확인되지 않아 아래 한 군데에서 Store API를 연결하도록 구성.
 *
 * 실제 API 예시:
 *
 * await store.callDeleteAccommodationImagesAPI({
 *   accomId: accomId.value,
 *   imageType: type,
 *   imageIds: ids,
 *   roomId,
 * });
 *
 * ======================================================= */
async function requestDeleteImages(
    type: DeleteImageType,
    ids: Id[],
    roomId?: Id
) {
  if (!ids.length || deleting.value) return;

  const confirmed = window.confirm(
      `선택한 이미지 ${ids.length}장을 삭제하시겠습니까?`
  );

  if (!confirmed) return;

  deleting.value = true;

  try {
    const deleteApi = (store as any)
        .callDeleteAccommodationImagesAPI;

    if (typeof deleteApi !== 'function') {
      console.warn(
          '[AccommodationDetail] 이미지 삭제 API가 연결되지 않았습니다.',
          {
            accomId: accomId.value,
            imageType: type,
            imageIds: ids,
            roomId,
          }
      );

      window.alert(
          '이미지 삭제 UI는 적용되었습니다.\n' +
          'useAccommodationStore에 callDeleteAccommodationImagesAPI를 연결해주세요.'
      );

      return;
    }

    await deleteApi.call(store, {
      accomId: accomId.value,
      imageType: type,
      imageIds: ids,
      ...(roomId !== undefined
          ? { roomId }
          : {}),
    });

    clearSelections();
    await loadDetail();
  } finally {
    deleting.value = false;
  }
}

async function deleteSelectedMainImages() {
  await requestDeleteImages(
      'MAIN',
      [...selectedMainImageIds.value]
  );
}

async function deleteSelectedRoomImages() {
  if (!activeRoom.value) return;

  await requestDeleteImages(
      'ROOM',
      [...activeSelectedImages.value],
      activeRoom.value.roomId
  );
}

async function deleteSelectedReviewImages() {
  await requestDeleteImages(
      'REVIEW',
      [...selectedReviewImageIds.value]
  );
}

function clearSelections() {
  selectedMainImageIds.value = [];
  selectedReviewImageIds.value = [];
  selectedRoomImages.value = {};

  rooms.value.forEach((room) =>
      ensureRoomSelection(room.roomId)
  );
}

/* =========================================================
 * 이미지 확대 / 이전 / 다음 / 모바일 스와이프
 * ======================================================= */
function openImageModal(
    images: string[],
    index = 0,
    title = '이미지'
) {
  const validImages = images.filter(Boolean);

  modalImages.value = validImages.length
      ? validImages
      : [NO_IMAGE_URL];

  modalImageIndex.value = Math.min(
      Math.max(index, 0),
      modalImages.value.length - 1
  );

  modalTitle.value = title;
  imageModalVisible.value = true;

  document.body.style.overflow = 'hidden';
}

function closeImageModal() {
  imageModalVisible.value = false;
  modalImages.value = [];
  modalImageIndex.value = 0;
  touchStartX.value = null;

  document.body.style.overflow = '';
}

function moveModalImage(direction: -1 | 1) {
  const length = modalImages.value.length;

  if (length <= 1) return;

  modalImageIndex.value =
      (modalImageIndex.value + direction + length) %
      length;
}

function handleModalTouchStart(
    event: TouchEvent
) {
  touchStartX.value =
      event.changedTouches[0]?.clientX ?? null;
}

function handleModalTouchEnd(
    event: TouchEvent
) {
  if (touchStartX.value === null) return;

  const endX =
      event.changedTouches[0]?.clientX;

  if (endX === undefined) return;

  const distance = endX - touchStartX.value;

  if (Math.abs(distance) >= 45) {
    moveModalImage(distance > 0 ? -1 : 1);
  }

  touchStartX.value = null;
}

function handleKeydown(event: KeyboardEvent) {
  if (!imageModalVisible.value) return;

  if (event.key === 'Escape') {
    closeImageModal();
  }

  if (event.key === 'ArrowLeft') {
    moveModalImage(-1);
  }

  if (event.key === 'ArrowRight') {
    moveModalImage(1);
  }
}

function handleImageError(event: Event) {
  const image = event.target as HTMLImageElement;

  if (image.src !== NO_IMAGE_URL) {
    image.src = NO_IMAGE_URL;
  }
}

/* =========================================================
 * 판매자 정보
 * ======================================================= */
function openSellerModal() {
  sellerModalVisible.value = true;
}

function closeSellerModal() {
  sellerModalVisible.value = false;
}

/* =========================================================
 * 표시명
 * ======================================================= */
function getAccomTypeName(
    type?: string | number
) {
  const typeMap: Record<string, string> = {
    '1': '모텔',
    '2': '호텔/리조트',
    '3': '펜션',
    '4': '홈 & 빌라',
    '5': '캠핑',
    '6': '게하/한옥',
    '7': '레지던스',
  };

  return (
      typeMap[String(type)] ||
      (type ? String(type) : '-')
  );
}

/**
 * 플랫폼 코드는 서버 코드에 맞게 이 매핑만 수정하면 됨.
 */
function getPlatformTypeName(
    type?: string | number
) {
  if (
      type === undefined ||
      type === null ||
      type === ''
  ) {
    return '-';
  }

  const value = String(type).trim();

  const map: Record<string, string> = {
    '1': '야놀자',
    '2': '여기어때',
    YANOLJA: '야놀자',
    yanolja: '야놀자',
    GOODCHOICE: '여기어때',
    goodchoice: '여기어때',
    YEOGI: '여기어때',
    yeogi: '여기어때',
  };

  return map[value] || value;
}

function getRoomTypeName(
    type?: string | number
) {
  const typeMap: Record<string, string> = {
    '1': '숙박',
    '2': '대실',
  };

  return typeMap[String(type)] || '-';
}

/* =========================================================
 * 포맷
 * ======================================================= */
function formatBizNumber(
    value?: string | number
) {
  if (
      value === undefined ||
      value === null ||
      value === ''
  ) {
    return '-';
  }

  const number = String(value).replace(/\D/g, '');

  if (number.length !== 10) {
    return String(value);
  }

  return `${number.slice(0, 3)}-${number.slice(3, 5)}-${number.slice(5)}`;
}

function formatPhoneNumber(
    value?: string | number
) {
  if (
      value === undefined ||
      value === null ||
      value === ''
  ) {
    return '-';
  }

  const number = String(value).replace(/\D/g, '');

  if (
      number.startsWith('050') &&
      number.length === 12
  ) {
    return `${number.slice(0, 4)}-${number.slice(4, 8)}-${number.slice(8)}`;
  }

  if (number.startsWith('02')) {
    if (number.length === 9) {
      return `${number.slice(0, 2)}-${number.slice(2, 5)}-${number.slice(5)}`;
    }

    if (number.length === 10) {
      return `${number.slice(0, 2)}-${number.slice(2, 6)}-${number.slice(6)}`;
    }
  }

  if (number.length === 10) {
    return `${number.slice(0, 3)}-${number.slice(3, 6)}-${number.slice(6)}`;
  }

  if (number.length === 11) {
    return `${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7)}`;
  }

  return String(value);
}

function formatNumber(
    value?: number | string
) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return '-';
  }

  return number.toLocaleString('ko-KR');
}

function formatPrice(
    value?: number | string
) {
  const price = Number(value);

  if (!Number.isFinite(price)) {
    return '-';
  }

  return `${price.toLocaleString('ko-KR')}원`;
}

function formatCheckTime(
    value?: string | number
) {
  if (
      value === undefined ||
      value === null ||
      value === ''
  ) {
    return '-';
  }

  const time = String(value).padStart(4, '0');

  if (!/^\d{4}$/.test(time)) {
    return String(value);
  }

  return `${time.substring(0, 2)}:${time.substring(2, 4)}`;
}

function formatUseTime(
    value?: number | string
) {
  const time = Number(value);

  if (
      !Number.isFinite(time) ||
      time <= 0
  ) {
    return '-';
  }

  return `${time}시간`;
}

function getDiscountRate(
    roomPrice?: number | string,
    roomDisPrice?: number | string
) {
  const originPrice = Number(roomPrice);
  const discountPrice = Number(roomDisPrice);

  if (
      !Number.isFinite(originPrice) ||
      !Number.isFinite(discountPrice) ||
      originPrice <= 0 ||
      discountPrice <= 0 || // 이게 중요
      discountPrice >= originPrice
  ) {
    return 0;
  }

  return Math.round(
      ((originPrice - discountPrice) / originPrice) * 100
  );
}

function formatScore(value?: number) {
  const score = Number(value);

  return Number.isFinite(score)
      ? score.toFixed(1)
      : '-';
}

function formatDate(value?: string) {
  if (!value) return '-';

  const matched = value.match(
      /^(\d{4})-(\d{2})-(\d{2})/
  );

  if (!matched) return value;

  return `${matched[1]}.${matched[2]}.${matched[3]}`;
}

function parseContents(
    contents?: string
): string[] {
  if (!contents) return [];

  try {
    const parsed = JSON.parse(contents);
    const values = Array.isArray(parsed)
        ? parsed
        : [parsed];

    return values
        .map((item) => String(item).trim())
        .filter(Boolean);
  } catch {
    return contents
        .split(/\r?\n/)
        .map((item) => item.trim())
        .filter(Boolean);
  }
}

function sortByOrder<
    T extends {
      imgPath?: string;
      viewOrder?: number;
    }
>(images: T[]): T[] {
  return [...images]
      .filter(hasImagePath)
      .sort(
          (a, b) =>
              Number(
                  a.viewOrder ??
                  Number.MAX_SAFE_INTEGER
              ) -
              Number(
                  b.viewOrder ??
                  Number.MAX_SAFE_INTEGER
              )
      );
}

function hasImagePath<
    T extends { imgPath?: string }
>(
    image: T
): image is T & { imgPath: string } {
  return Boolean(image?.imgPath);
}

function toTimestamp(value?: string) {
  const timestamp = value
      ? new Date(value).getTime()
      : 0;

  return Number.isNaN(timestamp)
      ? 0
      : timestamp;
}

/* =========================================================
 * watch
 * ======================================================= */
watch(mainImages, (images) => {
  const selectedExists = images.some(
      (image) =>
          image.imgPath ===
          selectedMainImage.value
  );

  if (!selectedExists) {
    selectedMainImage.value = '';
  }

  selectedMainImageIds.value =
      selectedMainImageIds.value.filter((id) =>
          images.some(
              (image) =>
                  getMainImageValue(image) === id
          )
      );
});

watch(reviewImages, (images) => {
  selectedReviewImageIds.value =
      selectedReviewImageIds.value.filter((id) =>
          images.some(
              (image) =>
                  getReviewImageValue(image) === id
          )
      );
});

watch(
    rooms,
    (newRooms) => {
      newRooms.forEach((room) =>
          ensureRoomSelection(room.roomId)
      );

      const activeExists =
          newRooms.some(
              (room) =>
                  room.roomId === activeRoomId.value
          );

      if (!activeExists) {
        activeRoomId.value =
            newRooms[0]?.roomId ?? null;
      }
    },
    { immediate: true }
);

onMounted(() => {
  /*  loadDetail();*/
  window.addEventListener(
      'keydown',
      handleKeydown
  );
});

onBeforeUnmount(() => {
  window.removeEventListener(
      'keydown',
      handleKeydown
  );

  document.body.style.overflow = '';
});
</script>



<style scoped>
.accom-admin-page {
  padding: 16px 20px 34px;
  background: #f4f4f4;
  font-size: 12px;
}

.accom-loading {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777;
}

.accom-info-note {
  background: #fff;
}

.accom-page-head,
.admin-section-head {
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.accom-page-head {
  padding-bottom: 10px;
}

.accom-page-head h4 {
  font-size: 16px;
}

.accom-page-head__name {
  font-size: 14px;
  font-weight: 500;
  color: #666;
}

.platform-badge {
  min-width: 72px;
  height: 29px;
  padding: 0 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #cfd7e6;
  border-radius: 4px;
  background: #eef3ff;
  color: #35569a;
  font-size: 12px;
  font-weight: 700;
}

.accom-summary-body {
  padding: 8px 12px !important;
  background: #f4f4f4 !important;
}

.accom-info-table td {
  padding: 9px 8px;
  vertical-align: middle;
  border-color: #e7e7e7;
  font-size: 12px;
}

.accom-info-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.info-dot {
  flex: 0 0 15px;
  width: 15px;
  height: 15px;
  border-radius: 3px;
}

.accom-info-cell b {
  margin-right: 3px;
  font-weight: 700;
}

.accom-info-address {
  white-space: normal;
  word-break: break-word;
}

.accom-mini-info-wrap {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 10px 12px !important;
  background: #f4f4f4 !important;
}

.accom-mini-info {
  min-width: 0;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  padding: 10px;
}

.accom-mini-info__title {
  margin-bottom: 7px;
  font-size: 13px;
  font-weight: 700;
}

.accom-mini-info__body {
  max-height: 95px;
  overflow-y: auto;
  color: #444;
  font-size: 12px;
  line-height: 1.55;
}

.mini-info-line + .mini-info-line {
  margin-top: 4px;
}

.facility-inline-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.facility-inline-item {
  padding: 4px 7px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: #fafafa;
  color: #444;
}

/* =========================================================
   section
========================================================= */
.admin-section-card {
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #fff;
}

.admin-section-head {
  padding: 9px 12px;
  border-bottom: 1px solid #e6e6e6;
  background: #fafafa;
}

.admin-section-head b {
  font-size: 13px;
}

.section-count {
  margin-left: 6px;
  color: #888;
  font-size: 11px;
}

.image-action-area {
  display: flex;
  align-items: center;
  gap: 6px;
}

.image-action-area .disabled {
  opacity: 1;
  color: #777;
}

.admin-empty {
  padding: 28px 12px;
  text-align: center;
  color: #999;
}

/* =========================================================
   main preview
========================================================= */
.admin-main-gallery {
  padding: 12px;
}

.admin-main-preview {
  position: relative;
  width: 100%;
  height: 350px;
  overflow: hidden;
  border: 1px solid #ddd;
  background: #f5f5f5;
  cursor: pointer;
}

.admin-main-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.admin-main-preview__count {
  position: absolute;
  right: 12px;
  bottom: 12px;
  padding: 5px 9px;
  border-radius: 3px;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  font-size: 11px;
}

/* =========================================================
   image sliders
========================================================= */
.admin-thumb-slider {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 12px;
}

.admin-main-gallery > .admin-thumb-slider {
  padding: 10px 0 0;
}

.admin-slider-btn,
.room-tab-arrow {
  flex: 0 0 26px;
  width: 26px;
  height: 42px;
  padding: 0;
  border: none;
  background: transparent;
  color: #555;
  font-size: 21px;
  cursor: pointer;
}

.admin-thumb-track {
  min-width: 0;
  flex: 1;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
}

.admin-thumb-track::-webkit-scrollbar {
  display: none;
}

.admin-image-card {
  position: relative;
  flex: 0 0 150px;
  width: 150px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  overflow: hidden;
}

.admin-image-card.active {
  border-color: #5879bd;
  box-shadow: 0 0 0 1px #5879bd;
}

.admin-image-card.checked {
  border-color: #348fe2;
}

.admin-image-check {
  position: absolute;
  top: 6px;
  left: 6px;
  z-index: 3;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.admin-image-check .form-check-input {
  margin: 0;
  cursor: pointer;
}

.admin-image-thumb {
  width: 100%;
  height: 105px;
  padding: 0;
  border: 0;
  background: #f5f5f5;
  cursor: pointer;
}

.admin-image-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.admin-image-card__bottom {
  min-height: 34px;
  padding: 7px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  border-top: 1px solid #eee;
  font-size: 11px;
}

.zoom-text-btn {
  padding: 0;
  border: 0;
  background: transparent;
  color: #348fe2;
  font-size: 11px;
  cursor: pointer;
}

/* =========================================================
   rooms
========================================================= */
.admin-section-head--tabs {
  min-height: 52px;
}

.room-tabs-wrapper {
  min-width: 0;
  flex: 1;
  display: flex;
  align-items: center;
}

.room-tabs-container {
  min-width: 0;
  flex: 1;
  display: flex;
  gap: 5px;
  overflow-x: auto;
  scrollbar-width: none;
}

.room-tabs-container::-webkit-scrollbar {
  display: none;
}

.room-tab-btn {
  flex: 0 0 auto;
  border-color: #ddd;
  font-weight: 600;
}

.room-tab-btn.active {
  border-color: #348fe2;
  background: #348fe2;
  color: #fff;
}

.room-tab-count {
  margin-left: 3px;
  font-size: 10px;
  opacity: 0.8;
}

.room-detail-area {
  padding-bottom: 8px;
}

.room-detail-title {
  padding: 11px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid #eee;
}

.room-detail-title b {
  font-size: 13px;
}

.room-detail-title span {
  margin-left: 8px;
  color: #888;
  font-size: 11px;
}

.room-image-slider {
  border-bottom: 1px solid #eee;
}

.admin-room-table {
  margin-bottom: 0;
  font-size: 12px;
}

.admin-room-table thead th {
  padding: 9px 10px;
  border-bottom-width: 1px;
  background: #fafafa;
  color: #555;
  font-size: 11px;
  font-weight: 700;
}

.admin-room-table tbody td {
  padding: 10px;
  vertical-align: middle;
}

.room-type-label {
  min-width: 44px;
  padding: 4px 8px;
  display: inline-flex;
  justify-content: center;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
}

.room-type-label.stay {
  background: #edf4ff;
  color: #2563eb;
}

.room-type-label.rent {
  background: #fff3e5;
  color: #c76c00;
}

.discount-label {
  color: #e5484d;
  font-weight: 700;
}

/* =========================================================
   review
========================================================= */
.review-card__bottom {
  min-height: 38px;
}

/* =========================================================
   detail info
========================================================= */
.detail-info-list {
  padding: 0 12px 12px;
}

.detail-info-row {
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr);
  gap: 18px;
  padding: 12px 4px;
  border-bottom: 1px solid #eee;
}

.detail-info-row:last-child {
  border-bottom: 0;
}

.detail-info-row__title {
  color: #444;
  font-size: 12px;
  font-weight: 700;
}

.detail-info-row__content {
  min-width: 0;
  color: #555;
  font-size: 12px;
  line-height: 1.6;
  white-space: pre-line;
}

.detail-info-line {
  position: relative;
  padding-left: 10px;
}

.detail-info-line::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #999;
}

/* =========================================================
   modal
========================================================= */
.simple-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10500;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.55);
}

.simple-modal {
  width: min(580px, 94vw);
  overflow: hidden;
  border-radius: 6px;
  background: #fff;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.24);
}

.simple-modal__head {
  min-height: 50px;
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  background: #fafafa;
}

.simple-modal__head h5 {
  font-size: 14px;
}

.seller-info-table th,
.seller-info-table td {
  padding: 11px 14px;
  vertical-align: middle;
  font-size: 12px;
}

.seller-info-table th {
  width: 135px;
  background: #fafafa;
  color: #555;
  font-weight: 700;
}

.simple-modal__footer {
  padding: 10px 14px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ddd;
  background: #fafafa;
}

/* image viewer */
.image-viewer-backdrop {
  z-index: 10600;
  background: rgba(0, 0, 0, 0.82);
}

.image-viewer {
  position: relative;
  width: min(1200px, 94vw);
  height: min(850px, 90vh);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-viewer > img {
  max-width: calc(100% - 110px);
  max-height: calc(100% - 55px);
  object-fit: contain;
  border-radius: 4px;
  background: #fff;
}

.image-viewer__head {
  position: absolute;
  top: 0;
  left: 55px;
  right: 55px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-size: 12px;
}

.image-viewer__head span {
  margin-left: 8px;
  color: #bbb;
}

.image-viewer__close {
  position: absolute;
  top: 0;
  right: 0;
  width: 38px;
  height: 38px;
  border: 0;
  border-radius: 50%;
  background: #fff;
  color: #222;
  font-size: 24px;
  line-height: 1;
}

.image-viewer__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 42px;
  height: 66px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 30px;
}

.image-viewer__nav.prev {
  left: 0;
}

.image-viewer__nav.next {
  right: 0;
}

@media (max-width: 1100px) {
  .accom-mini-info-wrap {
    grid-template-columns: 1fr;
  }

  .admin-section-head--tabs {
    align-items: flex-start;
    flex-direction: column;
  }

  .room-tabs-wrapper {
    width: 100%;
  }
}

@media (max-width: 767px) {
  .accom-admin-page {
    padding: 10px;
  }

  .accom-page-head,
  .admin-section-head {
    align-items: flex-start;
    flex-direction: column;
  }

  .accom-info-table td {
    display: block;
    width: 100% !important;
  }

  .admin-main-preview {
    height: 240px;
  }

  .admin-image-card {
    flex-basis: 130px;
    width: 130px;
  }

  .admin-image-thumb {
    height: 90px;
  }

  .image-action-area {
    width: 100%;
    flex-wrap: wrap;
  }

  .detail-info-row {
    grid-template-columns: 1fr;
    gap: 5px;
  }

  .image-viewer > img {
    max-width: calc(100% - 70px);
  }
}

/* =========================================================
   이미지 리스트형 UI
   상품 리스트 화면처럼 작은 썸네일 + 컬럼 방식
========================================================= */
.image-list-head {
  min-height: 50px;
}

.image-list-table {
  width: 100%;
  table-layout: fixed;
  font-size: 12px;
}

.image-list-table thead th {
  height: 44px;
  padding: 8px 10px;
  vertical-align: middle;
  border-bottom: 1px solid #d8dde3;
  background: #fff;
  color: #343a40;
  font-size: 12px;
  font-weight: 700;
}

.image-list-table tbody td {
  height: 82px;
  padding: 8px 10px;
  vertical-align: middle;
  border-bottom: 1px solid #e1e5e9;
  background: #fff;
  color: #343a40;
  font-size: 12px;
}

.image-list-table tbody tr:hover td {
  background: #fafbfc;
}

.image-list-table tbody tr.selected-row td {
  background: #f5f9ff;
}

.image-list-table .check-col {
  width: 42px;
  text-align: center;
}

.image-list-table .num-col {
  width: 52px;
  text-align: center;
  color: #555;
}

.image-list-table .image-col {
  width: 95px;
}

.image-list-table .action-col {
  width: 100px;
  text-align: center;
}

.image-list-table .path-col {
  width: 32%;
}

.list-thumb {
  width: 70px;
  height: 64px;
  padding: 0;
  overflow: hidden;
  border: 1px solid #e2e5e8;
  border-radius: 2px;
  background: #f4f4f4;
  cursor: pointer;
}

.list-thumb img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.list-thumb:hover {
  border-color: #348fe2;
}

.image-path-text {
  max-width: 100%;
  overflow: hidden;
  color: #777;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.room-image-list-wrap {
  border-bottom: 1px solid #e5e5e5;
}

.room-image-list-head {
  min-height: 45px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid #ededed;
  background: #fafafa;
}

.room-image-list-table tbody td {
  height: 78px;
}

.image-list-table .form-check {
  min-height: auto;
}

.image-list-table .form-check-input {
  width: 16px;
  height: 16px;
  margin: 0;
  cursor: pointer;
}

@media (max-width: 1000px) {
  .image-list-table {
    min-width: 900px;
  }

  .image-list-table .path-col {
    width: 260px;
  }
}


/* =========================================================
   이미지 3개 리스트 가로 배치
========================================================= */
.image-list-3col {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  align-items: stretch;
}

.image-list-panel {
  min-width: 0;
  height: 520px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #dcdfe4;
  border-radius: 5px;
  background: #fff;
}

.image-list-panel__head {
  flex: 0 0 auto;
  min-height: 48px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-bottom: 1px solid #e2e5e9;
  background: #fafafa;
}

.image-list-panel__head b {
  font-size: 13px;
}

.image-list-panel__actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.selected-text {
  color: #777;
  font-size: 11px;
  white-space: nowrap;
}

.image-list-panel__toolbar {
  flex: 0 0 auto;
  min-height: 38px;
  padding: 7px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-bottom: 1px solid #eceff2;
  background: #fff;
  color: #555;
  font-size: 11px;
}

.image-list-panel__room-tabs {
  flex: 0 0 auto;
  min-height: 40px;
  padding: 5px 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  border-bottom: 1px solid #eceff2;
  background: #fff;
}

.compact-room-tabs {
  min-width: 0;
  flex: 1;
  display: flex;
  gap: 4px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
}

.compact-room-tabs::-webkit-scrollbar {
  display: none;
}

.compact-room-tab {
  flex: 0 0 auto;
  height: 28px;
  padding: 0 9px;
  border: 1px solid #d8dde4;
  border-radius: 4px;
  background: #fff;
  color: #555;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}

.compact-room-tab.active {
  border-color: #348fe2;
  background: #348fe2;
  color: #fff;
}

.room-tab-arrow.compact {
  flex: 0 0 22px;
  width: 22px;
  height: 28px;
  font-size: 17px;
}

.current-room-name {
  max-width: 150px;
  overflow: hidden;
  color: #348fe2;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-list-panel__scroll {
  min-height: 0;
  flex: 1 1 auto;
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
}

.image-list-panel__scroll::-webkit-scrollbar {
  width: 7px;
}

.image-list-panel__scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.image-list-panel__scroll::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background: #c8cdd3;
}

.image-list-panel__scroll::-webkit-scrollbar-thumb:hover {
  background: #aeb5bd;
}

.compact-image-list {
  display: flex;
  flex-direction: column;
}

.compact-image-row {
  position: relative;
  min-width: 0;
  min-height: 82px;
  padding: 8px 8px 8px 6px;
  display: grid;
  grid-template-columns: 22px 24px 68px minmax(0, 1fr) 28px;
  gap: 7px;
  align-items: center;
  border-bottom: 1px solid #e7eaee;
  background: #fff;
}

.compact-image-row:hover {
  background: #fafbfc;
}

.compact-image-row.selected {
  background: #f3f8ff;
}

.compact-image-row__check {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.compact-image-row__check .form-check-input {
  width: 15px;
  height: 15px;
  margin: 0;
  cursor: pointer;
}

.compact-image-row__num {
  color: #777;
  font-size: 11px;
  text-align: center;
}

.compact-image-thumb {
  width: 68px;
  height: 62px;
  padding: 0;
  overflow: hidden;
  border: 1px solid #e0e4e8;
  border-radius: 3px;
  background: #f4f4f4;
  cursor: pointer;
}

.compact-image-thumb:hover {
  border-color: #348fe2;
}

.compact-image-thumb img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.compact-image-row__info {
  min-width: 0;
}

.compact-image-row__title {
  margin-bottom: 3px;
  overflow: hidden;
  color: #2e3338;
  font-size: 12px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.compact-image-row__sub {
  margin-bottom: 3px;
  color: #777;
  font-size: 10px;
}

.compact-image-row__path {
  max-width: 100%;
  overflow: hidden;
  color: #999;
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.compact-image-row__zoom {
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid #d9dde2;
  border-radius: 4px;
  background: #fff;
  color: #666;
  cursor: pointer;
}

.compact-image-row__zoom:hover {
  border-color: #348fe2;
  color: #348fe2;
}

.compact-empty {
  padding: 60px 10px;
}

/* 3열을 최대한 유지하고, 아주 좁아지면 가로 스크롤로 대응 */
@media (max-width: 1200px) {
  .image-list-3col {
    grid-template-columns: repeat(3, minmax(360px, 1fr));
    overflow-x: auto;
    padding-bottom: 5px;
  }

  .image-list-panel {
    min-width: 360px;
  }
}

@media (max-width: 767px) {
  .image-list-3col {
    grid-template-columns: repeat(3, 340px);
  }

  .image-list-panel {
    min-width: 340px;
    height: 460px;
  }

  .compact-image-row {
    grid-template-columns: 20px 20px 58px minmax(0, 1fr) 26px;
    gap: 5px;
  }

  .compact-image-thumb {
    width: 58px;
    height: 54px;
  }
}


/* =========================================================
   이미지 영역 비율 재배치
   메인 25% / 리뷰 25% / 객실 50%
========================================================= */
.image-list-3col {
  display: grid;
  grid-template-columns:
    minmax(240px, 0.9fr)
    minmax(240px, 0.9fr)
    minmax(460px, 2fr);
  gap: 10px;
  align-items: stretch;
}

/* 메인 / 리뷰는 조금 더 컴팩트하게 */
.image-list-panel--main .compact-image-row,
.image-list-panel--review .compact-image-row {
  grid-template-columns: 20px 20px 62px minmax(0, 1fr) 26px;
  gap: 5px;
  min-height: 76px;
  padding: 7px 6px;
}

.image-list-panel--main .compact-image-thumb,
.image-list-panel--review .compact-image-thumb {
  width: 62px;
  height: 56px;
}

.image-list-panel--main .image-list-panel__head,
.image-list-panel--review .image-list-panel__head {
  padding-left: 8px;
  padding-right: 8px;
}

/* 객실 영역은 가로를 넓게 사용 */
.image-list-panel--room .compact-image-row {
  grid-template-columns: 22px 26px 78px minmax(0, 1fr) 32px;
  gap: 9px;
  min-height: 90px;
}

.image-list-panel--room .compact-image-thumb {
  width: 78px;
  height: 70px;
}

.image-list-panel--room .compact-room-tabs {
  gap: 6px;
}

.image-list-panel--room .compact-room-tab {
  max-width: 220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-list-panel--room .current-room-name {
  max-width: 260px;
}

/* 중간 해상도에서도 3개 가로 배치 유지하고,
   화면보다 넓어지면 바깥쪽 가로 스크롤 */
@media (max-width: 1350px) {
  .image-list-3col {
    grid-template-columns: 280px 280px minmax(520px, 1fr);
    overflow-x: auto;
    padding-bottom: 6px;
  }

  .image-list-panel--main,
  .image-list-panel--review {
    min-width: 280px;
  }

  .image-list-panel--room {
    min-width: 520px;
  }
}

@media (max-width: 767px) {
  .image-list-3col {
    grid-template-columns: 260px 260px 500px;
  }

  .image-list-panel--main,
  .image-list-panel--review {
    min-width: 260px;
  }

  .image-list-panel--room {
    min-width: 500px;
  }
}


/* =========================================================
   객실 이미지 + 객실 상품정보 결합
========================================================= */

/* 객실 패널만 세로 공간을 더 사용 */
.image-list-panel--room {
  height: 680px;
}

/* 메인 / 리뷰는 기존 높이 유지 */
.image-list-panel--main,
.image-list-panel--review {
  height: 520px;
}

/* 객실 이미지 목록은 상단 영역으로 제한 */
.image-list-panel--room > .image-list-panel__scroll {
  flex: 0 0 255px;
  min-height: 0;
  overflow-y: auto;
}

/* 객실 상품 영역 */
.room-product-area {
  min-height: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  border-top: 1px solid #dfe3e8;
  background: #fff;
}

.room-product-area__head {
  flex: 0 0 auto;
  min-height: 42px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid #e7eaee;
  background: #fafafa;
}

.room-product-area__head b {
  font-size: 12px;
}

.room-product-current {
  max-width: 260px;
  overflow: hidden;
  color: #348fe2;
  font-size: 11px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.room-product-area__scroll {
  min-height: 0;
  flex: 1 1 auto;
  overflow: auto;
}

.room-product-area__scroll::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

.room-product-area__scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.room-product-area__scroll::-webkit-scrollbar-thumb {
  border-radius: 6px;
  background: #c8cdd3;
}

.room-product-table {
  min-width: 880px;
  font-size: 11px;
}

.room-product-table thead th {
  position: sticky;
  top: 0;
  z-index: 2;
  padding: 7px 8px;
  background: #fff;
  font-size: 11px;
  font-weight: 700;
  border-bottom: 1px solid #dfe3e8;
}

.room-product-table tbody td {
  padding: 7px 8px;
  font-size: 11px;
}

.room-product-empty {
  flex: 1 1 auto;
}

/* 전체 3열 높이를 객실 패널 기준으로 맞추고 싶으면 아래를 사용.
   지금은 메인/리뷰는 작게, 객실은 크게 유지 */
@media (max-width: 1350px) {
  .image-list-panel--room {
    min-width: 560px;
    height: 680px;
  }
}

@media (max-width: 767px) {
  .image-list-panel--room {
    min-width: 520px;
    height: 640px;
  }

  .image-list-panel--room > .image-list-panel__scroll {
    flex-basis: 230px;
  }
}


/* =========================================================
   이미지 리스트 세로 배치 + 컴팩트 썸네일
========================================================= */
.image-list-vertical {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.image-list-vertical .vertical-image-panel {
  width: 100% !important;
  min-width: 0 !important;
  height: 300px !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
  border: 1px solid #d9dde3 !important;
  border-radius: 6px !important;
  background: #fff !important;
}

.image-list-vertical .image-list-panel__head {
  flex: 0 0 44px !important;
  min-height: 44px !important;
  height: 44px !important;
  padding: 0 10px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  border-bottom: 1px solid #e6e9ed !important;
  background: #fafafa !important;
}

.image-list-vertical .image-list-panel__toolbar {
  flex: 0 0 34px !important;
  min-height: 34px !important;
  height: 34px !important;
  padding: 0 10px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  border-bottom: 1px solid #eceff2 !important;
  background: #fff !important;
  font-size: 11px !important;
}

.image-list-vertical .image-list-panel__room-tabs {
  flex: 0 0 40px !important;
  min-height: 40px !important;
  height: 40px !important;
  padding: 5px 8px !important;
  display: flex !important;
  align-items: center !important;
  gap: 5px !important;
  border-bottom: 1px solid #e6e9ed !important;
  background: #f7f8fa !important;
}

.image-list-vertical .image-list-panel__scroll {
  min-height: 0 !important;
  flex: 1 1 auto !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
}

/* 이미지는 작게 */
.image-list-vertical .compact-image-row {
  min-height: 66px !important;
  padding: 6px 8px !important;
  display: grid !important;
  grid-template-columns: 18px 22px 54px minmax(0, 1fr) 26px !important;
  gap: 7px !important;
  align-items: center !important;
  border-bottom: 1px solid #edf0f2 !important;
}

.image-list-vertical .compact-image-thumb {
  width: 54px !important;
  height: 48px !important;
  border-radius: 4px !important;
}

.image-list-vertical .compact-image-thumb img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
}

.image-list-vertical .compact-image-row__title {
  font-size: 11px !important;
  font-weight: 600 !important;
}

.image-list-vertical .compact-image-row__zoom {
  width: 26px !important;
  height: 26px !important;
}

/* 객실 탭은 가로 스크롤 유지 */
.image-list-vertical .compact-room-tabs {
  min-width: 0 !important;
  flex: 1 1 auto !important;
  display: flex !important;
  gap: 5px !important;
  overflow-x: auto !important;
  overflow-y: hidden !important;
  scrollbar-width: none !important;
}

.image-list-vertical .compact-room-tabs::-webkit-scrollbar {
  display: none !important;
}

.image-list-vertical .compact-room-tab {
  flex: 0 0 auto !important;
  max-width: 200px !important;
  height: 28px !important;
  padding: 0 10px !important;
  overflow: hidden !important;
  border: 1px solid #d9dde3 !important;
  border-radius: 4px !important;
  background: #fff !important;
  font-size: 11px !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.image-list-vertical .compact-room-tab.active {
  border-color: #348fe2 !important;
  background: #348fe2 !important;
  color: #fff !important;
}

.image-list-vertical .room-tab-arrow.compact {
  flex: 0 0 24px !important;
  width: 24px !important;
  height: 28px !important;
}

/* 기존 3열/객실 결합 CSS 영향 제거 */
.image-list-3col,
.room-product-area {
  all: unset;
}

@media (max-width: 767px) {
  .image-list-vertical .vertical-image-panel {
    height: 280px !important;
  }
}


/* =========================================================
   최종: 이미지 영역 + 이미지 리스트 모두 세로 자연 확장
   내부 고정 높이/스크롤 제거
========================================================= */
.image-list-vertical {
  display: flex !important;
  flex-direction: column !important;
  gap: 12px !important;
}

/* 패널 자체가 내용만큼 아래로 늘어나도록 */
.image-list-vertical .vertical-image-panel {
  width: 100% !important;
  min-width: 0 !important;
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  display: block !important;
  overflow: visible !important;
  border: 1px solid #d9dde3 !important;
  border-radius: 6px !important;
  background: #fff !important;
}

/* 헤더 */
.image-list-vertical .image-list-panel__head {
  min-height: 42px !important;
  height: auto !important;
  padding: 8px 10px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 8px !important;
  border-bottom: 1px solid #e6e9ed !important;
  background: #fafafa !important;
}

/* 전체 선택 */
.image-list-vertical .image-list-panel__toolbar {
  min-height: 34px !important;
  height: auto !important;
  padding: 7px 10px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 8px !important;
  border-bottom: 1px solid #eceff2 !important;
  background: #fff !important;
}

/* 객실 탭 */
.image-list-vertical .image-list-panel__room-tabs {
  min-height: 40px !important;
  height: auto !important;
  padding: 5px 8px !important;
  display: flex !important;
  align-items: center !important;
  gap: 5px !important;
  border-bottom: 1px solid #e6e9ed !important;
  background: #f7f8fa !important;
}

/* 핵심: 내부 세로 스크롤 제거 */
.image-list-vertical .image-list-panel__scroll,
.image-list-vertical .image-list-panel--room > .image-list-panel__scroll {
  width: 100% !important;
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  overflow: visible !important;
  display: block !important;
}

/* 목록 자체는 완전한 세로 리스트 */
.image-list-vertical .compact-image-list {
  width: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 0 !important;
}

/* 한 이미지 = 한 줄 */
.image-list-vertical .compact-image-row {
  width: 100% !important;
  min-width: 0 !important;
  min-height: 62px !important;
  height: auto !important;
  padding: 6px 10px !important;
  display: grid !important;
  grid-template-columns: 20px 26px 54px minmax(0, 1fr) 28px !important;
  gap: 8px !important;
  align-items: center !important;
  border-bottom: 1px solid #edf0f2 !important;
  background: #fff !important;
}

.image-list-vertical .compact-image-row:last-child {
  border-bottom: 0 !important;
}

.image-list-vertical .compact-image-row:hover {
  background: #fafbfc !important;
}

.image-list-vertical .compact-image-row.selected {
  background: #f4f8ff !important;
}

/* 작은 이미지 크기는 그대로 유지 */
.image-list-vertical .compact-image-thumb {
  width: 54px !important;
  height: 48px !important;
  min-width: 54px !important;
  min-height: 48px !important;
  padding: 0 !important;
  overflow: hidden !important;
  border: 1px solid #e0e3e7 !important;
  border-radius: 4px !important;
  background: #f6f6f6 !important;
}

.image-list-vertical .compact-image-thumb img {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
  object-fit: cover !important;
}

/* 정보 */
.image-list-vertical .compact-image-row__info {
  min-width: 0 !important;
}

.image-list-vertical .compact-image-row__title {
  overflow: hidden !important;
  color: #2d353c !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  line-height: 1.4 !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.image-list-vertical .compact-image-row__num {
  color: #777 !important;
  font-size: 11px !important;
  text-align: center !important;
}

.image-list-vertical .compact-image-row__zoom {
  width: 26px !important;
  height: 26px !important;
  padding: 0 !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* empty도 너무 높게 잡지 않음 */
.image-list-vertical .compact-empty {
  min-height: 72px !important;
  padding: 24px 12px !important;
}

/* 객실명 탭은 가로 유지 */
.image-list-vertical .compact-room-tabs {
  min-width: 0 !important;
  flex: 1 1 auto !important;
  display: flex !important;
  flex-direction: row !important;
  gap: 5px !important;
  overflow-x: auto !important;
  overflow-y: hidden !important;
  scrollbar-width: none !important;
}

.image-list-vertical .compact-room-tabs::-webkit-scrollbar {
  display: none !important;
}

@media (max-width: 767px) {
  .image-list-vertical .vertical-image-panel {
    height: auto !important;
    max-height: none !important;
  }

  .image-list-vertical .compact-image-row {
    grid-template-columns: 18px 22px 50px minmax(0, 1fr) 26px !important;
    padding: 6px 8px !important;
  }

  .image-list-vertical .compact-image-thumb {
    width: 50px !important;
    min-width: 50px !important;
    height: 46px !important;
    min-height: 46px !important;
  }
}


/* =========================================================
   참고 화면 스타일 적용
   영역은 세로 배치, 이미지 하나는 세로형 카드
========================================================= */

/* 메인 / 리뷰 / 객실 영역은 위에서 아래로 */
.image-list-vertical {
  display: flex !important;
  flex-direction: column !important;
  gap: 14px !important;
}

/* 각 이미지 섹션 */
.image-list-vertical .vertical-image-panel {
  width: 100% !important;
  min-width: 0 !important;
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  overflow: hidden !important;
  border: 1px solid #dfe3e8 !important;
  border-radius: 8px !important;
  background: #fff !important;
}

/* 제목 */
.image-list-vertical .image-list-panel__head {
  min-height: 44px !important;
  height: auto !important;
  padding: 9px 12px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  gap: 10px !important;
  border-bottom: 1px solid #e8ebef !important;
  background: #fafbfc !important;
}

.image-list-vertical .image-list-panel__head b {
  color: #252932 !important;
  font-size: 13px !important;
  font-weight: 700 !important;
}

/* 전체 선택 */
.image-list-vertical .image-list-panel__toolbar {
  min-height: 38px !important;
  height: auto !important;
  padding: 7px 12px !important;
  border-bottom: 1px solid #edf0f3 !important;
  background: #fff !important;
}

/* 객실 탭 */
.image-list-vertical .image-list-panel__room-tabs {
  min-height: 43px !important;
  height: auto !important;
  padding: 6px 10px !important;
  border-bottom: 1px solid #e8ebef !important;
  background: #f7f8fa !important;
}

/* 스크롤 강제 높이 제거 */
.image-list-vertical .image-list-panel__scroll,
.image-list-vertical .image-list-panel--room > .image-list-panel__scroll {
  width: 100% !important;
  height: auto !important;
  min-height: 0 !important;
  max-height: none !important;
  padding: 12px !important;
  overflow: visible !important;
}

/* =========================================================
   이미지 리스트
   참고 소스의 yd-room-image-card-grid 느낌
========================================================= */
.image-list-vertical .compact-image-list {
  width: 100% !important;
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(112px, 132px)) !important;
  gap: 10px !important;
  align-items: start !important;
  justify-content: start !important;
}

/* 이미지 하나 = 세로 카드 */
.image-list-vertical .compact-image-row {
  position: relative !important;
  width: 100% !important;
  min-width: 0 !important;
  min-height: 0 !important;
  height: auto !important;
  padding: 0 !important;

  display: flex !important;
  flex-direction: column !important;
  align-items: stretch !important;
  gap: 0 !important;

  overflow: hidden !important;
  border: 1px solid #e4e7eb !important;
  border-radius: 8px !important;
  background: #fff !important;

  transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease,
      transform 0.15s ease !important;
}

.image-list-vertical .compact-image-row:hover {
  border-color: #cbd2da !important;
  background: #fff !important;
  transform: translateY(-1px) !important;
}

.image-list-vertical .compact-image-row.selected {
  border-color: #348fe2 !important;
  background: #fff !important;
  box-shadow: 0 0 0 2px rgba(52, 143, 226, 0.12) !important;
}

/* 체크박스는 이미지 위 우측 */
.image-list-vertical .compact-image-row__check {
  position: absolute !important;
  z-index: 4 !important;
  top: 7px !important;
  right: 7px !important;

  width: 24px !important;
  height: 24px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  border: 1px solid #d7dce2 !important;
  border-radius: 50% !important;
  background: rgba(255, 255, 255, 0.94) !important;
}

.image-list-vertical .compact-image-row__check .form-check-input {
  width: 14px !important;
  height: 14px !important;
  margin: 0 !important;
}

/* 번호도 이미지 위 좌측 배지 */
.image-list-vertical .compact-image-row__num {
  position: absolute !important;
  z-index: 4 !important;
  top: 7px !important;
  left: 7px !important;

  min-width: 23px !important;
  height: 23px !important;
  padding: 0 6px !important;

  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;

  border-radius: 12px !important;
  background: rgba(30, 34, 40, 0.76) !important;
  color: #fff !important;
  font-size: 10px !important;
  font-weight: 700 !important;
}

/* 썸네일이 카드 상단 전체 */
.image-list-vertical .compact-image-thumb {
  width: 100% !important;
  height: 96px !important;
  min-width: 0 !important;
  min-height: 96px !important;

  padding: 0 !important;
  overflow: hidden !important;

  border: 0 !important;
  border-radius: 0 !important;
  background: #f1f3f5 !important;
}

.image-list-vertical .compact-image-thumb img {
  width: 100% !important;
  height: 100% !important;
  display: block !important;
  object-fit: cover !important;
}

/* 하단 정보 */
.image-list-vertical .compact-image-row__info {
  width: 100% !important;
  min-width: 0 !important;
  padding: 8px 9px !important;
  background: #fff !important;
}

.image-list-vertical .compact-image-row__title {
  width: 100% !important;
  overflow: hidden !important;
  color: #30353c !important;
  font-size: 11px !important;
  font-weight: 600 !important;
  line-height: 1.4 !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

/* 확대는 썸네일 우측 아래 */
.image-list-vertical .compact-image-row__zoom {
  position: absolute !important;
  z-index: 4 !important;
  top: 64px !important;
  right: 7px !important;

  width: 25px !important;
  height: 25px !important;
  padding: 0 !important;

  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;

  border: 0 !important;
  border-radius: 50% !important;

  background: rgba(26, 30, 36, 0.72) !important;
  color: #fff !important;
  font-size: 10px !important;
}

/* =========================================================
   객실 탭
========================================================= */
.image-list-vertical .compact-room-tabs {
  min-width: 0 !important;
  flex: 1 1 auto !important;
  display: flex !important;
  gap: 6px !important;
  overflow-x: auto !important;
  overflow-y: hidden !important;
  scrollbar-width: none !important;
}

.image-list-vertical .compact-room-tabs::-webkit-scrollbar {
  display: none !important;
}

.image-list-vertical .compact-room-tab {
  flex: 0 0 auto !important;
  max-width: 220px !important;
  height: 29px !important;
  padding: 0 11px !important;

  overflow: hidden !important;

  border: 1px solid #d9dee5 !important;
  border-radius: 5px !important;
  background: #fff !important;

  color: #555d67 !important;
  font-size: 11px !important;
  font-weight: 600 !important;

  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.image-list-vertical .compact-room-tab.active {
  border-color: #348fe2 !important;
  background: #348fe2 !important;
  color: #fff !important;
}

/* 비어 있을 때 */
.image-list-vertical .compact-empty {
  min-height: 76px !important;
  margin: 0 !important;
  padding: 25px 12px !important;
  border: 0 !important;
}

/* =========================================================
   반응형
========================================================= */
@media (max-width: 1200px) {
  .image-list-vertical .compact-image-list {
    grid-template-columns: repeat(auto-fill, minmax(105px, 125px)) !important;
  }

  .image-list-vertical .compact-image-thumb {
    height: 90px !important;
    min-height: 90px !important;
  }

  .image-list-vertical .compact-image-row__zoom {
    top: 58px !important;
  }
}

@media (max-width: 767px) {
  .image-list-vertical .image-list-panel__scroll,
  .image-list-vertical .image-list-panel--room > .image-list-panel__scroll {
    padding: 10px !important;
  }

  .image-list-vertical .compact-image-list {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    gap: 8px !important;
  }

  .image-list-vertical .compact-image-thumb {
    height: 82px !important;
    min-height: 82px !important;
  }

  .image-list-vertical .compact-image-row__zoom {
    top: 50px !important;
  }
}

@media (max-width: 520px) {
  .image-list-vertical .compact-image-list {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}


/* =========================================================
   최종 이미지 표시
   - 카드 크기 축소
   - 각 이미지 영역은 최대 2줄까지만 노출
   - 초과 이미지는 내부 세로 스크롤
========================================================= */

/* 이미지 목록 영역 */
.image-list-vertical .image-list-panel__scroll,
.image-list-vertical .image-list-panel--room > .image-list-panel__scroll {
  width: 100% !important;
  height: auto !important;
  min-height: 0 !important;

  /*
   * 카드 약 96px × 2줄
   * gap + padding 포함해서 약 205px
   */
  max-height: 205px !important;

  padding: 9px 10px !important;

  overflow-y: auto !important;
  overflow-x: hidden !important;

  scrollbar-width: thin !important;
}

/* 카드 리스트 */
.image-list-vertical .compact-image-list {
  width: 100% !important;

  display: grid !important;

  /* 카드 자체를 기존보다 작게 */
  grid-template-columns:
    repeat(auto-fill, minmax(88px, 104px)) !important;

  gap: 8px !important;

  align-items: start !important;
  justify-content: start !important;
}

/* 카드 */
.image-list-vertical .compact-image-row {
  position: relative !important;

  width: 100% !important;
  min-width: 0 !important;
  min-height: 0 !important;
  height: auto !important;

  padding: 0 !important;

  display: flex !important;
  flex-direction: column !important;

  overflow: hidden !important;

  border: 1px solid #e2e6ea !important;
  border-radius: 6px !important;

  background: #fff !important;
}

/* 이미지 */
.image-list-vertical .compact-image-thumb {
  width: 100% !important;

  height: 68px !important;
  min-height: 68px !important;

  padding: 0 !important;

  border: 0 !important;
  border-radius: 0 !important;

  overflow: hidden !important;

  background: #f2f3f5 !important;
}

.image-list-vertical .compact-image-thumb img {
  width: 100% !important;
  height: 100% !important;

  display: block !important;

  object-fit: cover !important;
}

/* 카드 하단 정보 */
.image-list-vertical .compact-image-row__info {
  width: 100% !important;
  min-width: 0 !important;

  padding: 5px 6px !important;

  background: #fff !important;
}

.image-list-vertical .compact-image-row__title {
  overflow: hidden !important;

  color: #343a40 !important;

  font-size: 10px !important;
  font-weight: 600 !important;
  line-height: 1.3 !important;

  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

/* 번호 */
.image-list-vertical .compact-image-row__num {
  position: absolute !important;

  z-index: 4 !important;

  top: 5px !important;
  left: 5px !important;

  min-width: 20px !important;
  height: 20px !important;

  padding: 0 5px !important;

  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;

  border-radius: 10px !important;

  background: rgba(25, 29, 34, 0.72) !important;
  color: #fff !important;

  font-size: 9px !important;
  font-weight: 700 !important;
}

/* 체크 */
.image-list-vertical .compact-image-row__check {
  position: absolute !important;

  z-index: 5 !important;

  top: 5px !important;
  right: 5px !important;

  width: 21px !important;
  height: 21px !important;

  display: flex !important;
  align-items: center !important;
  justify-content: center !important;

  border: 1px solid #d6dbe1 !important;
  border-radius: 50% !important;

  background: rgba(255, 255, 255, 0.94) !important;
}

.image-list-vertical .compact-image-row__check .form-check-input {
  width: 12px !important;
  height: 12px !important;

  margin: 0 !important;
}

/* 확대 버튼 */
.image-list-vertical .compact-image-row__zoom {
  position: absolute !important;

  z-index: 5 !important;

  top: 42px !important;
  right: 5px !important;

  width: 21px !important;
  height: 21px !important;

  padding: 0 !important;

  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;

  border: 0 !important;
  border-radius: 50% !important;

  background: rgba(20, 24, 29, 0.7) !important;
  color: #fff !important;

  font-size: 9px !important;
}

/* 선택 */
.image-list-vertical .compact-image-row.selected {
  border-color: #348fe2 !important;

  box-shadow:
      0 0 0 1px rgba(52, 143, 226, 0.18) !important;
}

/* hover */
.image-list-vertical .compact-image-row:hover {
  border-color: #c5ccd4 !important;

  transform: none !important;
}

/* 스크롤 */
.image-list-vertical .image-list-panel__scroll::-webkit-scrollbar {
  width: 6px !important;
}

.image-list-vertical .image-list-panel__scroll::-webkit-scrollbar-track {
  background: #f1f2f4 !important;
}

.image-list-vertical .image-list-panel__scroll::-webkit-scrollbar-thumb {
  border-radius: 6px !important;
  background: #c8cdd3 !important;
}

/* 이미지가 없을 때는 2줄 높이를 차지하지 않도록 */
.image-list-vertical .compact-empty {
  min-height: 65px !important;
  padding: 20px 10px !important;
}

/* =========================================================
   반응형
========================================================= */
@media (max-width: 1000px) {
  .image-list-vertical .compact-image-list {
    grid-template-columns:
      repeat(auto-fill, minmax(82px, 96px)) !important;
  }
}

@media (max-width: 767px) {
  .image-list-vertical .image-list-panel__scroll,
  .image-list-vertical .image-list-panel--room > .image-list-panel__scroll {
    max-height: 195px !important;
    padding: 8px !important;
  }

  .image-list-vertical .compact-image-list {
    grid-template-columns:
      repeat(auto-fill, minmax(76px, 90px)) !important;

    gap: 7px !important;
  }

  .image-list-vertical .compact-image-thumb {
    height: 64px !important;
    min-height: 64px !important;
  }

  .image-list-vertical .compact-image-row__zoom {
    top: 38px !important;
  }
}

</style>

```

````

`````
