import { Divider, NumberInput } from '@mantine/core'
import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'
import { Button, Card, Dropdown, Typography } from '~/components/common'
import { FROM_TOKEN_LIST, TO_TOKEN_LIST } from '~/constants'
import { TO_CHAIN_LIST, FROM_CHAIN_LIST } from '~/constants/chains'
import { verdana } from '~/fonts'

type BridgeOperationProps = {
  onConversion: () => void
}

const fromTokenOptions = FROM_TOKEN_LIST.map((token) => ({
  value: token.symbol,
  icon: token.icon,
}));

const ToTokenOptions = TO_TOKEN_LIST.map((token) => ({
  value: token.symbol,
  icon: token.icon,
}));

const fromChainOptions = FROM_CHAIN_LIST.map((chain) => ({
  value: chain.symbol,
  icon: chain.icon,
}));

const toChainOptions = TO_CHAIN_LIST.map((chain) => ({
  value: chain.symbol,
  icon: chain.icon,
}));

const BridgeOperation = (props: BridgeOperationProps) => {
  return (
    <div className='flex flex-col gap-4'>
    {/* <Card className="w-full flex flex-col"> */}
        <div className="flex md:flex-row flex-col gap-4 justify-between ">
          <div className="flex flex-col md:w-1/2 w-full gap-5">
            <Typography secondary size="sm" className="text-start">
              Token
            </Typography>
            <Dropdown
              value='VULT'
              defaultValue="VULT"
              options={fromTokenOptions}
              className="w-full "
            />
          </div>
          <div className="flex flex-col md:w-1/2 w-full  gap-5">
            <Typography secondary size="sm" className="">
              From
            </Typography>
            <Dropdown
            value='BASE'
              defaultValue='BASE'
              options={fromChainOptions}
              className="w-full "
            />
          </div>
        </div>

        <div className="h-1 flex items-center justify-center mt-10 ">
          <button className="absolute bg-black  p-3">
            <Image src="/img/icons/refresh.svg" width={24} height={24} alt="" />
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-10">
          <div className="flex md:flex-row flex-col gap-4 justify-between ">
            <div className="flex flex-col md:w-1/2 w-full gap-5">
              <Typography secondary size="sm" className="text-start">
                Token
              </Typography>
              <Dropdown
              value='VULT'
                defaultValue="VULT"
                options={ToTokenOptions}
                className="w-full "
              />
            </div>
            <div className="flex flex-col md:w-1/2 w-full  gap-5">
              <Typography secondary size="sm" className="">
                To
              </Typography>
              <Dropdown
              value='ETH'
                defaultValue="ETH"
                options={toChainOptions}
                className="w-full "
              />
            </div>
          </div>

          <div className="flex bg_rich_dark flex-row items-center bg justify-between px-2">
            <NumberInput
              classNames={{
                root: "flex-1  my-5 w-auto",
                input: clsx(
                  verdana.className,
                  "text-start bg-transparent text-white text-2xl h-auto border-transparent rounded-none"
                ),
              }}
              defaultValue="0"
              hideControls
            />
            <div className="flex gap-5 items-center">
              <div className="flex flex-col ">
                <Typography size="sm">Balance</Typography>
                <Typography size="sm" className="text-end">
                  -
                </Typography>
              </div>
              <Divider orientation="vertical" className="border_stroke" />
              <div>
                <Typography
                  size="md"
                  className="text_turq underline cursor-pointer"
                >
                  MAX
                </Typography>
              </div>
            </div>
          </div>
          <div>
            <Typography size="xs">Est. Value:- </Typography>

            <div className="flex md:flex-row flex-col gap-10">
              <div className="w-full flex flex-col gap-5 md:w-1/2 p-2 bg_rich_dark">
                <div className="flex flex-row justify-between gap-3">
                  <Typography size="xs">Gas Cost: </Typography>
                  <Typography size="xs" className="text_turq">
                    Fast
                  </Typography>
                </div>
                <Typography size="md">-</Typography>
                <Typography size="xs">Est. Time:-</Typography>
              </div>

              <div className="w-full flex flex-col gap-5 md:w-1/2 p-2 bg_rich_dark">
                <div className="flex flex-row justify-between gap-3">
                  <Typography size="xs">Gas Cost: </Typography>
                  <Typography size="xs" className="text_yellow">
                    Economy
                  </Typography>
                </div>
                <Typography size="md">-</Typography>
                <Typography size="xs">Max. Time:-</Typography>
              </div>
            </div>

            <Divider className="border_stroke my-5" />

            <div className="flex items-center justify-between gap-3 my-2">
              <Typography size="xs">You will receive</Typography>
              <Typography size="xs">-</Typography>
            </div>
            <div className="flex items-center justify-between gap-3 ">
              <Typography size="xs">Gas on destination</Typography>
              <Typography size="xs">-</Typography>
            </div>
          </div>
        </div>
        <Button className="w-full my-2" disabled>
          <Typography secondary size="sm" tt="uppercase" fw="bold">
            Bridge
          </Typography>
        </Button>
      {/* </Card> */}
      <Card>
            <Typography size="lg">MERGE your WEWE into VULT</Typography>

            <ul className="list-decimal list-inside pt-3 text-sm text_light_gray">
              <li>Merge your $WEWE to secure your $VULT</li>
              <li>
                Starting price is 1,000 $WEWE to 1 $VULT, but this will rise
              </li>
              <li>Your $VULT will be locked until the public launch</li>
            </ul>
          </Card>
      </div>
  )
}

export default BridgeOperation