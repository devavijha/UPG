import { supabase } from './supabase'

// Authentication functions
export const authService = {
  // Sign up
  async signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })
    return { data, error }
  },

  // Sign in
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: unknown) => void) {
    return supabase.auth.onAuthStateChange(callback)
  },
}

// Product functions
export const productService = {
  // Get all products
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Get single product
  async getProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    return { data, error }
  },

  // Create product
  async createProduct(product: {
    title: string
    description: string
    price: number
    category: string
    condition: string
    image_url?: string
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('products')
      .insert([{ ...product, seller_id: user?.id }])
      .select()
      .single()
    return { data, error }
  },

  // Update product
  async updateProduct(id: string, updates: Partial<{
    title: string
    description: string
    price: number
    category: string
    condition: string
    image_url: string
  }>) {
    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    return { data, error }
  },

  // Delete product
  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
    return { error }
  },

  // Get user's products
  async getUserProducts() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user?.id)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Upload product image
  async uploadImage(file: File, userId: string) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Math.random()}.${fileExt}`
    
    const { error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file)

    if (error) return { data: null, error }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    return { data: { url: publicUrl }, error: null }
  },
}

// Donation functions
export const donationService = {
  // Get user's donations
  async getDonations() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('donations')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Create donation
  async createDonation(donation: {
    item_name: string
    description: string
    category: string
    quantity: number
    condition: string
    pickup_address: string
    pincode: string
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('donations')
      .insert([{ ...donation, user_id: user?.id }])
      .select()
      .single()
    return { data, error }
  },
}

// Cart functions
export const cartService = {
  // Get cart items
  async getCartItems() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', user?.id)
    return { data, error }
  },

  // Add to cart
  async addToCart(productId: string, quantity: number = 1) {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('cart_items')
      .upsert([
        { user_id: user?.id, product_id: productId, quantity }
      ])
      .select()
    return { data, error }
  },

  // Remove from cart
  async removeFromCart(productId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user?.id)
      .eq('product_id', productId)
    return { error }
  },

  // Clear cart
  async clearCart() {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user?.id)
    return { error }
  },
}

// Wishlist functions
export const wishlistService = {
  // Get wishlist
  async getWishlist() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('wishlist')
      .select(`
        *,
        products (*)
      `)
      .eq('user_id', user?.id)
    return { data, error }
  },

  // Add to wishlist
  async addToWishlist(productId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data, error } = await supabase
      .from('wishlist')
      .insert([{ user_id: user?.id, product_id: productId }])
      .select()
    return { data, error }
  },

  // Remove from wishlist
  async removeFromWishlist(productId: string) {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', user?.id)
      .eq('product_id', productId)
    return { error }
  },
}

// Order functions
export const orderService = {
  // Get user's orders
  async getOrders() {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          products (*)
        )
      `)
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
    return { data, error }
  },

  // Create order
  async createOrder(orderData: {
    total_amount: number
    shipping_address: string
    items: Array<{ product_id: string; quantity: number; price: number }>
  }) {
    const { data: { user } } = await supabase.auth.getUser()
    
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: user?.id,
        total_amount: orderData.total_amount,
        shipping_address: orderData.shipping_address,
      }])
      .select()
      .single()

    if (orderError) return { data: null, error: orderError }

    // Create order items
    const orderItems = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) return { data: null, error: itemsError }

    return { data: order, error: null }
  },
}
