export const formatVND = (amount: number | string): string => {
  const numberAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(numberAmount)
}

export const formatVNDWithoutSymbol = (amount: number | string): string => {
  const numberAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numberAmount)
}
