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
        <div class="mb-2 d-md-flex fw-bold ms-auto">
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-white" disabled=""> 지 역</button>
            <select class="  btn-white px-2 ">
              <option>시/도 전체</option>
            </select>
            <select class="  btn-white px-2">
              <option>시/군/구 전체</option>
            </select>

          </div>
          <div class="btn-group ms-2">
            <button type="button" class="btn btn-sm btn-white" disabled=""> 주문앱 </button>
            <select class=" btn-sm btn-white px-2">
              <option>주문앱 전체</option>
            </select>
          </div>
          <div class="btn-group ms-2">
            <button type="button" class="btn btn-sm btn-white" disabled=""> DB등록여부 </button>
            <select class=" btn-sm btn-white px-2">
              <option>주문앱 전체</option>
            </select>
          </div>
          <div class="btn-group ms-2">
            <button type="button" class="btn btn-sm btn-white" disabled=""> DB등록여부 </button>
            <select class=" btn-sm btn-white px-2">
              <option>전체</option>
            </select>
          </div>


<!--          <div class="mt-md-0 mt-2"><a href="#" class="text-dark text-decoration-none"><i class="fa fa-download fa-fw me-1 text-dark text-opacity-50"></i> Export</a></div>
          <div class="ms-md-4 mt-md-0 mt-2 dropdown-toggle">
            <a href="#" data-bs-toggle="dropdown" class="text-dark text-decoration-none">More Actions <b class="caret"></b></a>
            <div class="dropdown-menu">
              <a class="dropdown-item" href="#">Action</a>
              <a class="dropdown-item" href="#">Another action</a>
              <a class="dropdown-item" href="#">Something else here</a>
              <div role="separator" class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">Separated link</a>
            </div>
          </div>-->
          <div class="ms-auto">
            <div class="input-group">
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

            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-white" disabled=""> DB생성기간 </button>

              <div class="input-group date" id="datepicker-disabled-past" data-date-format="dd-mm-yyyy" data-date-start-date="Date.default">
                <input type="text" class="form-control borde-radius-0" placeholder="Select Date">
                <span class="input-group-text input-group-addon"><i class="fa fa-calendar"></i></span>
              </div>
              <span class="">~</span>
              <div class="input-group date" id="datepicker-disabled-past" data-date-format="dd-mm-yyyy" data-date-start-date="Date.default">
                <input type="text" class="form-control borde-radius-0" placeholder="Select Date">
                <span class="input-group-text input-group-addon"><i class="fa fa-calendar"></i></span>
              </div>
            </div>
<!--            <button type="button" class="btn btn-sm btn-white px-2"><i class="fa fa-fw fa-arrows-rotate"></i></button>
            <button type="button" class="btn btn-sm btn-white" disabled=""><i class="fa me-1 fa-arrow-left"></i> Back</button>
            <button type="button" class="btn btn-sm btn-white text-opacity-50" disabled=""><i class="fa me-1 fa-arrow-right"></i> Forward</button>-->
<!--            <div class="btn-group">
              <button type="button" class="btn btn-sm btn-white"><i class="fa fa-fw fa-check ms-n1"></i> Select All</button>
              <button type="button" class="btn btn-sm btn-white"><i class="far fa-fw fa-square ms-n1"></i> Unselect All</button>
            </div>-->
          </div>
          <hr>
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
                    <th>음식점 코드</th>
                    <th>음식점 상호</th>
                    <th>음식점 사업자번호</th>
                    <th>음식점 앱 등록상호</th>
                    <th>주문앱</th>
                    <th>주소</th>
                    <th>상품수</th>
                    <th>DB 생성일</th>
                    <th>등록일</th>
                    <th>기등록 가맹점코드</th>
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
                    <td><router-link to="/extra/order-details" class="fw-bold">D121950</router-link></td>
                    <td>싸다김밥 울릉점</td>
                    <td>110-22-2231234</td>
                    <td>싸다김밥울릉 1호점</td>
                    <td><span class="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i class="fa fa-circle fs-9px fa-fw me-5px"></i> 쿠팡</span></td>
                    <td>서울시 구로구 가산동 12-2 101호</td>
                    <td>150</td>
                    <td>2025-12-22</td>
                    <td>2025-11-20</td>
                    <td><input type="text" class="form-control"></td>
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

<style scoped>
.borde-radius-0 {
  border-radius: 0px;
}
</style>
