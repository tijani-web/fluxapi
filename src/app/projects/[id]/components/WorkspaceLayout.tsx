// // app/project/[id]/components/layout/WorkspaceLayout.tsx
// 'use client'

// import { useState } from 'react'
// import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable'
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { ProjectHeader } from './ProjectHeader' // Your existing component
// import { ProjectSidebar } from './ProjectSidebar' // Your existing component
// import { EndpointManager } from '../sections/EndpointManager'
// import { MockDataManager } from '../sections/MockDataManager'
// import { EnvironmentManager } from '../sections/EnvironmentManager'
// import { AIAssistant } from '../sections/AIAssistant'
// import { WebhookManager } from '../sections/WebhookManager'
// import { DocumentationGenerator } from '../sections/DocumentationGenerator'
// import { ProjectAnalytics } from '../sections/ProjectAnalytics'
// import { ProjectSettings } from '../sections/ProjectSettings'
// import { ConsolePanel } from './ConsolePanel'
// import { CollaborationPanel } from './CollaborationPanel'

// interface WorkspaceLayoutProps {
//   projectId: string
//   children?: React.ReactNode
// }

// export function WorkspaceLayout({ projectId }: WorkspaceLayoutProps) {
//   const [activeTab, setActiveTab] = useState('endpoints')
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
//   const [consoleOpen, setConsoleOpen] = useState(false)
//   const [collaborationOpen, setCollaborationOpen] = useState(false)
  
//   const renderContent = () => {
//     switch (activeTab) {
//       case 'endpoints':
//         return <EndpointManager projectId={projectId} />
//       case 'mock-data':
//         return <MockDataManager projectId={projectId} />
//       case 'environments':
//         return <EnvironmentManager projectId={projectId} />
//       case 'ai-assistant':
//         return <AIAssistant projectId={projectId} />
//       case 'webhooks':
//         return <WebhookManager projectId={projectId} />
//       case 'documentation':
//         return <DocumentationGenerator projectId={projectId} />
//       case 'analytics':
//         return <ProjectAnalytics projectId={projectId} />
//       case 'settings':
//         return <ProjectSettings projectId={projectId} />
      
//       default:
//         return <EndpointManager projectId={projectId} />
//     }
//   }
  
//   return (
//     <div className="h-screen flex flex-col bg-background">
//       {/* Header - Reusing your component */}
//       <ProjectHeader 
//         projectId={projectId}
//         onToggleConsole={() => setConsoleOpen(!consoleOpen)}
//         consoleOpen={consoleOpen}
//         onToggleCollaboration={() => setCollaborationOpen(!collaborationOpen)}
//         collaborationOpen={collaborationOpen}
//       />
      
//       {/* Main Workspace */}
//       <div className="flex-1 overflow-hidden">
//         <ResizablePanelGroup direction="horizontal">
//           {/* Left Sidebar - Reusing your component */}
//           <ResizablePanel 
//             defaultSize={sidebarCollapsed ? 60 : 240}
//             minSize={60}
//             maxSize={320}
//             collapsible
//           >
//             <ProjectSidebar
//               projectId={projectId}
//               collapsed={sidebarCollapsed}
//               onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
//               activeTab={activeTab}
//               onTabChange={setActiveTab}
//             />
//           </ResizablePanel>
          
//           <ResizableHandle withHandle />
          
//           {/* Main Content Area */}
//           <ResizablePanel defaultSize={600}>
//             <div className="h-full p-4 overflow-auto">
//               <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
//                 {/* Tab List for mobile/alternative navigation */}
//                 <div className="lg:hidden mb-4">
//                   <TabsList className="grid grid-cols-4">
//                     <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
//                     <TabsTrigger value="mock-data">Mock Data</TabsTrigger>
//                     <TabsTrigger value="ai-assistant">AI</TabsTrigger>
//                     <TabsTrigger value="more">More</TabsTrigger>
//                   </TabsList>
//                 </div>
                
//                 {/* Content */}
//                 <TabsContent value={activeTab} className="h-[calc(100%-60px)] mt-0">
//                   {renderContent()}
//                 </TabsContent>
//               </Tabs>
//             </div>
//           </ResizablePanel>
          
//           {/* Right Panels */}
//           <ResizableHandle withHandle />
          
//           <ResizablePanel defaultSize={300} minSize={200} maxSize={400}>
//             <div className="h-full flex flex-col">
//               <Tabs defaultValue="collaboration" className="h-full">
//                 <TabsList className="grid grid-cols-2">
//                   <TabsTrigger value="collaboration">
//                     👥 Collaboration
//                   </TabsTrigger>
//                   <TabsTrigger value="preview">
//                     👁️ Preview
//                   </TabsTrigger>
//                 </TabsList>
                
//                 <TabsContent value="collaboration" className="h-[calc(100%-40px)]">
//                   <CollaborationPanel projectId={projectId} />
//                 </TabsContent>
                
//                 <TabsContent value="preview" className="h-[calc(100%-40px)]">
//                   {/* API Preview Panel */}
//                   <div className="p-4">
//                     <h3 className="font-semibold mb-3">API Preview</h3>
//                     {/* Preview content */}
//                   </div>
//                 </TabsContent>
//               </Tabs>
//             </div>
//           </ResizablePanel>
//         </ResizablePanelGroup>
//       </div>
      
//       {/* Console Panel */}
//       {consoleOpen && (
//         <div className="h-64 border-t">
//           <ConsolePanel projectId={projectId} />
//         </div>
//       )}
//     </div>
//   )
// }