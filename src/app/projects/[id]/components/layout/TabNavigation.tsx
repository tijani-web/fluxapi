// 'use client'

// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import {
//   FileCode,
//   Database,
//   Brain,
//   WebhookIcon,
//   Globe,
//   BarChart,
//   BookOpen,
//   Download,
//   Settings,
//   LayoutTemplate,
//   Users
// } from 'lucide-react'
// import { Badge } from '@/components/ui/badge'

// interface TabNavigationProps {
//   activeTab: string
//   onTabChange: (tab: string) => void
//   counts?: {
//     endpoints?: number
//     mockData?: number
//     webhooks?: number
//     environments?: number
//   }
// }

// export function TabNavigation({ 
//   activeTab, 
//   onTabChange,
//   counts = {} 
// }: TabNavigationProps) {
//   const tabs = [
//     { 
//       id: 'endpoints', 
//       label: 'Endpoints', 
//       icon: FileCode, 
//       count: counts.endpoints 
//     },
//     { 
//       id: 'mockdata', 
//       label: 'Mock Data', 
//       icon: Database, 
//       count: counts.mockData 
//     },
//     { 
//       id: 'ai', 
//       label: 'AI Assistant', 
//       icon: Brain 
//     },
//     { 
//       id: 'webhooks', 
//       label: 'Webhooks', 
//       icon: WebhookIcon, 
//       count: counts.webhooks 
//     },
//     { 
//       id: 'environments', 
//       label: 'Environments', 
//       icon: Globe, 
//       count: counts.environments 
//     },
//     { 
//       id: 'documentation', 
//       label: 'Documentation', 
//       icon: BookOpen 
//     },
//     { 
//       id: 'analytics', 
//       label: 'Analytics', 
//       icon: BarChart 
//     },
//     { 
//       id: 'templates', 
//       label: 'Templates', 
//       icon: LayoutTemplate 
//     },
//     { 
//       id: 'importexport', 
//       label: 'Import/Export', 
//       icon: Download 
//     },
//     { 
//       id: 'team', 
//       label: 'Team', 
//       icon: Users 
//     },
//     { 
//       id: 'settings', 
//       label: 'Settings', 
//       icon: Settings 
//     },
//   ]

//   return (
//     <div className="border-b border-border/40 bg-background">
//       <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
//         <TabsList className="h-12 w-full justify-start overflow-x-auto rounded-none border-b-0 px-2">
//           {tabs.map((tab) => (
//             <TabsTrigger
//               key={tab.id}
//               value={tab.id}
//               className="gap-2 px-3 data-[state=active]:bg-primary/10 data-[state=active]:text-primary"
//             >
//               <tab.icon className="h-4 w-4" />
//               <span>{tab.label}</span>
//               {tab.count !== undefined && tab.count > 0 && (
//                 <Badge variant="secondary" className="h-5 text-xs">
//                   {tab.count}
//                 </Badge>
//               )}
//             </TabsTrigger>
//           ))}
//         </TabsList>
//       </Tabs>
//     </div>
//   )
// }