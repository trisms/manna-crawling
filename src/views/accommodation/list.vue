<script>
export default {

}
</script>
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
	<panel>
<!--		<panel-header>
			<panel-title>Panel title here</panel-title>
			<panel-toolbar />
		</panel-header>-->
		<panel-body>
        <div class="mb-3 d-md-flex fw-bold">
          <div class="mt-md-0 mt-2"><a href="#" class="text-dark text-decoration-none"><i class="fa fa-download fa-fw me-1 text-dark text-opacity-50"></i> Export</a></div>
          <div class="ms-md-4 mt-md-0 mt-2 dropdown-toggle">
            <a href="#" data-bs-toggle="dropdown" class="text-dark text-decoration-none">More Actions <b class="caret"></b></a>
            <div class="dropdown-menu">
              <a class="dropdown-item" href="#">Action</a>
              <a class="dropdown-item" href="#">Another action</a>
              <a class="dropdown-item" href="#">Something else here</a>
              <div role="separator" class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">Separated link</a>
            </div>
          </div>
          <div class="ms-auto ">
            <div class="input-group mb-3">
              <button class="btn btn-white dropdown-toggle" type="button" data-bs-toggle="dropdown"><span class="d-none d-md-inline">Filter orders</span><span class="d-inline d-md-none"><i class="fa fa-credit-card"></i></span> <b class="caret"></b></button>
              <div class="dropdown-menu">
                <a class="dropdown-item" href="#">Action</a>
                <a class="dropdown-item" href="#">Another action</a>
                <a class="dropdown-item" href="#">Something else here</a>
                <div role="separator" class="dropdown-divider"></div>
                <a class="dropdown-item" href="#">Separated link</a>
              </div>
              <div class="flex-fill position-relative">
                <div class="input-group">
                  <div class="input-group-text position-absolute top-0 bottom-0 bg-none border-0 start-0" style="z-index: 1;">
                    <i class="fa fa-search opacity-5"></i>
                  </div>
                  <input type="text" class="form-control px-35px bg-light" placeholder="Search orders..." />
                  <a href="#" class="btn btn-success btn-rounded px-4 rounded-pill ms-3"><i class="fa fa-plus fa-lg me-2 ms-n2 text-success-900"></i> Search</a>
                </div>
              </div>
            </div>

          </div>

        </div>

        <div class="card border-0">
          <div class="mb-0 d-flex text-nowrap   flex-wrap gap-2">
            <button type="button" class="btn btn-sm btn-white" disabled=""><i class="fa fa-fw fa-arrow-turn-up ms-n1"></i>  Up One Level</button>

            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-white" disabled=""><i class="fa me-1 fa-arrow-left"></i> Back</button>
              <button type="button" class="btn btn-sm btn-white text-opacity-50" disabled=""><i class="fa me-1 fa-arrow-right"></i> Forward</button>
            </div>
            <button type="button" class="btn btn-sm btn-white px-2"><i class="fa fa-fw fa-arrows-rotate"></i></button>
            <div class="btn-group">
              <select class="btn btn-sm btn-white px-2">
                <option>132</option>
              </select>
              <select class="btn btn-sm btn-white px-2">
                <option>132</option>
              </select>
            </div>
            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-white"><i class="fa fa-fw fa-check ms-n1"></i> Select All</button>
              <button type="button" class="btn btn-sm btn-white"><i class="far fa-fw fa-square ms-n1"></i> Unselect All</button>
            </div>
          </div>
          <hr>
