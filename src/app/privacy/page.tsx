// app/privacy/page.tsx
import { Shield, Lock, Eye, Database, Users, Globe } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPolicyPage() {
  const lastUpdated = "December 2023"
  
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
              <span className="text-sm font-medium text-primary px-3 py-1 bg-primary/10 rounded-full">
                Privacy & Security
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              How we protect your data, endpoints, and mock collections in our API platform
            </p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4" />
                <span>Transparent data practices</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4" />
                <span>Enterprise-grade security</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Database className="h-4 w-4" />
                <span>Your mock data is private</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Quick Summary */}
          <Card className="mb-8 border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                TL;DR - Our Privacy Promise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="p-1 rounded bg-green-500/10 mt-0.5">
                    <Lock className="h-4 w-4 text-green-600" />
                  </div>
                  <span><strong>Your API endpoints and mock data are private</strong> - We never access or share your collection data unless required for support (with your permission)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 rounded bg-green-500/10 mt-0.5">
                    <Database className="h-4 w-4 text-green-600" />
                  </div>
                  <span><strong>Environment variables are encrypted</strong> - API keys, database URLs, and secrets are stored with AES-256 encryption</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 rounded bg-green-500/10 mt-0.5">
                    <Eye className="h-4 w-4 text-green-600" />
                  </div>
                  <span><strong>We minimize data collection</strong> - We only collect what's necessary to run the platform and improve your experience</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 rounded bg-green-500/10 mt-0.5">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <span><strong>You control your data</strong> - Export your endpoints and mock data anytime, delete your account permanently</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Detailed Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section id="data-we-collect">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                1. Data We Collect
              </h2>
              <div className="space-y-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Information You Provide</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Account Information</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Email address and password for authentication</li>
                        <li>• Name and profile picture (optional)</li>
                        <li>• Payment information (for paid plans)</li>
                      </ul>
                    </div>
                    
                    <div className="p-3 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">API Platform Data</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• <strong>Endpoint configurations</strong> - Paths, methods, JavaScript code</li>
                        <li>• <strong>Mock data collections</strong> - Your sample/test data</li>
                        <li>• <strong>Environment variables</strong> - Encrypted API keys and configs</li>
                        <li>• <strong>Execution logs</strong> - For debugging and analytics</li>
                        <li>• <strong>Team members and permissions</strong></li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Automatically Collected Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span><strong>Usage Analytics:</strong> How many endpoints you create, execution frequency, feature usage (aggregated and anonymized)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span><strong>Technical Logs:</strong> Error reports, performance metrics, infrastructure monitoring</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span><strong>Device Information:</strong> Browser type, IP address (for security and geolocation-based features)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Section 2 */}
            <section id="how-we-use-data">
              <h2 className="text-2xl font-bold mb-4">2. How We Use Your Data</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">To Provide Our Service</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">• Execute your API endpoints and JavaScript code</p>
                    <p className="text-sm">• Store and serve your mock data collections</p>
                    <p className="text-sm">• Securely manage environment variables</p>
                    <p className="text-sm">• Enable team collaboration features</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">To Improve Our Platform</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm">• Identify popular template patterns</p>
                    <p className="text-sm">• Optimize execution performance</p>
                    <p className="text-sm">• Fix bugs and improve reliability</p>
                    <p className="text-sm">• Develop new features based on usage</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Section 3 - Data Security */}
            <section id="data-security">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                3. Data Security & Protection
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-green-500/20">
                  <CardHeader>
                    <CardTitle className="text-green-600">Encryption</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <Lock className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Environment Variables:</strong> AES-256 encryption at rest</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Globe className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Data in Transit:</strong> TLS 1.3 encryption for all API calls</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Database className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Database Encryption:</strong> All data encrypted at rest</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="text-blue-600">Access Controls</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Role-Based Access:</strong> Granular team permissions</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Eye className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Zero-Trust Architecture:</strong> Strict internal access controls</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Regular Audits:</strong> Security assessments and penetration testing</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">Data Retention</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Active Account</h4>
                      <p className="text-sm">All data retained while account is active</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Account Deletion</h4>
                      <p className="text-sm">Complete data deletion within 30 days</p>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Backup Retention</h4>
                      <p className="text-sm">Encrypted backups kept for 90 days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section 4 - Your Rights */}
            <section id="your-rights">
              <h2 className="text-2xl font-bold mb-4">4. Your Rights & Choices</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">Access & Control</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <span className="text-primary">•</span>
                          <span>View and export all your data</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-primary">•</span>
                          <span>Correct inaccurate information</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-primary">•</span>
                          <span>Delete specific mock data collections</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-primary">•</span>
                          <span>Request data portability</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-3 text-lg">Account Management</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <span className="text-primary">•</span>
                          <span>Permanently delete your account</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-primary">•</span>
                          <span>Opt-out of marketing emails</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-primary">•</span>
                          <span>Disable usage analytics</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-primary">•</span>
                          <span>Manage cookie preferences</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <p className="text-sm">
                      <strong>To exercise your rights:</strong> Contact our privacy team at{" "}
                      <a href="mailto:privacy@yourapibuilder.com" className="text-primary hover:underline">
                        privacy@yourapibuilder.com
                      </a>{" "}
                      or use the settings in your account dashboard.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section 5 - Legal & Contact */}
            <section id="legal-contact">
              <h2 className="text-2xl font-bold mb-4">5. Legal & Contact Information</h2>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Compliance</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">🇪🇺</span>
                      <div>
                        <h4 className="font-semibold">GDPR Compliance</h4>
                        <p className="text-sm text-muted-foreground">
                          We comply with the General Data Protection Regulation (GDPR) for users in the European Union.
                          We act as a data processor for your mock data and environment variables.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">🇺🇸</span>
                      <div>
                        <h4 className="font-semibold">CCPA Compliance</h4>
                        <p className="text-sm text-muted-foreground">
                          We comply with the California Consumer Privacy Act (CCPA) and provide California residents
                          with specific rights regarding their personal information.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact & Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Privacy Questions</h4>
                        <a 
                          href="mailto:tijanibwebdev@gmail.com" 
                          className="text-primary hover:underline text-sm"
                        >
                          tijanibwebdev@gmail.com
                        </a>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Data Protection Officer</h4>
                        <p className="text-sm text-muted-foreground">
                          For formal GDPR requests and data protection inquiries
                        </p>
                        <a 
                          href="mailto:tijanibwebdev@gmail.com" 
                          className="text-primary hover:underline text-sm"
                        >
                          tijanibwebdev@gmail.com
                        </a>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Security Reports</h4>
                        <p className="text-sm text-muted-foreground">
                          Found a security vulnerability? Please report it responsibly.
                        </p>
                        <a 
                          href="mailto:tijanibwebdev@gmail.com" 
                          className="text-primary hover:underline text-sm"
                        >
                          tijanibwebdev@gmail.com
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Footer Note */}
            <div className="mt-12 pt-8 border-t">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This privacy policy applies to our API builder platform at{" "}
                <span className="text-primary">tijanibwebdev@gmail.com</span>. Third-party services integrated 
                with your endpoints have their own privacy policies.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                We may update this policy periodically. We'll notify you of significant changes via email 
                or through our platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}