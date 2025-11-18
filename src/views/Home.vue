<script setup>
import { ref, computed } from 'vue'

const items = ref([
  { id: 1950, date: 'Thu 26 Nov, 12:23pm', customer: 'Amanda Lee', total: '$398.00', payment: 'Paid', fulfillment: 'Fulfilled', items: 3, delivery: 'Free shipping' },
  { id: 1949, date: 'Thu 26 Nov, 11:54am', customer: 'Leonard Oii', total: '$496.00', payment: 'Paid', fulfillment: 'Fulfilled', items: 1, delivery: 'Local pickup' },
  { id: 1948, date: 'Thu 25 Nov, 11:54pm', customer: 'John Doe', total: '$195.00', payment: 'Pending', fulfillment: 'Unfulfilled', items: 2, delivery: 'Express' },
  { id: 1947, date: 'Thu 25 Nov, 11:53pm', customer: 'Terry Ng', total: '$195.00', payment: 'Pending', fulfillment: 'Unfulfilled', items: 2, delivery: 'Express' },
  { id: 1946, date: 'Thu 25 Nov, 11:52pm', customer: 'Terry Ng', total: '$195.00', payment: 'Pending', fulfillment: 'Unfulfilled', items: 2, delivery: 'Express' },
  { id: 1945, date: 'Thu 24 Nov, 2:43pm', customer: 'Lelouch Wong', total: '$900.00', payment: 'Paid', fulfillment: 'Ready for pickup', items: 2, delivery: 'Local pickup' },
  { id: 1944, date: 'Thu 23 Nov, 2:43pm', customer: 'Cynthia Ting', total: '$625.00', payment: 'Paid', fulfillment: 'Ready for delivery', items: 1, delivery: 'Local pickup' },
  { id: 1943, date: 'Thu 23 Nov, 11:59am', customer: 'Richard Leong', total: '$195.00', payment: 'Partially refunded', fulfillment: 'Partially fulfilled', items: 2, delivery: 'Express' },
  { id: 1942, date: 'Thu 22 Nov, 8:12am', customer: 'Clement Tang', total: '$195.00', payment: 'Paid', fulfillment: 'Fulfilled', items: 1, delivery: 'Express' },
  { id: 1941, date: 'Thu 22 Nov, 7:42am', customer: 'Richard Leong', total: '$195.00', payment: 'Paid', fulfillment: 'Fulfilled', items: 1, delivery: 'Express' },
  // 더 많은 데이터 추가 가능
])

// 페이지 관련 상태
const currentPage = ref(1)
const pageSize = ref(5)

const totalPages = computed(() => Math.ceil(items.value.length / pageSize.value))

const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return items.value.slice(start, end)
})

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}
</script>

<template>
  <div class="card border-0">
    <div class="table-responsive mb-3">
      <table class="table table-hover text-nowrap align-middle mb-0">
        <thead>
        <tr>
          <th>#</th>
          <th>Date</th>
          <th>Customer</th>
          <th>Total</th>
          <th>Payment</th>
          <th>Fulfillment</th>
          <th>Items</th>
          <th>Delivery</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in pagedItems" :key="item.id">
          <td><router-link :to="`/extra/order-details/${item.id}`" class="fw-bold">#{{ item.id }}</router-link></td>
          <td>{{ item.date }}</td>
          <td>{{ item.customer }}</td>
          <td>{{ item.total }}</td>
          <td>{{ item.payment }}</td>
          <td>{{ item.fulfillment }}</td>
          <td>{{ item.items }}</td>
          <td>{{ item.delivery }}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 페이징 -->
    <div class="d-flex align-items-center justify-content-between">
      <div>Page {{ currentPage }} / {{ totalPages }}</div>
      <ul class="pagination mb-0">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">Previous</a>
        </li>

        <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
        >
          <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
        </li>

        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">Next</a>
        </li>
      </ul>
    </div>
  </div>
</template>
