import {ProfilePage} from '@/components'
import React, { Suspense } from 'react'

export default function page() {
  return (
    
      <Suspense fallback ={<div>Loading</div>}>
        <ProfilePage/>
      </Suspense>
    
  )
}
