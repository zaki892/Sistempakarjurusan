import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const HasilTes = dynamic(() => import('./HasilTes'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Memuat hasil tes...</div>
})

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Memuat hasil tes...</div>}>
      <HasilTes />
    </Suspense>
  )
}

