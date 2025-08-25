<template>
  <div>
    <canvas id="myChart"></canvas>
  </div>
</template>
<script setup lang="ts">
import { onMounted, watch, ref, reactive } from "vue";
import { Bar, Bubble, Doughnut, Line, Pie, PolarArea, Radar, Scatter } from "vue-chartjs";
import { Chart } from "chart.js/auto";

// 父元件傳來的值
const props = defineProps({
  // 圖表屬性
  // 當前可設置：bar、bubble、doughnut、pie、line、polar-area、radar、scatter
  chartType: {
    type: [String],
    default: "pie",
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
  // data未設定backgrong時的預設值
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
  // 圖表的options設置
  chartOptions: {
    type: [Object],
    default: () => {},
  },
});
const getLabels = (chartData: any[]) => {
  const labels = chartData.map((v) => v.label);
  return labels;
};

const getBackground = (chartData: any[], defaultBackground: string) => {
  const background = chartData.map((v) => (v.backgroundColor !== undefined ? v.backgroundColor : defaultBackground));
  return background;
};

const getData = (chartData: any[]) => {
  const data = chartData.map((v) => v.data);
  return data;
};

// 圖標資料設置
const chartData = ref({});

onMounted(() => {
  renderingChart();
});

watch(
  () => props,
  () => {
    renderingChart();
  },
  { deep: true },
);

let chartInstance: Chart | null = null;

// CanvasRenderingContext2D
async function renderingChart() {
  const myChart = document.getElementById("myChart") as HTMLCanvasElement;

  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  if (props.chartType === "bar") {
    chartInstance = new Chart(myChart, {
      type: "bar",
      data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [
          {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  } else if (props.chartType === "pie" || props.chartType === "doughnut" || props.chartType === "polar-area") {
    chartData.value = {
      labels: getLabels(props.data) ? getLabels(props.data) : [],
      datasets: [
        {
          backgroundColor: getBackground(props.data, props.defaultBackground),
          borderColor: props.borderColor ? props.borderColor : "transparent",
          data: getData(props.data),
        },
      ],
    };
  } else if (props.chartType === "line") {
    console.log(props.chartType);

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
            min: Math.min(...getData(props.data).map((data) => data)) * 0.8,
            max: Math.max(...getData(props.data).map((data) => data)) * 1.2,
          },
        },
        plugins: {
          tooltip: {
            callbacks: {
              footer: (tooltipItems: any[]) => {
                let sum = 0;
                tooltipItems.forEach(function (tooltipItem) {
                  sum = tooltipItem.parsed.y;
                });
                return "Sum: " + sum;
              },
            },
          },
        },
      },
    });
  } else if (props.chartType === "bubble") {
    chartData.value = {
      datasets: props.data,
    };
  } else if (props.chartType === "radar" || props.chartType === "scatter") {
    chartData.value = {
      labels: props.chartScope,
      datasets: props.data,
    };
  }

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
</script>
