import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { ModeToggle } from "./ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "@/components/ui/Button";
import {
	navigationMenuTriggerStyle,
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "./ui/NavigationMenu";

export const Header = () => {
	const { data: sessionData } = useSession();

	return (
		<header className="flex flex-row gap-2 justify-between p-2">
			<section className="flex flex-row gap-2 font-bold ">
				{sessionData?.user ? (
					<Avatar onClick={() => void signOut()}>
						<AvatarImage
							className="w-12"
							src={sessionData?.user?.image ?? ""}
							alt={sessionData?.user?.name ?? ""}
						/>
						<AvatarFallback>CN</AvatarFallback>
					</Avatar>
				) : (
					<Button variant="default" onClick={() => void signIn()}>
						Login
					</Button>
				)}
				<article className="mt-3">
					{sessionData?.user?.name
						? `Sem dinheiro, ${sessionData.user.name}?`
						: ""}
				</article>
			</section>
			<section className="flex flex-row gap-2">
				<NavigationMenu>
					<NavigationMenuList>
						<NavigationMenuItem>
							<Link href="/" legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									Mensal
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<Link href="/dashboard" legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									Anual
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<Link href="/investments" legacyBehavior passHref>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}>
									Investimentos
								</NavigationMenuLink>
							</Link>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>
				<ModeToggle />
			</section>
		</header>
	);
};
