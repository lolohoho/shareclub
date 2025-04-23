import BaseLayout from "@/components/BaseLayout";
import PurchaseSummary from "./PurchaseSummary";
import { Suspense } from 'react';
const Page = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<BaseLayout>
				<PurchaseSummary />
			</BaseLayout>
		</Suspense>

	);
};
export default Page;




