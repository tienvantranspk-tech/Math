'use client'

import { useRouter } from 'next/navigation'
import styles from './page.module.css'

type ChildProfile = {
  id: string
  name: string
  grade: number
}

export default function ChildSelector({ childrenList }: { childrenList: ChildProfile[] }) {
  const router = useRouter()

  const handleSelectChild = (childId: string, childName: string) => {
    localStorage.setItem('childId', childId)
    localStorage.setItem('childName', childName)
    document.cookie = `childId=${childId}; path=/; max-age=31536000`
    router.push('/practice')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
      {childrenList.map((child) => (
        <button
          key={child.id}
          onClick={() => handleSelectChild(child.id, child.name)}
          className={`btn btn-primary`}
          style={{ padding: '1rem', fontSize: '1.2rem', borderRadius: '10px' }}
        >
          {child.name} - Lớp {child.grade}
        </button>
      ))}
    </div>
  )
}
