import { CheckoutForm } from "./checkout-form";

export default async function CheckoutPage(props: PageProps<"/s/[slug]/checkout">) {
  const { slug } = await props.params;
  return <CheckoutForm slug={slug} />;
}
