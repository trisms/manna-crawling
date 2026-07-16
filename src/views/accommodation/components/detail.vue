<template>
  <panel>
    <panel-body class="yd-detail-page">
      <div v-if="loading" class="yd-loading">
        숙소 정보를 불러오는 중입니다.
      </div>

      <template v-else>
        <!-- 상단 경로 -->
        <nav class="yd-breadcrumb">
          <span class="yd-breadcrumb__home">
            <i class="fa fa-home"></i>
          </span>
          <span>숙소</span>
          <span class="sep">›</span>
          <span>{{ regionLabel }}</span>
          <span class="sep">›</span>
          <strong>{{ info.accomName || '-' }}</strong>
        </nav>

        <!-- 메인 이미지 + 객실 이미지 -->
        <section class="yd-gallery">
          <div class="yd-main-gallery">
            <button
                type="button"
                class="yd-gallery__main"
                @click="openImageModal(mainImage)"
            >
              <img
                  :src="mainImage"
                  alt="대표 이미지"
                  @error="handleImageError"
              />
            </button>

            <div v-if="mainImages.length > 1" class="yd-image-slider">
              <button
                  type="button"
                  class="yd-image-slider__arrow left"
                  aria-label="메인 이미지 이전"
                  @click="scrollImageSlider(mainThumbsRef, -1)"
              >
                <i class="fa fa-chevron-left"></i>
              </button>

              <div
                  ref="mainThumbsRef"
                  class="yd-main-gallery__thumbs yd-image-slider__track"
                  @wheel="handleHorizontalWheel($event, mainThumbsRef)"
              >
                <button
                    v-for="(image, index) in mainImages"
                    :key="getMainImageKey(image, index)"
                    type="button"
                    class="yd-main-gallery__thumb"
                    :class="{ active: image.imgPath === mainImage }"
                    @click="selectedMainImage = image.imgPath"
                >
                  <img
                      :src="image.imgPath"
                      :alt="`메인 이미지 ${index + 1}`"
                      @error="handleImageError"
                  />
                  <span class="yd-main-gallery__order">{{ index + 1 }}</span>
                </button>
              </div>

              <button
                  type="button"
                  class="yd-image-slider__arrow right"
                  aria-label="메인 이미지 다음"
                  @click="scrollImageSlider(mainThumbsRef, 1)"
              >
                <i class="fa fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <section class="yd-section">
            <div v-if="rooms.length" class="yd-room-tabs-wrap">
              <!-- 객실 탭 -->
              <div class="yd-room-tabs-nav">
                <button
                    type="button"
                    class="yd-room-tabs-arrow left"
                    aria-label="객실 탭 왼쪽으로 이동"
                    @click="scrollRoomTabs(-1)"
                >
                  <i class="fa fa-chevron-left"></i>
                </button>

                <div ref="roomTabsRef" class="yd-room-tabs">
                  <button
                      v-for="roomItem in rooms"
                      :key="roomItem.roomId"
                      type="button"
                      class="yd-room-tab"
                      :class="{ active: activeRoomId === roomItem.roomId }"
                      @click="selectRoom(roomItem.roomId)"
                  >
                    <span class="yd-room-tab__name">
                      {{ roomItem.roomName || '객실명 없음' }}
                    </span>
                    <span class="yd-room-tab__count">
                      {{ roomItem.roomInfo?.length || 0 }}개 상품
                    </span>
                  </button>
                </div>

                <button
                    type="button"
                    class="yd-room-tabs-arrow right"
                    aria-label="객실 탭 오른쪽으로 이동"
                    @click="scrollRoomTabs(1)"
                >
                  <i class="fa fa-chevron-right"></i>
                </button>
              </div>

              <!-- 선택 객실 -->
              <div v-if="activeRoom" class="yd-room-tab-panel">
                <div class="yd-room-tab-panel__top">
                  <div>
                    <h3 class="yd-room-tab-panel__title">
                      {{ activeRoom.roomName || '-' }}
                    </h3>
                    <p class="yd-room-tab-panel__desc">
                      등록 이미지 {{ activeRoomImages.length }}장 ·
                      객실 상품 {{ activeRoom.roomInfo?.length || 0 }}개
                    </p>
                  </div>

                  <button
                      type="button"
                      class="yd-room-upload-btn"
                      :disabled="selectedImageCount === 0"
                  >
                    선택 이미지 업로드
                  </button>
                </div>

                <div class="yd-room-image-check-section">
                  <div class="yd-room-image-check-section__head">
                    <div class="yd-room-image-check-section__title-wrap">
                      <div class="yd-room-image-check-section__title">
                        객실 이미지
                      </div>
                      <div class="yd-room-image-check-section__info">
                        선택 {{ selectedImageCount }} / {{ activeRoomImages.length }}
                      </div>
                    </div>

                    <button
                        type="button"
                        class="yd-room-image-action-btn"
                        :disabled="activeRoomImages.length === 0"
                        @click="toggleAllActiveRoomImages"
                    >
                      {{ areAllActiveRoomImagesSelected ? '전체해제' : '전체선택' }}
                    </button>
                  </div>

                  <div v-if="activeRoomImages.length" class="yd-room-image-scroll">
                    <div class="yd-room-image-card-grid">
                      <button
                          v-for="(image, index) in activeRoomImages"
                          :key="getRoomImageKey(image, index)"
                          type="button"
                          class="yd-room-image-card"
                          :class="{ selected: isActiveRoomImageSelected(image) }"
                          @click="toggleActiveRoomImage(image)"
                      >
                        <div class="yd-room-image-card__thumb-wrap">
                          <img
                              :src="image.imgPath"
                              alt="객실 이미지"
                              class="yd-room-image-card__thumb"
                              @error="handleImageError"
                          />

                          <span class="yd-room-image-card__badge">
                            {{ index + 1 }}
                          </span>

                          <span class="yd-room-image-card__check">
                            <i class="fa fa-check"></i>
                          </span>

                          <span
                              class="yd-room-image-card__zoom"
                              @click.stop="openImageModal(image.imgPath)"
                          >
                            <i class="fa fa-search-plus"></i>
                          </span>
                        </div>

                        <div class="yd-room-image-card__meta">
                          <div class="yd-room-image-card__title">
                            이미지 {{ index + 1 }}
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div v-else class="yd-empty-panel">
                    등록된 객실 이미지가 없습니다.
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="yd-empty-panel">
              등록된 객실 정보가 없습니다.
            </div>
          </section>
        </section>

        <!-- 숙소 기본 정보 -->
        <section class="yd-summary">
          <div>
            <div class="yd-summary__type">
              {{ getAccomTypeName(info.accomType) }}
            </div>
            <h1 class="yd-summary__title">
              {{ info.accomName || '-' }}
            </h1>
          </div>
        </section>

        <section class="yd-info-grid">
          <article class="yd-info-card">
            <div v-if="previewInfo?.title" class="yd-info-card__title">
              {{ previewInfo.title }}
            </div>

            <ul v-if="previewContents.length" class="yd-preview-list">
              <li
                  v-for="(content, index) in previewContents"
                  :key="`preview-${index}`"
                  class="yd-preview-list__item"
              >
                {{ content }}
              </li>
            </ul>

            <div v-else class="yd-info-card__content--review">
              등록된 숙소 소개 정보가 없습니다.
            </div>
          </article>

          <article class="yd-info-card">
            <div class="yd-info-card__title">
              <span>서비스 및 부대시설</span>
              <i class="fa fa-angle-right"></i>
            </div>

            <div v-if="facilities.length" class="yd-facility-grid">
              <div
                  v-for="facility in facilities"
                  :key="facility.sfId"
                  class="yd-facility-item"
              >
                <i class="fa fa-check-square-o"></i>
                <span>{{ facility.sfName }}</span>
              </div>
            </div>

            <div v-else class="yd-empty-text">
              등록된 시설 정보가 없습니다.
            </div>
          </article>

          <article class="yd-info-card">
            <div class="yd-info-card__title">
              <span>위치 정보</span>
              <i class="fa fa-angle-right"></i>
            </div>

            <div class="yd-location">
              <div class="yd-location__line">
                <i class="fa fa-map-marker"></i>
                <span>{{ info.accomAddr || '-' }}</span>
              </div>
              <div class="yd-location__line">
                <i class="fa fa-phone"></i>
                <span>{{ info.accomTel || '-' }}</span>
              </div>
            </div>
          </article>
        </section>

        <!-- 리뷰 이미지 -->
        <section v-if="reviewImages.length" class="yd-section yd-review-section">
          <div class="yd-section-heading">
            <h2 class="yd-section__title">리뷰 이미지</h2>
            <span class="yd-section-heading__count">
              {{ reviewImages.length }}장
            </span>
          </div>

          <div class="yd-image-slider yd-review-slider">
            <button
                type="button"
                class="yd-image-slider__arrow left"
                aria-label="리뷰 이미지 이전"
                @click="scrollImageSlider(reviewSliderRef, -1)"
            >
              <i class="fa fa-chevron-left"></i>
            </button>

            <div
                ref="reviewSliderRef"
                class="yd-review-image-grid yd-image-slider__track"
                @wheel="handleHorizontalWheel($event, reviewSliderRef)"
            >
              <button
                  v-for="(review, index) in reviewImages"
                  :key="getReviewImageKey(review, index)"
                  type="button"
                  class="yd-review-image-card"
                  @click="openImageModal(review.imgPath)"
              >
                <div class="yd-review-image-card__thumb">
                  <img
                      :src="review.imgPath"
                      :alt="`리뷰 이미지 ${index + 1}`"
                      @error="handleImageError"
                  />
                  <span class="yd-review-image-card__zoom">
                    <i class="fa fa-search-plus"></i>
                  </span>
                </div>

                <div class="yd-review-image-card__meta">
                  <span class="yd-review-image-card__score">
                    <i class="fa fa-star"></i>
                    {{ formatScore(review.score) }}
                  </span>
                  <span class="yd-review-image-card__date">
                    {{ formatDate(review.createdAt) }}
                  </span>
                </div>
              </button>
            </div>

            <button
                type="button"
                class="yd-image-slider__arrow right"
                aria-label="리뷰 이미지 다음"
                @click="scrollImageSlider(reviewSliderRef, 1)"
            >
              <i class="fa fa-chevron-right"></i>
            </button>
          </div>
        </section>

        <!-- 상세 숙소 정보 -->
        <section class="yd-section">
          <h2 class="yd-section__title">숙소 정보</h2>

          <div class="yd-stay-info-box">
            <template v-if="detailInfos.length">
              <div
                  v-for="item in detailInfos"
                  :key="item.accomInfoId"
                  class="yd-stay-info-group"
              >
                <div class="yd-stay-info-group__title">
                  {{ item.title || '-' }}
                </div>

                <div class="yd-stay-info-group__content">
                  <div
                      v-if="parseContents(item.contents).length"
                      class="yd-stay-info-grid"
                  >
                    <div
                        v-for="(content, index) in parseContents(item.contents)"
                        :key="`${item.accomInfoId}-${index}`"
                        class="yd-stay-info-item"
                    >
                      {{ content }}
                    </div>
                  </div>

                  <div v-else class="yd-stay-info-text">
                    {{ item.contents || '-' }}
                  </div>
                </div>
              </div>
            </template>

            <div v-else class="yd-stay-info-empty">
              등록된 숙소 소개 정보가 없습니다.
            </div>
          </div>
        </section>
      </template>
    </panel-body>
  </panel>

  <!-- 이미지 확대 모달 -->
  <div
      v-if="imageModalVisible"
      class="yd-image-modal"
      @click="closeImageModal"
  >
    <div class="yd-image-modal__dialog" @click.stop>
      <button
          type="button"
          class="yd-image-modal__close"
          @click="closeImageModal"
      >
        <i class="fa fa-times"></i>
      </button>

      <img
          :src="modalImage"
          alt="확대 이미지"
          class="yd-image-modal__img"
          @error="handleImageError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAccommodationStore } from '@/stores/accommodation/useAccommodationStore';

