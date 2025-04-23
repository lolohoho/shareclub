"use server";

import prisma from "@/db/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createCheckoutSession } from "@/lib/checkout/createSession";
export async function checkAuthStatus() {
	console.log("checkAuthStatus")
	const { getUser } = getKindeServerSession();
	const user = await getUser();
	console.log(user)

	if (!user) return { success: false };

	const existingUser = await prisma.user.findUnique({ where: { id: user.id } });
	console.log(existingUser)

	// sign up
	if (!existingUser) {
		console.log("create")

		await prisma.user.create({
			data: {
				id: user.id,
				email: user.email!,
				name: user.given_name + " " + user.family_name,
				image: user.picture,
			},
		});
	}
	console.log("end")

	return { success: true };
}


export async function createCheckoutSessionFromCallback(productId: string, size: string) {
	const { getUser } = getKindeServerSession();
	const user = await getUser();
	if (!user || !user.email) {
		throw new Error("Unauthorized");
	}

	const session = await createCheckoutSession({
		productId,
		size,
		user
	});

	return session.url;
}