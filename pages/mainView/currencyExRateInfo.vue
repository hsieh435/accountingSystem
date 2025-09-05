<template>
  <div class="flex-col justify-start items-center">
    <div>
      <currencyExRateSearching />
    </div>

    <div class="tabs">
      <input type="radio" id="tab1" name="tab-control" checked />
      <input type="radio" id="tab2" name="tab-control" />
      <input type="radio" id="tab3" name="tab-control" />
      <input type="radio" id="tab4" name="tab-control" />
      <ul>
        <li title="Features">
          <label for="tab1" role="button"><span>1</span></label>
        </li>
        <li title="Delivery Contents">
          <label for="tab2" role="button"><span>2</span></label>
        </li>
        <li title="Shipping">
          <label for="tab3" role="button"><span>3</span></label>
        </li>
      </ul>

      <div class="slider">
        <div class="indicator"></div>
      </div>
      <div class="content">
        <section>
          <!-- <stockPriceLineChart :searchingParamsGot="stockPriceParams" /> -->
        </section>
        <section>
          <!-- <stockPerPrb /> -->
        </section>
        <section>
          <!-- <stockInterest :searchingParamsGot="stockPriceParams" /> -->
        </section>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from "vue";
import { fetchCurrencyLatestExRate } from "@/server/outerWebApi";
import { IResponse } from "@/models/index";
import { getCurrentYear, getCurrentMonth } from "@/composables/tools";
import { showAxiosErrorMsg } from "@/composables/swalDialog";



declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "資訊查詢",
  subTitle: "貨幣匯率查詢",
})



const currencyExRateSearching = defineAsyncComponent(() => import("@/components/outerInformationComponents/currency/currencyExRateSearching.vue"));



onMounted(async () => {
  //
});


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
  flex-direction: row;
  margin-bottom: 10px;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
}
.tabs ul li {
  box-sizing: border-box;
  flex: 1;
  width: 25%;
  padding: 0 10px;
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
.tabs ul li label br {
  display: none;
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
  width: 100%; /* Ensure full width */
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
.tabs input[name="tab-control"]:nth-of-type(1):checked ~ ul > li:nth-child(1) > label {
  cursor: default;
  color: rgb(0, 193, 106);
}
.tabs input[name="tab-control"]:nth-of-type(1):checked ~ ul > li:nth-child(1) > label svg {
  fill: rgb(0, 193, 106);
}
@media (max-width: 600px) {
  .tabs input[name="tab-control"]:nth-of-type(1):checked ~ ul > li:nth-child(1) > label {
    background: rgba(0, 0, 0, 0.08);
  }
}
.tabs input[name="tab-control"]:nth-of-type(1):checked ~ .slider {
  transform: translateX(0%);
}
.tabs input[name="tab-control"]:nth-of-type(1):checked ~ .content > section:nth-child(1) {
  display: block;
}
.tabs input[name="tab-control"]:nth-of-type(2):checked ~ ul > li:nth-child(2) > label {
  cursor: default;
  color: rgb(0, 193, 106);
}
.tabs input[name="tab-control"]:nth-of-type(2):checked ~ ul > li:nth-child(2) > label svg {
  fill: rgb(0, 193, 106);
}
@media (max-width: 600px) {
  .tabs input[name="tab-control"]:nth-of-type(2):checked ~ ul > li:nth-child(2) > label {
    background: rgba(0, 0, 0, 0.08);
  }
}
.tabs input[name="tab-control"]:nth-of-type(2):checked ~ .slider {
  transform: translateX(100%);
}
.tabs input[name="tab-control"]:nth-of-type(2):checked ~ .content > section:nth-child(2) {
  display: block;
}
.tabs input[name="tab-control"]:nth-of-type(3):checked ~ ul > li:nth-child(3) > label {
  cursor: default;
  color: rgb(0, 193, 106);
}
.tabs input[name="tab-control"]:nth-of-type(3):checked ~ ul > li:nth-child(3) > label svg {
  fill: rgb(0, 193, 106);
}
@media (max-width: 600px) {
  .tabs input[name="tab-control"]:nth-of-type(3):checked ~ ul > li:nth-child(3) > label {
    background: rgba(0, 0, 0, 0.08);
  }
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
  .tabs ul li label br {
    display: initial;
  }
  .tabs ul li label svg {
    height: 1.5em;
  }
}
@media (max-width: 600px) {
  .tabs ul li label {
    padding: 5px;
    border-radius: 5px;
  }
  .tabs ul li label span {
    display: none;
  }
  .tabs .slider {
    display: none;
  }
  .tabs .content {
    margin-top: 20px;
  }
  .tabs .content section h2 {
    display: block;
  }
}


</style>
<!-- https://codepen.io/woranov/pen/NRqLWK/ -->
<!-- https://codepen.io/mildrenben/pen/bdGdOb/ -->
<!-- https://codepen.io/celcarpe/pen/VwZrJpj -->
<!-- https://codepen.io/alvarotrigo/pen/bGoPzmw -->
