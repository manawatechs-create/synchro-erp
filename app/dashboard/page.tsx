'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dataService from '../../services/dataService'
import { useApp } from '../../context/AppContext'
export default function DashboardPage() {
  const router = useRouter()
  const { couleurPrincipale } = useApp()
  return <div style={{minHeight:'100vh',backgroundColor:'var(--bg)',padding:'24px'}}><h1>📊 Dashboard</h1></div>
}
