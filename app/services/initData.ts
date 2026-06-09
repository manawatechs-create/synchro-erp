'use client'

import { useEffect } from 'react'
import dataService from './dataService'

export default function InitData() {
  useEffect(() => {
    dataService.init()
  }, [])
  return null
}