type Id = number | string;

interface MainImage {
  imgType?: string;
  imgPath: string;
  viewOrder?: number;
}

interface ReviewImage {
  imgPath: string;
  createdAt?: string;
  score?: number;
}

interface RoomImage {
  roomImgId?: Id;
  imgPath: string;
  viewOrder?: number;
}

interface RoomItem {
  roomId: Id;
  roomName?: string;
  roomInfo?: unknown[];
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

const route = useRoute();
const store = useAccommodationStore();

const NO_IMAGE_URL = new URL('@/assets/img/noimg.gif', import.meta.url).href;

/* 화면 상태 */
const loading = ref(false);
const selectedMainImage = ref('');
const activeRoomId = ref<Id | null>(null);
const selectedRoomImages = ref<Record<string, Id[]>>({});

/* 이미지 모달 */
const imageModalVisible = ref(false);
const modalImage = ref(NO_IMAGE_URL);

/* DOM */
const roomTabsRef = ref<HTMLElement | null>(null);
const mainThumbsRef = ref<HTMLElement | null>(null);
const reviewSliderRef = ref<HTMLElement | null>(null);

/* API 데이터 */
const accomId = computed(() =>
    Number(route.query.accomId || route.params.id || 0)
);

const info = computed<any>(() => store.form.info || {});
const rawRoom = computed<any>(() => store.form.room || []);

/* 숙소 기본 정보 */
const accomInfos = computed<AccomInfoItem[]>(() =>
    Array.isArray(info.value.accomInfo) ? info.value.accomInfo : []
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
  return address ? address.split(/\s+/).slice(0, 2).join(' ') : '지역정보';
});

