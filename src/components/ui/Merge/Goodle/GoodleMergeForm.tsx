import { NumberInput } from '@mantine/core'
import Image from 'next/image'
import React, { useState } from 'react'
import { formatEther, Hex } from 'viem'
import { Button, Typography } from '~/components/common'
import { dogica } from '~/fonts'
import { cn } from '~/utils'
import MergeCompleteModal from './MergeCompleteModal'
import { FailTXModal } from '~/components/common/FailTXModal'
import { hash } from 'crypto'

const GoodleMergeForm = () => {

    const [amount, setAmount] = useState("")

    const [isProcessing, setIsProcessing] = useState(false)
    const [isFailed, setIsFailed] = useState(false)
    const [isComplete, setIsComplete] = useState(false)
    const [hash, setHash] = useState<Hex>()

    const handleSelect = (div: number) => {
        
      };

  return (
    <>
         <div className="bg_light_dark flex items-center justify-between gap-3 p-4 mt-5">
        <div className="flex-1 flex items-center gap-1">
          <Image src="/img/tokens/goodle.svg" width={32} height={32} alt="" />
          <Typography secondary size="sm">
            GOODLE
          </Typography>
        </div>
        <Image
          src="/img/icons/arrow_right.svg"
          width={16}
          height={16}
          alt=""
        />
        <div className="flex-1 flex items-center justify-end gap-1">
          <Image src="/img/tokens/wewe.svg" width={32} height={32} alt="" />
          <Typography secondary size="sm">
            VULT
          </Typography>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 pt-4">
        <div className="flex-1">
          <div className="grid grid-cols-11  md:bg-black items-center justify-between md:justify-normal gap-3">
            <div className="col-span-5 flex-1 flex items-center gap-3">
              <NumberInput
                classNames={{
                  root: "w-full md:w-full",
                  input: cn(
                    dogica.className,
                    "bg_light_dark md:p-4 p-0 text-white text-lg h-auto border-transparent rounded-none lg:w-[20.8rem]"
                  ),
                }}
                hideControls
                value={amount}
                onChange={(value) => setAmount(String(value))}
              />
            </div>
            <Image
              className="col-span-1"
              src="/img/icons/arrow_right.svg"
              width={16}
              height={16}
              alt=""
            />
            <div className="col-span-5 items-center flex-1  md:flex-none flex justify-end gap-3">
            
                <div className="overflow-x-auto">
                  <Typography size="md">
                    {/* {dn.format(dn.mul([rate, 2], dn.from(amount || 0)), { locale: "en" })}  */}
                    WEWE
                  </Typography>
                </div>

            </div>
          </div>

          <div className="w-full flex items-center gap-4 mt-3">
            <div>
              <Typography size="xs" className="text_light_gray">
                Available:
              </Typography>
              <Typography size="xs" className="text_light_gray">
                $4,690,420,090.00
              </Typography>
            </div>
            <div className="flex gap-3 items-center">
              <button
                className="bg_light_dark px-3 py-2"
                onClick={() => handleSelect(1)}
              >
                <Typography size="xs">MAX</Typography>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full md:w-auto ">
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-3 ">
            <Button
            onClick={() => setIsComplete(true)}
              className="flex items-center justify-center gap-3 w-full md:w-auto md:h-[62px]"
             
            >
              <Typography secondary size="sm" fw={700} tt="uppercase">
                REDEEM
              </Typography>
            </Button>
          </div>
        </div>
      </div>
      <FailTXModal hash={hash as Hex} opened={isFailed} onClose={() => {setIsFailed(false)}} />
      <MergeCompleteModal onClose={() => setIsComplete(false)} opened={isComplete} />
    </>
  )
}

export default GoodleMergeForm