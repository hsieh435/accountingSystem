<template>
  <div class="flex-col justify-start items-center">
    <div class="flex flex-wrap justify-start items-center bg-gray-100 w-full px-3 py-1">
      <div class="flex items-center me-3 my-1">
        <span>股票：</span><stockListSelect @sendbackStockNo="settingStockNo" />
      </div>
      <div class="flex items-center me-3 my-1">
        <span>查詢區間：</span>
        <dateSelect
          :dateSelect="searchingParams.startDate"
          :minDate="'1967-01-01'"
          :maxDate="dateMove(searchingParams.endDate, -1)"
          @sendbackDate="settingStart" />
        <span class="mx-1">～</span>
        <dateSelect
          :dateSelect="searchingParams.endDate"
          :minDate="dateMove(searchingParams.startDate, 1)"
          :maxDate="getCurrentYMD()"
          @sendbackDate="settingEnd" />
      </div>
      <ui-buttonGroup
        showSearch
        :searchDisable="!searchingParams.stockNo || searchingParams.startDate === searchingParams.endDate"
        @dataSearch="sendingParams()" />
    </div>

    <div class="tabs">
      <input type="radio" id="tab1" name="tab-control" checked />
      <input type="radio" id="tab2" name="tab-control" />
      <input type="radio" id="tab3" name="tab-control" />
      <ul>
        <li title="股價走勢">
          <label for="tab1" role="button">
            <font-awesome-icon icon="fa-solid fa-chart-line" /><span>股價走勢</span>
          </label>
        </li>
        <li title="除權息">
          <label for="tab2" role="button">
            <font-awesome-icon icon="fa-solid fa-money-bill-trend-up" /><span>除權息</span>
          </label>
        </li>
        <li title="本益比 / 股價淨值比">
          <label for="tab3" role="button">
            <font-awesome-icon icon="fa-solid fa-percent" /><span>本益比 / 股價淨值比</span>
          </label>
        </li>
      </ul>

      <div class="slider">
        <div class="indicator"></div>
      </div>
      <div class="content">
        <section>
          <div class="icon-activity"></div>
          <stockPriceLineChart :searchingParamsGot="stockPriceParams" />
        </section>
        <section>
          <stockInterest :searchingParamsGot="stockPriceParams" />
        </section>
        <section>
          <stockPerPbr :searchingParamsGot="stockPriceParams" />
        </section>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, ref, reactive } from "vue";
import { IStockPriceSearchingParams, IStockList } from "@/models/index";
import { getCurrentYMD, getCurrentYear, getCurrentMonth, getCurrentDate, dateMove } from "@/composables/tools";

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "資訊查詢",
  subTitle: "股市查詢",
});

const stockListSelect = defineAsyncComponent(() => import("@/components/ui/select/stockListSelect.vue"));
const dateSelect = defineAsyncComponent(() => import("@/components/ui/select/dateSelect.vue"));
const stockPriceLineChart = defineAsyncComponent(
  () => import("@/components/outerInformationComponents/stock/stockPriceLineChart.vue"),
);
const stockPerPbr = defineAsyncComponent(() => import("@/components/outerInformationComponents/stock/stockPerPbr.vue"));
const stockInterest = defineAsyncComponent(
  () => import("@/components/outerInformationComponents/stock/stockInterest.vue"),
);

const searchingParams = reactive<IStockPriceSearchingParams>({
  stockNo: "",
  stockName: "",
  startDate: `${getCurrentYear()}-${getCurrentMonth() - 1}-${getCurrentDate()}`,
  endDate: getCurrentYMD(),
});

const stockPriceParams = ref<IStockPriceSearchingParams>({
  stockNo: "",
  stockName: "",
  startDate: "",
  endDate: "",
});



async function settingStockNo(selectedData: IStockList) {
  searchingParams.stockNo = selectedData.stock_id;
  searchingParams.stockName = selectedData.stock_name;
}

async function settingStart(date: string) {
  searchingParams.startDate = date;
}

async function settingEnd(date: string) {
  searchingParams.endDate = date;
}

