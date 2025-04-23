import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createCheckoutSession } from "@/lib/checkout/createSession";

export async function createCheckoutSessionAction({
  productId,
  size,
}: {
  productId: string;
  size: string;
}) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized - please login");

  const session = await createCheckoutSession({
    productId,
    size,
    user
  });

  return { url: session.url };
}
