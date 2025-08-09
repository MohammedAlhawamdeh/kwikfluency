import { NextResponse } from "next/server";
import { createClient } from "@/app/lib/supabase/server";

export async function POST(req: Request) {
  const { password, accessToken } = await req.json();
  const supabase = await createClient();

  supabase.auth.setSession({ access_token: accessToken, refresh_token: "" });

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
