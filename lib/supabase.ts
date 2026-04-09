/**
 * Compatibility shim for generated code that imports from '@/lib/supabase'.
 *
 * The canonical Supabase clients live at:
 *   Client components: @/lib/supabase/client
 *   Server components: @/lib/supabase/server
 *
 * This shim re-exports createClient from the browser client so that
 * generated code using `import { createClient } from '@/lib/supabase'`
 * doesn't fail to compile.
 *
 * For server components, always prefer @/lib/supabase/server directly.
 */
export { createClient } from '@/lib/supabase/client'
