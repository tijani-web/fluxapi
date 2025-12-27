'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { 
  FileCode, 
  Database, 
  Brain, 
  WebhookIcon, 
  Globe, 
  BarChart, 
  BookOpen, 
  Download, 
  Settings,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

// Import all sections
import { EndpointSection } from './components/sections/EndpointSection'
import { MockDataSection } from './components/sections/MockDataSection'
import { AISection } from './components/sections/AiSection'
import { WebhooksSection } from './components/sections/WebhooksSection'
import { EnvironmentsSection } from './components/sections/EnvironmentsSection'
import { ImportExportSection } from './components/sections/ImportExportSection'
import { DocumentationSection } from './components/sections/DocumentationSection'
import { AnalyticsSection } from './components/sections/AnalyticsSection'
import { SettingsSection } from './components/sections/SettingsSection'
import { CollaborationSection } from './components/sections/CollaborationSection'

export default function WorkspacePage() {
  const params = useParams()
  const projectId = params.id as string
  
  // Get initial active tab from localStorage
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`workspace-tab-${projectId}`)
      return saved || 'endpoints'
    }
    return 'endpoints'
  })
  
  const [counts, setCounts] = useState({
    endpoints: 0,
    mockData: 0,
    webhooks: 0,
    environments: 0
  })
  
  const tabsListRef = useRef<HTMLDivElement>(null)
  const [showLeftScroll, setShowLeftScroll] = useState(false)
  const [showRightScroll, setShowRightScroll] = useState(true)

  const tabs = [
    { id: 'endpoints', label: 'Endpoints', icon: FileCode, component: EndpointSection, count: counts.endpoints },
    { id: 'mockdata', label: 'Mock Data', icon: Database, component: MockDataSection, count: counts.mockData },
    { id: 'ai', label: 'AI Assistant', icon: Brain, component: AISection },
    { id: 'webhooks', label: 'Webhooks', icon: WebhookIcon, component: WebhooksSection, count: counts.webhooks },
    { id: 'environments', label: 'Environments', icon: Globe, component: EnvironmentsSection, count: counts.environments },
    { id: 'documentation', label: 'Documentation', icon: BookOpen, component: DocumentationSection },
    { id: 'collaborators', label: 'Collaborators', icon: Users, component: CollaborationSection },
    { id: 'analytics', label: 'Analytics', icon: BarChart, component: AnalyticsSection },
    { id: 'importexport', label: 'Import/Export', icon: Download, component: ImportExportSection },
    { id: 'settings', label: 'Settings', icon: Settings, component: SettingsSection },
  ]

  // Save active tab to localStorage whenever it changes
  useEffect(() => {
    if (projectId && typeof window !== 'undefined') {
      localStorage.setItem(`workspace-tab-${projectId}`, activeTab)
    }
  }, [activeTab, projectId])

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    
    // Also save immediately for safety
    if (typeof window !== 'undefined' && projectId) {
      localStorage.setItem(`workspace-tab-${projectId}`, tabId)
    }
  }

  // Check scroll position
  const checkScroll = () => {
    if (tabsListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current
      setShowLeftScroll(scrollLeft > 0)
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  // Scroll tabs
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsListRef.current) {
      const scrollAmount = 200
      tabsListRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  // Ensure active tab is visible
  const scrollToActiveTab = () => {
    if (tabsListRef.current) {
      const activeElement = tabsListRef.current.querySelector(`[data-state="active"]`) as HTMLElement
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        })
      }
    }
  }

  useEffect(() => {
    checkScroll()
    scrollToActiveTab()
    window.addEventListener('resize', checkScroll)
    
    return () => window.removeEventListener('resize', checkScroll)
  }, [activeTab])

  useEffect(() => {
    const currentRef = tabsListRef.current
    if (currentRef) {
      currentRef.addEventListener('scroll', checkScroll)
      return () => currentRef.removeEventListener('scroll', checkScroll)
    }
  }, [])

  // Get label based on screen size
  const getDisplayLabel = (tab: typeof tabs[0]) => {
    if (typeof window === 'undefined') return tab.label
    
    if (window.innerWidth >= 1024) {
      return tab.label // Full label on desktop
    } else if (window.innerWidth >= 768) {
      // Medium screens: show full label for important tabs, short for others
      const importantTabs = ['endpoints', 'mockdata', 'ai', 'analytics']
      if (importantTabs.includes(tab.id)) {
        return tab.label
      }
      return tab.label.split(' ')[0] // First word only
    } else {
      // Small screens: show abbreviated labels
      switch(tab.label) {
        case 'Endpoints': return 'API'
        case 'Mock Data': return 'Mock'
        case 'Webhooks': return 'Hook'
        case 'Environments': return 'Env'
        case 'Documentation': return 'Docs'
        case 'Collaborators': return 'Team'
        case 'Analytics': return 'Stats'
        case 'AI Assistant': return 'AI'
        case 'Import/Export': return 'Import'
        case 'Settings': return 'Settings'
        default: return tab.label.substring(0, 4)
      }
    }
  }

  return (
    <div className="h-full flex flex-col p-2 sm:p-4">
      {/* Enhanced Tab Navigation with Scroll Controls */}
      <div className="relative mb-4">
        {/* Left scroll button */}
        {showLeftScroll && (
          <button
            onClick={() => scrollTabs('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm rounded-r-lg border-l-0 border-y border-r border-border p-2 shadow-lg hover:bg-accent transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
        
        {/* Right scroll button */}
        {showRightScroll && (
          <button
            onClick={() => scrollTabs('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm rounded-l-lg border-r-0 border-y border-l border-border p-2 shadow-lg hover:bg-accent transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        
        {/* Tabs with dark theme scrollbar */}
        <div 
          ref={tabsListRef}
          className="overflow-x-auto workspace-scrollbar"
        >
          <div className="inline-flex h-auto min-w-max p-1 gap-1 bg-transparent rounded-lg border border-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  relative group
                  h-10 px-3 sm:px-4
                  flex items-center gap-2
                  whitespace-nowrap
                  rounded-md
                  ${activeTab === tab.id 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'hover:bg-accent hover:text-accent-foreground'
                  }
                  transition-all duration-200
                  border border-transparent
                  ${activeTab === tab.id ? 'border-primary/20' : ''}
                  flex-shrink-0
                `}
              >
                <tab.icon className="h-4 w-4 flex-shrink-0" />
                <span className="font-medium text-sm">{getDisplayLabel(tab)}</span>
                {(tab.count || 0) > 0 && (
                  <span className={`
                    ml-1 text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center
                    ${activeTab === tab.id 
                      ? 'bg-primary-foreground/20 text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    {tab.count}
                  </span>
                )}
                
                {/* Active indicator line */}
                {activeTab === tab.id && (
                  <div className="absolute -bottom-4 left-0 right-0 h-0.5 bg-primary animate-in fade-in duration-300" />
                )}
                
                {/* Tooltip for mobile */}
                <div className="
                  absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                  px-3 py-1.5 bg-popover text-popover-foreground
                  text-xs font-medium rounded-md shadow-lg border border-border
                  opacity-0 group-hover:opacity-100 group-focus:opacity-100
                  transition-opacity duration-200 pointer-events-none
                  whitespace-nowrap z-50
                  hidden sm:block
                ">
                  {tab.label}
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-popover rotate-45 border-b border-r border-border" />
                </div>
              </button>
            ))}
          </div>
        </div>
        
        {/* Scroll indicator dots (mobile only) */}
        <div className="sm:hidden flex justify-center gap-1 mt-3">
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`
                w-2 h-2 rounded-full transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-primary w-4' 
                  : 'bg-muted hover:bg-muted-foreground/50'
                }
              `}
              aria-label={`Go to ${tab.label}`}
            />
          ))}
        </div>
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        {activeTab === 'endpoints' && <EndpointSection projectId={projectId} />}
        {activeTab === 'mockdata' && <MockDataSection projectId={projectId} />}
        {activeTab === 'ai' && <AISection projectId={projectId} />}
        {activeTab === 'webhooks' && <WebhooksSection projectId={projectId} />}
        {activeTab === 'environments' && <EnvironmentsSection projectId={projectId} />}
        {activeTab === 'documentation' && <DocumentationSection projectId={projectId} />}
        {activeTab === 'collaborators' && <CollaborationSection projectId={projectId} />}
        {activeTab === 'analytics' && <AnalyticsSection projectId={projectId} />}
        {activeTab === 'importexport' && <ImportExportSection projectId={projectId} />}
        {activeTab === 'settings' && <SettingsSection projectId={projectId} />}
      </div>

      {/* Add dark theme scrollbar styles inline */}
      <style jsx global>{`
        .workspace-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: hsl(var(--muted-foreground)/0.3) transparent;
        }
        
        .workspace-scrollbar::-webkit-scrollbar {
          height: 8px;
          background: transparent;
        }
        
        .workspace-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 4px;
          margin: 0 4px;
        }
        
        .workspace-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground)/0.3);
          border-radius: 4px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        
        .workspace-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground)/0.4);
          border-radius: 4px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        
        .workspace-scrollbar::-webkit-scrollbar-thumb:active {
          background: hsl(var(--muted-foreground)/0.5);
        }
        
        /* For Firefox */
        @supports (scrollbar-color: auto) {
          .workspace-scrollbar {
            scrollbar-color: hsl(var(--muted-foreground)/0.3) transparent;
            scrollbar-width: thin;
          }
        }
        
        /* For very dark themes - ash gray scrollbar */
        .dark .workspace-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground)/0.25);
        }
        
        .dark .workspace-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground)/0.35);
        }
        
        .dark .workspace-scrollbar::-webkit-scrollbar-thumb:active {
          background: hsl(var(--muted-foreground)/0.45);
        }
      `}</style>
    </div>
  )
}