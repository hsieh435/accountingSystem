
// tables CSS styles
export function getTableClasses() {
  return "table w-full min-w-max border-1 overflow-x-auto overflow-y-hidden mb-5";
}

export function getTheadClasses() {
  return "w-full border-1 table-header-group text-center overflow-hidden";
}

export function getTheadtrClasses() {
  return "table-row border-1";
}

const tableLastColumn = "min-w-max sticky last:right-0";
export function getThClasses() {
  return `table-cell w-auto text-white bg-black border-r border-white px-1 py-1 first:w-[60px] last:border-r-0 last:${tableLastColumn}`;
}

export function getTbodyClasses() {
  return "text-center table-row-group";
}

export function getTbodytrClasses() {
  return `text-sm table-row
  odd:bg-white even:bg-gray-200
  hover:bg-slate-300 hover:border-gray-300 group`;
}

export function getTdClasses() {
  return `table-cell text-black border-r border-b border-gray-200 text-center align-middle px-2 py-[1px]
  first:w-[60px] last:${tableLastColumn}`;
}

export function getNoDataClasses() {
  return "text-black mx-3";
}

export function getSelectClasses(width: string | number = 200) {
  return `${typeof width === "number" ? `w-[${width}px]` : `${width}`} block border border-gray-300 rounded-md shadow-sm text-black bg-white px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`;
}

export function getInputClasses(width: string | number = 200) {
  return `${typeof width === "number" ? `w-[${width}px]` : `${width}`} border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500`;
}
