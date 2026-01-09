import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const usersToCreate = [
      {
        email: "admin@mantaf.id",
        password: "admin123",
        full_name: "Admin Utama",
        phone: "081234567890",
        role: "admin" as const,
      },
      {
        email: "ustadz@mantaf.id",
        password: "ustadz123",
        full_name: "Ustadz Ahmad Fauzi",
        phone: "081234567891",
        role: "asatidz" as const,
      },
      {
        email: "wali@mantaf.id",
        password: "wali123",
        full_name: "Bapak Abdullah",
        phone: "081234567892",
        role: "wali_santri" as const,
      },
    ];

    const results = [];

    for (const userData of usersToCreate) {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
      const existingUser = existingUsers?.users?.find(u => u.email === userData.email);

      if (existingUser) {
        results.push({ email: userData.email, status: "already exists" });
        continue;
      }

      // Create user
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: { full_name: userData.full_name },
      });

      if (createError) {
        results.push({ email: userData.email, status: "error", error: createError.message });
        continue;
      }

      // Update profile with phone
      if (newUser.user) {
        await supabaseAdmin
          .from("profiles")
          .update({ phone: userData.phone })
          .eq("user_id", newUser.user.id);

        // Assign role
        await supabaseAdmin
          .from("user_roles")
          .insert({ user_id: newUser.user.id, role: userData.role });
      }

      results.push({ email: userData.email, status: "created", role: userData.role });
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
