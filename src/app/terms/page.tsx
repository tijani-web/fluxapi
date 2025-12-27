// app/terms/page.tsx
import { FileText, Scale, AlertTriangle, CheckCircle, XCircle, Users, Code, Shield } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function TermsOfServicePage() {
  const effectiveDate = "December 2025"
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary px-3 py-1 bg-primary/10 rounded-full">
                Legal Agreement
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Terms of Service
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              The rules and guidelines for using our API builder platform
            </p>
            
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm px-3 py-1.5 bg-muted rounded-lg">
                <FileText className="h-4 w-4" />
                <span>Last updated: {effectiveDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm px-3 py-1.5 bg-muted rounded-lg">
                <Users className="h-4 w-4" />
                <span>Applies to all users</span>
              </div>
              <div className="flex items-center gap-2 text-sm px-3 py-1.5 bg-muted rounded-lg">
                <Shield className="h-4 w-4" />
                <span>Includes Acceptable Use Policy</span>
              </div>
            </div>
            
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <p className="text-sm text-amber-800 dark:text-amber-300">
                <AlertTriangle className="h-4 w-4 inline mr-2 mb-1" />
                <strong>Important:</strong> By using our API builder platform, you agree to these terms. 
                Please read them carefully.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Acceptable Use Summary */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Quick Acceptable Use Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-green-600 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    What's Allowed ✅
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-sm">Building mock APIs for development & testing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-sm">Creating internal tools and prototypes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-sm">Teaching API concepts and development</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span className="text-sm">Team collaboration on API projects</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3 text-red-600 flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    What's Prohibited ❌
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span className="text-sm">Illegal activities or harmful content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span className="text-sm">Spamming or excessive API calls</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span className="text-sm">Bypassing security or access controls</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 mt-1">•</span>
                      <span className="text-sm">Reselling our service without permission</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Terms */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Section 1 */}
          <section id="agreement">
            <h2 className="text-2xl font-bold mb-6 pb-3 border-b">1. Agreement to Terms</h2>
            <div className="space-y-4">
              <p>
                By accessing or using the API Builder platform ("Service"), you agree to be bound by these 
                Terms of Service. If you disagree with any part of the terms, you may not access the Service.
              </p>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Who Can Use Our Service</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>You must be at least 16 years old to use this Service</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>If using on behalf of an organization, you must have authority to bind them</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>You must provide accurate registration information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>You are responsible for maintaining account security</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 2 - Service Description */}
          <section id="service-description">
            <h2 className="text-2xl font-bold mb-6 pb-3 border-b flex items-center gap-2">
              <Code className="h-6 w-6 text-primary" />
              2. Our Service
            </h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What We Provide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold mb-2">API Building Platform</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Create, test, and deploy mock API endpoints</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Write JavaScript logic for endpoint behavior</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Manage mock data collections</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>Configure environment variables</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">Service Level</h4>
                    <p className="text-sm mb-2">
                      We strive for 99.9% uptime but do not guarantee uninterrupted service. We may:
                    </p>
                    <ul className="space-y-1 text-sm">
                      <li>• Perform maintenance with advance notice when possible</li>
                      <li>• Update features and improve the platform</li>
                      <li>• Limit usage to ensure fair access for all users</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 3 - User Content & Data */}
          <section id="user-content">
            <h2 className="text-2xl font-bold mb-6 pb-3 border-b">3. Your Content & Data</h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ownership Rights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-semibold mb-2 text-green-700 dark:text-green-300">
                        You Own Your Content
                      </h4>
                      <p className="text-sm">
                        <strong>You retain all rights</strong> to your API endpoints, JavaScript code, 
                        mock data collections, and environment variables that you create on our platform.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">License to Us</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        By using our Service, you grant us a limited license to:
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-sm">Store, process, and execute your endpoints on our infrastructure</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-sm">Display and share your endpoints as you configure them</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span className="text-sm">Use anonymized, aggregated data to improve our Service</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Portability & Export</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm">
                      We believe in <strong>data portability</strong>. You can export your endpoints, 
                      mock data, and configurations at any time through our export tools.
                    </p>
                    
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h4 className="font-semibold mb-2">Export Formats</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="p-2 bg-background rounded text-center">
                          JSON Endpoints
                        </div>
                        <div className="p-2 bg-background rounded text-center">
                          Postman Collections
                        </div>
                        <div className="p-2 bg-background rounded text-center">
                          Mock Data (JSON/CSV)
                        </div>
                        <div className="p-2 bg-background rounded text-center">
                          Environment Configs
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 4 - Acceptable Use */}
          <section id="acceptable-use">
            <h2 className="text-2xl font-bold mb-6 pb-3 border-b flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              4. Acceptable Use Policy
            </h2>
            
            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="bg-amber-50 dark:bg-amber-950/20">
                <CardTitle className="text-amber-800 dark:text-amber-300">
                  Violation of these rules may result in account suspension or termination
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <h4 className="font-semibold mb-3 text-lg">Prohibited Activities</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
                        <h5 className="font-semibold text-red-700 dark:text-red-300 mb-1">
                          Illegal Content & Activities
                        </h5>
                        <ul className="text-sm space-y-1">
                          <li>• Malware, viruses, or harmful code</li>
                          <li>• Phishing or fraud attempts</li>
                          <li>• Copyright infringement</li>
                          <li>• Hate speech or harassment</li>
                        </ul>
                      </div>
                      
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
                        <h5 className="font-semibold text-red-700 dark:text-red-300 mb-1">
                          System Abuse
                        </h5>
                        <ul className="text-sm space-y-1">
                          <li>• Attempting to bypass rate limits</li>
                          <li>• Excessive API calls affecting performance</li>
                          <li>• Attempting unauthorized access</li>
                          <li>• Denial of service attacks</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
                        <h5 className="font-semibold text-red-700 dark:text-red-300 mb-1">
                          Platform Misuse
                        </h5>
                        <ul className="text-sm space-y-1">
                          <li>• Reselling our service without permission</li>
                          <li>• Creating deceptive or fake APIs</li>
                          <li>• Scraping or copying platform content</li>
                          <li>• Impersonating others</li>
                        </ul>
                      </div>
                      
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded border border-red-200 dark:border-red-800">
                        <h5 className="font-semibold text-red-700 dark:text-red-300 mb-1">
                          Security Violations
                        </h5>
                        <ul className="text-sm space-y-1">
                          <li>• Sharing login credentials</li>
                          <li>• Attempting to access others' data</li>
                          <li>• Testing security without permission</li>
                          <li>• Storing unencrypted sensitive data</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Usage Limits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h5 className="font-semibold mb-2">Free Tier</h5>
                      <ul className="text-sm space-y-1">
                        <li>• 100 endpoints</li>
                        <li>• 5 mock collections</li>
                        <li>• 10 environments</li>
                        <li>• 1,000 executions/day</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h5 className="font-semibold mb-2">Pro Tier</h5>
                      <ul className="text-sm space-y-1">
                        <li>• 1,000 endpoints</li>
                        <li>• 50 mock collections</li>
                        <li>• 100 environments</li>
                        <li>• 50,000 executions/day</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h5 className="font-semibold mb-2">Enterprise</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Custom limits</li>
                        <li>• Unlimited collections</li>
                        <li>• SLA guarantees</li>
                        <li>• Priority support</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 5 - Payments & Refunds */}
          <section id="payments">
            <h2 className="text-2xl font-bold mb-6 pb-3 border-b">5. Payments & Billing</h2>
            
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Subscription Plans</h4>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-sm">Free tier available with basic features</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-sm">Paid plans billed monthly or annually</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-sm">Automatic renewal unless cancelled</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-sm">Price changes communicated 30 days in advance</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Refund Policy</h4>
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <p className="text-sm">
                        <strong>30-day money-back guarantee</strong> for first-time subscribers. 
                        Contact support within 30 days of purchase for a full refund.
                      </p>
                      <p className="text-sm mt-2">
                        No refunds for partial months or downgrades.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 6 - Termination */}
          <section id="termination">
            <h2 className="text-2xl font-bold mb-6 pb-3 border-b">6. Termination</h2>
            
            <div className="space-y-4">
              <p>
                We may suspend or terminate your account if you violate these Terms. You may terminate 
                your account at any time through your account settings.
              </p>
              
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3">What Happens After Termination</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-semibold mb-2 text-sm">Immediate Effects</h5>
                      <ul className="space-y-1 text-sm">
                        <li>• Access to platform disabled</li>
                        <li>• Active endpoints stop working</li>
                        <li>• API calls return errors</li>
                        <li>• Team access revoked</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold mb-2 text-sm">Data Retention</h5>
                      <ul className="space-y-1 text-sm">
                        <li>• 30-day data retention for recovery</li>
                        <li>• Permanent deletion after 30 days</li>
                        <li>• Export available during retention</li>
                        <li>• Backups deleted within 90 days</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Section 7 - Disclaimer & Liability */}
          <section id="disclaimer">
            <h2 className="text-2xl font-bold mb-6 pb-3 border-b">7. Disclaimers & Limitation of Liability</h2>
            
            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader className="bg-amber-50 dark:bg-amber-950/20">
                <CardTitle className="text-amber-800 dark:text-amber-300">
                  Important Legal Disclaimers
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2">Service "As Is"</h4>
                  <p className="text-sm">
                    Our Service is provided "as is" without warranties of any kind. We do not guarantee:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm">
                    <li>• That the Service will meet your specific requirements</li>
                    <li>• That the Service will be uninterrupted or error-free</li>
                    <li>• The accuracy or reliability of any results</li>
                    <li>• That defects will be corrected</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-semibold mb-2 text-red-700 dark:text-red-300">
                    Limitation of Liability
                  </h4>
                  <p className="text-sm">
                    To the maximum extent permitted by law, our total liability for any claims 
                    under these Terms shall be limited to the amount you paid us in the last 12 months.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">
                    Indemnification
                  </h4>
                  <p className="text-sm">
                    You agree to indemnify and hold us harmless from any claims, damages, or losses 
                    arising from your use of the Service or violation of these Terms.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Section 8 - General */}
          <section id="general">
            <h2 className="text-2xl font-bold mb-6 pb-3 border-b">8. General Provisions</h2>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Governing Law</h4>
                    <p className="text-sm">
                      These Terms shall be governed by the laws of [Your State/Country], 
                      without regard to its conflict of law provisions.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Changes to Terms</h4>
                    <p className="text-sm">
                      We may update these Terms. We'll notify you of significant changes via email 
                      or platform notification. Continued use after changes constitutes acceptance.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Contact Information</h4>
                    <p className="text-sm">
                      For questions about these Terms, contact us at:
                    </p>
                    <p className="text-sm mt-1">
                      <strong>Legal Department</strong><br />
                      <a href="mailto:tijanibwebdev@gmail.com" className="text-primary hover:underline">
                        tijanibwebdev@gmail.com
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center p-6 bg-muted/30 rounded-lg">
                <div>
                  <h4 className="font-semibold mb-1">Related Documents</h4>
                  <p className="text-sm text-muted-foreground">
                    Review our complete legal documentation
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" asChild>
                    <Link href="/privacy">
                      Privacy Policy
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/security">
                      Security Information
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-12 border-t">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                These Terms of Service constitute the entire agreement between you and 
                API Builder regarding the Service.
              </p>
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} Flux API. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}