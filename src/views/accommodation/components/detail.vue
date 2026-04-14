<template>
  <panel>
    <panel-body class="yd-detail-page">
      <div v-if="loading" class="yd-loading">
        숙소 정보를 불러오는 중입니다.
      </div>

      <template v-else>
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

        <section class="yd-gallery">
          <button
              type="button"
              class="yd-gallery__main"
              @click="openImageModal(mainImage)"
          >
            <img :src="mainImage" alt="대표 이미지" @error="handleImageError" />
          </button>

          <div class="yd-gallery__side">
            <button
                v-for="(img, index) in sideImageSlots"
                :key="`side-${index}`"
                type="button"
                class="yd-gallery__thumb"
                :class="{ 'yd-gallery__thumb--empty': !img }"
                @click="img && openImageModal(img)"
            >
              <template v-if="img">
                <img :src="img" alt="썸네일 이미지" @error="handleImageError" />
                <span
                    v-if="index === 3 && extraImageCount > 0"
                    class="yd-gallery__more"
                >
                  <i class="fa fa-image"></i>
                  {{ extraImageCount }}+
                </span>
              </template>

              <div v-else class="yd-gallery__empty"></div>
            </button>
          </div>
        </section>

        <section class="yd-summary">
          <div class="yd-summary__left">
            <div class="yd-summary__type">{{ getAccomTypeName(info.accomType) }}</div>
            <h1 class="yd-summary__title">{{ info.accomName || '-' }}</h1>
          </div>

          <div class="yd-summary__right">
            <button type="button" class="yd-like-btn">
              <i class="fa fa-heart-o"></i>
            </button>
            <div class="yd-summary__price">
              {{ lowestPrice }}
            </div>
          </div>
        </section>

        <section class="yd-info-grid">
          <article class="yd-info-card">
            <div v-if="previewInfo?.title" class="yd-info-card__title">
              <span>{{ previewInfo.title }}</span>
            </div>

            <div v-if="previewInfoList.length" class="yd-preview-list-wrap">
              <ul class="yd-preview-list">
                <li
                    v-for="(content, idx) in previewInfoList"
                    :key="`preview-${idx}`"
                    class="yd-preview-list__item"
                >
                  {{ content }}
                </li>
              </ul>
            </div>

            <div v-else class="yd-info-card__content yd-info-card__content--review">
              등록된 숙소 소개 정보가 없습니다.
            </div>
          </article>

          <article class="yd-info-card">
            <div class="yd-info-card__title">
              <span>서비스 및 부대시설</span>
              <i class="fa fa-angle-right"></i>
            </div>

            <div v-if="facilityList.length" class="yd-facility-grid">
              <div
                  v-for="facility in facilityList"
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

        <section class="yd-section">
          <h2 class="yd-section__title">숙소 정보</h2>

          <div class="yd-stay-info-box">
            <template v-if="detailAccomInfoList.length">
              <div
                  v-for="item in detailAccomInfoList"
                  :key="item.accomInfoId"
                  class="yd-stay-info-group"
              >
                <div class="yd-stay-info-group__title">
                  {{ item.title || '-' }}
                </div>

                <div
                    v-if="parseAccomContents(item.contents).length"
                    class="yd-stay-info-grid"
                >
                  <div
                      v-for="(content, idx) in parseAccomContents(item.contents)"
                      :key="`${item.accomInfoId}-${idx}`"
                      class="yd-stay-info-item"
                  >
                    {{ content }}
                  </div>
                </div>

                <div v-else class="yd-stay-info-text">
                  {{ item.contents || '-' }}
                </div>
              </div>
            </template>

            <div v-else class="yd-stay-info-empty">
              등록된 숙소 소개 정보가 없습니다.
            </div>
          </div>
        </section>

        <section class="yd-section">
          <h2 class="yd-section__title">객실 정보</h2>

          <div v-if="roomList.length" class="yd-room-list">
            <article
                v-for="roomItem in roomList"
                :key="roomItem.roomId"
                class="yd-room-card"
            >
              <div
                  class="yd-room-card__gallery"
                  @mouseenter="stopRoomSlide(roomItem.roomId)"
                  @mouseleave="startRoomSlide(roomItem.roomId)"
              >
                <img
                    :src="currentRoomImage(roomItem)"
                    alt="객실 이미지"
                    class="yd-room-card__img"
                    @click="openImageModal(currentRoomImage(roomItem))"
                    @error="handleImageError"
                />

                <button
                    v-if="sortedRoomImages(roomItem).length > 1"
                    type="button"
                    class="yd-room-nav yd-room-nav--prev"
                    @click.stop="prevRoomImage(roomItem.roomId)"
                >
                  <i class="fa fa-chevron-left"></i>
                </button>

                <button
                    v-if="sortedRoomImages(roomItem).length > 1"
                    type="button"
                    class="yd-room-nav yd-room-nav--next"
                    @click.stop="nextRoomImageAndReset(roomItem.roomId)"
                >
                  <i class="fa fa-chevron-right"></i>
                </button>

                <div
                    v-if="sortedRoomImages(roomItem).length > 1"
                    class="yd-room-dots"
                >
                  <button
                      v-for="(img, imgIndex) in sortedRoomImages(roomItem)"
                      :key="img.roomImgId"
                      type="button"
                      class="yd-room-dot"
                      :class="{ active: getRoomImageIndex(roomItem.roomId) === imgIndex }"
                      @click.stop="moveRoomImage(roomItem.roomId, imgIndex)"
                  ></button>
                </div>
              </div>

              <div class="yd-room-card__body">
                <div class="yd-room-card__header">
                  <div>
                    <h3 class="yd-room-card__title">{{ roomItem.roomName || '-' }}</h3>
                    <p class="yd-room-card__desc">
                      객실 상품 {{ roomItem.roomInfo?.length || 0 }}개
                    </p>
                  </div>
                </div>

                <div v-if="roomItem.roomInfo?.length" class="yd-room-products">
                  <div
                      v-for="detail in roomItem.roomInfo"
                      :key="detail.roomInfoId"
                      class="yd-room-product"
                  >
                    <div class="yd-room-product__top">
                      <div>
                        <div class="yd-room-product__name">
                          {{ detail.roomType || '객실 상품' }}
                        </div>
                        <div class="yd-room-product__meta">
                          기준 {{ detail.baseCnt ?? 0 }}인 / 최대 {{ detail.maxCnt ?? 0 }}인
                        </div>
                        <div class="yd-room-product__meta">
                          이용시간 {{ detail.availUseTime || '-' }}
                        </div>
                        <div class="yd-room-product__meta">
                          입실 {{ detail.checkInTime || '-' }} · 퇴실 {{ detail.checkOutTime || '-' }}
                        </div>
                      </div>

                      <div class="yd-room-product__side">
                        <div
                            class="yd-status-badge"
                            :class="{ sold: isSoldOut(detail.isSoldOut) }"
                        >
                          {{ isSoldOut(detail.isSoldOut) ? '판매종료' : '예약가능' }}
                        </div>

                        <div class="yd-room-price">
                          <div
                              v-if="hasDiscount(detail)"
                              class="yd-room-price__origin"
                          >
                            {{ formatPrice(detail.roomPrice) }}
                          </div>
                          <div class="yd-room-price__sale">
                            {{ displayRoomPrice(detail) }}
                          </div>
                        </div>

                        <button
                            type="button"
                            class="yd-room-product__btn"
                            :disabled="isSoldOut(detail.isSoldOut)"
                        >
                          {{ isSoldOut(detail.isSoldOut) ? '마감' : '예약가능' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-else class="yd-empty-panel">
                  등록된 객실 상세 정보가 없습니다.
                </div>
              </div>
            </article>
          </div>

          <div v-else class="yd-empty-panel">
            등록된 객실 정보가 없습니다.
          </div>
        </section>
      </template>
    </panel-body>
  </panel>

  <div v-if="imageModalVisible" class="yd-image-modal" @click="closeImageModal">
    <div class="yd-image-modal__dialog" @click.stop>
      <button type="button" class="yd-image-modal__close" @click="closeImageModal">
        <i class="fa fa-times"></i>
      </button>
      <img
          :src="modalImage"
          alt="확대 이미지"
          class="yd-image-modal__img"
          @error="handleModalImageError"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAccommodationStore } from '@/stores/accommodation/useAccommodationStore';

const route = useRoute();
const store = useAccommodationStore();

const NO_IMAGE_URL = new URL('@/assets/img/noimg.gif', import.meta.url).href;

const loading = ref(false);
const imageModalVisible = ref(false);
const modalImage = ref(NO_IMAGE_URL);

const roomImageIndexes = ref<Record<number | string, number>>({});
const roomSlideTimers = ref<Record<number | string, number>>({});

const accomId = computed(() => Number(route.query.accomId || route.params.id || 0));

const info = computed(() => store.form.info || {});
const room = computed(() => store.form.room || []);

const accomInfoList = computed(() => {
  return Array.isArray(info.value?.accomInfo) ? info.value.accomInfo : [];
});

const previewInfo = computed(() => {
  return accomInfoList.value.length ? accomInfoList.value[0] : null;
});

const detailAccomInfoList = computed(() => {
  return accomInfoList.value.length > 1 ? accomInfoList.value.slice(1) : [];
});

const facilityList = computed(() => {
  return Array.isArray(info.value?.serviceFacilities) ? info.value.serviceFacilities : [];
});

const roomList = computed(() => {
  if (Array.isArray(room.value)) return room.value;
  if (Array.isArray((room.value as any)?.rooms)) return (room.value as any).rooms;
  if (Array.isArray((room.value as any)?.roomList)) return (room.value as any).roomList;
  if ((room.value as any)?.roomId !== undefined) return [room.value];
  return [];
});

const roomImagePool = computed(() => {
  return roomList.value
      .flatMap((roomItem: any) => Array.isArray(roomItem.roomImgs) ? roomItem.roomImgs : [])
      .sort((a: any, b: any) => Number(a.viewOrder || 0) - Number(b.viewOrder || 0))
      .map((img: any) => img.imgPath)
      .filter(Boolean);
});

const galleryImages = computed(() => {
  const merged = [info.value?.mainImgPath, ...roomImagePool.value].filter(Boolean);
  return [...new Set(merged)];
});

const mainImage = computed(() => {
  return galleryImages.value[0] || NO_IMAGE_URL;
});

const sideImages = computed(() => {
  return galleryImages.value.slice(1, 5);
});

const sideImageSlots = computed(() => {
  const images = sideImages.value;
  return Array.from({ length: 4 }, (_, index) => images[index] || null);
});

const extraImageCount = computed(() => {
  return Math.max(galleryImages.value.length - 5, 0);
});

const regionLabel = computed(() => {
  const addr = String(info.value?.accomAddr || '').trim();
  if (!addr) return '지역정보';
  const parts = addr.split(' ');
  return parts.slice(0, 2).join(' ') || addr;
});

const previewInfoList = computed(() => {
  if (!previewInfo.value) return [];
  return parseAccomContents(previewInfo.value.contents || '');
});

const lowestPrice = computed(() => {
  const prices: number[] = [];

  roomList.value.forEach((roomItem: any) => {
    if (!Array.isArray(roomItem.roomInfo)) return;

    roomItem.roomInfo.forEach((detail: any) => {
      const sale = Number(detail?.roomDisPrice || 0);
      const price = Number(detail?.roomPrice || 0);
      if (sale > 0) prices.push(sale);
      else if (price > 0) prices.push(price);
    });
  });

  if (!prices.length) return '-';
  return `${Math.min(...prices).toLocaleString()}원`;
});

function parseAccomContents(contents: string) {
  if (!contents) return [];

  try {
    const parsed = JSON.parse(contents);

    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item)).filter(Boolean);
    }

    return [String(parsed)];
  } catch (error) {
    return [];
  }
}

