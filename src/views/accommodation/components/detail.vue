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

          <section class="yd-section">
            <div v-if="roomList.length" class="yd-room-tabs-wrap">
              <div class="yd-room-tabs-nav">
                <button
                    type="button"
                    class="yd-room-tabs-arrow left"
                    @click="scrollRoomTabs('left')"
                    aria-label="객실 탭 왼쪽으로 이동"
                >
                  <i class="fa fa-chevron-left"></i>
                </button>

                <div class="yd-room-tabs" ref="roomTabsRef">
                  <button
                      v-for="roomItem in roomList"
                      :key="roomItem.roomId"
                      type="button"
                      class="yd-room-tab"
                      :class="{ active: activeRoomId === roomItem.roomId }"
                      @click="selectRoomTab(roomItem.roomId)"
                  >
                    <span class="yd-room-tab__name">{{ roomItem.roomName || '객실명 없음' }}</span>
                    <span class="yd-room-tab__count">
          {{ roomItem.roomInfo?.length || 0 }}개 상품
        </span>
                  </button>
                </div>

                <button
                    type="button"
                    class="yd-room-tabs-arrow right"
                    @click="scrollRoomTabs('right')"
                    aria-label="객실 탭 오른쪽으로 이동"
                >
                  <i class="fa fa-chevron-right"></i>
                </button>
              </div>

              <div v-if="activeRoom" class="yd-room-tab-panel">
                <div class="yd-room-tab-panel__top">
                  <div class="yd-room-tab-panel__summary">
                    <h3 class="yd-room-tab-panel__title">{{ activeRoom.roomName || '-' }}</h3>
                    <p class="yd-room-tab-panel__desc">
                      등록 이미지 {{ sortedRoomImages(activeRoom).length }}장 ·
                      객실 상품 {{ activeRoom.roomInfo?.length || 0 }}개
                    </p>
                  </div>

                  <button
                      type="button"
                      class="yd-room-upload-btn"
                      :disabled="!(selectedRoomImageMap[activeRoom.roomId]?.length)"
                  >
                    선택 이미지 업로드
                  </button>
                </div>

                <!-- 객실 상품 먼저 -->
                <!--              <div class="yd-room-products-wrap">
                                <div class="yd-room-products-wrap__title">객실 상품</div>

                                <div v-if="activeRoom.roomInfo?.length" class="yd-room-products-table">
                                  <div
                                      v-for="detail in activeRoom.roomInfo"
                                      :key="detail.roomInfoId"
                                      class="yd-room-product-row"
                                  >
                                    <div class="yd-room-product-row__main">
                                      <div class="yd-room-product-row__name">
                                        {{ getRoomTypeName(detail.roomType) }}
                                      </div>
                                      <div class="yd-room-product-row__meta">
                                        기준 {{ detail.baseCnt ?? 0 }}인 / 최대 {{ detail.maxCnt ?? 0 }}인
                                      </div>
                                      <div class="yd-room-product-row__meta">
                                        이용시간 {{ detail.availUseTime || '-' }}시간
                                      </div>
                                      <div class="yd-room-product-row__meta">
                                        입실 {{ formatRoomTime(detail.checkInTime) }} · 퇴실 {{ formatRoomTime(detail.checkOutTime) }}
                                      </div>
                                    </div>

                                    <div class="yd-room-product-row__status">
                                      <span
                                          class="yd-status-badge"
                                          :class="{ sold: isSoldOut(detail.isSoldOut) }"
                                      >
                                        {{ isSoldOut(detail.isSoldOut) ? '판매종료' : '예약가능' }}
                                      </span>
                                    </div>

                                    <div class="yd-room-product-row__price">
                                      <div v-if="hasDiscount(detail)" class="yd-room-price__origin">
                                        {{ formatPrice(detail.roomPrice) }}
                                      </div>
                                      <div class="yd-room-price__sale">
                                        {{ displayRoomPrice(detail) }}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div v-else class="yd-empty-panel">
                                  등록된 객실 상세 정보가 없습니다.
                                </div>
                              </div>-->

                <!-- 이미지 카드 5열 -->
                <div class="yd-room-image-check-section">
                  <div class="yd-room-image-check-section__head">
                    <div class="yd-room-image-check-section__title-wrap">
                      <div class="yd-room-image-check-section__title">객실 이미지</div>
                      <div class="yd-room-image-check-section__info">
                        선택 {{ selectedCount(activeRoom.roomId) }} / {{ sortedRoomImages(activeRoom).length }}
                      </div>
                    </div>

                    <div class="yd-room-image-check-section__actions">
                      <button
                          type="button"
                          class="yd-room-image-action-btn"
                          @click="toggleSelectAllRoomImages(activeRoom)"
                          :disabled="!sortedRoomImages(activeRoom).length"
                      >
                        {{ isAllRoomImagesSelected(activeRoom) ? '전체해제' : '전체선택' }}
                      </button>
                    </div>
                  </div>

                  <div
                      v-if="sortedRoomImages(activeRoom).length"
                      class="yd-room-image-scroll"
                  >
                    <div class="yd-room-image-card-grid">
                      <button
                          v-for="(img, index) in sortedRoomImages(activeRoom)"
                          :key="img.roomImgId || index"
                          type="button"
                          class="yd-room-image-card"
                          :class="{ selected: isRoomImageSelected(activeRoom.roomId, img) }"
                          @click="toggleRoomImageSelection(activeRoom.roomId, img)"
                      >
                        <div class="yd-room-image-card__thumb-wrap">
                          <img
                              :src="img.imgPath"
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
                              @click.stop="openImageModal(img.imgPath)"
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

        <section class="yd-summary">
          <div class="yd-summary__left">
            <div class="yd-summary__type">{{ getAccomTypeName(info.accomType) }}</div>
            <h1 class="yd-summary__title">{{ info.accomName || '-' }}</h1>
          </div>

          <div class="yd-summary__right">
