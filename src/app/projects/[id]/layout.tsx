'use client'

import { ReactNode, useState } from 'react'
import { useParams } from 'next/navigation'
import { SidebarNav } from './components/layout/SidebarNav'
import { HeaderBar } from './components/layout/HeaderBar'

export default function ProjectLayout({ 
  children 
}: { 
  children: ReactNode 
}) {
  const params = useParams()
  const projectId = params.id as string
  
  // State for Sidebar
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Header */}
      <HeaderBar 
        projectId={projectId} 
        onMobileMenuToggle={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}
        
        {/* Left Sidebar */}
        <div className={mobileSidebarOpen ? "fixed inset-y-0 left-0 z-50 lg:relative" : "hidden lg:block"}>
          <SidebarNav 
            projectId={projectId}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
            onMobileClose={() => setMobileSidebarOpen(false)}
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Page Content */}
          <div className="flex-1 overflow-auto p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}