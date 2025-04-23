"use client";

import ZoomedImage from "@/components/ZoomedImage";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { centsToDollars } from "@/lib/utils";
import { Product } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ProductCheckout = ({ product }: { product: Product }) => {
	const { toast } = useToast();
	const [user, setUser] = useState<any>(null);
	const router = useRouter();

	useEffect(() => {
		fetch("/api/user")
			.then((res) => res.json())
			.then((data) => setUser(data.user))
			.catch(() => setUser(null));
	}, []);

	const { mutate: createCheckoutSession, isPending } = useMutation({
		mutationKey: ["createCheckoutSession"],
		mutationFn: async ({ productId, size }: { productId: string; size: string }) => {
			const res = await fetch("/api/checkout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ productId, size }),
			});

			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.error || "Erreur lors de la création de la session");
			}

			return res.json();
		},
		onSuccess: ({ url }) => {
			if (url) {
				router.push(url);
			} else {
				throw new Error("Checkout URL not returned");
			}
		},
		onError: (error: any) => {
			toast({
				title: "Error",
				description: error.message || "Something went wrong. Please try again later.",
				variant: "destructive",
			});
		},
	});

	const handleBuyProduct = () => {
		if (!user) {
			localStorage.setItem("productId", product.id);
			localStorage.setItem("productSize", "normal");
			router.push("/api/auth/login");
		} else {
			createCheckoutSession({ productId: product.id, size: "normal" });
		}
	};

	return (
		<div className='flex flex-col md:flex-row gap-5'>
			<ZoomedImage imgSrc={product.image} />

			<div className='w-full'>
				<h1 className='text-2xl md:text-4xl font-bold'>{product.name}</h1>
				<p className='text-muted-foreground text-base'>${centsToDollars(product.price)}</p>
				<Button
					className='mt-5 text-white px-5 py-2 rounded-md'
					disabled={isPending}
					size={"sm"}
					onClick={handleBuyProduct}
				>
					{isPending ? "Processing..." : "Buy Now"}
				</Button>
			</div>
		</div>
	);
};

export default ProductCheckout;
