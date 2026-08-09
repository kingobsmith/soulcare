import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Please log in to apply." }, { status: 401 });
  }

  const body = await req.json();

  const { error } = await supabase.from("provider_profiles").upsert(
    {
      user_id: user.id,
      legal_name: body.legalName,
      public_name: body.publicName,
      credential_type: body.credentialType,
      license_state: body.licenseState,
      specialties: body.specialties,
      languages: body.languages,
      faith_preferences: body.faithPreferences,
      modalities: body.modalities,
      public_bio: body.bio,
      verification_status: "submitted"
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Could not submit your application." }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
