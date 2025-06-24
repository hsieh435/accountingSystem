
// 地址資料格式 interface
type TAddress = {
  city: string;
  district: string;
  zipCode: string;
  address: string;
};

// 權限 menu 第一層 interface
export interface INavbarMenuListItem {
  checkAll?: boolean;
  caculation?: number;
  hasCheckboxChecked?: boolean;
  functionGroupModel: {
    functionGroupId: string;
    functionGroupName: string;
    sort: number;
  };
  functionModelList: ISubMenuListItem[];
  showDrop?: string;
}

// 權限 menu 第二層 interface
export interface ISubMenuListItem {
  checkEach: boolean;
  functionGroupId: string;
  functionGroupModel: {
    functionGroupId: string;
    functionGroupName: string;
    sort: number;
  };
  functionId: string;
  functionName: string;
  permissionModel: IPermissionModel[];
  sort: number;
  url: string;
}

// 權限 interface
export interface IPermissionModel {
  functionId: string;
  roleId: string;
}

// 頁面路徑 interface
export interface IBreadCrumbItem {
  key: string;
  mainName: string;
  subName: string;
}

// 首頁訊息列表 interface
export interface INotificationList {
  isResolved: boolean;
  no?: number;
  notificationDatetime: string;
  notificationMessage: string;
  notificationType: string;
  sysNotificationId: number;
  userId: string;
}

// 使用者列表 interface
export interface IUserList {
  associationDetailsModel: IAssociationIncreaseorEdit;
  associationId: string;
  email: string;
  loginFailTimes: number;
  no?: number;
  pwdHash: string;
  pwdRefreshedDate: string;
  requirePwdRefresh: boolean;
  roleId: string;
  roleModel: {
    permissionModel: IPermissionModel[];
    roleId: string;
    roleName: string;
  };
  userId: string;
  userName: string;
  userState: string;
  userStateName?: string;
}

// 各別使用者資料 interface
export interface IEachUser {
  associationDetailsModel: IAssociationIncreaseorEdit;
  associationId: string;
  email: string;
  loginFailTimes: number;
  no?: number;
  pwdHash: string;
  pwdRefreshedDate: string;
  requirePwdRefresh: boolean;
  roleId: string;
  roleModel: {
    permissionModel: IPermissionModel[];
    roleId: string;
    roleName: string;
  };
  userId: string;
  userName: string;
  userState: string;
}

// 新增使用者、編輯使用者 interface
export interface IUserIncreaseorEdit {
  associationId: string;
  email: string;
  password: string;
  roleId: string;
  userId: string;
  userName: string;
}

// 角色列表 interface
export interface IRoleList {
  isEditMode: boolean;
  no: number;
  permissionModel: IPermissionModel[];
  roleId: string;
  roleName: string;
}

// 會別列表 interface，繼承 TAddress interface
export interface IAssociationList extends TAddress {
  associationId: string;
  associationName: string;
  associationPrefix: string;
  businessId: string;
  committeeChairName: string;
  enable: string;
  isEnable: boolean;
  no?: number;
  sort: number;
  taxNum: string;
  tel: string;
}

// 建立會別 interface，繼承 TAddress interface
export interface IAssociationIncreaseorEdit extends TAddress {
  associationId: string;
  associationName: string;
  associationPrefix: string;
  businessId: string;
  committeeChairName: string;
  enable: string;
  taxNum: string;
  tel: string;
}

// 角色權限資料 interface
export interface IfunctionGroups {
  caculation: number;
  checkAll?: boolean;
  functionGroupId: string;
  functionGroupName: string;
  functionModel: ISubMenuListItem[];
  sort: Number;
}

// 資料排序方式 interface
export interface ISortArray {
  code?: number;
  sortId: string;
  sortText: string;
  value?: number;
}

// 資料過濾方式 interface
export interface IFilterArray {
  code?: number;
  filterId: string;
  filterText: string;
}

// 租賃標的分類列表（3 項，建物、土地、車位）interface
export interface IAssetLeaseCategoryCode {
  assetLeaseCategoryCode: string;
  assetLeaseCategoryName: string;
}

// 資產分類列表（10 項）interface
export interface IAssetSubCategoryCode {
  assetSubcategoryCode: string;
  assetSubcategoryName: string;
  isExtinguishAble?: boolean;
  isRequireDepreciate?: boolean;
  isScrapAble?: boolean;
  no?: number;
}

// 系統參數列表 interface
export interface IPublicParamsList extends IPublicParamsHandling {
  no: number;
  startDate: string;
  type: string;
}

// 系統參數資料編輯 interface
export interface IPublicParamsHandling {
  code: string;
  name: string;
}

