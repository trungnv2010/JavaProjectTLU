export enum COOKIE_STATUS {
  FAILED = 'failed',
  ACTIVE = 'active'
}

export type TCookie = {
  _id: string
  cookie: string
  createdAt: number
  isUsed: boolean
  status: COOKIE_STATUS
  user_info: TAccountShopee
}

export type TAccountShopee = {
  userid: number
  username: string
  avatar: string
  email: string
  phone: string
  ctime: number
  nickname: string
  gender: number
  birthday: number
}
interface TTranslatedText {
  text: string
  tl: boolean
}

interface TStatusInfo {
  status_label: TTranslatedText
  header_text: TTranslatedText
  header_image: string
  list_view_text: TTranslatedText
  list_view_status_label: TTranslatedText
}

interface TTrackingInfo {
  driver_phone: string
  driver_name: string
  ctime: number
  description: string
  type: number
  pin_code: string
}

interface TShippingInfo {
  masked_carrier: TTranslatedText
  tracking_number: string
  tracking_info: TTrackingInfo
  is_multi_parcel: boolean
  num_parcels: number
  parcel_no: number
  can_modify_fulfilment_channel: boolean
  disable_edit_fulfilment_channel_reason: string
  fulfilment_channel_updatability: number
}

interface TAddressInfo {
  shipping_name: string
  shipping_phone: string
  shipping_address: string
  is_buyer_address_editable: boolean
  buyer_address_action: number
  address_id: number
}

interface TPaymentMethodInfo {
  payment_method: number
  payment_channel_name: TTranslatedText
  can_change_payment_method: boolean
}

interface TExtInfo {
  add_on_deal_id: number
  is_add_on_sub_item: boolean
  free_return_day: number
  is_wholesale: boolean
  is_pre_order: boolean
  is_membership_gift: boolean
  is_free_return: boolean
}

interface TOrderItem {
  item_id: number
  model_id: number
  shop_id: number
  name: string
  model_name: string
  image: string
  amount: number
  ext_info: TExtInfo
  status: number
  item_price: number
  price_before_discount: number
  order_price: number
  snapshot_id: number
}

export interface TItemGroup {
  items: TOrderItem[]
  num_items: number
}

interface TShopInfo {
  shop_id: number
  shop_name: string
  user_id: number
  username: string
  portrait: string
  shop_tag: number
}

interface TParcelStatusInfo {
  label: TTranslatedText
  tooltip: TTranslatedText
  status: number
}

interface TInfoAttribute {
  name: string
  type: number
  label: TTranslatedText
}

interface TInfoTooltip {
  tooltip: TTranslatedText
  icon_type: number
}

interface TInfoValue {
  value: string
  type: number
}

interface TPaymentInfoRow {
  info_label: {
    text: string
    tl: boolean
    attributes?: TInfoAttribute[]
  }
  info_value: TInfoValue
  info_tooltip?: TInfoTooltip
}

interface TPaymentInfo {
  currency: string
  total_price: number
  info_rows: TPaymentInfoRow[]
}

interface TOrderDetails {
  parcel_no: number
  forder_id: string
  parcel_status_info: TParcelStatusInfo
  shop_info: TShopInfo
  product_info: {
    item_groups: TItemGroup[]
    total_num_items: number
  }
  payment_info: TPaymentInfo
  extra_info: {
    is_shipment_grouped: boolean
  }
  logistics_id: string
}

export interface TLadingCode {
  status: TStatusInfo
  shipping: TShippingInfo
  address: TAddressInfo
  payment_method: TPaymentMethodInfo
  orders: TOrderDetails
  userInfo: TAccountShopee
  order_id: string
}
