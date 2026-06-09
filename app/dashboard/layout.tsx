'use client'

import Sidebar from '../../components/layout/Sidebar'
import Topbar from '../../components/layout/Topbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: '240px' }}>
        <Topbar />
        <main style={{ marginTop: '56px', minHeight: 'calc(100vh - 56px)', backgroundColor: '#F8F9FA' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
