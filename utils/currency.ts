// utils/currency.ts
export const formatPrice = (value: number | null): string => {
  if (value === null || value === 0) return ''
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

export const parsePrice = (value: string): number | null => {
  // Hapus semua karakter non-digit
  const digits = value.replace(/\D/g, '')
  if (!digits) return null
  return parseInt(digits, 10)
}

// Fungsi untuk memformat secara real-time
export const formatPriceRealTime = (value: string): string => {
  // Hapus semua karakter non-digit
  const digits = value.replace(/\D/g, '')
  if (!digits) return ''
  
  const number = parseInt(digits, 10)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number)
}