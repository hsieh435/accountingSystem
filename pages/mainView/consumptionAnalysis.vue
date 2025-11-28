<template>
  <div class="py-[20px] tabs">
    <input id="tab1" name="tab-control" type="radio" checked />
    <input id="tab2" name="tab-control" type="radio" />
    <input id="tab3" name="tab-control" type="radio" />
    <input id="tab4" name="tab-control" type="radio" />
    <input id="tab5" name="tab-control" type="radio" />
    <ul>
      <li title="現金流">
        <label for="tab1" role="button">
          <font-awesome-icon class="mx-1" :icon="['fas', 'money-bill-alt']" /><span>現金流</span>
        </label>
      </li>
      <li title="儲值票卡">
        <label for="tab2" role="button">
          <font-awesome-icon class="mx-1" :icon="['fas', 'ticket-alt']" /><span>儲值票卡</span>
        </label>
      </li>
      <li title="信用卡">
        <label for="tab3" role="button">
          <font-awesome-icon class="mx-1" :icon="['fas', 'credit-card']" /><span>信用卡</span>
        </label>
      </li>
      <li title="存款帳戶">
        <label for="tab4" role="button">
           <font-awesome-icon class="mx-1" :icon="['fas', 'dollar-sign']" /><span>存款帳戶</span>
        </label>
      </li>
      <li title="證券帳戶">
        <label for="tab5" role="button">
          <font-awesome-icon class="mx-1" :icon="['fas', 'arrow-trend-up']" /><span>證券帳戶</span>
        </label>
      </li>
    </ul>

    <div class="slider">
      <div class="indicator"></div>
    </div>
    <div class="content">
      <section>
        <div class="icon-activity"></div>
        <cashFlowConsumptionChart />
      </section>
      <section>
        <storedValueCardConsumptionChart />
      </section>
      <section>
        <creditCardConsumptionChart />
      </section>
      <section>
        <currencyAccountConsumptionChart />
      </section>
      <section>
        <stockAccountConsumptionChart />
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineAsyncComponent } from "vue";


const cashFlowConsumptionChart = defineAsyncComponent(() => import("@/components/financeStatementComponents/consumptionAnalysisChart/cashFlowConsumptionChart.vue"));

const storedValueCardConsumptionChart = defineAsyncComponent(() => import("@/components/financeStatementComponents/consumptionAnalysisChart/storedValueCardConsumptionChart.vue"));

const creditCardConsumptionChart = defineAsyncComponent(() => import("@/components/financeStatementComponents/consumptionAnalysisChart/creditCardConsumptionChart.vue"));

const currencyAccountConsumptionChart = defineAsyncComponent(() => import("@/components/financeStatementComponents/consumptionAnalysisChart/currencyAccountConsumptionChart.vue"));

const stockAccountConsumptionChart = defineAsyncComponent(() => import("@/components/financeStatementComponents/consumptionAnalysisChart/stockAccountConsumptionChart.vue"));

declare function definePageMeta(meta: any): void;
definePageMeta({
  middleware: "auth",
  functionTitle: "財務報表",
  subTitle: "消費分析",
})



</script>
<style lang="scss" scoped>

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
  width: 20%;
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

.tabs ul li label:hover,
.tabs ul li label:focus,
.tabs ul li label:active {
  outline: 0;
  color: rgb(190, 197, 207);
}
.tabs .slider {
  position: relative;
  width: 20%;
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

.tabs input[name="tab-control"]:nth-of-type(4):checked ~ ul > li:nth-child(4) > label,
.tabs input[name="tab-control"]:nth-of-type(4):checked ~ ul > li:nth-child(4) > label svg {
  cursor: default;
  color: rgb(0, 193, 106);
}
.tabs input[name="tab-control"]:nth-of-type(4):checked ~ .slider {
  transform: translateX(300%);
}
.tabs input[name="tab-control"]:nth-of-type(4):checked ~ .content > section:nth-child(4) {
  display: block;
}

.tabs input[name="tab-control"]:nth-of-type(5):checked ~ ul > li:nth-child(5) > label,
.tabs input[name="tab-control"]:nth-of-type(5):checked ~ ul > li:nth-child(5) > label svg {
  cursor: default;
  color: rgb(0, 193, 106);
}
.tabs input[name="tab-control"]:nth-of-type(5):checked ~ .slider {
  transform: translateX(400%);
}
.tabs input[name="tab-control"]:nth-of-type(5):checked ~ .content > section:nth-child(5) {
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
}
</style>
<!-- https://codepen.io/woranov/pen/NRqLWK/ -->
<!-- https://codepen.io/mildrenben/pen/bdGdOb/ -->
<!-- https://codepen.io/celcarpe/pen/VwZrJpj -->
<!-- https://codepen.io/alvarotrigo/pen/bGoPzmw -->