// 資產相關資訊 interface
export interface IAssetList {
  allDescription: string;
  alterDescription: string;
  amount: number;
  assetIdentifier: string;
  assetIdentifierNumber1?: string;
  assetIdentifierNumber2?: string;
  assetIdentifierNumber3?: string;
  assetIdentifierNumber4?: string;
  assetIdentifierNumber5?: string;
  assetIdentifierNumber6?: string;
  assetLeaseModelSet: IAssetLeaseInfo[];
  assetName: string;
  assetState: string;
  assetStateName?: string;
  assetSubcategoryCode: string;
  assetSubcategoryModel: IAssetSubCategoryCode;
  assetType: string;
  assetTypeName?: string;
  associationDetailsModel: IAssociationIncreaseorEdit;
  associationId: string;
  createByUserId: string;
  createByUserIdModel: {
    userId: string;
    userName: string;
  };
  createDate: string;
  depreciateEndDate: string;
  depreciateStartDate: string;
  extinguishDate: string;
  extinguishDescription: string;
  featureDescription: string;
  folderStorageId?: string;
  insuranceEndDate: string;
  insuranceStartDate: string;
  isSelected?: boolean;
  isInvestment: string;
  isInvestmentName?: string;
  keepByUserId: string;
  lastMonthAmount: any;
  lastYearAmount: any;
  modifyByUserId: string;
  modifyDate: string;
  monthDepricate: any;
  no: number;
  ownership?: string;
  propertyInsuranceNum: string;
  purchaseDate: string;
  refBuilding: string;
  residualValue: number;
  scrapDate: string;
  scrapDescription: string;
  storageLocation: string;
  totalPrice: number;
  unit: string;
  unitPrice: number;
  usefulLife: number;
  writeOffDate: string;
  writeOffDescription: string;
  yearDepricate: any;
  cloneNum?: number;
  isTotalPriceBatchMerge?: string;
}

// 資產異動紀錄 interface
export interface IAssetAlterRecord {
  allDescription: string;
  alterByUserId: string;
  alterCode: string;
  alterDate: string;
  alterDescription: string;
  amount: number;
  alterName?: string;
  assetAlterHistoryId: number;
  assetIdentifier: string;
  assetName: string;
  assetSubcategoryCode: string;
  assetType: string;
  associationId: string;
  createByUserId: string;
  createDate: string;
  depreciateEndDate: string;
  depreciateStartDate: string;
  extinguishDate: string;
  extinguishDescription: string;
  featureDescription: string;
  folderStorageId: string;
  insuranceEndDate: string;
  insuranceStartDate: string;
  isExtinguish: string;
  isInvestment: string;
  isScrapCancel: string;
  isWriteOff: string;
  keepByUserId: string;
  no: number;
  ownership: string;
  propertyInsuranceNum: string;
  purchaseDate: string;
  refBuilding: string;
  residualValue: number;
  scrapDate: string;
  scrapDescription: string;
  storageLocation: string;
  totalPrice: number;
  unit: number;
  unitPrice: number;
  usefulLife: number;
  writeOffDate: string;
  writeOffDescription: string;
}

// 租賃標的列表 interface
export interface IAssetLeaseInfo {
  address: string;
  application: string;
  area: number;
  assetIdentifier: string;
  assetLeaseCategoryCode: string;
  assetLeaseCategoryModel?: IAssetLeaseCategoryCode;
  assetLeaseId: string;
  assetLeaseName: string;
  assetLeaseSerialNum: string;
  associationId: string;
  buildingMaterial: string;
  buildingNum: string;
  city: string;
  createByUserId: string;
  createDate: string;
  currentManagementFee: number;
  currentRent: number;
  district: string;
  electricMeterNum: string;
  floorNum: number;
  gasMeterNum: string;
  landNum: string;
  landUse: string;
  managementFee: number;
  no?: number;
  parkingType: string;
  ping: number;
  reDescription: string;
  registrationDate: string;
  rent: number;
  rentalStatus: string;
  taxNum: string;
  taxRegisterDate: string;
  titleDeedNum: string;
  totalFloors: number;
  usageLicense: string;
  waterMeterNum: string;
  zipCode: string;
}

// 公設參考建物列表 interface
export interface IRefBuilinding {
  assetIdentifier: string;
  assetName: string;
}

// 下載檔案參數 interface
export interface IFileStoragePK {
  fileStorageId: string;
  folderStorageId: string;
}

// 法規資料夾列表 interface
export interface IRegulationsFolderList {
  createByUserId: string;
  createDate: string;
  description: string;
  folderStorageId: string;
  isReleased?: boolean;
  keyword: string;
  no: number;
  regulatoryDocId: string;
  title: string;
}

