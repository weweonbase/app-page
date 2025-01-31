import { NumberInput } from '@mantine/core'
import Image from 'next/image'
import React, { useState } from 'react'
import { encodePacked, Hex, toBytes } from 'viem'
import { Button, Card, Typography } from '~/components/common'
import { dogica } from '~/fonts'
import { cn } from '~/utils'
import MergeCompleteModal from './MergeCompleteModal'
import { FailTXModal } from '~/components/common/FailTXModal'
import { useAccount } from 'wagmi'
import { useTokenBalance } from '~/hooks/useTokenBalance'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import * as dn from "dnum"
import MergeProcessingModal from './MergeProcessingModal'
import { ethers, formatUnits } from 'ethers'
import { useMemeEaterCapsInfo, useMemeEaterIsPaused, useMemeEaterMerklInfo, useMemeEaterRate, useMemeGetTotalWeWe, useVestingsInfo } from '~/hooks/useMemeEater'
import { MergeConfig } from '~/constants/mergeConfigs'
import { WEWE_COINGECKO_ID } from '~/constants'
import { useCoinGeckoGetPrice } from '~/hooks/useCoingeckoGetPrice';
import { padHex } from 'viem';
import { StandardMerkleTree } from '@openzeppelin/merkle-tree';
import { HoverCard, Group } from '@mantine/core';
import { InfoIconFill } from '~/components/common/Icons'

interface MemeMergeFormProps {
  mergeConfig: MergeConfig;
}

function checkIsValidProof({
  merkleRoot,
  proof,
  amount,
  address,
}: {
  merkleRoot?: string,
  proof?: string[],
  amount?: string,
  address?: Hex,
}) {
  if (merkleRoot === padHex('0x0', { size: 32 })) {
    return true;
  }

  if (!merkleRoot || !proof || !amount || !address) {
    return false;
  }

  return StandardMerkleTree.verify(merkleRoot, ['address', 'uint'], [address, amount], proof);
}