/* 이미지 목록 */
const mainImages = computed<MainImage[]>(() =>
    sortByOrder(
        Array.isArray(info.value.mainImgs) ? info.value.mainImgs : []
    )
);

const reviewImages = computed<ReviewImage[]>(() => {
  const images = Array.isArray(info.value.reviewImgs)
      ? info.value.reviewImgs
      : [];

  return [...images]
      .filter(hasImagePath)
      .sort(
          (a, b) =>
              toTimestamp(b.createdAt) - toTimestamp(a.createdAt)
      );
});

const mainImage = computed(() => {
  const selectedExists = mainImages.value.some(
      (image) => image.imgPath === selectedMainImage.value
  );

  if (selectedExists) return selectedMainImage.value;
  return mainImages.value[0]?.imgPath || NO_IMAGE_URL;
});

/* 객실 목록 */
const rooms = computed<RoomItem[]>(() => {
  const value = rawRoom.value;

  if (Array.isArray(value)) return value;
  if (Array.isArray(value?.rooms)) return value.rooms;
  if (Array.isArray(value?.roomList)) return value.roomList;
  if (value?.roomId !== undefined) return [value];

  return [];
});

const activeRoom = computed(() =>
    rooms.value.find((room) => room.roomId === activeRoomId.value)
    || rooms.value[0]
    || null
);

