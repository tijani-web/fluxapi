// app/status/page.tsx
import { 
  Server, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw,
  Wifi,
  Database,
  Cpu,
  Globe,
  Shield,
  BarChart,
  History,
  Bell,
  ExternalLink,
  Link
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function StatusPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="border-b bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Server className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">System Status</h1>
                    <p className="text-muted-foreground">Real-time health monitoring of our API platform</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="font-medium">All Systems Operational</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 inline mr-1" />
                    Last updated: Just now
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="gap-2">
                  <Bell className="h-4 w-4" />
                  Subscribe to Updates
                </Button>
                <Button className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh Status
                </Button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-background">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">99.99%</div>
                      <div className="text-xs text-muted-foreground">30-Day Uptime</div>
                    </div>
                    <Activity className="h-8 w-8 text-green-500 opacity-50" />
                  </div>
                  <Progress value={99.99} className="h-1.5 mt-2" />
                </CardContent>
              </Card>
              
              <Card className="bg-background">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">0</div>
                      <div className="text-xs text-muted-foreground">Active Incidents</div>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="h-1.5 mt-2 bg-green-500/20 rounded-full"></div>
                </CardContent>
              </Card>
              
              <Card className="bg-background">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">28</div>
                      <div className="text-xs text-muted-foreground">Days Since Last Incident</div>
                    </div>
                    <Shield className="h-8 w-8 text-blue-500 opacity-50" />
                  </div>
                  <Progress value={93} className="h-1.5 mt-2" />
                </CardContent>
              </Card>
              
              <Card className="bg-background">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-bold">&lt;50ms</div>
                      <div className="text-xs text-muted-foreground">Avg Response Time</div>
                    </div>
                    <BarChart className="h-8 w-8 text-purple-500 opacity-50" />
                  </div>
                  <Progress value={95} className="h-1.5 mt-2" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="gap-2">
                <Activity className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="components" className="gap-2">
                <Server className="h-4 w-4" />
                Components
              </TabsTrigger>
              <TabsTrigger value="incidents" className="gap-2">
                <History className="h-4 w-4" />
                Incident History
              </TabsTrigger>
              <TabsTrigger value="metrics" className="gap-2">
                <BarChart className="h-4 w-4" />
                Metrics
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Current Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <div>
                              <h4 className="font-semibold">All Systems Operational</h4>
                              <p className="text-sm text-green-700 dark:text-green-300">
                                No ongoing incidents
                              </p>
                            </div>
                          </div>
                          <Badge className="bg-green-500 hover:bg-green-600">Normal</Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Recent Updates</h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Database maintenance completed</p>
                              <p className="text-xs text-muted-foreground">2 hours ago • No impact to service</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Performance improvements deployed</p>
                              <p className="text-xs text-muted-foreground">Yesterday • API response times improved by 15%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      Subscribe to Updates
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Get notified about system status changes, maintenance, and incidents.
                      </p>
                      
                      <div className="space-y-3">
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Subscribe via Email
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <ExternalLink className="h-4 w-4" />
                          RSS Feed
                        </Button>
                        <Button variant="outline" className="w-full justify-start gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Webhook Notifications
                        </Button>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold text-sm mb-2">API Status Endpoint</h4>
                        <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                          GET https://status.yourapibuilder.com/api/v1/status
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Components Tab */}
            <TabsContent value="components" className="mt-6">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {systemComponents.map((component, index) => (
                    <Card key={index} className={
                      component.status === 'operational' ? 'border-green-200 dark:border-green-800' :
                      component.status === 'degraded' ? 'border-amber-200 dark:border-amber-800' :
                      'border-red-200 dark:border-red-800'
                    }>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              component.status === 'operational' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                              component.status === 'degraded' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                              'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                            }`}>
                              <component.icon className="h-4 w-4" />
                            </div>
                            <CardTitle className="text-base">{component.name}</CardTitle>
                          </div>
                          <Badge className={
                            component.status === 'operational' ? 'bg-green-500 hover:bg-green-600' :
                            component.status === 'degraded' ? 'bg-amber-500 hover:bg-amber-600' :
                            'bg-red-500 hover:bg-red-600'
                          }>
                            {component.status === 'operational' ? 'Operational' :
                             component.status === 'degraded' ? 'Degraded' : 'Outage'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3">{component.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span>Uptime: {component.uptime}</span>
                          <span className={
                            component.responseTime.includes('ms') ? 'text-green-600' :
                            component.responseTime.includes('<100ms') ? 'text-green-600' : 'text-amber-600'
                          }>
                            {component.responseTime}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Component Health History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Last 24 hours</span>
                        <div className="flex gap-1">
                          {Array.from({ length: 24 }).map((_, i) => (
                            <div 
                              key={i}
                              className="w-3 h-6 rounded-sm bg-green-500"
                              title={`Hour ${i + 1}: Operational`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Last 7 days</span>
                        <div className="flex gap-1">
                          {Array.from({ length: 7 }).map((_, i) => (
                            <div 
                              key={i}
                              className={`w-6 h-6 rounded-sm ${
                                i === 2 ? 'bg-amber-500' : 'bg-green-500'
                              }`}
                              title={i === 2 ? 'Day 3: Partial Degradation' : `Day ${i + 1}: Operational`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Last 30 days</span>
                        <div className="flex gap-1">
                          {Array.from({ length: 30 }).map((_, i) => (
                            <div 
                              key={i}
                              className={`w-1.5 h-6 rounded-sm ${
                                i === 15 ? 'bg-red-500' : 
                                i === 16 ? 'bg-red-500' : 'bg-green-500'
                              }`}
                              title={
                                i === 15 || i === 16 ? `Day ${i + 1}: Outage` : 
                                `Day ${i + 1}: Operational`
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Incident History Tab */}
            <TabsContent value="incidents" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Past Incidents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {pastIncidents.map((incident, index) => (
                        <div key={index} className="pb-6 border-b last:border-0 last:pb-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold">{incident.title}</h3>
                              <div className="flex items-center gap-3 mt-1">
                                <Badge variant={
                                  incident.status === 'resolved' ? 'default' :
                                  incident.status === 'investigating' ? 'outline' :
                                  'destructive'
                                } className={
                                  incident.status === 'resolved' ? 'bg-green-500 hover:bg-green-600' :
                                  incident.status === 'investigating' ? 'border-amber-500 text-amber-600' :
                                  'bg-red-500 hover:bg-red-600'
                                }>
                                  {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {incident.date} • {incident.duration}
                                </span>
                              </div>
                            </div>
                            <Badge variant="outline" className={
                              incident.impact === 'major' ? 'border-red-500 text-red-600' :
                              incident.impact === 'minor' ? 'border-amber-500 text-amber-600' :
                              'border-blue-500 text-blue-600'
                            }>
                              {incident.impact === 'major' ? 'Major' :
                               incident.impact === 'minor' ? 'Minor' : 'Maintenance'}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-4">{incident.description}</p>
                          
                          <div className="space-y-3">
                            {incident.updates.map((update, updateIndex) => (
                              <div key={updateIndex} className="pl-4 border-l-2 border-muted">
                                <div className="flex items-center gap-2 mb-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs font-medium">{update.time}</span>
                                </div>
                                <p className="text-sm">{update.message}</p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-4">
                            {incident.components.map((component, compIndex) => (
                              <Badge key={compIndex} variant="secondary" className="text-xs">
                                {component}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Scheduled Maintenance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold mb-1">Database Optimization</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Scheduled database maintenance to improve performance
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>Dec 28, 2023 • 02:00-04:00 UTC</span>
                              </div>
                              <Badge variant="outline" className="border-blue-500 text-blue-600">
                                Scheduled
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 text-xs">
                          <p className="font-medium mb-1">Expected Impact:</p>
                          <p>API responses may be 10-20% slower during maintenance window. No downtime expected.</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Metrics Tab */}
            <TabsContent value="metrics" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">API Response Time</span>
                        <span className="text-sm text-green-600">48ms avg</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0ms</span>
                        <span>100ms</span>
                        <span>200ms</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Endpoint Success Rate</span>
                        <span className="text-sm text-green-600">99.95%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '99.95%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Concurrent Users</span>
                        <span className="text-sm">1,243</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Usage Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-2xl font-bold">4.2M</div>
                          <div className="text-xs text-muted-foreground">API Calls Today</div>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-2xl font-bold">28.5K</div>
                          <div className="text-xs text-muted-foreground">Active Endpoints</div>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-2xl font-bold">9.8K</div>
                          <div className="text-xs text-muted-foreground">Mock Collections</div>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <div className="text-2xl font-bold">142</div>
                          <div className="text-xs text-muted-foreground">Team Projects</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3 text-sm">Peak Usage Times</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">09:00-12:00 UTC</span>
                            <span className="text-sm font-medium">High</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">00:00-06:00 UTC</span>
                            <span className="text-sm font-medium">Low</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Global Service Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      {regions.map((region) => (
                        <div key={region.name} className="text-center">
                          <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                            region.status === 'operational' ? 'bg-green-500' :
                            region.status === 'degraded' ? 'bg-amber-500' : 'bg-red-500'
                          }`}></div>
                          <div className="text-xs font-medium">{region.name}</div>
                          <div className="text-xs text-muted-foreground">{region.ping}ms</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="text-xs text-muted-foreground text-center">
                      Ping times measured from regional health checks
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-sm font-medium mb-1">System Status Dashboard</p>
                <p className="text-xs text-muted-foreground">
                  This page updates automatically every 60 seconds. Data shown is from the last 30 days.
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                  <a href="https://twitter.com/yourapibuilder" target="_blank" rel="noopener noreferrer">
                    Twitter Updates
                  </a>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/privacy">
                    Privacy Policy
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Flux API Status • Page generated: {currentDate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// System Components Data
const systemComponents = [
  {
    icon: Globe,
    name: "API Gateway",
    description: "Entry point for all API requests and routing",
    status: "operational" as const,
    uptime: "99.99%",
    responseTime: "<20ms"
  },
  {
    icon: Server,
    name: "Endpoint Execution",
    description: "JavaScript runtime for user endpoint code",
    status: "operational" as const,
    uptime: "99.98%",
    responseTime: "<50ms"
  },
  {
    icon: Database,
    name: "Mock Database",
    description: "Storage for mock data collections",
    status: "operational" as const,
    uptime: "99.99%",
    responseTime: "<30ms"
  },
  {
    icon: Cpu,
    name: "Environment Service",
    description: "Environment variable management",
    status: "operational" as const,
    uptime: "100%",
    responseTime: "<10ms"
  },
  {
    icon: Wifi,
    name: "Webhook Service",
    description: "Outbound webhook delivery system",
    status: "operational" as const,
    uptime: "99.95%",
    responseTime: "<100ms"
  },
  {
    icon: Shield,
    name: "Authentication",
    description: "User authentication and authorization",
    status: "operational" as const,
    uptime: "99.99%",
    responseTime: "<15ms"
  }
]

// Past Incidents Data
const pastIncidents = [
  {
    title: "Database Performance Degradation",
    status: "resolved",
    date: "November 15, 2023",
    duration: "2 hours",
    impact: "minor",
    description: "Increased latency for database queries affecting mock data retrieval",
    components: ["Mock Database", "API Gateway"],
    updates: [
      {
        time: "14:30 UTC",
        message: "Identified slow queries in the mock data service"
      },
      {
        time: "15:15 UTC",
        message: "Applied query optimizations and added database indexes"
      },
      {
        time: "16:30 UTC",
        message: "Performance restored to normal levels"
      }
    ]
  },
  {
    title: "Scheduled Maintenance",
    status: "resolved",
    date: "October 28, 2023",
    duration: "4 hours",
    impact: "maintenance",
    description: "Infrastructure upgrade and security patch deployment",
    components: ["All Systems"],
    updates: [
      {
        time: "01:00 UTC",
        message: "Maintenance window started"
      },
      {
        time: "03:30 UTC",
        message: "Security patches deployed successfully"
      },
      {
        time: "05:00 UTC",
        message: "All systems back online and verified"
      }
    ]
  },
  {
    title: "API Gateway Intermittent Errors",
    status: "resolved",
    date: "September 5, 2023",
    duration: "45 minutes",
    impact: "major",
    description: "Load balancer configuration issue causing intermittent 502 errors",
    components: ["API Gateway"],
    updates: [
      {
        time: "10:15 UTC",
        message: "Investigating increased error rates"
      },
      {
        time: "10:30 UTC",
        message: "Identified load balancer misconfiguration"
      },
      {
        time: "11:00 UTC",
        message: "Configuration fixed, monitoring recovery"
      }
    ]
  }
]

// Regions Data
const regions = [
  { name: "North America", status: "operational" as const, ping: 12 },
  { name: "Europe", status: "operational" as const, ping: 25 },
  { name: "Asia Pacific", status: "operational" as const, ping: 45 },
  { name: "South America", status: "operational" as const, ping: 38 },
  { name: "Australia", status: "operational" as const, ping: 62 },
  { name: "Africa", status: "operational" as const, ping: 58 }
]