function sortedRoomImages(roomItem: any) {
  if (!Array.isArray(roomItem?.roomImgs)) return [];
  return [...roomItem.roomImgs].sort(
      (a, b) => Number(a.viewOrder || 0) - Number(b.viewOrder || 0)
  );
}

function getRoomImageIndex(roomId: number | string) {
  return roomImageIndexes.value[roomId] ?? 0;
}

function currentRoomImage(roomItem: any) {
  const images = sortedRoomImages(roomItem);
  if (!images.length) return NO_IMAGE_URL;

  const index = getRoomImageIndex(roomItem.roomId);
  return images[index]?.imgPath || NO_IMAGE_URL;
}

function moveRoomImage(roomId: number | string, index: number) {
  roomImageIndexes.value[roomId] = index;
  restartRoomSlide(roomId);
}

function prevRoomImage(roomId: number | string) {
  const roomItem = roomList.value.find((item: any) => item.roomId === roomId);
  const images = sortedRoomImages(roomItem);
  if (!images.length) return;

  const current = getRoomImageIndex(roomId);
  roomImageIndexes.value[roomId] = (current - 1 + images.length) % images.length;
  restartRoomSlide(roomId);
}

function nextRoomImage(roomId: number | string) {
  const roomItem = roomList.value.find((item: any) => item.roomId === roomId);
  const images = sortedRoomImages(roomItem);
  if (!images.length) return;

  const current = getRoomImageIndex(roomId);
  roomImageIndexes.value[roomId] = (current + 1) % images.length;
}

