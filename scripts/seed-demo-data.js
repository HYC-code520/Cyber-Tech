#!/usr/bin/env node

/**
 * Demo Data Seeder for Identity Sentinel
 *
 * This script generates the same 1,810+ incidents that demonstrate analyst overload.
 * Run this after setting up the database to populate it with realistic demo data.
 *
 * Usage:
 *   node scripts/seed-demo-data.js
 *
 * Or add as npm script and run:
 *   npm run seed:demo
 */

const scenarios = [
  { scenario: 'flashFlood', count: 200 },
  { scenario: 'multiVector', count: 100 },
  { scenario: 'multiVector', count: 100 },
  { scenario: 'multiVector', count: 100 },
  { scenario: 'waveAttack', count: 800 },
  { scenario: 'noiseCampaign', count: 510 }
]

async function seedDemoData() {
  console.log('🚀 Starting demo data seeding...')
  console.log(`📊 Will create ~1,810 incidents across ${scenarios.length} scenarios`)

  const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
  let totalCreated = 0

  for (let i = 0; i < scenarios.length; i++) {
    const { scenario, count } = scenarios[i]
    console.log(`\n📦 Batch ${i + 1}/${scenarios.length}: Creating ${count} ${scenario} incidents...`)

    try {
      const response = await fetch(`${baseUrl}/api/demo/load-bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scenario, count })
      })

      const result = await response.json()

      if (result.success) {
        const created = result.message.match(/(\d+)/)?.[1] || count
        totalCreated += parseInt(created)
        console.log(`✅ Created ${created} incidents`)
        console.log(`📈 Running total: ${totalCreated} incidents`)
      } else {
        console.error(`❌ Failed to create ${scenario} incidents:`, result.error)
      }
    } catch (error) {
      console.error(`❌ Network error for ${scenario}:`, error.message)
    }

    // Small delay between batches to avoid overwhelming the API
    if (i < scenarios.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  console.log(`\n🎉 Demo data seeding complete!`)
  console.log(`📊 Total incidents created: ${totalCreated}`)
  console.log(`🌐 Visit ${baseUrl} to see the analyst overload demonstration`)
}

// Run if called directly
if (require.main === module) {
  seedDemoData().catch(console.error)
}

module.exports = { seedDemoData }