import React from 'react'
import { Typography } from './Typography'
import Image from 'next/image'
import { Button } from './Button'
import { useAccount } from 'wagmi'
import { useGetChaosUserInfo } from '~/hooks/useChaos'

const ChaosPoints = () => {


  return (
    <div className='lg:min-w-[10rem] w-full p-3 border_violet flex items-center flex-col justify-center gap-5'>
        <Typography secondary className='text-center' size='md'>CHAOS POINTS</Typography>
        <Typography secondary className='text-center' fw={900} size='md'>123,456</Typography>
        <Image
              src="/img/icons/arrow_down.svg"
              width={16}
              height={16}
              alt=""
            />
        <div className='flex items-center gap-1'>
        <div className='flex flex-col items-start w-full gap-2'>
            <Typography secondary size='xs' className='w-full text_light_gray'>
                LP
            </Typography>
            <Typography secondary size='xs' className='w-full text_light_gray'>
                Merge
            </Typography>
            <Typography secondary size='xs' className='w-full text_light_gray'>
                Volume
            </Typography>
        </div>
        <div className='flex flex-col items-end text-right w-full gap-2'>
            <Typography secondary size='xs' className='w-full text_light_gray'>
                10CH/1USDC/12H
            </Typography>
            <Typography secondary size='xs' className='w-full text_light_gray'>
                10CH/1USDC
            </Typography>
            <Typography secondary size='xs' className='w-full text_light_gray'>
                10CH/1USDC
            </Typography>
        </div>
        </div>
        <button className='outline bg-transparent px-5 py-3
        '>
            <Typography secondary size='xs'>
                Leaderboard
            </Typography>
        </button>
    </div>
  )
}

export default ChaosPoints