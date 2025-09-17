'use client'

import { AIEnhancedRecommendationPane } from '@/components/recommendations/AIEnhancedRecommendationPane'

const testRecommendations = [
  {
    id: 'test-1',
    action: 'disable_user_account',
    reason: 'Prevent further unauthorized access attempts',
    citation: 'NIST Cybersecurity Framework - Respond',
    priority: 1,
    applied: false,
    category: 'immediate' as const
  },
  {
    id: 'test-2',
    action: 'revoke_user_tokens',
    reason: 'Invalidate potentially compromised sessions',
    citation: 'MITRE ATT&CK - Credential Access',
    priority: 2,
    applied: false,
    category: 'immediate' as const
  }
]

export default function TestAIPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            AI-Enhanced Recommendations Test
          </h1>
          <p className="text-slate-600">
            Testing the AI-enhanced "Why & Citations" section with OpenAI integration
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Brute Force Attack</h2>
            <AIEnhancedRecommendationPane
              recommendations={testRecommendations}
              currentStep="trigger"
              incidentType="brute_force"
              incidentSeverity="high"
              onExecuteAction={(action) => {
                console.log('Executing action:', action)
                alert(`Would execute: ${action}`)
              }}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Password Spray Attack</h2>
            <AIEnhancedRecommendationPane
              recommendations={testRecommendations}
              currentStep="trigger"
              incidentType="password_spray"
              incidentSeverity="high"
              onExecuteAction={(action) => {
                console.log('Executing action:', action)
                alert(`Would execute: ${action}`)
              }}
            />
          </div>
        </div>

        <div className="mt-8 p-6 bg-white rounded-lg border">
          <h3 className="text-lg font-semibold mb-3">AI Enhancement Features:</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Context-aware detailed explanations
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Business impact analysis
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Step-by-step implementation guidance
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Alternative approaches
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Risk level assessment
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Time estimation
            </li>
            <li className="flex items-center">
              <span className="text-green-500 mr-2">✓</span>
              Confidence scoring
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
