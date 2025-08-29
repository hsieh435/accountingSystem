<template>
  <div>
    <canvas id="myChart"></canvas>
  </div>
</template>
<script setup lang="ts">
import { onMounted, watch, reactive } from "vue";
import { Bar, Bubble, Doughnut, Line, Pie, PolarArea, Radar, Scatter } from "vue-chartjs";
import { Chart } from "chart.js/auto";

// 父元件傳來的值
const props = defineProps({
  // 圖表屬性
  // 當前可設置：bar、bubble、doughnut、pie、line、polar-area、radar、scatter
  chartType: {
    type: [String],
    default: "",
  },
  // 長條圖、折線圖才需要設置的值
  chartTitle: {
    type: [String],
    default: "",
  },
  // 雷達圖才需要設置的外圍值
  chartScope: {
    type: [Array],
    default: () => [],
  },
  data: {
    type: [Array],
    default: () => [],
  },
  // data 未設定 background 時的預設值
  defaultBackground: {
    type: [String],
    default: "#E46651",
  },
  borderColor: {
    type: [String],
    default: "",
  },
  // 目前只給予折線圖設置
  fill: {
    type: [Boolean],
    default: false,
  },
  // 圖表的 options 設置
  chartOptions: {
    type: [Object],
    default: () => {},
  },
});

const getLabels = (chartData: any[]) => {
  const labels = chartData.map((v) => v.label);
  return labels;
};

const getData = (chartData: any[]) => {
  const data = chartData.map((v) => v.data);
  return data;
};

// 圖標資料設置
// const chartData = ref({});

onMounted(() => {
  renderingChart();
});

watch(
  props,
  () => {
    renderingChart();
  },
  { deep: true },
);

let chartInstance: Chart | null = null;

// CanvasRenderingContext2D
async function renderingChart() {
  // console.log(props.chartType);
  const myChart = document.getElementById("myChart") as HTMLCanvasElement;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  const scalesMax = getData(props.data) ? Math.ceil(Math.max(...getData(props.data).map((data) => data)) * 1.02) : 10;
  const scalesMin = getData(props.data) ? Math.floor(Math.min(...getData(props.data).map((data) => data)) * 0.85) : 0;

  let variation = 0;

  chartInstance = new Chart(myChart, {
    type: "line",
    data: {
      labels: getLabels(props.data) ? getLabels(props.data) : [],
      datasets: [
        {
          label: props.chartTitle,
          data: getData(props.data),
          fill: props.fill,
        },
      ],
    },
    options: {
      scales: {
        y: {
          min:
            Math.ceil(scalesMin - (scalesMax - scalesMin) * 0.1) <= 0
              ? 0
              : Math.ceil(scalesMin - (scalesMax - scalesMin) * 0.1),
          max: Math.floor(scalesMax + (scalesMax - scalesMin) * 0.1),
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            title: function (tooltipItems) {
              return tooltipItems[0].label;
            },
            label: function () {
              return "";
            },
            footer: function (tooltipItems) {
              // console.log("tooltipItems:", tooltipItems);
              let currentValue = 0;
              let lastValue = 0;
              tooltipItems.forEach(function (tooltipItem) {
                const index = tooltipItem.dataIndex;
                currentValue = Number(tooltipItem.dataset.data[index]);
                lastValue = index > 0 ? Number(tooltipItem.dataset.data[index - 1]) : 0;
                variation =
                  index === 0 || !Array.isArray(tooltipItem.dataset.data) || currentValue === null || lastValue === null
                    ? 0
                    : currentValue - lastValue;
              });
              return (
                currentValue +
                "\n" +
                (variation > 0 ? "▲" : variation < 0 ? "▼" : "") +
                (variation === 0
                  ? "0.00 ( 0.00 % ）"
                  : (lastValue <= 0 ? "" : variation.toFixed(2)) +
                    `（ ${lastValue <= 0 ? "N/A" : ((variation / lastValue) * 100).toFixed(2) + "%"} ）`)
              );
            },
          },
          footerColor: function () {
            switch (true) {
              case variation > 0:
                return "rgb(255, 0, 0)";
              case variation < 0:
                return "rgb(0, 128, 0)";
              default:
                return "rgb(255, 255, 255)";
            }
          },
        },
      },
    },
  });

  // 預設的options
  const chartOptions = reactive({
    responsive: true,
    maintainAspectRatio: false,
  });

  // 父元件如果有設定options，將新得更新至當前的options內
  if (props.chartOptions) {
    Object.assign(chartOptions, props.chartOptions);
  }
}

const actions = [
  {
    name: "增加資料",
    handler(chartinstance: Chart) {
      const data = chartinstance.data;
      // Replace Utils with dummy color and data generation for demonstration
      const dsColor = `hsl(${Math.floor(Math.random() * 360)}, 70%, 50%)`;
      const transparentize = (color: string, opacity: number) => {
        // Simple transparentize function for demonstration
        return color.replace("hsl", "hsla").replace(")", `, ${opacity})`);
      };
      const numbers = ({ count, min, max }: { count: number; min: number; max: number }) =>
        Array.from({ length: count }, () => Math.floor(Math.random() * (max - min + 1)) + min);

      const newDataset = {
        label: "Dataset " + (data.datasets.length + 1),
        backgroundColor: transparentize(dsColor, 0.5),
        borderColor: dsColor,
        data: numbers({ count: (data.labels ?? []).length, min: -100, max: 100 }),
      };
      chartinstance.data.datasets.push(newDataset);
      chartinstance.update();
    },
  },
];
</script>
