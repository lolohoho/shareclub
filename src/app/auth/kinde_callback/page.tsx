"use client";

import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { createCheckoutSessionFromCallback } from "./actions";

const Page = () => {
	const router = useRouter();
	const { user, isLoading: checkingAuth } = useKindeBrowserClient();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const doRedirect = async () => {
			const productId = localStorage.getItem("productId");
			const size = localStorage.getItem("productSize");

			if (!user || !productId || !size || checkingAuth) 
			{
				router.push("/");

			}
			else{
				try {
					localStorage.removeItem("productId");
					localStorage.removeItem("productSize");
	
					const url = await createCheckoutSessionFromCallback(productId, size);
					if (url) {
						window.location.href = url;
					} else {
						throw new Error("Stripe session creation failed");
					}
				} catch (err) {
					console.error("Error during redirect:", err);
					router.push("/error"); // ou une page d’erreur
				} finally {
					setLoading(false);
				}
			}

	
		};

		doRedirect();
	}, [user, checkingAuth, router]);

	return (
		<div className='mt-20 w-full flex justify-center'>
			<div className='flex flex-col items-center gap-2'>
				<Loader className='w-10 h-10 animate-spin text-muted-foreground' />
				<h3 className='text-xl font-bold'>Redirecting to checkout...</h3>
				<p>Please wait...</p>
			</div>
		</div>
	);
};
export default Page;
