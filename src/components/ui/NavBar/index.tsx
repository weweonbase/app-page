"use client";

import Image from "next/image";
import Link from "next/link";
import { PAGE_LINKS } from "./links";
import NavLink from "./NavLink";
import { ConnectButton, Typography } from "~/components/common";
import { useDisclosure } from "@mantine/hooks";
import { NavBarModal } from "./NavBarModal";
import ChaosPoints from "~/components/common/ChaosPoints";
import { useAccount } from "wagmi";
import { useGetChaosUserInfo } from "~/hooks/useChaos";
import { thousandSeperator } from "~/utils";

export const NavBar = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const user = useAccount()
  const {isConnected} = useAccount()
  const {data: userInfo, isLoading} = useGetChaosUserInfo(user.address as `0x${string}`)

  return (
    <header className="w-full">
      <nav className="flex items-center justify-between gap-4 py-8 px-4 md:px-8">
        <Link href="/" className="flex items-center">
          <Image src="/img/logo.svg" width={115} height={50} alt="logo" />
        </Link>

        <ul className="items-center gap-4 hidden lg:flex">
          {PAGE_LINKS.map((link, key) => (
            <NavLink
              icon={link.icon}
              text={link.text}
              href={link.href}
              key={key}
            />
          ))}
        </ul>

        <div className="flex items-center gap-2 lg:gap-4 relative h-full">
        {isConnected && <div className="hidden xl:flex border_violet flex-col gap-2 h-full text-center py-1 px-4">
            <Typography size="xs" secondary>CHAOS Points</Typography>
            {isLoading ? <Typography secondary className="animate-pulse">0.00</Typography> :<Typography size="md" fw={900} secondary>{thousandSeperator(userInfo?.totalChaosRewards)}</Typography>}
        </div>}
          <ConnectButton />
          <button onClick={open} className="block lg:hidden">
            <Image
              src="/img/icons/hamburger.svg"
              width={40}
              height={40}
              alt=""
            />
          </button>
        </div>
      </nav>
     {isConnected && <div className="flex xl:hidden border_violet items-center justify-between gap-2 text-center mx-4 lg:mx-8 p-4">
            <Typography size="lg" className="text_violet text-left" secondary>CHAOS Points</Typography>
            {isLoading ? <Typography secondary className="animate-pulse">0.00</Typography> :<Typography size="md" fw={900} secondary>{thousandSeperator(userInfo?.totalChaosRewards)}</Typography>}
        </div>}
      <NavBarModal opened={opened} onClose={close} />
    
    </header>
  );
};
