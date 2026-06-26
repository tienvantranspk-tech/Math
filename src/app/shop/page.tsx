'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './shop.module.css'

type Item = {
  id: string
  name: string
  type: string
  price: number
  image: string
  isOwned: boolean
}

export default function ShopPage() {
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [coins, setCoins] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [childId, setChildId] = useState<string | null>(null)
  
  // Custom Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({ message: '', type: null })

  useEffect(() => {
    const id = localStorage.getItem('childId')
    if (!id) {
      router.push('/')
      return
    }
    setChildId(id)

    fetchShopData(id)
  }, [router])

  const fetchShopData = async (id: string) => {
    try {
      const res = await fetch(`/api/shop/items?childId=${id}`)
      const data = await res.json()
      if (res.ok) {
        setItems(data.items)
        setCoins(data.coins)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Lỗi khi tải cửa hàng')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    // Auto-hide toast after 3 seconds
    const timer = setTimeout(() => {
      setToast({ message: '', type: null })
    }, 3000)
    return () => clearTimeout(timer)
  }

  const handleBuy = async (item: Item) => {
    if (!childId) return
    if (coins < item.price) {
      showToast('Bé không đủ xu rồi! Hãy chăm chỉ làm bài tập để nhận thêm xu nhé! 🪙', 'error')
      return
    }

    try {
      const res = await fetch('/api/shop/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ childId, itemId: item.id })
      })

      const data = await res.json()

      if (res.ok) {
        setCoins(data.coins)
        setItems(items.map(i => i.id === item.id ? { ...i, isOwned: true } : i))
        showToast(`Tuyệt vời! Bé đã sở hữu "${item.name}" thành công! 🎉`, 'success')
      } else {
        showToast(data.error || 'Lỗi khi mua, vui lòng thử lại!', 'error')
      }
    } catch (err) {
      showToast('Lỗi khi mua, vui lòng thử lại!', 'error')
    }
  }

  if (loading) {
    return <div className={styles.container}><div className={styles.loading}>Đang tải...</div></div>
  }

  return (
    <div className={styles.container}>
      {/* Custom Toast Container */}
      {toast.type && (
        <div className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}>
          <span className={styles.toastIcon}>
            {toast.type === 'success' ? '🎉' : '🪙'}
          </span>
          <span className={styles.toastMessage}>{toast.message}</span>
          <button className={styles.toastClose} onClick={() => setToast({ message: '', type: null })}>×</button>
        </div>
      )}

      <div className={styles.header}>
        <Link href="/map" className={styles.backButton}>← Trở về Bản Đồ</Link>
        <h1 className={styles.title}>Cửa Hàng Vui Vẻ</h1>
        <div className={styles.coins}>
          🪙 {coins} Xu
        </div>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem', fontWeight: 'bold' }}>{error}</div>}

      <div className={styles.itemsGrid}>
        {items.map(item => (
          <div key={item.id} className={styles.itemCard}>
            <div className={styles.itemImage}>{item.image}</div>
            <h3 className={styles.itemName}>{item.name}</h3>
            <div className={styles.itemPrice}>🪙 {item.price} Xu</div>
            
            {item.isOwned ? (
              <button className={styles.ownedButton} disabled>Đã sở hữu</button>
            ) : (
              <button 
                className={styles.buyButton} 
                onClick={() => handleBuy(item)}
                disabled={coins < item.price}
              >
                Mua ngay
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
