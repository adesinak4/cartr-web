import { redirect } from "next/navigation";

// Marketing content lives on the separately-hosted cartr.com.ng site now —
// this app only ever serves app.cartr.com.ng, so there's no landing page to
// render here anymore, just the natural entry point into the app itself.
export default function RootPage() {
  redirect("/login");
}
