import { createClient } from "@supabase/supabase-js";

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE } = process.env;

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE!);

export default supabase;