// 法規資料夾文件列表 interface，繼承 IFileStoragePK interface
export interface IRegulationsDocList extends IFileStoragePK {
  fileExtension: string;
  fileName: string;
  isReleased?: boolean | null;
  no?: number;
  uploadByUserId: string;
  uploadDate: string;
}

// 承包廠商列表 interface
export interface IRepairMerchantList {
  address: string;
  businessId: string;
  city: string;
  companyAbbr: string;
  companyEmail: string;
  companyFax: string;
  companyName: string;
  companyTel: string;
  companyWebsite: string;
  contactPersonModelSet: IRepairMerchantContactPersonModel[];
  contractorDescription: string;
  createByUserId: string;
  createDate: string;
  district: string;
  legalRepresentative: string;
  no: number;
  zipCode: string;
}

// 承包廠商資料 interface
export interface IEachRepairMerchant {
  businessId: string;
  companyName: string;
  companyAbbr: string;
  legalRepresentative: string;
  companyEmail: string;
  companyTel: string;
  companyFax: string;
  companyWebsite: string;
  city: string;
  district: string;
  zipCode: string;
  address: string;
  contractorDescription: string;
}

// 承包廠商聯絡人列表 interface
export interface IRepairMerchantContactPersonModel {
  businessId: string;
  contactPersonId: number;
  contactPersonName: string;
  email: string;
  jobTitle: string;
  no?: number;
  phone: string;
  tel: string;
}

// 承包商歷程 interface，繼承 IRepairSheetList, IEngineeringDocumentList 2 interface
export interface IMerchantRecordList extends IRepairSheetList, IEngineeringDocumentList { }

// 修繕維養單列表資料 interface
export interface IRepairSheetList {
  acceptanceDate: string;
  assetAllModel: IAssetList;
  assetIdentifier: string;
  assetLeaseId: string;
  associationDetailsModel: IAssociationIncreaseorEdit;
  associationId: string;
  businessId: string;
  contractorModel: IRepairMerchantList;
  createByUserId: string;
  createByUserIdModel: {
    userId: string;
    userName: string;
  };
  createDate: string;
  endDate: string;
  finalPrice: number;
  folderStorageId: string;
  isClosed: boolean;
  no: number;
  startDate: string;
  upkeepCategory: string;
  upkeepCategoryName: string;
  upkeepCost: string;
  upkeepDays: string;
  upkeepDescription: string;
  upkeepSheetId: string;
  upkeepSheetName: string;
  warrantyExpDate: string;
}

// 各別修繕維養單資料 interface
export interface IEachRepairSheet {
  upkeepSheetId: string;
  upkeepSheetName: string;
  associationId: string;
  assetIdentifier: string;
  upkeepCategory: string;
  businessId: string;
  assetLeaseId: string;
  upkeepDays: string;
  startDate: string;
  endDate: string;
  warrantyExpDate: string;
  upkeepDescription: string;
  acceptanceDate: string;
  finalPrice: number;
}

// 修繕維養單請購明細 interface
export interface IUpkeepRequest {
  amount: number;
  no?: number;
  requestByUserId: string;
  requestDate: string;
  requestDescription: string;
  specs: string;
  totalPrice: number;
  unit: string;
  unitPrice: number;
  upkeepRequestId: number;
  upkeepRequestName: string;
  upkeepSheetId: string;
}

// 檔案文件列表、照片列表 interface，繼承 IFileStoragePK interface
export interface IFilesList extends IFileStoragePK {
  fileDescription: string;
  fileExtension: string;
  fileName: string;
  isReleased: boolean;
  no?: number;
  uploadByUserId: string;
  uploadDate: string;
}

// 折舊單列表 interface
export interface IDepreciationRecordList {
  assetDepreciateSheetId: number;
  associationId: string;
  confirmByUserId: string;
  confirmDate: string;
  createByUserId: string;
  isConfirm: boolean;
  month: number;
  no: number;
  year: number;
}

// 折舊單資料 interface
export interface IAssetDepreciateDetail {
  adjustAmount: number;
  assetAllDistillModel: {
    assetIdentifier: string;
    assetName: string;
    assetSubcategoryCode: string;
  };
  assetDepreciateId: number;
  assetDepreciateSheetId: number;
  assetDepreciateSheetModel: {
    assetDepreciateSheetId: number;
    associationDetailsModel: IAssociationList;
    associationId: string;
    createByUserId: string;
    month: number;
    year: number;
  };
  assetDepreciateType: string;
  assetDepreciateTypeName: string;
  assetIdentifier: string;
  depreciateAdjustState: string;
  depreciateAdjustStateName: string;
  depreciateAmount: number;
  no: number;
}

