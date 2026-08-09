import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AffiliateJoinForm from "@/components/AffiliateJoinForm";

export default async function AffiliateJoinPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (affiliate) redirect("/affiliate/dashboard");
  }

  return <AffiliateJoinForm isAuthenticated={!!user} />;
}
