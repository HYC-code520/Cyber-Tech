'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { AlertCircle, CheckCircle, Info, Zap, Waves, Volume2, GitBranch } from 'lucide-react'

export default function LoadTestPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const scenarios = [
    {
      id: 'standard',
      name: 'Standard Distribution',
      description: '800 incidents with realistic SOC workload',
      icon: Info,
      color: 'text-blue-600'
    },
    {
      id: 'flashFlood',
      name: 'Flash Flood',
      description: '200 incidents in 10 minutes',
      icon: Zap,
      color: 'text-yellow-600'
    },
    {
      id: 'slowBurn',
      name: 'Slow Burn',
      description: '800 incidents over 16 hours',
      icon: Waves,
      color: 'text-orange-600'
    },
    {
      id: 'noiseCampaign',
      name: 'Noise Campaign',
      description: '500 false positives hiding 10 real threats',
      icon: Volume2,
      color: 'text-purple-600'
    },
    {
      id: 'multiVector',
      name: 'Multi-Vector Storm',
      description: 'Simultaneous attacks across different vectors',
      icon: GitBranch,
      color: 'text-red-600'
    }
  ]

  const loadScenario = async (scenarioId: string, clearExisting: boolean = false) => {
    setLoading(true)
    try {
      const response = await fetch('/api/demo/load-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: scenarioId, clearExisting })
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error loading scenario:', error)
      setResult({ error: 'Failed to load scenario' })
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Incident Overload Test Scenarios</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon
          return (
            <Card key={scenario.id} className="p-6">
              <div className="flex items-start space-x-3 mb-4">
                <Icon className={`h-6 w-6 ${scenario.color}`} />
                <div className="flex-1">
                  <h3 className="font-semibold">{scenario.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => loadScenario(scenario.id, false)}
                  disabled={loading}
                  variant="outline"
                  className="flex-1"
                >
                  Add to Existing
                </Button>
                <Button
                  onClick={() => loadScenario(scenario.id, true)}
                  disabled={loading}
                  className="flex-1"
                >
                  Replace All
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {result && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            {result.success ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                Load Test Complete
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                Load Test Failed
              </>
            )}
          </h2>

          {result.success && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Scenario</p>
                <p className="font-semibold">{result.scenario}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Total Incidents Created</p>
                <p className="text-2xl font-bold">{result.statistics.total}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">By Severity</p>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(result.statistics.bySeverity).map(([severity, count]) => (
                    <div key={severity} className="text-center">
                      <div className={`text-xs ${
                        severity === 'critical' ? 'text-red-600' :
                        severity === 'high' ? 'text-orange-600' :
                        severity === 'medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {severity.toUpperCase()}
                      </div>
                      <div className="font-semibold">{count as number}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Attack Types Distribution</p>
                <p className="text-sm">
                  {Object.keys(result.statistics.byType).length} different attack types generated
                </p>
              </div>

              <Button
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                View Dashboard
              </Button>
            </div>
          )}

          {result.error && (
            <p className="text-red-600">{result.error}</p>
          )}
        </Card>
      )}
    </div>
  )
}