function nextRoomImageAndReset(roomId: number | string) {
  nextRoomImage(roomId);
  restartRoomSlide(roomId);
}

function stopRoomSlide(roomId: number | string) {
  if (roomSlideTimers.value[roomId]) {
    clearInterval(roomSlideTimers.value[roomId]);
    delete roomSlideTimers.value[roomId];
  }
}

function clearAllRoomSlides() {
  Object.keys(roomSlideTimers.value).forEach((roomId) => {
    stopRoomSlide(roomId);
  });
}

function startRoomSlide(roomId: number | string) {
  stopRoomSlide(roomId);

  const roomItem = roomList.value.find((item: any) => item.roomId === roomId);
  const images = sortedRoomImages(roomItem);
  if (images.length <= 1) return;

  roomSlideTimers.value[roomId] = window.setInterval(() => {
    nextRoomImage(roomId);
  }, 3200);
}

function restartRoomSlide(roomId: number | string) {
  startRoomSlide(roomId);
}

watch(
    roomList,
    (newRooms) => {
      clearAllRoomSlides();

      newRooms.forEach((roomItem: any) => {
        roomImageIndexes.value[roomItem.roomId] = 0;
        startRoomSlide(roomItem.roomId);
      });
    },
    { deep: true, immediate: true }
);

