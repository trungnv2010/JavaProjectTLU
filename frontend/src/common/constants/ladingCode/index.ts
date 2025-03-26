import { t } from 'i18next'

export enum FILTER_KEY {
  ALL = 'all',
  PENDING_CONFIRM = 'pending_confirm',
  WAITING_FOR_DELIVERY = 'waiting_for_delivery',
  WAITING_DELIVERY = 'waiting_delivery',
  RETURN_GOODS = 'return_goods',
  DELIVERED = 'delivered',
  CANCEL = 'cancel'
}

export const FILTER_OPTIONS = {
  [FILTER_KEY.ALL]: t('ladingCode.all'),
  [FILTER_KEY.PENDING_CONFIRM]: t('ladingCode.pendingConfirm'),
  [FILTER_KEY.WAITING_FOR_DELIVERY]: t('ladingCode.pendingConfirm'),
  [FILTER_KEY.WAITING_DELIVERY]: t('ladingCode.waitingForDelivery'),
  [FILTER_KEY.RETURN_GOODS]: t('ladingCode.returnGoods'),
  [FILTER_KEY.DELIVERED]: t('ladingCode.delivered'),
  [FILTER_KEY.CANCEL]: t('ladingCode.cancel')
}

export const FILTER_OPTIONS_LIST = Object.values(FILTER_KEY).map((key) => ({
  label: FILTER_OPTIONS[key],
  value: key
}))

export const SORT_BY = [
  {
    label: t('ladingCode.oldest'),
    value: 'oldest'
  },
  {
    label: t('ladingCode.newest'),
    value: 'newest'
  }
]

export enum KEY_LADING_CODE {
  CANCELLED = 'label_order_cancelled',
  COMPLETED = 'label_order_completed'
}

export const LADING_CODE_STATUS = {
  [KEY_LADING_CODE.CANCELLED]: t('ladingCode.orderCancelled'),
  [KEY_LADING_CODE.COMPLETED]: t('ladingCode.orderCompleted')
}