<!--          <ul class="nav nav-tabs nav-tabs-v2 px-3">
            <li class="nav-item me-2"><a href="#allTab" class="nav-link px-2 active" data-bs-toggle="tab">All</a></li>
            <li class="nav-item me-2"><a href="#publishedTab" class="nav-link px-2" data-bs-toggle="tab">음식점</a></li>
            <li class="nav-item me-2"><a href="#expiredTab" class="nav-link px-2" data-bs-toggle="tab">숙박업소</a></li>
            <li class="nav-item me-2"><a href="#deletedTab" class="nav-link px-2" data-bs-toggle="tab">미용실</a></li>
          </ul>-->
          <div class="tab-content">
            <div class="tab-pane fade show active" id="allTab">
              <!-- BEGIN input-group -->

              <!-- END input-group -->

              <!-- BEGIN table -->
              <div class="table-responsive mb-3">
                <table class="table table-hover table-panel text-nowrap align-middle mb-0">
                  <thead>
                  <tr>
                    <th></th>
                    <th>Order</th>
                    <th>Date</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Payment status</th>
                    <th>Fulfillment status</th>
                    <th>Items</th>
                    <th>Delivery method</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td class="w-10px align-middle">
                      <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="product1">
                        <label class="form-check-label" for="product1"></label>
                      </div>
                    </td>
                    <td><router-link to="/extra/order-details" class="fw-bold">#1950</router-link></td>
                    <td>Thu 26 Nov, 12:23pm</td>
                    <td>Amanda Lee</td>
                    <td>$398.00</td>
                    <td><span class="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> Paid</span></td>
                    <td><span class="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> Fulfilled</span></td>
                    <td>3 items</td>
                    <td>Free shipping</td>
                  </tr>
                  <tr>
                    <td class="w-10px align-middle">
                      <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="product2">
                        <label class="form-check-label" for="product2"></label>
                      </div>
                    </td>
                    <td><router-link to="/extra/order-details" class="fw-bold">#1949</router-link></td>
                    <td>Thu 26 Nov, 11:54am</td>
                    <td>Leonard Oii</td>
                    <td>$496.00</td>
                    <td><span class="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> Paid</span></td>
                    <td><span class="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> Fulfilled</span></td>
                    <td>1 item</td>
                    <td>Local pickup</td>
                  </tr>
                  <tr>
                    <td class="w-10px align-middle">
                      <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="product3">
                        <label class="form-check-label" for="product3"></label>
                      </div>
                    </td>
                    <td><router-link to="/extra/order-details" class="fw-bold">#1948</router-link></td>
                    <td>Thu 25 Nov, 11:54pm</td>
                    <td>John Doe</td>
                    <td>$195.00</td>
                    <td><span class="badge border border-warning text-warning px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> Pending</span></td>
                    <td><span class="badge border border-warning text-warning px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> Unfulfilled</span></td>
                    <td>2 items</td>
                    <td>Express</td>
                  </tr>
                  <tr>
                    <td class="w-10px align-middle">
                      <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="product4">
                        <label class="form-check-label" for="product4"></label>
                      </div>
                    </td>
                    <td><router-link to="/extra/order-details" class="fw-bold">#1947</router-link></td>
                    <td>Thu 25 Nov, 11:53pm</td>
                    <td>Terry Ng</td>
                    <td>$195.00</td>
                    <td><span class="badge border border-warning text-warning px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> Pending</span></td>
                    <td><span class="badge border border-warning text-warning px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> Unfulfilled</span></td>
                    <td>2 items</td>
                    <td>Express</td>
                  </tr>
                  <tr>
                    <td class="w-10px align-middle">
                      <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="product5">
                        <label class="form-check-label" for="product5"></label>
                      </div>
                    </td>
                    <td><router-link to="/extra/order-details" class="fw-bold">#1946</router-link></td>
                    <td>Thu 25 Nov, 11:52pm</td>
                    <td>Terry Ng</td>
                    <td>$195.00</td>
                    <td><span class="badge border border-warning text-warning px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> Pending</span></td>
                    <td><span class="badge border border-yellow text-warning px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> Unfulfilled</span></td>
                    <td>2 items</td>
                    <td>Express</td>
                  </tr>
                  <tr>
                    <td class="w-10px align-middle">
                      <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="product6">
                        <label class="form-check-label" for="product6"></label>
                      </div>
                    </td>
                    <td><router-link to="/extra/order-details" class="fw-bold">#1945</router-link></td>
                    <td>Thu 24 Nov, 2:43pm</td>
                    <td>Lelouch Wong</td>
                    <td>$900.00</td>
                    <td><span class="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> Paid</span></td>
                    <td><span class="badge border border-primary text-primary px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> Ready for pickup</span></td>
                    <td>2 items</td>
                    <td>Local pickup</td>
                  </tr>
                  <tr>
                    <td class="w-10px align-middle">
                      <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="product7">
                        <label class="form-check-label" for="product7"></label>
                      </div>
                    </td>
                    <td><router-link to="/extra/order-details" class="fw-bold">#1944</router-link></td>
                    <td>Thu 23 Nov, 2:43pm</td>
                    <td>Cynthia Ting</td>
                    <td>$625.00</td>
                    <td><span class="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> Paid</span></td>
                    <td><span class="badge border border-primary text-primary px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> Ready for delivery</span></td>
                    <td>1 item</td>
                    <td>Local pickup</td>
                  </tr>
                  <tr>
                    <td class="w-10px align-middle">
                      <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="product8">
                        <label class="form-check-label" for="product8"></label>
                      </div>
                    </td>
                    <td><router-link to="/extra/order-details" class="fw-bold">#1943</router-link></td>
                    <td>Thu 23 Nov, 11:59am</td>
                    <td>Richard Leong</td>
                    <td>$195.00</td>
                    <td><span class="badge border border-gray-300 text-gray-300 px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> Partially refunded</span></td>
                    <td><span class="badge border border-danger text-danger px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> Partially fulfilled</span></td>
                    <td>2 items</td>
                    <td>Express</td>
                  </tr>
                  <tr>
                    <td class="w-10px align-middle">
                      <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="product9">
                        <label class="form-check-label" for="product9"></label>
                      </div>
                    </td>
                    <td><router-link to="/extra/order-details" class="fw-bold">#1942</router-link></td>
                    <td>Thu 22 Nov, 8:12am</td>
                    <td>Clement Tang</td>
                    <td>$195.00</td>
                    <td><span class="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> Paid</span></td>
                    <td><span class="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> Fulfilled</span></td>
                    <td>1 item</td>
                    <td>Express</td>
                  </tr>
                  <tr>
                    <td class="w-10px align-middle">
                      <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="product10">
                        <label class="form-check-label" for="product10"></label>
                      </div>
                    </td>
                    <td><router-link to="/extra/order-details" class="fw-bold">#1941</router-link></td>
                    <td>Thu 22 Nov, 7:42am</td>
                    <td>Richard Leong</td>
                    <td>$195.00</td>
                    <td><span class="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> Paid</span></td>
                    <td><span class="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> Fulfilled</span></td>
                    <td>1 item</td>
                    <td>Express</td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <!-- END table -->
              <div class="d-md-flex align-items-center">
                <div class="me-md-auto text-md-left text-center mb-2 mb-md-0">
                  Showing 1 to 10 of 57 entries
                </div>
                <ul class="pagination mb-0 justify-content-center">
                  <li class="page-item disabled"><a class="page-link">Previous</a></li>
                  <li class="page-item"><a class="page-link" href="#">1</a></li>
                  <li class="page-item active"><a class="page-link" href="#">2</a></li>
                  <li class="page-item"><a class="page-link" href="#">3</a></li>
                  <li class="page-item"><a class="page-link" href="#">4</a></li>
                  <li class="page-item"><a class="page-link" href="#">5</a></li>
                  <li class="page-item"><a class="page-link" href="#">6</a></li>
                  <li class="page-item"><a class="page-link" href="#">Next</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
		</panel-body>
	</panel>
	<!-- END panel -->
</template>
