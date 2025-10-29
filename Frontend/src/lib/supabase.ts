import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types (you can expand these based on your needs)
export type User = {
  id: string
  email: string
  name: string
  created_at: string
}

export type Product = {
  id: string
  title: string
  description: string
  price: number
  image_url: string
  seller_id: string
  category: string
  condition: string
  created_at: string
  updated_at: string
}

export type Donation = {
  id: string
  user_id: string
  item_name: string
  description: string
  category: string
  quantity: number
  condition: string
  pickup_address: string
  pincode: string
  status: string
  created_at: string
}