onMounted(async () => {
  if (!accomId.value) return;

  loading.value = true;
  try {
    await store.callDetailAPI(accomId.value);
  } finally {
    loading.value = false;
  }
});

onBeforeUnmount(() => {
  clearAllRoomSlides();
});

function isSoldOut(value: string) {
  const v = String(value || '').toUpperCase();
  return v === 'Y' || v === '1' || v === 'TRUE';
}

function hasDiscount(detail: any) {
  const price = Number(detail?.roomPrice || 0);
  const disPrice = Number(detail?.roomDisPrice || 0);
  return disPrice > 0 && disPrice < price;
}

function displayRoomPrice(detail: any) {
  if (hasDiscount(detail)) return formatPrice(detail.roomDisPrice);
  return formatPrice(detail.roomPrice);
}

function formatPrice(value: number | string) {
  if (value === null || value === undefined || value === '') return '-';
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return `${num.toLocaleString()}원`;
}

function getAccomTypeName(type: string | number) {
  switch (String(type)) {
    case '1': return '모텔';
    case '2': return '호텔/리조트';
    case '3': return '펜션';
    case '4': return '홈 & 빌라';
    case '5': return '캠핑';
    case '6': return '게하/한옥';
    case '7': return '레지던스';
    default: return type ? String(type) : '-';
  }
}

function openImageModal(src: string) {
  modalImage.value = src || NO_IMAGE_URL;
  imageModalVisible.value = true;
}

function closeImageModal() {
  imageModalVisible.value = false;
}

function handleImageError(e: Event) {
  const target = e.target as HTMLImageElement;
  target.src = NO_IMAGE_URL;
}

function handleModalImageError(e: Event) {
  const target = e.target as HTMLImageElement;
  target.src = NO_IMAGE_URL;
}
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
  grid-template-columns: 1.15fr 1fr;
  gap: 8px;
  margin-bottom: 18px;
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
  border-radius: 14px 0 0 14px;
}

.yd-gallery__main img {
  width: 100%;
  height: 100%;
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
  height: 100%;
  object-fit: cover;
  display: block;
}

.yd-gallery__thumb--empty {
  cursor: default;
  background: #e5e7eb;
}

.yd-gallery__empty {
  width: 100%;
  height: 100%;
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
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}

.yd-info-card {
  min-height: 142px;
  background: #fff;
  border: 1px solid #dfdfdf;
  border-radius: 14px;
  padding: 18px 20px;
}

.yd-info-card__title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #24272c;
  font-size: 16px;
  font-weight: 800;
  margin-bottom: 14px;
}

.yd-info-card__content--review {
  color: #41464f;
  font-size: 14px;
  line-height: 1.7;
  word-break: break-word;
}

.yd-facility-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 14px;
}

.yd-facility-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #343942;
  font-size: 14px;
  line-height: 1.5;
}