const activeRoomImages = computed<RoomImage[]>(() =>
    sortByOrder(activeRoom.value?.roomImgs || [])
);

const activeRoomKey = computed(() =>
    activeRoom.value ? String(activeRoom.value.roomId) : ''
);

const activeSelectedImages = computed(() =>
    selectedRoomImages.value[activeRoomKey.value] || []
);

const selectedImageCount = computed(() =>
    activeSelectedImages.value.length
);

const areAllActiveRoomImagesSelected = computed(() => {
  if (!activeRoomImages.value.length) return false;

  return activeRoomImages.value.every((image) =>
      activeSelectedImages.value.includes(getRoomImageValue(image))
  );
});

/* 데이터 조회 */
async function loadDetail() {
  if (!accomId.value) return;

  loading.value = true;

  try {
    await store.callDetailAPI(accomId.value);
  } finally {
    loading.value = false;
  }
}

/* 메인 이미지 */
function getMainImageKey(image: MainImage, index: number) {
  return `${image.imgPath}-${image.viewOrder ?? index}`;
}

/* 객실 탭 */
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

function scrollImageSlider(element: HTMLElement | null, direction: -1 | 1) {
  if (!element) return;

  const scrollAmount = Math.max(element.clientWidth * 0.8, 240);

  element.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth',
  });
}

function handleHorizontalWheel(event: WheelEvent, element: HTMLElement | null) {
  if (!element) return;

  const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;

  if (!delta) return;

  event.preventDefault();
  element.scrollLeft += delta;
}

/* 객실 이미지 선택 */
function getRoomImageValue(image: RoomImage): Id {
  return image.roomImgId ?? image.imgPath;
}

function getRoomImageKey(image: RoomImage, index: number) {
  return image.roomImgId ?? `${image.imgPath}-${index}`;
}

function ensureRoomSelection(roomId: Id) {
  const key = String(roomId);

  if (!selectedRoomImages.value[key]) {
    selectedRoomImages.value[key] = [];
  }
}

function isActiveRoomImageSelected(image: RoomImage) {
  return activeSelectedImages.value.includes(
      getRoomImageValue(image)
  );
}

function toggleActiveRoomImage(image: RoomImage) {
  if (!activeRoom.value) return;

  ensureRoomSelection(activeRoom.value.roomId);

  const key = activeRoomKey.value;
  const value = getRoomImageValue(image);
  const current = selectedRoomImages.value[key];
  const index = current.indexOf(value);

  if (index >= 0) {
    current.splice(index, 1);
  } else {
    current.push(value);
  }
}

function toggleAllActiveRoomImages() {
  if (!activeRoom.value) return;

  const key = activeRoomKey.value;

  selectedRoomImages.value[key] =
      areAllActiveRoomImagesSelected.value
          ? []
          : activeRoomImages.value.map(getRoomImageValue);
}

/* 리뷰 이미지 */
function getReviewImageKey(image: ReviewImage, index: number) {
  return `${image.imgPath}-${image.createdAt || index}`;
}

/* 이미지 모달 */
function openImageModal(src?: string) {
  modalImage.value = src || NO_IMAGE_URL;
  imageModalVisible.value = true;
}

function closeImageModal() {
  imageModalVisible.value = false;
}

function handleImageError(event: Event) {
  const image = event.target as HTMLImageElement;

  if (image.src !== NO_IMAGE_URL) {
    image.src = NO_IMAGE_URL;
  }
}

/* 포맷 및 공통 유틸 */
function getAccomTypeName(type?: string | number) {
  const typeMap: Record<string, string> = {
    '1': '모텔',
    '2': '호텔/리조트',
    '3': '펜션',
    '4': '홈 & 빌라',
    '5': '캠핑',
    '6': '게하/한옥',
    '7': '레지던스',
  };

  return typeMap[String(type)] || (type ? String(type) : '-');
}

function formatScore(value?: number) {
  const score = Number(value);
  return Number.isFinite(score) ? score.toFixed(1) : '-';
}

