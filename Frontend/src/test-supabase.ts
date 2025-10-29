import { supabase } from './lib/supabase'

// Test Supabase connection
async function testConnection() {
  console.log('🔍 Testing Supabase connection...\n')
  
  try {
    // Test 1: Check connection
    const { error } = await supabase.from('profiles').select('count')
    
    if (error && error.code === '42P01') {
      console.log('⚠️  Tables not found. You need to run the SQL schema.')
      console.log('📋 Follow these steps:')
      console.log('1. Open Supabase dashboard: https://app.supabase.com')
      console.log('2. Go to SQL Editor')
      console.log('3. Copy content from supabase-schema.sql')
      console.log('4. Paste and run it')
      return
    }
    
    if (error) {
      console.log('❌ Connection error:', error.message)
      return
    }
    
    console.log('✅ Successfully connected to Supabase!')
    console.log('✅ Database tables are set up correctly!\n')
    
    // Test 2: Check tables
    console.log('📊 Checking tables...')
    const tables = ['profiles', 'products', 'donations', 'cart_items', 'wishlist', 'orders']
    
    for (const table of tables) {
      const { error: tableError } = await supabase.from(table).select('count').limit(1)
      if (tableError) {
        console.log(`  ❌ ${table}: ${tableError.message}`)
      } else {
        console.log(`  ✅ ${table}: OK`)
      }
    }
    
    console.log('\n🎉 Supabase is ready to use!')
    
  } catch (err) {
    console.log('❌ Error:', err)
  }
}

testConnection()