.yd-facility-item i {
  color: #2c2f36;
}

.yd-location {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.yd-location__line {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #343942;
  font-size: 14px;
  line-height: 1.55;
}

.yd-location__line i {
  margin-top: 3px;
}

.yd-section {
  margin-bottom: 26px;
}

.yd-section__title {
  margin: 0 0 12px;
  color: #181a1f;
  font-size: 24px;
  font-weight: 800;
}

.yd-room-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.yd-room-card {
  background: #fff;
  border: 1px solid #dfdfdf;
  border-radius: 16px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 360px minmax(0, 1fr);
}

.yd-room-card__gallery {
  position: relative;
  min-height: 270px;
  background: #eceff3;
}

.yd-room-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  cursor: pointer;
}

.yd-room-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 999px;
  background: rgba(16, 18, 22, 0.48);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.yd-room-nav--prev {
  left: 12px;
}

.yd-room-nav--next {
  right: 12px;
}

.yd-room-dots {
  position: absolute;
  left: 50%;
  bottom: 12px;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.yd-room-dot {
  width: 7px;
  height: 7px;
  border: none;
  border-radius: 999px;
  background: rgba(255,255,255,0.45);
}

.yd-room-dot.active {
  background: #fff;
}

.yd-room-card__body {
  padding: 18px 20px;
}

.yd-room-card__header {
  margin-bottom: 12px;
}

.yd-room-card__title {
  margin: 0;
  color: #181a1f;
  font-size: 22px;
  font-weight: 800;
}

.yd-room-card__desc {
  margin: 6px 0 0;
  color: #7d838d;
  font-size: 13px;
}

.yd-room-products {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.yd-room-product {
  border: 1px solid #e7e7e7;
  border-radius: 14px;
  padding: 14px 16px;
  background: #fff;
}

.yd-room-product__top {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.yd-room-product__name {
  font-size: 17px;
  font-weight: 800;
  color: #1f2329;
}

.yd-room-product__meta {
  margin-top: 6px;
  color: #6c737d;
  font-size: 13px;
}

.yd-room-product__side {
  min-width: 140px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
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
  text-align: right;
}

.yd-room-price__sale {
  color: #1b1d22;
  font-size: 26px;
  font-weight: 800;
  line-height: 1.1;
  text-align: right;
}

.yd-room-product__btn {
  min-width: 96px;
  height: 40px;
  border: none;
  border-radius: 12px;
  background: #1976ff;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
}

.yd-room-product__btn:disabled {
  background: #d0d4da;
  color: #6d7480;
}

.yd-empty-panel,
.yd-empty-text {
  color: #737a84;
  font-size: 14px;
}

.yd-empty-panel {
  background: #fff;
  border: 1px dashed #d9dde3;
  border-radius: 14px;
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

.yd-stay-info-group + .yd-stay-info-group {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid #eceff3;
}

.yd-stay-info-group__title {
  font-size: 15px;
  font-weight: 800;
  color: #1f2329;
  margin-bottom: 10px;
}

.yd-stay-info-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
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

@media (max-width: 1280px) {
  .yd-gallery {
    grid-template-columns: 1fr;
    height: auto;
  }

  .yd-gallery__main {
    border-radius: 14px;
    min-height: 320px;
  }

  .yd-gallery__side {
    grid-template-columns: repeat(4, 1fr);
  }

  .yd-info-grid {
    grid-template-columns: 1fr;
  }

  .yd-room-card {
    grid-template-columns: 1fr;
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

  .yd-gallery__main {
    min-height: 220px;
  }

  .yd-gallery__side {
    grid-template-columns: 1fr 1fr;
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

  .yd-section__title {
    font-size: 22px;
  }

  .yd-room-card__gallery {
    min-height: 220px;
  }

  .yd-room-card__title {
    font-size: 20px;
  }

  .yd-room-product__top {
    flex-direction: column;
  }

  .yd-room-product__side {
    align-items: flex-start;
    min-width: 0;
  }

  .yd-room-price__origin,
  .yd-room-price__sale {
    text-align: left;
  }

  .yd-room-product__btn {
    width: 100%;
  }

  .yd-stay-info-grid {
    grid-template-columns: 1fr;
  }
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
  font-size: 14px;
  line-height: 1.7;
  margin-bottom: 4px;
  word-break: break-word;
}

.yd-preview-list__item:last-child {
  margin-bottom: 0;
}
</style>