function formatDate(value?: string) {
  if (!value) return '-';

  // 서버가 전달한 날짜 부분을 그대로 사용해 UTC → KST 날짜 밀림을 방지한다.
  const matched = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!matched) return value;

  return `${matched[1]}.${matched[2]}.${matched[3]}`;
}

function parseContents(contents?: string): string[] {
  if (!contents) return [];

  try {
    const parsed = JSON.parse(contents);
    const values = Array.isArray(parsed) ? parsed : [parsed];

    return values
        .map((item) => String(item).trim())
        .filter(Boolean);
  } catch {
    return [];
  }
}

function sortByOrder<T extends { imgPath?: string; viewOrder?: number }>(
    images: T[]
): T[] {
  return [...images]
      .filter(hasImagePath)
      .sort(
          (a, b) =>
              Number(a.viewOrder ?? Number.MAX_SAFE_INTEGER)
              - Number(b.viewOrder ?? Number.MAX_SAFE_INTEGER)
      );
}

function hasImagePath<T extends { imgPath?: string }>(
    image: T
): image is T & { imgPath: string } {
  return Boolean(image?.imgPath);
}

function toTimestamp(value?: string) {
  const timestamp = value ? new Date(value).getTime() : 0;
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

/* API 데이터가 바뀌면 선택 상태 정리 */
watch(mainImages, (images) => {
  const selectedExists = images.some(
      (image) => image.imgPath === selectedMainImage.value
  );

  if (!selectedExists) {
    selectedMainImage.value = '';
  }
});

watch(
    rooms,
    (newRooms) => {
      newRooms.forEach((room) => ensureRoomSelection(room.roomId));

      const activeRoomExists = newRooms.some(
          (room) => room.roomId === activeRoomId.value
      );

      if (!activeRoomExists) {
        activeRoomId.value = newRooms[0]?.roomId ?? null;
      }
    },
    { immediate: true }
);

onMounted(loadDetail);
</script>

<style scoped>
.yd-detail-page {
  padding: 22px 30px 44px;
  background: #f5f5f5;
}

.yd-loading {
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 14px;
}

.yd-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  font-size: 13px;
  color: #6a6f77;
}

.yd-breadcrumb strong {
  color: #23262b;
  font-weight: 700;
}

.yd-breadcrumb__home {
  color: #3b82f6;
}

.yd-breadcrumb .sep {
  color: #b5bac1;
}

.yd-gallery {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(283px, 955px);
  gap: 12px;
  margin-bottom: 18px;
  align-items: stretch;
}

.yd-gallery__main,
.yd-gallery__thumb {
  padding: 0;
  border: none;
  background: #fff;
  overflow: hidden;
  cursor: pointer;
}

.yd-gallery__main {
  border-radius: 14px;
  min-height: 360px;
}

.yd-gallery__main img {
  width: 100%;
  height: 100%;
  min-height: 360px;
  object-fit: cover;
  display: block;
}

.yd-gallery__side {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.yd-gallery__thumb {
  position: relative;
}

.yd-gallery__thumb:nth-child(2) {
  border-top-right-radius: 14px;
}

.yd-gallery__thumb:nth-child(4) {
  border-bottom-right-radius: 14px;
}

.yd-gallery__thumb img {
  width: 100%;
  height: 176px;
  object-fit: cover;
  display: block;
}

.yd-gallery__thumb--empty {
  cursor: default;
  background: #e5e7eb;
}

.yd-gallery__empty {
  width: 100%;
  height: 176px;
  background: #e5e7eb;
}

.yd-gallery__more {
  position: absolute;
  right: 12px;
  bottom: 12px;
  min-width: 64px;
  height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(20, 20, 20, 0.82);
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
}

.yd-gallery__intro-card {
  background: #fff;
  border: 1px solid #e4e7eb;
  border-radius: 14px;
  padding: 18px 18px 16px;
  display: flex;
  flex-direction: column;
  min-height: 360px;
  overflow: hidden;
}

.yd-gallery__intro-title {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #24272c;
  font-size: 15px;
  font-weight: 800;
  margin-bottom: 12px;
  flex: 0 0 auto;
}

.yd-gallery__intro-scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.yd-summary {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.yd-summary__type {
  color: #868b94;
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 6px;
}

.yd-summary__title {
  margin: 0;
  color: #181a1f;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
}

.yd-summary__right {
  min-width: 180px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.yd-like-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 999px;
  background: #ececec;
  color: #8b9097;
  font-size: 18px;
}

.yd-summary__price {
  font-size: 34px;
  font-weight: 800;
  color: #181a1f;
  line-height: 1;
}

.yd-info-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-bottom: 20px;
}

.yd-info-card {
  min-height: 110px;
  background: #fff;
  border: 1px solid #e4e7eb;
  border-radius: 10px;
  padding: 14px 16px;
}

.yd-info-card__title {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #24272c;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 10px;
}

.yd-info-card__content--review,
.yd-preview-list__item,
.yd-facility-item,
.yd-location__line {
  font-size: 13px;
  line-height: 1.55;
}

.yd-facility-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px 12px;
}

