const tableFirstTd = "w-[60px]"
const tableLastColumn = "min-w-max sticky last:right-0 last:z-10";



export const tailwindTableStyles = {
  tableClasses: "table w-full min-w-max border rounded-t-xl overflow-x-auto mb-[30px]",
  theadClasses: "w-full table-header-group rounded-xl text-center overflow-hidden",
  theadtrClasses: "table-row rounded rounded-xl",
  thClasses: `table-cell w-auto border-x border-gray-200 bg-black text-white px-1 py-1 first:border-0 first:rounded-tl-xl last:border-l last:rounded-tr-xl last:${tableLastColumn}`,
  tbodyClasses: "text-center table-row-group",
  tbodytrClasses: "text-sm table-row rounded hover:bg-gray-200 hover:border-gray-300 group",
  tdClasses: `table-cell text-black border border-gray-200 bg-white px-2 py-[1px] group-hover:border-gray-300 first:${tableFirstTd} last:${tableLastColumn}`,
  noDataClasses: "text-black mx-3",
};

export default tailwindTableStyles;


export function selectClasses(width: string | number = 200) {
  return `${typeof width === "number" ? `w-[${width}px]` : `w-auto`} block border border-gray-300 rounded-md shadow-sm text-black bg-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`;
}

export function inputClasses(width: string | number = 200) {
  return `${typeof width === "number" ? `w-[${width}px]` : `w-auto`} border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500`;
}