<!--            <button type="button" class="yd-like-btn">
              <i class="fa fa-heart-o"></i>
            </button>-->
<!--            <div class="yd-summary__price">
              {{ lowestPrice }}
            </div>-->
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

            <div v-else class="yd-info-card__content yd-info-card__content&#45;&#45;review">
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

                <div class="yd-stay-info-group__content">
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
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAccommodationStore } from '@/stores/accommodation/useAccommodationStore';

const route = useRoute();
const store = useAccommodationStore();

const NO_IMAGE_URL = new URL('@/assets/img/noimg.gif', import.meta.url).href;

const loading = ref(false);
const imageModalVisible = ref(false);
const modalImage = ref(NO_IMAGE_URL);

const activeRoomId = ref<number | string | null>(null);
const selectedRoomImageMap = ref<Record<number | string, Array<number | string>>>({});

const accomId = computed(() => Number(route.query.accomId || route.params.id || 0));

const info = computed(() => store.form.info || {});
const room = computed(() => store.form.room || []);
const roomTabsRef = ref<HTMLElement | null>(null);

function scrollRoomTabs(direction: 'left' | 'right') {
  const el = roomTabsRef.value;
  if (!el) return;

  const move = 260;

  el.scrollBy({
    left: direction === 'left' ? -move : move,
    behavior: 'smooth',
  });
}
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

const activeRoom = computed(() => {
  if (!roomList.value.length) return null;
  const found = roomList.value.find((item: any) => item.roomId === activeRoomId.value);
  return found || roomList.value[0];
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

function getRoomTypeName(roomType: string | number) {
  switch (String(roomType)) {
    case '1':
      return '숙박';
    case '2':
      return '대실';
    default:
      return '객실 상품';
  }
}

function formatRoomTime(value: string | number) {
  if (value === null || value === undefined || value === '') return '-';

  const str = String(value).replace(/[^0-9]/g, '');

  if (str.length === 4) {
    return `${str.slice(0, 2)}:${str.slice(2, 4)}`;
  }

  if (str.length === 3) {
    return `0${str.slice(0, 1)}:${str.slice(1, 3)}`;
  }

  return String(value);
}

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

function selectRoomTab(roomId: number | string) {
  activeRoomId.value = roomId;

  if (!selectedRoomImageMap.value[roomId]) {
    selectedRoomImageMap.value[roomId] = [];
  }
}

function getRoomImageValue(img: any) {
  return img?.roomImgId || img?.imgPath;
}

function isRoomImageSelected(roomId: number | string, img: any) {
  const selected = selectedRoomImageMap.value[roomId] || [];
  const value = getRoomImageValue(img);
  return selected.includes(value);
}

function toggleRoomImageSelection(roomId: number | string, img: any) {
  if (!selectedRoomImageMap.value[roomId]) {
    selectedRoomImageMap.value[roomId] = [];
  }

  const value = getRoomImageValue(img);
  const selected = selectedRoomImageMap.value[roomId];
  const index = selected.indexOf(value);

  if (index > -1) {
    selected.splice(index, 1);
  } else {
    selected.push(value);
  }
}

function selectedCount(roomId: number | string) {
  return selectedRoomImageMap.value[roomId]?.length || 0;
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

watch(
    roomList,
    (newRooms) => {
      newRooms.forEach((roomItem: any, index: number) => {
        if (!selectedRoomImageMap.value[roomItem.roomId]) {
          selectedRoomImageMap.value[roomItem.roomId] = [];
        }

        if (index === 0 && activeRoomId.value === null) {
          activeRoomId.value = roomItem.roomId;
        }
      });

      if (
          activeRoomId.value !== null &&
          !newRooms.some((item: any) => item.roomId === activeRoomId.value)
      ) {
        activeRoomId.value = newRooms[0]?.roomId ?? null;
      }
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

function isAllRoomImagesSelected(roomItem: any) {
  if (!roomItem) return false;

  const images = sortedRoomImages(roomItem);
  if (!images.length) return false;

  const selected = selectedRoomImageMap.value[roomItem.roomId] || [];
  const allValues = images.map((img: any) => getRoomImageValue(img));

  return allValues.every((value) => selected.includes(value));
}

function toggleSelectAllRoomImages(roomItem: any) {
  if (!roomItem) return;

  const roomId = roomItem.roomId;
  const images = sortedRoomImages(roomItem);

  if (!images.length) {
    selectedRoomImageMap.value[roomId] = [];
    return;
  }

  const allValues = images.map((img: any) => getRoomImageValue(img));

  if (isAllRoomImagesSelected(roomItem)) {
    selectedRoomImageMap.value[roomId] = [];
  } else {
    selectedRoomImageMap.value[roomId] = [...allValues];
  }
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

  .yd-room-image-card-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

@media (max-width: 1024px) {
  .yd-room-image-card-grid {
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

  .yd-room-image-card-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
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
</style>