.yd-facility-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #343942;
}

.yd-facility-item i {
  color: #2c2f36;
}

.yd-location {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.yd-location__line {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #343942;
}

.yd-location__line i {
  margin-top: 3px;
}

.yd-section__title {
  margin: 0 0 10px;
  color: #181a1f;
  font-size: 20px;
  font-weight: 800;
}

.yd-empty-panel,
.yd-empty-text {
  color: #737a84;
  font-size: 14px;
}

.yd-empty-panel {
  background: #fff;
  border: 1px dashed #d9dde3;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.yd-image-modal {
  position: fixed;
  inset: 0;
  background: rgba(16, 18, 22, 0.82);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.yd-image-modal__dialog {
  position: relative;
  max-width: min(1280px, 94vw);
  max-height: 92vh;
}

.yd-image-modal__img {
  max-width: 100%;
  max-height: 92vh;
  display: block;
  border-radius: 14px;
  background: #fff;
}

.yd-image-modal__close {
  position: absolute;
  top: -12px;
  right: -12px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 999px;
  background: #fff;
  color: #1a1d22;
  font-size: 14px;
}

.yd-stay-info-box {
  background: #fff;
  border: 1px solid #dfdfdf;
  border-radius: 14px;
  padding: 18px 20px;
}

.yd-stay-info-group {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 18px;
  align-items: start;
}

.yd-stay-info-group + .yd-stay-info-group {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid #eceff3;
}

.yd-stay-info-group__title {
  font-size: 15px;
  font-weight: 800;
  color: #1f2329;
  padding-top: 2px;
  word-break: keep-all;
}

.yd-stay-info-group__content {
  min-width: 0;
}

.yd-stay-info-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 8px 14px;
}

.yd-stay-info-item {
  position: relative;
  padding-left: 12px;
  color: #4b5563;
  font-size: 14px;
  line-height: 1.7;
  word-break: break-word;
}

.yd-stay-info-item::before {
  content: '•';
  position: absolute;
  left: 0;
  top: 0;
  color: #6b7280;
}

.yd-stay-info-text {
  color: #4b5563;
  font-size: 14px;
  line-height: 1.8;
  white-space: pre-line;
  word-break: break-word;
}

.yd-stay-info-empty {
  color: #737a84;
  font-size: 14px;
  text-align: center;
}

.yd-preview-list-wrap {
  margin-top: 2px;
}

.yd-preview-list {
  margin: 0;
  padding-left: 18px;
}

.yd-preview-list__item {
  color: #41464f;
  margin-bottom: 4px;
  word-break: break-word;
}

.yd-preview-list__item:last-child {
  margin-bottom: 0;
}

.yd-preview-list--intro {
  margin: 0;
  padding-left: 18px;
}

.yd-preview-list--intro .yd-preview-list__item {
  margin-bottom: 8px;
  line-height: 1.6;
}

/* 객실 탭 */
.yd-room-tabs-wrap {
  background: #fff;
  border: 1px solid #e4e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.yd-room-tabs-nav {
  display: flex;
  align-items: stretch;
  border-bottom: 1px solid #eceff3;
  background: #fafbfc;
}

.yd-room-tabs {
  flex: 1;
  display: flex;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
  background: #fafbfc;
}

.yd-room-tabs::-webkit-scrollbar {
  display: none;
}

.yd-room-tabs-arrow {
  width: 44px;
  min-width: 44px;
  border: none;
  background: #fafbfc;
  color: #4b5563;
  cursor: pointer;
  border-right: 1px solid #eceff3;
  transition: background 0.2s ease, color 0.2s ease;
}

.yd-room-tabs-arrow.right {
  border-right: none;
  border-left: 1px solid #eceff3;
}

.yd-room-tabs-arrow:hover {
  background: #f1f5f9;
  color: #111827;
}

.yd-room-tabs-arrow i {
  font-size: 14px;
}

.yd-room-tab {
  flex: 0 0 auto;
  min-width: 180px;
  padding: 14px 16px;
  border: none;
  border-right: 1px solid #eceff3;
  background: transparent;
  text-align: left;
  cursor: pointer;
  transition: background 0.2s ease;
}

.yd-room-tab:hover {
  background: #f4f6f8;
}

.yd-room-tab.active {
  background: #fff;
}

.yd-room-tab__name {
  display: block;
  font-size: 14px;
  font-weight: 700;
  color: #1f2329;
}

.yd-room-tab__count {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: #7b818a;
}

.yd-room-tab-panel {
  padding: 18px;
}

.yd-room-tab-panel__top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 18px;
}

.yd-room-tab-panel__title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #1a1d22;
}

