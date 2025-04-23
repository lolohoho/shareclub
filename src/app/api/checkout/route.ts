import { NextResponse } from "next/server";
// import { createCheckoutSessionAction } from "@/app/your-page-path/actions"; // ⬅️ adapte ce chemin
import { createCheckoutSessionAction } from "@/app/merch/[id]/actions";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const session = await createCheckoutSessionAction(body);
		return NextResponse.json(session);
	} catch (error: any) {
		console.error("Error in checkout:", error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
