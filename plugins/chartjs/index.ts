// chart.js 官方網站：https://www.chartjs.org/docs/latest/
// chart.js 設定檔，參考網站：https://hackmd.io/@0C9tvexQRlq2rpKZwMsejw/SkTBiYdc6



import { defineNuxtPlugin } from "nuxt/app";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
export default defineNuxtPlugin(() => {
  Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    RadialLinearScale,
    ArcElement,
    Filler,
    Title,
    Tooltip,
    Legend,
  );
});
