import prisma from "@/db/prisma";
import { stripe } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";

type Params = {
    productId: string;
    size: string;
    user: { id: string; email: string };
};

export async function createCheckoutSession({ productId, size, user  }: { productId: string; size: string, user :KindeUser }) {

    console.log("createCheckoutSession")
    const { getUser } = getKindeServerSession();
    // const user = await getUser();
    console.log(user)
	if (!user) throw new Error("Unauthorized - you must be logged in to purchase products");

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new Error("Product not found");

	const order = await prisma.order.create({
		data: {
			userId: user.id,
			productId: product.id,
			price: product.price,
			size,
		},
	});

	const customer = await stripe.customers.create({
		email: user.email!,
	});


    const session = await stripe.checkout.sessions.create({
		payment_method_types: ["card"],
		line_items: [
			{
				price_data: {
					currency: "eur",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: product.price,
				},
				quantity: 1,
			},
		],
		metadata: {
			orderId: order.id,
			size,
		},
		mode: "payment",
		success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/purchase-success?orderId=${order.id}`,
		cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/merch/${product.id}`,
		shipping_address_collection: {
			allowed_countries: ["US"],
		},
		customer: customer.id,
		// expires at 30 minutes(min value is 30 minutes)
		expires_at: Math.floor(Date.now() / 1000) + 60 * 30,
	});



    return session;
}