// 折舊記錄列表 interface
export interface IDepreciationRecord {
  adjustAmount: number | null;
  adjustCode: string;
  adjustCodeName: string;
  alterByUserId: string;
  alterDate: string;
  assetDepreciateId: number;
  assetDepreciateModel: IAssetDepreciateDetail;
  depreciateAjustHistoryId: number;
  no: number;
}

// 盤點單列表 interface
export interface IStockTakingList {
  assetStockTakingModelSet: IAssetStockTakingDetail[];
  assetStockTakingSheetId: number;
  assetStockTakingSheetName: string;
  associationId: string;
  confirmByUserId: string;
  confirmDate: string;
  createByUserId: string;
  createDate: string;
  no: number;
  isConfirm: boolean;
}

// 盤點單資料 interface
export interface IAssetStockTakingDetail {
  afterAmount: number;
  afterStorageLocation: string;
  assetAllModel: IAssetList;
  afterUnit: string;
  assetIdentifier: string;
  assetStockTakingId: number;
  assetStockTakingSheetId: number;
  beforeAmount: number;
  beforeStorageLocation: string;
  beforeUnit: string;
  isEdit: boolean;
  no: number;
  stockTakingDescription: string;
}

// 工程單列表 interface
export interface IEngineeringDocumentList {
  acceptanceDate: string;
  assetAllModel: IAssetList;
  assetIdentifier: string;
  assetLeaseId: string;
  associationDetailsModel: IAssociationIncreaseorEdit;
  associationId: string;
  associationName: string;
  businessId: string;
  contractorModel: IRepairMerchantList;
  createByUserId: string;
  createDate: string;
  endDate: string;
  engineeringCost: string;
  engineeringDays: string;
  engineeringDescription: string;
  engineeringId: string;
  engineeringName: string;
  finalPrice: number;
  folderStorageId: string;
  isClosed: boolean;
  no: number;
  startDate: string;
  warrantyExpDate: string;
}

// 新增、修改工程單傳送資料 interface
export interface IEngineeringDocumentData {
  engineeringId: string;
  engineeringName: string;
  associationId: string;
  assetIdentifier: string;
  businessId: string;
  assetLeaseId: string;
  engineeringDays: string;
  startDate: string;
  endDate: string;
  warrantyExpDate: string;
  engineeringDescription: string;
  acceptanceDate: string;
  finalPrice: number;
}

// 工程單明細列表 interface
export interface IEngineeringDetails {
  detailsCost: number;
  detailsDays: string;
  detailsDescription: string;
  detailsEndDate: string;
  detailsName: string;
  detailsStartDate: string;
  engineeringDetailsId: number;
  engineeringId: string;
  isEditMode: boolean;
  no: number;
}

// 工程保證金、租賃保證金列表 interface
export interface ISecurityDepositList {
  acquiredDate: string;
  address: string;
  assetLeaseId: string;
  associationDetailsModel: IAssociationIncreaseorEdit;
  associationId: string;
  businessId: string;
  city: string;
  contractorDistillModel: {
    businessId: string;
    companyName: string;
  };
  depositDescription: string;
  depositPrice: number;
  district: string;
  email: string;
  endDate: string;
  engineeringId: string;
  invoiceType: string;
  invoiceTypeName: string;
  leaseContractDistillModel: {
    assetLeaseDistillModel: {
      assetIdentifier: string;
      assetLeaseId: string;
      assetLeaseName: string;
      assetLeaseSerialNum: string;
    };
    assetLeaseId: string;
    leaseContractId: string;
  };
  leaseContractId: string;
  lesseeDistillModel: {
    lesseeId: string;
    lesseeName: string;
  };
  lesseeId: string;
  no: number;
  phone: string;
  receiptNum: string;
  refundDate: string;
  securityDepositId: number;
  securityDepositOperationHistorySet: ISecurityDepositRecord[];
  securityDepositType: string;
  securityDepositTypeName: string;
  startDate: string;
  state: string;
  tel: string;
  zipCode: string;
}

// 工程保證金、租賃保證金操作紀錄列表 interface
export interface ISecurityDepositRecord {
  description: string;
  operationByUserId: string;
  operationDatetime: string;
  operationType: string;
  operationTypeName: string;
  no?: number;
  securityDepositId: number;
  securityDepositOperationHistoryId: number;
}

// 檢查表租賃物列表 interface，繼承 IAssetLeaseInfo interface 之介面
export interface IAssetLeaseIncomeList extends IAssetLeaseInfo {
  assetLeaseIncomeDTO: {
    message: string | null;
    rentMonthly: number;
    stageEndDate: string;
    stageStartDate: string;
  };
  associationDetailsModel: IAssociationIncreaseorEdit;
}

