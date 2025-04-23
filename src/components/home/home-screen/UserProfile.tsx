import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CoverImage from "./CoverImage";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/db/prisma";
import { getUserProfileAction } from "@/app/update-profile/actions";

const UserProfile = async () => {
	const admin = await prisma.user.findUnique({
		where: {
			email: process.env.ADMIN_EMAIL!,
		},
	});

	const currentUser = await getUserProfileAction();

	return (
		<div className='flex flex-col'>
			<CoverImage adminName={admin?.name!} />

			<div className='flex flex-col p-4'>
				<div className='flex flex-col md:flex-row gap-4 justify-between'>
					<Avatar className='w-20 h-20 border-2 -mt-10'>
						<AvatarImage src={admin?.image || "/user-placeholder.png"} className='object-cover' />
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>

					<div className='flex'>
						{!currentUser?.isSubscribed && (
							<Button asChild className='rounded-full flex gap-10'>
								<Link href={"/pricing"}>
									<span className='uppercase font-semibold tracking-wide'>Subscribe</span>
								</Link>
							</Button>
						)}

						{currentUser?.isSubscribed && (
							<Button className='rounded-full flex gap-10' variant={"outline"}>
								<span className='uppercase font-semibold tracking-wide'>Subscribed</span>
							</Button>
						)}
					</div>
				</div>

				<div className='flex flex-col mt-4'>
					<p className='text-lg font-semibold'>{admin?.name}</p>
					<p className='text-sm mt-2 md:text-md'>
					Bienvenue dans ce guide pratique dédié aux plantes sauvages comestibles de France. Vous cherchez à découvrir d’autres moyens de vous nourrir, tout en redécouvrant les saveurs de la nature ? Vous êtes au bon endroit ! Ce guide vous initie à la cueillette, une manière enrichissante de diversifier votre alimentation.
					</p>
				</div>
			</div>
			<div aria-hidden='true' className='h-2 w-full bg-muted' />
		</div>
	);
};
export default UserProfile;
