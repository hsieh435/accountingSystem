<template>
  <div class="flex flex-wrap justify-between items-center px-2">

    <div class="flex flex-wrap justify-start items-center me-2 my-1">
      <span>共 {{ props.totalDataQuanity }} 筆</span>
      <USelect v-model="itemsPerPage" :items="perPageArray" class="w-auto mx-2" :disabled="props.totalDataQuanity <= props.pageArrayGot[0]" />

      <template v-if="props.totalDataQuanity > props.pageArrayGot[0]">
        <UPagination class="mx-2" v-model:page="currentPage" :items-per-page="itemsPerPage" :total="props.totalDataQuanity" show-edges :sibling-count="1" variant="outline" />

        <div class="flex flex-row justify-start items-center">
          <span class="mx-1">前往第</span>
          <UInputNumber style="width: 120px;" v-model="pageTarget" :min="1" :max="totalPages" />
          <span class="mx-1">頁</span>
        </div>
      </template>

    </div>


    <template v-if="props.showSortSelect && sortMethodGot.length > 0">
      <div class="flex flex-row justify-start items-center me-2 my-1">
        <UIcon class="mx-1" name="i-ic:outline-sort-by-alpha" />
        <select class="form-select form-select-sm w-auto mx-1" @change="clickSortSelect" v-model="sortSelectValue">
          <template v-for="(sort, sortIndex) in sortMethodGot" :key="sortIndex">
            <option :value="sort.value">{{ sort.sortText }}</option>
          </template>
        </select>
      </div>
    </template>

    <template v-if="props.showFilter">
      <div class="flex flex-row justify-start items-center me-2 my-1">
        <UIcon class="mx-1" name="i-stash:sliders-h" />
        <UInput class="mx-1" v-model="keyWord" :type="'search'" :placeholder="props.searchingPlaceholder" icon="i-lucide-search" size="md" />
      </div>
    </template>



    <!-- <template v-if="props.showCheckBox">
      <UCheckbox v-model="isCheckBoxPicked" :label="props.checkBoxTitle" />
    </template> -->

  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { ISortArray } from "@/models/index";



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
    sortMethod?: ISortArray[];
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
    sortMethod: () => [],
    showFilterSelect: false,
    // filterMethod: () => [],
  },
);
const emits = defineEmits(["tableSliceChange", "checkboxChange", "sortSelectChange", "filterChange"]);


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



const sortMethodGot = ref<ISortArray[]>([]);
const sortSelectValue = ref<number>(0);

const filterValue = ref<string>("");


const isCheckBoxPicked = ref<boolean>(false);



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


  sortMethodGot.value = JSON.parse(JSON.stringify(props.sortMethod));
  for (let i = 0; i < sortMethodGot.value.length; i++) {
    sortMethodGot.value[i]["value"] = i;
  }
  sortSelectValue.value = sortMethodGot.value.length > 0 ? sortMethodGot.value[0].value || 0 : 0;


  isCheckBoxPicked.value = props.checkBoxValue;
});


watch(props, () => {
  // console.log("watch props:", props);
  perPageArray.value = props.pageArrayGot.map((item) => ({ label: `${item} 筆 / 頁`, value: item }));

  itemsPerPage.value = perPageArray.value.some(item => item.value === props.dataPerpage) ? props.dataPerpage : perPageArray.value[0].value;

  totalPages.value = Math.ceil(props.totalDataQuanity / itemsPerPage.value);
  currentPage.value =
    props.currentPage * itemsPerPage.value > props.totalDataQuanity && props.totalDataQuanity > 0
      ? Math.ceil(props.totalDataQuanity / itemsPerPage.value)
      : props.currentPage;

  if (props.totalDataQuanity === 0) {
    totalPages.value = 0;
    currentPage.value = 1;
    itemsPerPage.value = perPageArray.value[0].value;
  }
  pageTarget.value = currentPage.value;
});


watch([currentPage, itemsPerPage, keyWord], () => {
  emits("tableSliceChange", { currentPage: currentPage.value, itemsPerPage: itemsPerPage.value, keyWord: keyWord.value });
});

watch(isCheckBoxPicked, () => {
  emits("checkboxChange", isCheckBoxPicked.value);
});



async function clickSortSelect() {
  emits("sortSelectChange", sortMethodGot.value[sortSelectValue.value].sortId, sortMethodGot.value[sortSelectValue.value].code);
}



</script>
<style lang="scss" scoped></style>
