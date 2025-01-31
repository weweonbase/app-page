import Link from 'next/link'
import React from 'react'
import { Card, Typography } from '~/components/common'
import { useMemeEaterVestingDuration } from '~/hooks/useMemeEater'
import { MemeClaimForm } from '~/components/ui/Merge/Memes/MemeClaimForm'
import { MergeConfig, slugToMergeConfig } from '~/constants/mergeConfigs'
import { GetServerSideProps } from 'next'
import MemeMergeForm from '~/components/ui/Merge/Memes/MemeMergeForm'
import { ChaosRewardCard } from '~/components/ui/Merge/Memes/ChaosRewardCard'
import { CapsCard } from '~/components/ui/Merge/Memes/CapsCard'

interface MemeMergePageProps {
  mergeConfig: MergeConfig
}

export const getServerSideProps: GetServerSideProps<MemeMergePageProps> = async ({ params }) => {
  const mergeConfig = slugToMergeConfig[params?.slug as string];


  if (!mergeConfig) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      mergeConfig
    }
  }
}

const MemeMergePage = ({ mergeConfig }: MemeMergePageProps) => {
  const { vestingDuration } = useMemeEaterVestingDuration(mergeConfig.eaterContractAddress);


  return (
    <div>
      <Card  className="mb-5">
        <Typography secondary size="lg" className="text-center uppercase" >
        MERGE YOUR {mergeConfig.inputToken.symbol}! <span className="text-yellow">LIVE UNTIL {mergeConfig.mergeDeadline}!</span> 
        </Typography>
      </Card>
      <div className="gap-5 grid grid-cols-12">
        <div className="md:col-span-8 col-span-12 gap-3 h-[100%]">
          <Card>
            <div className="md:flex items-center justify-between gap-3 text-center md:text-start">
              <Link href="/merge">
                <Typography secondary size="xl" tt="uppercase">
                  <span>{"<"}</span>  MERGE NOW
                </Typography>
              </Link>
            </div>
            <div className="md:flex items-center justify-between gap-3 text-center md:text-start mt-5">
              <Typography
                size="sm"
                tt="uppercase"
                className="text-center md:text-start"
              >
                Merge your coins
              </Typography>
            </div>
          </Card>
          <Card className="border-t-0">
            <div>
              <Typography className="pt-3">
                We merge fragmented communities - into One United Power! <br/>
                We target tokens with extremely low liquidity, high failure rate, but social power.
              </Typography>
            </div>
            <div className="flex flex-col my-5">
              <ul className="list-decimal list-inside text-base font-bold text_light_gray">
                <li>Sacrifice your ${mergeConfig.inputToken.symbol} to get $WEWE</li>
                <li>Speed pays. Be fast to get maximum $WEWE and $CHAOS</li>
                <li>Claim your $WEWE in {vestingDuration}</li>
              </ul>
            </div>
          </Card>
          <Card className="border-t-0">
            <div className="mb-10">
              <MemeMergeForm mergeConfig={mergeConfig} />
            </div>
          </Card>
          <Card className="border-t-0">
            <div className="h-full">
              <div id="dexscreener-embed"><iframe src={mergeConfig.chartUrl}></iframe></div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col md:col-span-4 col-span-12 md:order-2 order-1 gap-5">
          <Card>
            <MemeClaimForm mergeConfig={mergeConfig} />
          </Card>
          <Card>
            <CapsCard mergeConfig={mergeConfig}/>
          </Card>
          <Card>
            <ChaosRewardCard mergeConfig={mergeConfig} />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default MemeMergePage;
