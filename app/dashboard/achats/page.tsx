'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../../services/dataService'
import { useApp } from '../../../context/AppContext'
export default function AchatsPage() {
  const router = useRouter()
  const { addNotification } = useApp()
  return <div style={{minHeight:'100vh',backgroundColor:'var(--bg)',padding:'24px'}}><h1>🛒 Achats</h1></div>
}
