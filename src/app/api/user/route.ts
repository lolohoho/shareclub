// /pages/api/user.ts (ou /app/api/user/route.ts si t'es en App Router)

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function GET() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return Response.json({ user });
}
