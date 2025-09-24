// app/blogs/[slug]/components/ViewCountTracker.tsx
'use client'

import { useEffect } from 'react'

export default function ViewCountTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const incrementViewCount = async () => {
      try {
        await fetch(`/api/blogs/${slug}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      } catch (error) {
        console.error('Error incrementing view count:', error)
      }
    }

    incrementViewCount()
  }, [slug])

  return null
}