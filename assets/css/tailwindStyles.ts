const tableLastColumn = "min-w-max sticky last:right-0 last:z-10";



export const tailwindStyles = {
  tableClasses: "table table-auto w-full min-w-max border rounded-t-xl overflow-x-auto mb-[30px]",
  theadClasses: "w-full table-header-group rounded-xl text-center overflow-hidden",
  theadtrClasses: "table-row rounded rounded-xl",
  thClasses: `table-cell w-auto border-x border-gray-200 bg-black text-white px-1 py-1 first:border-0 first:rounded-tl-xl last:border-l last:rounded-tr-xl last:${tableLastColumn}`,
  tbodyClasses: "table-row-group",
  tbodytrClasses: "text-sm text-center table-row rounded hover:bg-gray-200 hover:border-gray-300 group",
  tdClasses: `table-cell text-black border border-gray-200 bg-white px-1 py-[3px] group-hover:border-gray-300 first:w-[60px] last:${tableLastColumn}`,
  noDataClasses: "text-black mx-3",


  selectClasses: "block border border-gray-300 rounded-md shadow-sm text-black bg-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",


  inputClasses: "col-span-4 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500",
};



export default tailwindStyles;