.yd-room-tab-panel__desc {
  margin: 6px 0 0;
  font-size: 13px;
  color: #7b818a;
}

.yd-room-upload-btn {
  height: 36px;
  padding: 0 14px;
  border: 1px solid #d7dce2;
  border-radius: 8px;
  background: #fff;
  font-size: 13px;
  font-weight: 700;
  color: #2a2f37;
}

.yd-room-upload-btn:disabled {
  background: #f3f4f6;
  color: #9aa1ab;
  cursor: not-allowed;
}

.yd-room-products-wrap {
  margin-bottom: 20px;
}

.yd-room-products-wrap__title {
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 700;
  color: #252932;
}

.yd-room-products-table {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.yd-room-product-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 110px 140px;
  gap: 16px;
  align-items: center;
  border: 1px solid #e7eaee;
  border-radius: 10px;
  padding: 14px 16px;
  background: #fff;
}

.yd-room-product-row__name {
  font-size: 15px;
  font-weight: 800;
  color: #1f2329;
}

.yd-room-product-row__meta {
  margin-top: 5px;
  color: #6c737d;
  font-size: 13px;
}

.yd-room-product-row__status {
  display: flex;
  justify-content: center;
}

.yd-room-product-row__price {
  text-align: right;
}

.yd-status-badge {
  min-width: 76px;
  height: 30px;
  border-radius: 999px;
  background: #edf8f1;
  color: #16803c;
  font-size: 12px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.yd-status-badge.sold {
  background: #fceeee;
  color: #c62828;
}

.yd-room-price__origin {
  color: #9ea4ad;
  font-size: 12px;
  text-decoration: line-through;
}

.yd-room-price__sale {
  color: #1b1d22;
  font-size: 24px;
  font-weight: 800;
  line-height: 1.1;
}

/* 객실 이미지 */
.yd-room-image-check-section__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.yd-room-image-check-section__title {
  font-size: 14px;
  font-weight: 700;
  color: #252932;
}

.yd-room-image-check-section__info {
  font-size: 12px;
  color: #7b818a;
}

.yd-room-image-scroll {
  max-height: 190px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 4px;
}

.yd-room-image-card-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
  align-content: start;
}

.yd-room-image-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 0;
  overflow: hidden;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.yd-room-image-card:hover {
  border-color: #cfd6de;
  transform: translateY(-1px);
}

.yd-room-image-card.selected {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.12);
}

.yd-room-image-card__thumb-wrap {
  position: relative;
  aspect-ratio: 1 / 1;
  background: #f3f4f6;
}

.yd-room-image-card__thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.yd-room-image-card__badge {
  position: absolute;
  top: 8px;
  left: 8px;
  min-width: 26px;
  height: 26px;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.76);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.yd-room-image-card__check {
  position: absolute;
  right: 8px;
  top: 8px;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: transparent;
  border: 1px solid #d6dbe2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.yd-room-image-card.selected .yd-room-image-card__check {
  background: #2563eb;
  border-color: #2563eb;
  color: #fff;
}

.yd-room-image-card__zoom {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.72);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.yd-room-image-card__meta {
  padding: 10px 11px 12px;
}

.yd-room-image-card__title {
  font-size: 13px;
  font-weight: 700;
  color: #1f2329;
}

.yd-room-image-card__sub {
  margin-top: 4px;
  font-size: 12px;
  color: #7b818a;
}

.yd-main-gallery {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.yd-main-gallery__thumbs {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 8px;
}

.yd-main-gallery__thumb {
  position: relative;
  padding: 0;
  border: 2px solid transparent;
  border-radius: 9px;
  background: #fff;
  overflow: hidden;
  cursor: pointer;
  aspect-ratio: 16 / 10;
}

.yd-main-gallery__thumb.active {
  border-color: #2563eb;
}

.yd-main-gallery__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.yd-main-gallery__order {
  position: absolute;
  left: 6px;
  bottom: 6px;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.72);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.yd-review-section {
  margin-bottom: 20px;
}

.yd-section-heading {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}

.yd-section-heading .yd-section__title {
  margin-bottom: 0;
}

.yd-section-heading__count {
  color: #737a84;
  font-size: 13px;
}

.yd-review-image-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 12px;
}

.yd-review-image-card {
  padding: 0;
  border: 1px solid #e4e7eb;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
  text-align: left;
  cursor: pointer;
}

.yd-review-image-card__thumb {
  position: relative;
  aspect-ratio: 1 / 1;
  background: #f3f4f6;
}

