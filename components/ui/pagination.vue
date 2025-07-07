<template>
  <div class="flex justify-between items-center px-2 py-2">

    <div class="flex justify-start items-center">
      <span>共 {{ props.totalDataQuanity }} 筆</span>
      <USelect v-model="itemsPerPage" :items="perPageArray" class="w-auto mx-2" :label="'123'" />
      
      <UPagination class="mx-2" v-model:page="currentPage" :items-per-page="itemsPerPage" :total="props.totalDataQuanity" show-edges :sibling-count="1" color="neutral" variant="outline" />
      
      <span class="mx-1">前往第</span>
      <UInputNumber style="width: 120px;" v-model="currentPage" :min="1" :max="totalPages" color="neutral" highlight />
      <span class="mx-1">頁</span>
    </div>


    <template v-if="props.showFilter">
      <div class="flex justify-start items-center mx-2">
        <font-awesome-icon class="mx-1" :icon="['fas', 'sliders']" />
        <UInput class="mx-1" v-model="keyWord" :type="'search'" color="neutral" :placeholder="props.searchingPlaceholder" icon="i-lucide-search" size="md" />
      </div>      
    </template>

  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";




const props = withDefaults(
  defineProps<{
    currentPage?: number;
    dataPerpage?: number;
    pageArrayGot?: number[];
    totalDataQuanity?: number;
    showPageSendArea?: boolean;
    showFilter?: boolean;
    isSearchingDisabled?: boolean;
    searchingPlaceholder?: string;
    searchingWidth?: string;
    showCheckBox?: boolean;
    checkBoxId?: string;
    checkBoxTitle?: string;
    checkBoxValue?: boolean;
    showSortSelect?: boolean;
    // sortMethod?: ISortArray[];
    showFilterSelect?: boolean;
    // filterMethod?: IFilterArray[];
  }>(),
  {
    currentPage: 1,
    dataPerpage: 1,
    pageArrayGot: () => [20, 30, 50],
    totalDataQuanity: 0,
    showPageSendArea: true,
    showFilter: true,
    isSearchingDisabled: false,
    searchingPlaceholder: "",
    searchingWidth: "width: 300px",
    showCheckBox: false,
    checkBoxId: "",
    checkBoxTitle: "",
    checkBoxValue: false,
    showSortSelect: false,
    // sortMethod: () => [],
    showFilterSelect: false,
    // filterMethod: () => [],
  },
);


// 目前頁數
const currentPage = ref<number>(1);

// 一頁要幾筆資料
const itemsPerPage = ref<number>(20);

// 設定頁數
const totalPages = ref<number>(1);

// 每頁呈現資料量
const perPageArray = ref<{ label: string; value: number }[]>([]);

// 目標頁面
const pageTarget = ref<number>(1);

// 關鍵字
const keyWord = ref<string>("");
const keyWordPlaceholder = ref<string>("");



onMounted(() => {
  // 初始化頁數
  
  // console.log("onMounted props:", props);
  perPageArray.value = props.pageArrayGot.map((item) => {
    return { label: `${item} 筆 / 頁`, value: item };
  });

  itemsPerPage.value = perPageArray.value.some(item => item.value === props.dataPerpage) ? props.dataPerpage : perPageArray.value[0].value;

  totalPages.value = Math.ceil(props.totalDataQuanity / itemsPerPage.value);
  currentPage.value = 1;

  if (props.totalDataQuanity === 0) {
    totalPages.value = 0;
    currentPage.value = 1;
    itemsPerPage.value = perPageArray.value[0].value;
  }
  pageTarget.value = currentPage.value;

  keyWordPlaceholder.value = props.searchingPlaceholder ? props.searchingPlaceholder : "";
});



watch([currentPage, itemsPerPage, keyWord], () => {
  console.log("currentPage:", currentPage.value);
  console.log("itemsPerPage:", itemsPerPage.value);
  console.log("keyWord:", keyWord.value);
});



</script>
