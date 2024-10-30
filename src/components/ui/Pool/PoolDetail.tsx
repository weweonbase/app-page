import React from "react";
import Image from "next/image";
import { Button, Card, Typography } from "~/components/common";

import { usePoolContext } from "./PoolContext";

type PoolDetailProps = {
  onBack: () => void;
};

const PoolDetail = ({ onBack }: PoolDetailProps) => {
  const { selectedPool } = usePoolContext();
  return (
    selectedPool && (
      <>
        <Card>
          <div className=" min-h-40 w-full">
            <div className="flex  flex-wrap items-center justify-between gap-3 sm:py-4">
              <div className="flex items-center gap-2">
                <button onClick={onBack}>
                  <Typography secondary size="xl">
                    {"<"}
                  </Typography>
                </button>
                <div className="flex items-center">
                  <Image
                    src={selectedPool.logo.first}
                    width={24}
                    height={24}
                    alt=""
                  />
                  <Image
                    src={selectedPool.logo.second}
                    width={24}
                    height={24}
                    className="-translate-x-1.5"
                    alt=""
                  />
                </div>
                <Typography
                  secondary
                  size="xs"
                  className="font-bold"
                  tt="uppercase"
                >
                  {selectedPool.type}
                </Typography>
              </div>
              <div></div>
              <div className="flex flex-col gap-2 lg:text-right">
                <Typography size="xs" ta="center" className="text_light_gray">
                  APR
                </Typography>
                <Typography size="lg" className="font-extrabold">
                  {selectedPool.apr}%
                </Typography>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 sm:py-1 ">
              {/* <div className="flex gap-6">
              <Typography
                size="xs"
                className={`bg_green flex justify-center rounded-full w-[6rem] py-1 `}
              >
                IN RANGE
              </Typography>
              <div className="flex items-center gap-1">
                <Image
                  src="/img/links/wide.svg"
                  width={20}
                  height={20}
                  alt=""
                />
                <Typography size="xs" className="translate-x-1">
                  WIDE
                </Typography>
              </div>
            </div> */}
              <div className="flex items-center gap-1">
                <Image
                  src="/img/icons/memes.svg"
                  width={20}
                  height={20}
                  alt=""
                />
                <Typography size="xs" className="translate-x-1">
                  {selectedPool.poolType}
                </Typography>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex items-center">
                  <Image
                    src="/img/icons/Infinity.svg"
                    className="translate-x-[5px]"
                    width={20}
                    height={20}
                    alt=""
                  />
                </div>
                <Typography size="xs" className="translate-x-1">
                  {selectedPool.range}
                </Typography>
              </div>
            </div>
            <div className=" bg_light_dark my-5 min-h-48 flex-wrap gap-5 py-5">
              <Typography size="md" className="text-center">
                POOLED TOKENS
              </Typography>
              {/* <Button className="w-full md:w-auto">
                     <Typography secondary size="xs" fw={700} tt="uppercase">ZAP-OUT</Typography>
                </Button>
                <Button  className="w-full md:w-auto">
                     <Typography secondary size="xs" fw={700} tt="uppercase">MANAGE</Typography>
                </Button>

                <Button className="w-full md:w-auto">
                     <Typography secondary size="xs" fw={700} tt="uppercase">CLAIM</Typography>
                </Button> */}
            </div>

            <div className="flex items-center justify-between">
              <Typography size="xs">Rate</Typography>
              <Typography size="xs">1 USDC = 0.0027 ETH ($1.00)</Typography>
            </div>
            <div className="my-5 flex items-center justify-between">
              <Typography size="xs">Range</Typography>
              <Typography size="xs"> Min. 1,02 - Max. 3,02</Typography>
            </div>
            <div className="flex items-center justify-between">
              <Typography size="xs">Pooled Tokens</Typography>
              <div className="flex items-center justify-center gap-5">
                <div className="flex items-center gap-3">
                  <Typography size="xs" className="translate-x-1 font-bold">
                    17.27
                  </Typography>
                  <Image
                    src="/img/tokens/usdc.png"
                    width={32}
                    height={32}
                    alt=""
                  />
                </div>
                <div className="flex items-center gap-3">
                  <Typography size="xs" className="translate-x-1 font-bold">
                    4,245.15
                  </Typography>
                  <Image
                    src="/img/tokens/wewe.svg"
                    width={32}
                    height={32}
                    alt=""
                  />
                </div>
              </div>
            </div>
            <Button className="mt-4 w-full">
              <Typography secondary size="xs" fw={700} tt="uppercase">
                ZAP-IN
              </Typography>
            </Button>
          </div>
        </Card>
        <Card>
          <Typography size="lg">
            When you add liquidity to an Active Pool:
          </Typography>

          <ul className="list-inside list-decimal text-sm">
            <li>Your assets are swapped to be added correctly to the pool.</li>
            <li>
              Any assets that can’t fit in the pool are refunded back to you.
            </li>
            <li>
              You may experience a small slip when you enter a pool that is
              out-of-balance.
            </li>
          </ul>
        </Card>
      </>
    )
  );
};
export default PoolDetail;