// 檢查表列表 interface
export interface ICheckingList {
  assetAllModel: IAssetList;
  assetChecklistId: string;
  assetIdentifier: string;
  assetLeaseIncomeDetailsModelList: IAssetLeaseIncomeList[];
  associationDetailsModel: IAssociationIncreaseorEdit;
  associationId: string;
  associationName: string;
  buildingCondition: string;
  buildingDoorWindow: string;
  buildingLeakage: string;
  buildingSteelExposed: string;
  buildingWallCracks: string;
  createByUserId: string;
  createDate: string;
  elseSuggest: string;
  endCheckDatetime: string;
  folderStorageId: string;
  futureSuggest: string;
  improveSuggest: string;
  isClutter: string;
  isOccupied: string;
  isTrash: string;
  isWeeds: string;
  landCondition: string;
  landElseDescription: string;
  landOnly: string;
  no: number;
  startCheckDatetime: string;
  useDescription: string;
}

// 承租人列表 interface
export interface ILesseeList {
  associationDetailsModel: IAssociationIncreaseorEdit;
  associationId: string;
  birthday: string;
  contactAddress: string;
  contactCity: string;
  contactDistrict: string;
  contactZipCode: string;
  email: string;
  idNum: string;
  invoiceType: string;
  legalIdNum: string;
  legalPhone: string;
  legalRepresentative: string;
  legalTel: string;
  lesseeDescription: string;
  lesseeId: string;
  lesseeName: string;
  lesseeType: string;
  lesseeTypeName?: string;
  no?: number;
  phone: string;
  registeredAddress: string;
  registeredCity: string;
  registeredDistrict: string;
  registeredZipCode: string;
  tel: string;
}

// 新增、修改承租人傳送資料 interface
export interface IEachLesseeData {
  lesseeId: string;
  associationId: string;
  lesseeType: string;
  lesseeName: string;
  idNum: string;
  tel: string;
  phone: string;
  contactCity: string;
  contactDistrict: string;
  contactZipCode: string;
  contactAddress: string;
  lesseeDescription: string;
  email: string;
  invoiceType: string;
  registeredCity: string;
  registeredDistrict: string;
  registeredZipCode: string;
  registeredAddress: string;
  birthday: string;
  legalRepresentative: string;
  legalIdNum: string;
  legalTel: string;
  legalPhone: string;
}

// 保證人列表 interface
export interface IGuarantorList {
  associationDetailsModel: IAssociationIncreaseorEdit;
  associationId: string;
  birthday: string;
  contactAddress: string;
  contactCity: string;
  contactDistrict: string;
  contactZipCode: string;
  email: string;
  guarantorDescription: string;
  guarantorId: string;
  guarantorName: string;
  idNum: string;
  no: number;
  phone: string;
  registeredAddress: string;
  registeredCity: string;
  registeredDistrict: string;
  registeredZipCode: string;
  tel: string;
}

// 租賃契約列表 interface
export interface IEachRentalContract {
  allUnpaidSum: number;
  assetLeaseCategoryCode: string;
  assetLeaseId: string;
  assetLeaseName: string;
  associationId: string;
  associationName: string;
  breachDate: string | null;
  contractStartDate: string;
  contractType: string;
  contractTypeName?: string;
  invoiceType: string;
  invoiceTypeName: string;
  leaseContractId: string;
  lesseeId: string;
  lesseeName: string;
  managementFee: number;
  no?: number;
  paymentEndDate: string;
  paymentStartDate: string;
  rent: number;
  stageNum: number;
  sumDepositPrice: number;
  unpaidSum: number;
}

// 付款階段 interface
export interface ILeasePaymentStageModelSet {
  allUnpaidSum: number;
  isExpanded: boolean;
  leaseContractId: string;
  leaseContractDistillModel: {
    assetLeaseDistillModel: {
      assetIdentifier: string;
      assetLeaseId: string;
      assetLeaseName: string;
      assetLeaseSerialNum: string;
    };
    assetLeaseId: string;
    contractEndDate: string;
    contractStartDate: string;
    leaseContractId: string;
  };
  managementFee: number;
  managementFeeUnpaidSum: number | null;
  paymentEndDate: string;
  paymentStartDate: string;
  rent: number;
  rentUnpaidSum: number | null;
  securityDepositId: number | null;
  stageNum: number;
}

