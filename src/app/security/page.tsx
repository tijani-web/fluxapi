// app/security/page.tsx
import { 
  Shield, 
  Lock, 
  Key, 
  Database, 
  Cpu, 
  Network, 
  Users,
  Eye,
  CheckCircle,
  AlertTriangle,
  FileLock,
  Server,
  Globe,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function SecurityPage() {
  const lastAudit = "Q4 2025"
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">
                  <Lock className="h-3 w-3 mr-1" />
                  SOC 2 Compliant
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-600 hover:bg-blue-500/30">
                  <Key className="h-3 w-3 mr-1" />
                  AES-256 Encryption
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-600 hover:bg-purple-500/30">
                  <Database className="h-3 w-3 mr-1" />
                  Zero-Trust Architecture
                </Badge>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Security & Compliance
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Enterprise-grade security protecting your API endpoints, mock data, and environment variables
            </p>
            
            {/* Security Score */}
            <div className="inline-flex items-center gap-4 px-4 py-3 bg-muted rounded-lg mb-8">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <span className="font-semibold">Security Status: Excellent</span>
              </div>
              <div className="h-4 w-px bg-border"></div>
              <div className="text-sm text-muted-foreground">
                Last security audit: {lastAudit}
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-2xl font-bold text-green-600">99.99%</div>
                <div className="text-xs text-muted-foreground">Uptime SLA</div>
              </div>
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">256-bit</div>
                <div className="text-xs text-muted-foreground">Encryption</div>
              </div>
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-xs text-muted-foreground">Monitoring</div>
              </div>
              <div className="p-3 bg-background border rounded-lg">
                <div className="text-2xl font-bold text-amber-600">&lt;1 min</div>
                <div className="text-xs text-muted-foreground">Breach Detection</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Security Features Grid */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Security Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {securityFeatures.map((feature, index) => (
                <Card key={index} className="border-border hover:border-primary/20 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${feature.color}`}>
                        <feature.icon className="h-5 w-5" />
                      </div>
                      {feature.badge && (
                        <Badge variant="outline" className="text-xs">
                          {feature.badge}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Data Protection Section */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              Data Protection
            </h2>
            
            <div className="space-y-6">
              <Card className="border-green-500/20">
                <CardHeader className="bg-green-50 dark:bg-green-950/20">
                  <CardTitle className="text-green-700 dark:text-green-300">
                    <div className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Encryption Standards
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Lock className="h-4 w-4 text-green-600" />
                        At Rest Encryption
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>AES-256 encryption for all stored data</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Environment variables double-encrypted</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Encrypted database backups</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Globe className="h-4 w-4 text-blue-600" />
                        In Transit Encryption
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>TLS 1.3 for all API communications</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>Perfect Forward Secrecy (PFS)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span>HTTP Strict Transport Security</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold flex items-center gap-2">
                        <FileLock className="h-4 w-4 text-purple-600" />
                        Key Management
                      </h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span>AWS KMS for encryption keys</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span>Regular key rotation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                          <span>Hardware security modules</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Segregation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Segregation & Isolation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Tenant Isolation
                      </h4>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm">
                          Each customer's data is logically isolated. Your:
                        </p>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• Endpoints run in isolated containers</li>
                          <li>• Mock data stored in separate schemas</li>
                          <li>• Environment variables encrypted per tenant</li>
                          <li>• Execution logs isolated by project</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-primary" />
                        Runtime Security
                      </h4>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <p className="text-sm">
                          When your endpoint code executes:
                        </p>
                        <ul className="mt-2 space-y-1 text-sm">
                          <li>• Runs in isolated Docker containers</li>
                          <li>• Memory and CPU limits enforced</li>
                          <li>• Network access restricted</li>
                          <li>• File system access limited</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Infrastructure Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Server className="h-6 w-6 text-primary" />
              Infrastructure Security
            </h2>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Network className="h-5 w-5 text-blue-600" />
                        Network Security
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/30 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-blue-600" />
                          </div>
                          <span className="text-sm">DDoS protection and mitigation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/30 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-blue-600" />
                          </div>
                          <span className="text-sm">Web Application Firewall (WAF)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/30 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-blue-600" />
                          </div>
                          <span className="text-sm">VPC isolation and private networking</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="p-1 rounded bg-blue-100 dark:bg-blue-900/30 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-blue-600" />
                          </div>
                          <span className="text-sm">Intrusion detection systems</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-600" />
                        Physical Security
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-2">
                          <div className="p-1 rounded bg-green-100 dark:bg-green-900/30 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="text-sm">Tier IV data centers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="p-1 rounded bg-green-100 dark:bg-green-900/30 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="text-sm">24/7 video surveillance</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="p-1 rounded bg-green-100 dark:bg-green-900/30 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="text-sm">Biometric access controls</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="p-1 rounded bg-green-100 dark:bg-green-900/30 mt-0.5">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="text-sm">Redundant power and cooling</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance */}
              <Card className="border-blue-500/20">
                <CardHeader className="bg-blue-50 dark:bg-blue-950/20">
                  <CardTitle className="text-blue-700 dark:text-blue-300">
                    Compliance & Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-background border rounded-lg text-center">
                      <div className="text-xl font-bold mb-1">SOC 2</div>
                      <div className="text-xs text-muted-foreground">Type II Certified</div>
                    </div>
                    <div className="p-4 bg-background border rounded-lg text-center">
                      <div className="text-xl font-bold mb-1">GDPR</div>
                      <div className="text-xs text-muted-foreground">Fully Compliant</div>
                    </div>
                    <div className="p-4 bg-background border rounded-lg text-center">
                      <div className="text-xl font-bold mb-1">CCPA</div>
                      <div className="text-xs text-muted-foreground">California Compliant</div>
                    </div>
                    <div className="p-4 bg-background border rounded-lg text-center">
                      <div className="text-xl font-bold mb-1">ISO 27001</div>
                      <div className="text-xs text-muted-foreground">In Progress</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Access Controls */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Eye className="h-6 w-6 text-primary" />
              Access Controls & Monitoring
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Access Management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Authentication</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Multi-factor authentication (MFA/2FA)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Single Sign-On (SSO) with SAML 2.0</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Password policy enforcement</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Team Permissions</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span>Role-based access control (RBAC)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span>Granular project permissions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-600" />
                        <span>Audit logs for all team actions</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Security Monitoring</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">24/7 Monitoring</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                        <span>Real-time security event monitoring</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-blue-600" />
                        <span>Anomaly detection and alerting</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-blue-600" />
                        <span>SIEM integration available</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">Incident Response</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <span>Documented incident response plan</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <span>Security team on-call 24/7</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <span>Regular security drills and testing</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Security Best Practices */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Security Best Practices for Users</h2>
            
            <Card>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-4 text-green-600">✅ DO These</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Enable MFA for your account</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Use strong, unique passwords</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Review team member access regularly</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Export and backup your data periodically</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4 text-red-600">❌ AVOID These</h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Storing real production secrets in environment variables</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Sharing account credentials with team members</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Creating endpoints that expose sensitive data</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">Using weak or common passwords</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Vulnerability Reporting & Contact */}
          <section className="mb-12">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-amber-500/20">
                <CardHeader className="bg-amber-50 dark:bg-amber-950/20">
                  <CardTitle className="text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="h-5 w-5 inline mr-2" />
                    Vulnerability Reporting
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-sm mb-4">
                    We take security vulnerabilities seriously. If you discover a security issue, 
                    please report it responsibly:
                  </p>
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Email Security Team</h4>
                      <a 
                        href="mailto:tijanibwebdev@gmail.com" 
                        className="text-primary hover:underline text-sm"
                      >
                        tijanibwebdev@gmail.com
                      </a>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">PGP Key</h4>
                      <p className="text-xs text-muted-foreground">
                        Available upon request for encrypted communications
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Security Documentation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">
                      For detailed security information, audit reports, or compliance documentation:
                    </p>
                    <div className="flex flex-col gap-3">
                      <Button variant="outline" className="justify-start" asChild>
                        <Link href="/privacy">
                          <Shield className="h-4 w-4 mr-2" />
                          Privacy Policy
                        </Link>
                      </Button>
                      <Button variant="outline" className="justify-start" asChild>
                        <Link href="/terms">
                          <FileLock className="h-4 w-4 mr-2" />
                          Terms of Service
                        </Link>
                      </Button>
                      <Button variant="outline" className="justify-start" asChild>
                        <Link href="/status">
                          <Server className="h-4 w-4 mr-2" />
                          System Status
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-8 border-t">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                This security overview was last updated: {lastAudit}
              </p>
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Flux API. All security measures subject to continuous improvement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Security Features Data
const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All data encrypted at rest and in transit with AES-256",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    badge: "Enterprise"
  },
  {
    icon: Database,
    title: "Data Isolation",
    description: "Multi-tenant architecture with logical data separation",
    color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    badge: "Compliant"
  },
  {
    icon: Cpu,
    title: "Runtime Security",
    description: "Endpoint code executes in isolated containers with resource limits",
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
  },
  {
    icon: Users,
    title: "Access Controls",
    description: "RBAC, MFA, SSO, and detailed audit logging",
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    badge: "SOC 2"
  },
  {
    icon: Network,
    title: "Network Security",
    description: "WAF, DDoS protection, and private networking",
    color: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
  },
  {
    icon: RefreshCw,
    title: "Continuous Monitoring",
    description: "24/7 security monitoring and anomaly detection",
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
  }
]

// Helper component for X mark
const XCircle = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    fill="currentColor" 
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      fillRule="evenodd" 
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
      clipRule="evenodd" 
    />
  </svg>
)