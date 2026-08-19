import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, data } = await req.json()

    if (action === 'create-article') {
      const { title, content, image_url, image_storage_path, video_url, category_id, district_id, is_hero_slider, is_top_hero, whatsapp_link } = data
      
      const { data: article, error } = await supabaseClient
        .from('articles')
        .insert([{ 
          title, 
          content, 
          image_url, 
          image_storage_path,
          video_url, 
          category_id, 
          district_id, 
          is_hero_slider,
          is_top_hero,
          whatsapp_link 
        }])
        .select()

      if (error) throw error
      return new Response(JSON.stringify(article), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (action === 'update-article') {
      const { id, title, content, image_url, image_storage_path, video_url, category_id, district_id, is_hero_slider, is_top_hero, whatsapp_link } = data
      
      const { data: article, error } = await supabaseClient
        .from('articles')
        .update({ 
          title, 
          content, 
          image_url, 
          image_storage_path,
          video_url, 
          category_id: category_id ? parseInt(category_id) : null, 
          district_id: district_id ? parseInt(district_id) : null, 
          is_hero_slider,
          is_top_hero,
          whatsapp_link 
        })
        .eq('id', id)
        .select()

      if (error) throw error
      return new Response(JSON.stringify(article), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (action === 'get-articles') {
      const { category_slug, district_name, limit = 10 } = data
      let query = supabaseClient.from('articles').select('*, categories(*), districts(*)')

      if (category_slug) {
        query = query.eq('categories.slug', category_slug)
      }
      if (district_name) {
        query = query.eq('districts.name', district_name)
      }

      const { data: articles, error } = await query.order('created_at', { ascending: false }).limit(limit)

      if (error) throw error
      return new Response(JSON.stringify(articles), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (action === 'upload-epaper') {
      const { pdf_url, image_url } = data
      
      // 1. Get E-Paper category ID
      const { data: category } = await supabaseClient
        .from('categories')
        .select('id')
        .eq('slug', 'e-paper')
        .single()
      
      if (!category) throw new Error('E-Paper category not found')

      // 2. Check if a daily e-paper record already exists
      const { data: existing } = await supabaseClient
        .from('articles')
        .select('id, content')
        .eq('category_id', category.id)
        .eq('title', 'DAILY_EPAPER')
        .single()

      let result;
      if (existing) {
        // Update existing
        const { data: updated, error } = await supabaseClient
          .from('articles')
          .update({ 
            content: pdf_url, // We store PDF URL in content
            image_url: image_url 
          })
          .eq('id', existing.id)
          .select()
        if (error) throw error
        result = updated
      } else {
        // Create new
        const { data: inserted, error } = await supabaseClient
          .from('articles')
          .insert([{ 
            title: 'DAILY_EPAPER',
            content: pdf_url,
            image_url: image_url,
            category_id: category.id,
            is_expiring: false,
            expires_at: null
          }])
          .select()
        if (error) throw error
        result = inserted
      }

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (action === 'get-latest-epaper') {
      const { data: epaper, error } = await supabaseClient
        .from('articles')
        .select('*, categories!inner(slug)')
        .eq('categories.slug', 'e-paper')
        .eq('title', 'DAILY_EPAPER')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 is 'no rows returned'
      
      return new Response(JSON.stringify(epaper || null), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (action === 'delete-epaper') {
      const { data: category } = await supabaseClient
        .from('categories')
        .select('id')
        .eq('slug', 'e-paper')
        .single()
      
      if (!category) throw new Error('E-Paper category not found')

      const { error } = await supabaseClient
        .from('articles')
        .delete()
        .eq('category_id', category.id)
        .eq('title', 'DAILY_EPAPER')

      if (error) throw error
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    return new Response(JSON.stringify({ error: 'Action not found' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