// 租金、安管費收入列表 interface
export interface IIncomeRecordList {
  associationDetailsModel: IAssociationList;
  associationId: string;
  bankAccountName: string;
  bankAccountNum: string | number;
  bankCode: string | number;
  checkNum: string | number;
  contractEndDate: string;
  contractStartDate: string;
  currentInstallment: number;
  incomeCategory: string;
  incomeCategoryName: string;
  incomeDate: string;
  incomeNote: string;
  incomePrice: number;
  installmentCategory: string;
  installmentDescription: string;
  installmentMonth: number;
  installmentYear: number;
  invoiceId: string;
  invoiceNum: string;
  invoiceType: string;
  leaseContractId: string;
  leaseContractInstallmentId: number;
  lesseeName: string;
  no?: number;
  stageNum: number;
}

// 租金、安管費繳款單列表 interface
export interface IPaymentSlipList {
  actualPaymentDate: string;
  actualPaymentPrice: number;
  assetLeaseId: string;
  associationId: string;
  atmVirtualAccount: string;
  barcode1: string;
  barcode2: string;
  barcode3: string;
  billingAddress: string;
  billingCity: string;
  billingDistrict: string;
  billingZipCode: string;
  importDocId: string;
  incomeCategory: string;
  isSelected: boolean;
  isTransfered: boolean | null;
  leaseContractInstallmentModel: IIncomeRecordList;
  no?: number;
  paymentDueDate: string;
  paymentSlipDescription: string;
  paymentSlipId: number;
  printDate: string;
  transactionNum: string;
  writeOffId: string;
}

// 積欠租金、積欠安管費資料列表 interface
export interface IPaymentCallList {
  isSelected: boolean;
  leaseContractModel: {
    assetLeaseId: string;
    assetLeaseModel: IAssetLeaseInfo;
    associationDetailsModel: IAssociationList;
    associationId: string;
    breachDate: string;
    contractDescription: string;
    contractEndDate: string;
    contractStartDate: string;
    contractType: string;
    freeInstallments: number;
    guarantorId: string;
    guarantorModel: IGuarantorList;
    invoiceType: string;
    isManageTaxFree: boolean;
    isParkingTaxFree: boolean;
    isRentTaxFree: boolean;
    isSocialHousing: boolean;
    leaseContractId: string;
    leaseDetailItem: string;
    leasePaymentStageModelSet: ILeasePaymentStageModelSet[];
    leasedArea: number;
    lesseeId: string;
    lesseeModel: ILesseeList;
    notarizeCost: number;
    notarizeDate: string;
    notarizeNum: string;
    paymentFrequency: string;
    signingDate: string;
  };
  no: number;
  outstandingManagementFeeCount: number;
  outstandingManagementFeePrice: number;
  outstandingRentCount: number;
  outstandingRentPrice: number;
}

// 發票資料列表 interface
export interface IInvoiceDataList {
  assetLeaseId: string;
  associationDetailsModel: IAssociationIncreaseorEdit;
  associationId: string;
  beforeTaxPrice: number;
  buyerAddress: string;
  buyerIdNum: string;
  buyerName: string;
  cancelDatetime: string;
  cancelReason: string;
  incomeDate: string;
  invoiceDatetime: string;
  invoiceDescription: string;
  invoiceFormat: string;
  invoiceFormatCode: string;
  invoiceId: string;
  invoiceItemCategory: string;
  invoiceItemCategoryName?: string;
  invoiceMonths: string;
  invoicePrefixNum: string;
  invoiceTrackNumStackId: number;
  invoiceTrackNumStackModel: IInvoiceStackIdList;
  invoiceType: string;
  invoiceTypeName: string;
  invoiceYear: number;
  isCancel: boolean;
  itemAmount: number;
  itemName: string;
  no: number;
  selected: boolean;
  sellerAddress: string;
  sellerIdNum: string;
  sellerName: string;
  tax: number;
  taxType: string;
  totalPrice: number;
  unitPrice: number;
  uploadDatetime: string;
}

// 發票字軌資料列表 interface
export interface IInvoiceStackIdList {
  amount: number;
  associationDetailsModel: IAssociationIncreaseorEdit;
  associationId: string;
  cancelAmount: number;
  currentInvoiceNum: string;
  invoiceDescription: string;
  invoiceFormat: string;
  invoiceFormatName: string;
  invoiceMonths: string;
  invoiceNumFrom: string;
  invoiceNumTo: string;
  invoicePrefix: string;
  invoiceTrackNumStackId: number;
  invoiceType: string;
  invoiceTypeName?: string;
  invoiceYear: number;
  no: number;
}

// 發票資料編輯 interface
export interface IEachInvoiceData {
  invoiceId: string;
  associationId: string;
  invoiceType: string;
  assetLeaseId: string;
  invoiceDatetime: string;
  sellerIdNum: string;
  sellerName: string;
  sellerAddress: string;
  buyerIdNum: string;
  buyerName: string;
  buyerAddress: string;
  itemName: string;
  unitPrice: number;
  itemAmount: number;
  totalPrice: number;
  tax: number;
  beforeTaxPrice: number;
  taxType: string;
  invoiceDescription: string;
  incomeDate: string;
  invoiceItemCategory: string;
  invoicePrefixNum: string;
}