const MemeMergeForm = ({ mergeConfig }: MemeMergeFormProps) => {
  const { refetch: refetchVestings, mergedAmount } = useVestingsInfo(mergeConfig.eaterContractAddress);
  const [amount, setAmount] = useState("");
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [hash, setHash] = useState<Hex>();
  const { rate, isLoading: isRateLoading } = useMemeEaterRate(mergeConfig.eaterContractAddress);
  const { isPaused } = useMemeEaterIsPaused(mergeConfig.eaterContractAddress);
  const { isLoading: isMerklInfoLoading, merkleRoot, whitelistData } = useMemeEaterMerklInfo(mergeConfig.eaterContractAddress, mergeConfig.inputToken.address);
  const { totalMerged, maxSupply } = useMemeEaterCapsInfo(mergeConfig.eaterContractAddress);


  const isWhitelisted = !isConnected ? true : checkIsValidProof({
    merkleRoot,
    proof: whitelistData?.whitelistInfo.proof,
    amount: whitelistData?.whitelistInfo.amount,
    address: whitelistData?.whitelistInfo.address,
  });

  const { data: tokenPrices, isLoading: isTokenPriceLoading } = useCoinGeckoGetPrice([mergeConfig.tokenCoinGeckoId, WEWE_COINGECKO_ID]);
  const inputTokenPrice = tokenPrices?.[0] ?? 0;
  const weweTokenPrice = tokenPrices?.[1] ?? 0;

  const amountBigNumber = ethers.parseUnits(amount || "0", mergeConfig.inputToken.decimals);

  const { data: balanceMeme, refetch: refetchBalance } = useTokenBalance(
    address,
    mergeConfig.inputToken.address,
  );

  const remainingCap = maxSupply - totalMerged;

  const remainedAmountToMerge = BigInt(whitelistData?.whitelistInfo.amount ?? 0) > 0 ? BigInt(whitelistData?.whitelistInfo.amount || 0) - mergedAmount : 0n;
  const maxAmountToMerge = remainedAmountToMerge > balanceMeme ?
      balanceMeme : remainedAmountToMerge;

  const handleSelect = (div: number) => {
    setAmount(dn.toString(dn.div([maxAmountToMerge, mergeConfig.inputToken.decimals], div)))
  };

  const handleMerge = () => {
    isConnected ? setIsProcessing(true) : openConnectModal?.()
  }

  const { totalWeWe, isLoading: isTotalWeWeLoading } = useMemeGetTotalWeWe(mergeConfig.eaterContractAddress, amountBigNumber);

  const claimableAmount = dn.format([totalWeWe, 18], { locale: "en", digits: 2 });

  return (
    <>
      {
        !isWhitelisted ? (
          <Card>
            <Typography secondary size="sm">
              Your address is <span className="text-yellow">not whitelisted</span> for the merge!
            </Typography>
          </Card>
        ) : null
      }
      <div className="bg_light_dark flex items-center justify-between gap-3 p-4 mt-5">
        <div className="flex-1 flex items-center gap-1">
          <Image className="rounded-full" src={mergeConfig.inputToken.icon} width={32} height={32} alt="" />
          <Typography secondary size="sm">
            {mergeConfig.inputToken.symbol}
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
            WEWE
          </Typography>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 mt-5">
        <div className="flex-1">
          <div className="grid grid-cols-11  md:bg-black items-center justify-between md:justify-normal gap-3">
            <div className="col-span-5 flex-1 flex items-center gap-3">
              <div className="flex flex-col">
                <NumberInput
                  classNames={{
                    root: "w-full md:w-full",
                    input: cn(
                      dogica.className,
                      "bg_light_dark md:p-4 p-0 text-white text-lg h-auto border-transparent rounded-none lg:w-[20.8rem] disabled:opacity-100 disabled:text-white"
                    ),
                  }}
                  hideControls
                  value={amount}
                  allowNegative={false}
                  trimLeadingZeroesOnBlur
                  thousandSeparator
                  onChange={(value) => setAmount(String(value))}
                />
                {
                  amountBigNumber > remainingCap ? (
                    <div className="text-red-400 text-sm">
                      Amount is greater than remaining cap({dn.format([remainingCap, mergeConfig.inputToken.decimals], { locale: "en", digits: 2 })}).
                    </div>
                  ) : null
                }
                <div className="text_light_gray">
                  {isTokenPriceLoading ? (
                    <Typography size="sm" className="animate-pulse md:py-4 p-0">
                      Calculating...
                    </Typography>
                  ) : (
                    <Typography size="sm" className="md:py-4 p-0">
                      ${dn.format(dn.mul(dn.from(amount || "0", mergeConfig.inputToken.decimals), inputTokenPrice), { locale: "en", digits: 6 })}
                    </Typography>
                  )}
                </div>
              </div>

            </div>
            <div className="col-span-6 items-center flex-1  md:flex-none flex justify-end gap-3">
              {!isRateLoading && (
                <div className="overflow-x-auto">
                  {
                    isTotalWeWeLoading ? (
                      <Typography size="sm" className="animate-pulse md:py-4 p-0 text_light_gray">
                        Calculating...
                      </Typography>
                    ) : (
                      <div className="flex flex-col">
                        <Typography size="md" className="md:py-4 p-0 text-right">
                          {claimableAmount} WEWE
                        </Typography>
                        <div className="text-right text_light_gray">
                          {isTokenPriceLoading ? (
                            <Typography size="sm" className="animate-pulse md:py-4 p-0">
                              Calculating...
                            </Typography>
                          ) : (
                            <Typography size="sm" className="md:py-4 p-0">
                              ${dn.format(dn.mul(dn.from([totalWeWe, 18]), weweTokenPrice), { locale: "en", digits: 6 })}
                            </Typography>
                          )}
                        </div>
                      </div>
                    )
                  }
                </div>
              )}
            </div>
          </div>

          <div className="w-full flex items-center gap-4 mt-3">
            <div>
              <Group justify="center">
                <HoverCard width={280} withArrow keepMounted radius={0} position="top" classNames={{ dropdown: "bg_light_dark" }}>
                  <HoverCard.Target>
                    <div className="flex">
                      <Typography size="xs" className="text_light_gray">
                        Can Merge: 
                      </Typography>
                      <InfoIconFill size={16} />
                    </div>
                  </HoverCard.Target>
                  <HoverCard.Dropdown >
                    <div>
                      <div className="flex flex-col gap-1 border-b py-2">
                        <span className="text-sm">
                          Whitelisted Tokens:
                        </span>
                        <span className="font-bold">
                        {dn.format([BigInt(whitelistData?.whitelistInfo.amount || "0"), mergeConfig.inputToken.decimals], { locale: "en", digits: 6 })}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1 border-b py-2">
                        <span className="text-sm">
                          Already Merged:
                        </span>
                        <span className="font-bold">
                        {dn.format([mergedAmount, mergeConfig.inputToken.decimals], { locale: "en", digits: 6 })}
                        </span>
                      </div>

                      <div className="flex flex-col gap-1 py-2">
                        <span className="text-sm">
                          Wallet Balance:
                        </span>
                        <span className="font-bold">
                          {dn.format([balanceMeme, mergeConfig.inputToken.decimals], { locale: "en", digits: 6 })}
                        </span>
                      </div>
                    </div>
                  </HoverCard.Dropdown>
                </HoverCard>
              </Group>

              <Typography size="xs" className="text_light_gray">
                {Math.trunc(
                  Number(formatUnits(maxAmountToMerge, mergeConfig.inputToken.decimals))
                ).toLocaleString("en-US")}
              </Typography>
            </div>
            <div className="flex gap-3 items-center">
              <button
                className="bg_light_dark px-3 py-2"
                onClick={() => handleSelect(4)}
              >
                <Typography size="xs">25%</Typography>
              </button>
              <button
                className="bg_light_dark px-3 py-2"
                onClick={() => handleSelect(2)}
              >
                <Typography size="xs">50%</Typography>
              </button>
              <button
                className="bg_light_dark px-3 py-2"
                onClick={() => handleSelect(1)}
              >
                <Typography size="xs">MAX</Typography>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full sm:w-auto ">
          <div className="flex-1 flex flex-col sm:flex-row items-center gap-3 ">
            <Button
              className="flex items-center justify-center gap-3 w-full md:w-auto md:h-[62px]"
              disabled={
                mergeConfig.isMergeDisabled ||
                !address ||
                Number(amount) === 0 ||
                isPaused ||
                !isWhitelisted ||
                isMerklInfoLoading ||
                amountBigNumber > remainingCap ||
                remainedAmountToMerge === 0n
              }
              onClick={
                isConnected
                  ? () => handleMerge()
                  : () => openConnectModal && openConnectModal()
              }
            >
              <Typography secondary size="sm" fw={700} tt="uppercase">
                MERGE🔥
              </Typography>
            </Button>
          </div>
        </div>
      </div>
      {
        isProcessing && (
          <MergeProcessingModal
            opened={isProcessing}
            data={{
              amountToMerge: amountBigNumber < balanceMeme ? amountBigNumber.toString() : balanceMeme.toString(),
              whitelistedAmount: whitelistData?.whitelistInfo.amount || "0",
              token: mergeConfig.inputToken,
              eater: mergeConfig.eaterContractAddress,
              uniAdapter: mergeConfig.uniAdaptorAddress,
              proof: whitelistData?.whitelistInfo.proof || [],
            }}
            onTxError={(hash) => {
              setHash(hash)
              setIsFailed(true)
              setIsProcessing(false)
            }}
            onClose={() => {
              setIsProcessing(false)
            }}
            onMergeSuccess={hash => {
              setHash(hash)
              setIsProcessing(false)
              setIsComplete(true)
              refetchBalance()

            }}
            onOpen={() => { }} />
        )
      }
      <FailTXModal
        hash={hash as Hex}
        opened={isFailed}
        onClose={() => {
          setIsFailed(false)
          setHash(undefined)
        }} />

      <MergeCompleteModal
        key="merge-complete-modal"
        mergeConfig={mergeConfig}
        hash={hash as Hex}
        ratio={rate}
        onClose={() => {
          setAmount("")
          setIsComplete(false)
          refetchVestings()
        }}
        opened={isComplete}
      />

    </>
  )
}

export default MemeMergeForm;