.yd-review-image-card__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.yd-review-image-card__zoom {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.72);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.yd-review-image-card__meta {
  min-height: 42px;
  padding: 9px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.yd-review-image-card__score {
  color: #343942;
  font-size: 12px;
  font-weight: 700;
}

.yd-review-image-card__score i {
  color: #f59e0b;
  margin-right: 3px;
}

.yd-review-image-card__date {
  color: #8a9099;
  font-size: 11px;
}

@media (max-width: 1280px) {
  .yd-gallery {
    grid-template-columns: 1fr;
  }

  .yd-gallery__main,
  .yd-gallery__intro-card {
    min-height: auto;
  }

  .yd-gallery__side {
    grid-template-columns: repeat(4, 1fr);
  }

  .yd-gallery__intro-scroll {
    max-height: 260px;
  }

  .yd-info-grid {
    grid-template-columns: 1fr;
  }

  .yd-room-image-card-grid,
  .yd-review-image-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 1024px) {
  .yd-room-image-card-grid,
  .yd-review-image-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .yd-room-image-scroll {
    max-height: 420px;
  }

  .yd-room-product-row {
    grid-template-columns: minmax(0, 1fr) 100px 120px;
  }
}

@media (max-width: 767px) {
  .yd-detail-page {
    padding: 14px;
  }

  .yd-breadcrumb {
    font-size: 12px;
    gap: 6px;
    flex-wrap: wrap;
  }

  .yd-gallery__main img {
    min-height: 220px;
  }

  .yd-gallery__side {
    grid-template-columns: 1fr 1fr;
  }

  .yd-gallery__thumb img,
  .yd-gallery__empty {
    height: 120px;
  }

  .yd-gallery__intro-card {
    padding: 14px;
  }

  .yd-gallery__intro-scroll {
    max-height: 220px;
  }

  .yd-summary {
    flex-direction: column;
  }

  .yd-summary__title {
    font-size: 24px;
  }

  .yd-summary__right {
    align-items: flex-start;
    min-width: 0;
  }

  .yd-summary__price {
    font-size: 30px;
  }

  .yd-room-tab {
    min-width: 150px;
    padding: 12px 14px;
  }

  .yd-room-tab-panel__top {
    flex-direction: column;
    align-items: stretch;
  }

  .yd-room-upload-btn {
    width: 100%;
  }

  .yd-room-product-row {
    grid-template-columns: 1fr;
    text-align: left;
  }

  .yd-room-product-row__status {
    justify-content: flex-start;
  }

  .yd-room-product-row__price {
    text-align: left;
  }

  .yd-room-image-check-section__head {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .yd-room-image-card-grid,
  .yd-review-image-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .yd-main-gallery__thumbs {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .yd-room-image-scroll {
    max-height: 360px;
  }

  .yd-stay-info-group {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .yd-stay-info-grid {
    grid-template-columns: 1fr;
  }
}

.yd-room-image-check-section__title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.yd-room-image-check-section__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.yd-room-image-action-btn {
  height: 32px;
  padding: 0 12px;
  border: 1px solid #d7dce2;
  border-radius: 8px;
  background: #fff;
  color: #2a2f37;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.yd-room-image-action-btn:hover {
  background: #f8fafc;
  border-color: #c7d0db;
}

.yd-room-image-action-btn:disabled {
  background: #f3f4f6;
  color: #9aa1ab;
  cursor: not-allowed;
}


/* 한 줄 이미지 슬라이더 */
.yd-image-slider {
  position: relative;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.yd-image-slider__track {
  min-width: 0;
  flex: 1;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  scroll-snap-type: x proximity;
  scrollbar-width: none;
  overscroll-behavior-x: contain;
}

.yd-image-slider__track::-webkit-scrollbar {
  display: none;
}

.yd-image-slider__arrow {
  flex: 0 0 34px;
  width: 34px;
  height: 64px;
  padding: 0;
  border: 1px solid #dfe3e8;
  border-radius: 9px;
  background: #fff;
  color: #4b5563;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, border-color 0.2s ease;
}

.yd-image-slider__arrow:hover {
  background: #f8fafc;
  border-color: #cbd2da;
}

.yd-main-gallery__thumbs {
  display: flex;
  grid-template-columns: none;
  gap: 8px;
}

.yd-main-gallery__thumb {
  flex: 0 0 112px;
  width: 112px;
  scroll-snap-align: start;
}

.yd-review-image-grid {
  display: flex;
  grid-template-columns: none;
  gap: 12px;
}

.yd-review-image-card {
  flex: 0 0 180px;
  width: 180px;
  scroll-snap-align: start;
}

.yd-review-slider .yd-image-slider__arrow {
  height: 110px;
}

@media (max-width: 767px) {
  .yd-image-slider {
    gap: 6px;
  }

  .yd-image-slider__arrow {
    flex-basis: 30px;
    width: 30px;
    height: 58px;
  }

  .yd-main-gallery__thumb {
    flex-basis: 96px;
    width: 96px;
  }

  .yd-review-image-card {
    flex-basis: 150px;
    width: 150px;
  }

  .yd-review-slider .yd-image-slider__arrow {
    height: 96px;
  }
}

</style>
