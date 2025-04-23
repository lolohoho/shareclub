import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Shirt, Home, LayoutDashboard, User, CreditCard } from "lucide-react";

import { ModeToggle } from "./ModeToggle";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import RegisterButton from "./RegisterButton";

import { getUserProfileAction } from "@/app/update-profile/actions";

const SIDEBAR_LINKS = [
	{
		icon: Home,
		label: "Home",
		href: "/",
	},
	{
		icon: Shirt,
		label: "Merch",
		href: "/merch",
	},
];

const Sidebar = async () => {
	const { getUser } = getKindeServerSession();
	const user = await getUser();

	const userProfile = await getUserProfileAction();

	const isAdmin = process.env.ADMIN_EMAIL === user?.email;

	return (
		<div
			className='flex lg:w-1/5 flex-col gap-3 px-2 border-r sticky
    left-0 top-0 h-screen'
		>
			<Link href='/update-profile' className='max-w-fit'>
				<Avatar className='mt-4 cursor-pointer'>
					<AvatarImage src={user ? (userProfile?.image || "/user-placeholder.png") : "/user-placeholder.png"} className='object-cover' />
					<AvatarFallback>CN</AvatarFallback>
				</Avatar>
			</Link>

			<nav className='flex flex-col gap-3'>
				{SIDEBAR_LINKS.map((link) => (
					<Link
						key={link.href}
						href={link.href}
						className='flex w-12 lg:w-full items-center gap-2 hover:bg-primary-foreground font-bold hover:text-primary px-2 py-1 rounded-full justify-center lg:justify-normal'
					>
						<link.icon className='w-6 h-6' />
						<span className='hidden lg:block'>{link.label}</span>
					</Link>
				))}
				
				{!user && (
					<>
						<LoginButton />
						<RegisterButton />
					</>
				)}
				{isAdmin && (
					<Link
						href={"/secret-dashboard"}
						className='flex w-12 lg:w-full items-center gap-2 hover:bg-primary-foreground font-bold hover:text-primary px-2 py-1 rounded-full justify-center lg:justify-normal'
					>
						<LayoutDashboard className='w-6 h-6' />
						<span className='hidden lg:block'>Dashboard</span>
					</Link>
				)}
				{user && (
					<>
						<Link href={process.env.STRIPE_BILLING_PORTAL_LINK_DEV + "?prefilled_email=" + user?.email}
							className='flex w-12 lg:w-full items-center gap-2 hover:bg-primary-foreground font-bold hover:text-primary px-2 py-1 rounded-full justify-center lg:justify-normal'

						>
							<CreditCard className="w-6 h-6" />		<span className='hidden lg:block'>Billing</span>
						</Link>

						<LogoutButton />
					</>
				)}

				{/* <DropdownMenu>
					<div className='flex w-12 lg:w-full items-center gap-2 hover:bg-primary-foreground font-bold hover:text-primary px-2 py-1 rounded-full justify-center lg:justify-normal'>
						<DropdownMenuTrigger className='flex items-center gap-2'>
							<User className='w-6 h-6' />
							<span className='hidden lg:block'>Setting</span>
						</DropdownMenuTrigger>
					</div>

					<DropdownMenuContent>
						<DropdownMenuLabel>My Account</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<Link href={process.env.STRIPE_BILLING_PORTAL_LINK_DEV + "?prefilled_email=" + user?.email}>
							<DropdownMenuItem>Billing</DropdownMenuItem>
						</Link>
						<LogoutButton />
					</DropdownMenuContent>
				</DropdownMenu> */}

				<ModeToggle />
			</nav>
		</div>
	);
};
export default Sidebar;