async function sendingParams() {
  // console.log("searchingParams:", searchingParams);
  stockPriceParams.value = { ...searchingParams };
}
</script>
<style lang="scss" scoped>
.tabs {
  padding: 20px;
}
.tabs input[name="tab-control"] {
  display: none;
}
.tabs ul {
  list-style-type: none;
  padding-left: 0;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;
}
.tabs ul li {
  box-sizing: border-box;
  flex: 1;
  width: 32%;
  padding: 0px 10px;
  text-align: center;
}
.tabs ul li label {
  transition: all 0.3s ease-in-out;
  color: rgb(146, 157, 175);
  padding: 5px auto;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.tabs ul li label svg {
  fill: rgb(146, 157, 175);
  height: 1.2em;
  vertical-align: bottom;
  margin-right: 0.2em;
  transition: all 0.2s ease-in-out;
}
.tabs ul li label:hover,
.tabs ul li label:focus,
.tabs ul li label:active {
  outline: 0;
  color: rgb(190, 197, 207);
}
.tabs ul li label:hover svg,
.tabs ul li label:focus svg,
.tabs ul li label:active svg {
  fill: rgb(190, 197, 207);
}
.tabs .slider {
  position: relative;
  width: 33%;
  transition: all 0.33s cubic-bezier(0.38, 0.8, 0.32, 1.07);
}
.tabs .slider .indicator {
  position: relative;
  width: 100%;
  margin: 0 auto;
  height: 4px;
  background: rgb(0, 193, 106);
  border-radius: 5px;
}
.tabs .content {
  width: 100%;
  margin-top: 30px;
}
.tabs .content section {
  display: none;
  width: 100%;
  -webkit-animation-name: content;
  animation-name: content;
  -webkit-animation-direction: normal;
  animation-direction: normal;
  -webkit-animation-duration: 0.3s;
  animation-duration: 0.3s;
  -webkit-animation-timing-function: ease-in-out;
  animation-timing-function: ease-in-out;
  -webkit-animation-iteration-count: 1;
  animation-iteration-count: 1;
  line-height: 1.4;
}

.tabs input[name="tab-control"]:nth-of-type(1):checked ~ ul > li:nth-child(1) > label,
.tabs input[name="tab-control"]:nth-of-type(1):checked ~ ul > li:nth-child(1) > label svg {
  cursor: default;
  color: rgb(0, 193, 106);
}
.tabs input[name="tab-control"]:nth-of-type(1):checked ~ .slider {
  transform: translateX(0%);
}
.tabs input[name="tab-control"]:nth-of-type(1):checked ~ .content > section:nth-child(1) {
  display: block;
}

.tabs input[name="tab-control"]:nth-of-type(2):checked ~ ul > li:nth-child(2) > label,
.tabs input[name="tab-control"]:nth-of-type(2):checked ~ ul > li:nth-child(2) > label svg {
  cursor: default;
  color: rgb(0, 193, 106);
}
.tabs input[name="tab-control"]:nth-of-type(2):checked ~ .slider {
  transform: translateX(100%);
}
.tabs input[name="tab-control"]:nth-of-type(2):checked ~ .content > section:nth-child(2) {
  display: block;
}

.tabs input[name="tab-control"]:nth-of-type(3):checked ~ ul > li:nth-child(3) > label,
.tabs input[name="tab-control"]:nth-of-type(3):checked ~ ul > li:nth-child(3) > label svg {
  cursor: default;
  color: rgb(0, 193, 106);
}
.tabs input[name="tab-control"]:nth-of-type(3):checked ~ .slider {
  transform: translateX(200%);
}
.tabs input[name="tab-control"]:nth-of-type(3):checked ~ .content > section:nth-child(3) {
  display: block;
}

@-webkit-keyframes content {
  from {
    opacity: 0;
    transform: translateY(5%);
  }
  to {
    opacity: 1;
    transform: translateY(0%);
  }
}
@keyframes content {
  from {
    opacity: 0;
    transform: translateY(5%);
  }
  to {
    opacity: 1;
    transform: translateY(0%);
  }
}
@media (max-width: 1000px) {
  .tabs ul li label {
    white-space: initial;
  }
  .tabs ul li label svg {
    height: 1.5em;
  }
}
</style>
<!-- https://codepen.io/woranov/pen/NRqLWK/ -->
<!-- https://codepen.io/mildrenben/pen/bdGdOb/ -->
<!-- https://codepen.io/celcarpe/pen/VwZrJpj -->
<!-- https://codepen.io/alvarotrigo/pen/bGoPzmw -->