// 各期發票統計資料 interface
export interface IInvoiceTaxSummary {
  associationId: string;
  endMonth: number;
  invoiceMonthlyPriceAndTaxDTO: {
    totalBeforeTaxPrice: number;
    totalPrice: number;
    totalTax: number;
  };
  invoiceType: string;
  invoiceYear: number;
  startMonth: number;
  taxType: string;
}

// 銀行帳號列表 interface
export interface IBankAccountList {
  associationDetailsModel: IAssociationIncreaseorEdit;
  associationId: string;
  bankAccountDescription: string;
  bankAccountId: number;
  bankAccountName: string;
  bankAccountNum: string;
  bankCode: string;
  incomeNote: string;
  installmentCategory: string;
  no?: number;
  serialNum: number;
  yuantaCompanyCode: string;
}

// 銀行帳號新增、編輯參數 interface
export interface IBankAccountDataParams {
  bankAccountId: number;
  bankAccountNum: string;
  associationId: string;
  bankAccountName: string;
  bankCode: string;
  incomeNote: string;
  bankAccountDescription: string;
}

// 元大企業代碼列表 interface
export interface IYuantaCompanyCodeList {
  associationId: string;
  bankAccountName: string;
  bankAccountNum: string;
  bankCode: string;
  incomeNote: string | null;
  installmentCategory: string;
  no: number;
  serialNum: number;
  yuantaCompanyCode: string;
}

// 租賃保證金設算利息資料列表 interface
export interface IInterestCalculateList {
  associationId: string;
  interestBeforeTax: number;
  interestTax: number;
  interestTotal: number;
  interestYear: number;
  invoiceId: string | number | null;
  isTransfered: boolean;
  monthsQuantity: number;
  no: number;
  securityDepositId: number;
  securityDepositInterestId: number;
  securityDepositModel: {
    acquiredDate: string;
    address: string;
    associationDetailsModel: IAssociationIncreaseorEdit;
    associationId: string;
    businessId: string;
    city: string;
    contractorDistillModel: null;
    depositDescription: string;
    depositPrice: number;
    district: string;
    email: string;
    endDate: string;
    engineeringId: string | null;
    invoiceType: string;
    leaseContractDistillModel: {
      assetLeaseDistillModel: {
        assetIdentifier: string;
        assetLeaseId: string;
        assetLeaseName: string;
        assetLeaseSerialNum: string;
      };
      assetLeaseId: string;
      leaseContractId: string;
    };
    leaseContractId: string;
    lesseeDistillModel: {
      lesseeId: string;
      lesseeName: string;
    };
    lesseeId: string;
    phone: string;
    receiptNum: string;
    refundDate: string;
    securityDepositId: number;
    securityDepositType: string;
    startDate: string;
    tel: string;
    zipCode: string;
  };
}

// 消耗品類別列表 interface
export interface IConsumablesCategoryList {
  consumableCategoryCode: string;
  consumableCategoryName: string;
  no: number;
}

// 消耗品資料列表 interface
export interface IConsumablesList {
  associationDetailsModel: IAssociationIncreaseorEdit;
  associationId: string;
  consumableCategoryCode: string;
  consumableDescription: string;
  consumableId: string;
  consumableName: string;
  createByUserId: string;
  createDate: string;
  expirationDate: string;
  folderStorageId: string;
  initStockInDate: string;
  initialInventory: number;
  initialStorageLocation: string;
  isAble: boolean;
  no?: number;
  safetyInventory: number;
  size: string;
  spec: string;
  unit: string;
}

// 消耗品請領單列表 interface
export interface IConsumablesRequisitionList {
  acceptByUserId: string;
  createByUserId: string;
  createDate: string;
  fromAssociationDetailsModel: IAssociationIncreaseorEdit;
  fromAssociationId: string;
  inventoryTransSlipDetailsModelList: IrequisitionDetails[];
  no: number;
  state: string;
  stateName: string;
  toAssociationDetailsModel: IAssociationIncreaseorEdit;
  toAssociationId: string;
  transSlipNum: string;
  transSlipType: string;
  transSlipTypeName: string;
}

// 消耗品請領單請領內容 interface
export interface IrequisitionDetails {
  actualQuantity: number;
  consumableId: string;
  consumableModel: IConsumablesList;
  hopeQuantity: number;
  fromStorageLocation: string;
  inUseDescription: string;
  inventoryTransSlipDetailsId: string;
  no?: number;
  outUseDescription: string;
  storageLocation: string;
  toStorageLocation: string;
  transSlipNum: string;
}

