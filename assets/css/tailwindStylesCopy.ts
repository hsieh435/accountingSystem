const tableFirstTd = "w-[60px]";
const tableLastColumn = "min-w-max sticky last:right-0 last:z-10";

export const tailwindTableStyles = {
  tableClasses: "table w-full min-w-max border-1 overflow-x-auto overflow-y-hidden mb-5",
  theadClasses: "w-full border-1 table-header-group text-center overflow-hidden",
  theadtrClasses: "table-row border-1",
  thClasses: `table-cell w-auto text-white bg-black border-r border-white px-1 py-1 first:${tableFirstTd} last:border-r-0 last:${tableLastColumn}`,
  tbodyClasses: "text-center table-row-group ",
  tbodytrClasses: "text-sm table-row hover:bg-gray-200 hover:border-gray-300 group",
  tdClasses: `table-cell text-black border-r border-b border-gray-300 bg-white text-center align-middle px-2 py-[1px] group-hover:border-gray-300 first:${tableFirstTd} last:${tableLastColumn}`,
  noDataClasses: "text-black mx-3",
};
export default tailwindTableStyles;

export function getNoDataClasses() {
  return "text-black mx-3";
}

export function getSelectClasses() {
  return "block border border-gray-300 rounded-md shadow-sm text-black bg-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";
}

export function getInputClasses() {
  return "col-span-4 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500";
}