// 消耗品請領單請領內容 interface
export interface IConsumablesRecordList {
  associationDetailsModel: IAssociationIncreaseorEdit;
  associationId: string;
  consumableId: string;
  consumableModel: IConsumablesList;
  inventoryAmount: number;
  lastUpdateDatetime: string;
  modifiedByUserId: string;
  no?: number;
  storageLocation: string;
}

// 各別消耗品請領單請領內容 interface
export interface IEachConsumablesRecordList {
  associationDetailsModel: IAssociationIncreaseorEdit;
  associationId: string;
  consumableId: string;
  consumableModel: IConsumablesList;
  inventoryAmount: number;
  inventoryMovement: number;
  lastUpdateDatetime: string;
  modifiedByUserId: string;
  no?: number;
  storageLocation: string;
  transDatetime: string;
  transHistoryId: number;
  transSlipNum: string;
  transSlipType: string;
  transSlipTypeName: string;
}

// 雜項收入資料列表 interface
export interface ISundryIncomeList {
  associationId: string;
  associationName?: string;
  createByUserId: string;
  createDate: string;
  invoiceId: string;
  invoiceModel: IInvoiceDataList;
  miscellaneousIncomeId: number;
  no: number;
  receiptNum: string;
  transactionDate: string;
}

// 雜項收入資料新增、修改 interface
export interface IEachSundryIncome {
  miscellaneousIncomeId: number;
  associationId: string;
  buyerName: string;
  taxType: string;
  itemAmount: number;
  beforeTaxPrice: number;
  tax: number;
  totalPrice: number;
  transactionDate: string;
  invoiceType: string;
  buyerIdNum: string;
  buyerAddress: string;
  itemName: string;
  receiptNum: string;
}

// 捐款人資料列表 interface
export interface IDonorList {
  associationDetailsModel: IAssociationIncreaseorEdit;
  associationId: string;
  contactCity: string;
  contactDistrict: string;
  contactAddress: string;
  contactZipCode: string;
  createByUserId: string;
  createDate: string;
  donorId: string;
  donorName: string;
  donorDescription: string;
  email: string;
  idNum: string;
  lastUpdateDatetime: string;
  modifiedByUserId: string;
  no?: number;
  phone: string;
  roleType: string;
  roleModel: {
    code: string;
    name: string;
    startDate: string;
    type: string;
  };
  tel: string;
}

// 捐款人資料新增、修改 interface
export interface IEachDonorData {
  donorId: string;
  associationId: string;
  donorName: string;
  idNum: string;
  roleType: string;
  tel: string;
  phone: string;
  email: string;
  contactCity: string;
  contactDistrict: string;
  contactZipCode: string;
  contactAddress: string;
  donorDescription: string;
}

// 捐款資料列表 interface
export interface IDonationList {
  donateTypeModel: IEachModel;
  donationModel: {
    associationDetailsModel: IAssociationIncreaseorEdit;
    associationId: string;
    bankAccountNum: string;
    contactAddress: string;
    contactCity: string;
    contactDistrict: string;
    contactZipCode: string;
    createByUserId: string;
    createDate: string;
    donateAmount: number;
    donateDate: string;
    donateType: string;
    donationId: string;
    donorDescription: string;
    donorName: string;
    email: string;
    folderStorageId: string;
    headerType: string;
    idNum: string;
    materialName: string;
    materialQuantity: string;
    phone: string;
    receiptNum: string;
    roleType: string;
    state: string;
    tel: string;
    usage: string;
    usageDescription: string;
  };
  no?: number;
  roleModel: IEachModel;
  stateModel: IEachModel;
}

// 各式 Model interface
export interface IEachModel {
  code: string;
  name: string;
  startDate: string;
  type: string;
}

// 捐款資料操作紀錄 interface
export interface IDonationOperationRecord {
  description: string;
  donationOperationHistoryid: number;
  operationByUserId: string;
  operationDatetime: string;
  operationType: string;
  no?: number;
  sysParaCodeModel: IEachModel;
}

// 下載捐款資料報表 interface
export interface IReceiptDataList {
  associationDetailsModel: IAssociationIncreaseorEdit;
  associationId: string;
  associationPrefix: string;
  currentReceiptNum: string;
  no: number;
  receiptCategory: string;
  receiptCategoryName: string;
  receiptTrackNumStackId: number;
  receiptYear: number;
}

// 主管列表 interface
export interface IOfficerStampList {
  code: string;
  createByUserId: string;
  createDate: string;
  folderStorageId: string;
  isEditMode?: boolean;
  name: string;
  no: number;
  officerStampId: string;
  position: string;
  startDate: string;
}

// 各式 interface
