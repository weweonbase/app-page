import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Button, Card, Dropdown, Typography } from "~/components/common";
import { usePoolContext } from "./PoolContext";
import { Divider, NumberInput } from "@mantine/core";
import clsx from "clsx";
import { verdana } from "~/fonts";
import { CONTRACT_ADDRESSES, TOKEN_LIST } from "~/constants";
import { useTokenBalance } from "~/hooks/useTokenBalance";
import { useAccount } from "wagmi";
import RangeSlider from "~/components/common/RangeSlider";
import { ethers } from "ethers";
import { useGetPrices } from "~/hooks/useGetPrices";
import { WewePosition } from "~/hooks/useWewePositions";
import { PoolChartCard } from "./PoolChartCard";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { formatNumber } from "~/utils";

import { Hex } from "viem";
import { useVaultTotalSupply } from "~/hooks/useVaultTotalSupply";
import { useVaultInfo } from "~/hooks/useVaultInfo";
import * as dn from "dnum";

import ActionNav from "./ActionNav";
import ZapInSection from "./ZapInSection";
import ZapOutSection from "./ZapOutSection";
import Switch from "~/components/common/Switch";

type Action = "deposit" | "withdraw";

type PoolDepositProps = {
  onBack: () => void;
  onDeposit: (token0: number, token1: number) => void;
  onWithdraw: (sharesAmount: bigint) => void;
  onZapIn: (tokenAmount: string, tokenAddress: Hex) => void;
  onZapOut: (tokenAmount: string, tokenAddress: Hex) => void;
  onClaim?: (wewePositon: WewePosition) => void;
  enableClaimBlock?: boolean;
};

const PoolDeposit = ({
  onBack,
  onDeposit,
  onWithdraw,
  onZapIn,
  onZapOut,
  onClaim,
  enableClaimBlock,
}: PoolDepositProps) => {
  const { selectedPool, selectedPosition } = usePoolContext();
  const [selectedAction, setSelectedAction] = useState<Action>("deposit");
  const [sliderValue, setSliderValue] = useState<number>(50);
  const [formattedShares, setFormattedShares] = useState<number>(0);
  const [zapAmount, setZapAmount] = useState<string>("0");
  const [zapTokenAddress, setZapTokenAddress] = useState<string>("");
  const [inputValueToken0, setInputValueToken0] = useState<number>(0);
  const [inputValueToken1, setInputValueToken1] = useState<number>(0);
  const [inputTokenIndex, setInputTokenIndex] = useState(0);
  const [secondaryTokenIndex, setSecondaryTokenIndex] = useState(0);

  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { totalSupply } = useVaultTotalSupply(selectedPool);
  const { token0UnderlyingAmount, token1UnderlyingAmount } =
    useVaultInfo(selectedPool);

  const [zapInSwitch, setZapInSwitch] = useState<boolean>(false);
  const [zapOutSwitch, setZapOutSwitch] = useState<boolean>(false);

  const [zapOutAmount, setZapOutAmount] = useState<string>("0");
  const [zapOutTokenAddress, setZapOutTokenAddress] = useState<string>("");
  const [sliderZapOutValue, setSliderZapOutValue] = useState<number>(50);

  const { address } = useAccount();

  const { data: prices } = useGetPrices(
    selectedPool?.token0,
    selectedPool?.token1
  );

  // Define poolTokens containing token0 and token1
  const poolTokens = selectedPool
    ? [selectedPool.token0, selectedPool.token1]
    : [];

  useEffect(() => {
    if (selectedPool) {
      setInputTokenIndex(
        TOKEN_LIST.findIndex(
          ({ address }) => address === selectedPool?.token0?.address
        )
      );
      setSecondaryTokenIndex(
        TOKEN_LIST.findIndex(
          ({ address }) => address === selectedPool?.token1?.address
        )
      );
      // Reset zapTokenAddress to the first token's address when pool changes
      setZapTokenAddress(poolTokens[0]?.address || "");
      setZapOutTokenAddress(poolTokens[0]?.address || "");
    }
  }, [selectedPool]);

  const { data: balanceToken0, refetch: refechToken0Balance } = useTokenBalance(
    address,
    TOKEN_LIST.find(
      (token) =>
        selectedPool?.token0?.address.toLowerCase() ===
        token.address.toLowerCase()
    )?.address
  );

  const { data: balanceToken1, refetch: refechToken1Balance } = useTokenBalance(
    address,
    TOKEN_LIST.find(
      (token) =>
        selectedPool?.token1?.address.toLowerCase() ===
        token.address.toLowerCase()
    )?.address
  );

  const { data: balanceShares, refetch: refechShares } = useTokenBalance(
    address,
    selectedPool?.address
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      refechToken1Balance();
      refechToken0Balance();
      refechShares();
      if (zapTokenAddress || zapOutTokenAddress) {
        refetchZapTokenBalance();
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const formatShare0 = (share: number) => {
    if (!share) {
      return 0;
    }

    return totalSupply
      ? dn.format(
          dn.mul(
            dn.div(
              [token0UnderlyingAmount, selectedPool?.token0.decimals || 18],
              [totalSupply, 18]
            ),
            formattedShares
          ),
          { locale: "en", digits: 6 }
        )
      : 0;
  };

  const formatShare1 = (share: number) => {
    if (!share) {
      return 0;
    }

    return totalSupply
      ? dn.format(
          dn.mul(
            dn.div(
              [token1UnderlyingAmount, selectedPool?.token1.decimals || 18],
              [totalSupply, 18]
            ),
            formattedShares
          ),
          { locale: "en", digits: 6 }
        )
      : 0;
  };

  const disableDepositButton = (selectedPool: any): boolean => {
    if (!selectedPool) {
      return true;
    }

    if (!inputValueToken1) {
      return true;
    }

    return (
      BigInt(
        ethers.parseUnits(
          String(inputValueToken1.toFixed(selectedPool.token1?.decimals) || 0),
          selectedPool.token1?.decimals
        )
      ) > balanceToken1
    );
  };

  useEffect(() => {
    if (prices && selectedPool) {
      const resultToken0 = (BigInt(sliderValue) * balanceToken0) / BigInt(100);
      const resultShares = (BigInt(sliderValue) * balanceShares) / BigInt(100);

      const resultToken1 = (BigInt(sliderValue) * balanceToken1) / BigInt(100);

      const formattedToken0 = Number(
        ethers.formatUnits(resultToken0, selectedPool?.token0.decimals)
      );
      const formattedShares = Number(ethers.formatUnits(resultShares, 18));

      const formattedToken1 = Number(
        ethers.formatUnits(resultToken1, selectedPool?.token1.decimals)
      );

      const token1Equivalent =
        (formattedToken0 * prices.priceToken0) / prices.priceToken1;
      const token0Equivalent =
        (formattedToken1 * prices.priceToken1) / prices.priceToken0;

      const walletToken0 = Number(
        ethers.formatUnits(balanceToken0, selectedPool?.token0.decimals)
      );

      const walletToken1 = Number(
        ethers.formatUnits(balanceToken1, selectedPool?.token1.decimals)
      );

      if (
        (prices.priceToken0 * walletToken0) / prices.priceToken1 <
        walletToken1
      ) {
        setInputValueToken0(formattedToken0);
        setFormattedShares(formattedShares);
        setInputValueToken1(token1Equivalent);
      } else {
        setInputValueToken1(formattedToken1);
        setFormattedShares(formattedShares);
        setInputValueToken0(token0Equivalent);
      }

      if (zapInSwitch) {
        const selectedZapToken = poolTokens.find(
          (token) => token.address === zapTokenAddress
        );
        const selectedZapTokenBalanceFormatted = Number(
          ethers.formatUnits(
            selectedZapTokenBalance || BigInt(0),
            selectedZapToken?.decimals
          )
        );
        const newZapAmount =
          (sliderValue / 100) * selectedZapTokenBalanceFormatted;
        setZapAmount(newZapAmount.toFixed(selectedZapToken?.decimals));
      }

      if (zapOutSwitch) {
        const resultShares =
          (BigInt(sliderZapOutValue) * balanceShares) / BigInt(100);
        const selectedZapToken = poolTokens.find(
          (token) => token.address === zapOutTokenAddress
        );
        const selectedZapTokenBalanceFormatted = Number(
          ethers.formatUnits(
            selectedZapOutTokenBalance || BigInt(0),
            selectedZapToken?.decimals
          )
        );
        const newZapAmount = Number(ethers.formatUnits(resultShares, 18));
        setZapOutAmount(newZapAmount.toFixed(selectedZapToken?.decimals));
      }
    }
  }, [
    prices,
    sliderValue,
    sliderZapOutValue,
    balanceToken0,
    selectedPool,
    selectedAction,
    zapTokenAddress,
    zapOutTokenAddress,
    zapInSwitch,
    zapOutSwitch,
  ]);

  const handleChangeToken0 = (newValue: number) => {
    if (prices) {
      const token1Equivalent =
        (newValue * prices.priceToken0) / prices.priceToken1;
      setInputValueToken0(newValue);
      setInputValueToken1(Number(token1Equivalent.toFixed(6)));
    }
  };

  const handleChangeToken1 = (newValue: number) => {
    if (prices) {
      const token0Equivalent =
        (newValue * prices.priceToken1) / prices.priceToken0;
      setInputValueToken1(newValue);
      setInputValueToken0(Number(token0Equivalent.toFixed(6)));
    }
  };

  const { data: selectedZapTokenBalance, refetch: refetchZapTokenBalance } =
    useTokenBalance(address, zapTokenAddress as Hex, {
      enabled: !!zapTokenAddress,
    });

  const {
    data: selectedZapOutTokenBalance,
    refetch: refetchZapOutTokenBalance,
  } = useTokenBalance(address, zapOutTokenAddress as Hex, {
    enabled: !!zapOutTokenAddress,
  });

  const handleZapTokenChange = (selectedAddress: string) => {
    setZapTokenAddress(selectedAddress);
    setZapAmount("0");
    setSliderValue(50);
  };

  const handleZapOutTokenChange = (selectedAddress: string) => {
    setZapOutTokenAddress(selectedAddress);
  };

  const handleWithdraw = () => {
    if (!isConnected) {
      openConnectModal && openConnectModal();
      return;
    }
    try {
      const sharesInBigNumber = ethers.parseUnits(
        formattedShares.toString(),
        18
      );
      onWithdraw(
        sharesInBigNumber > balanceShares ? balanceShares : sharesInBigNumber
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    selectedPool && (
      <>
        <Card>
          <div className=" w-full min-h-[10rem] ">
            <div className="sm:py-4  flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <button onClick={onBack}>
                  <Typography secondary size="xl">
                    {"<"}
                  </Typography>
                </button>
                <div className="flex items-center">
                  <Image
                    src={selectedPool?.token0?.icon}
                    width={24}
                    height={24}
                    alt=""
                  />
                  <Image
                    src={selectedPool?.token1?.icon}
                    width={24}
                    height={24}
                    className="-translate-x-1.5"
                    alt=""
                  />
                </div>
                <Typography
                  secondary
                  size="lg"
                  className="font-bold"
                  tt="uppercase"
                >
                  {selectedPool.type}
                </Typography>
              </div>
              <div></div>
              <div className="lg:text-right flex flex-col gap-2">
                <Typography size="xs" ta="center" className="text_light_gray">
                  APR
                </Typography>
                <Typography size="lg" className="font-extrabold">
                  {selectedPool.apr}%
                </Typography>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 flex-wrap py-4 sm:py-1">
              <div className="flex items-center gap-2 max-w-full">
                <Image
                  src="/img/icons/memes.svg"
                  width={20}
                  height={20}
                  alt=""
                />
                <Typography size="xs" className="break-words line-clamp-1">
                  {selectedPool.address}
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
                  INFINITY
                </Typography>
              </div>
            </div>
            <Divider className="border-blue-700 mt-4" />
            {enableClaimBlock && (
              <div className="mt-10">
                <div className="flex gap-20 justify-center mb-5">
                  <div>
                    <div className="flex items-center justify-center">
                      <Typography size="xs" className="font-bold mr-2">
                        PENDING REWARDS
                      </Typography>
                      <Image
                        src="/img/tokens/rewards.svg"
                        alt=""
                        width={24}
                        height={24}
                      />
                    </div>
                    <Typography
                      size="lg"
                      className="font-bold py-4 text-center"
                    >
                      {formatNumber(selectedPosition?.pendingChaosReward || 0, {
                        decimalDigits: 6,
                      })}
                    </Typography>
                  </div>

                  <div>
                    <div className="flex items-center justify-center">
                      <Typography size="xs" className="font-bold mr-2">
                        PENDING FEES
                      </Typography>
                      <Image
                        src="/img/tokens/usdc.png"
                        alt=""
                        width={24}
                        height={24}
                      />
                    </div>
                    <Typography
                      size="lg"
                      className="font-bold py-4 text-center"
                    >
                      $
                      {formatNumber(selectedPosition?.pendingUsdcReward || 0, {
                        decimalDigits: 6,
                      })}
                    </Typography>
                  </div>
                </div>
                <button
                  className="custom_btn w-full uppercase"
                  onClick={() =>
                    selectedPosition && onClaim && onClaim(selectedPosition)
                  }
                >
                  <Typography size="xs" secondary>
                    Claim
                  </Typography>
                </button>
              </div>
            )}
            <div className="mt-5 flex items-center justify-between w-full gap-6 md:flex-row flex-col">
              <ActionNav
                selectedAction={selectedAction}
                setSelectedAction={setSelectedAction}
              />
            </div>
            <div></div>
            {selectedAction === "deposit" ? (
              <div>
                <div className="my-8">
                  <Switch
                    value={zapInSwitch}
                    onClick={() =>
                      setZapInSwitch((zapInSwitch) => !zapInSwitch)
                    }
                    label="ZAP IN"
                    description="Deposit in the pool with a single token. Half of your deposit will be automatically sold for the other asset in the pool ratio."
                  />
                </div>

                {!zapInSwitch ? (
                  <div>
                    <div className="mt-4">
                      <Typography>Deposit amount</Typography>
                    </div>
                    <div className="grid grid-cols-12 md:flex-row items-center justify-between gap-3">
                      <div className="bg_gray my-3 col-span-12 md:col-span-6 md:flex md:items-center md:mr-4">
                        <Dropdown
                          value={TOKEN_LIST[inputTokenIndex].address}
                          options={TOKEN_LIST.map((token, index) => ({
                            value: token.address,
                            icon: token.icon,
                            text: token.symbol,
                            index: index,
                          }))}
                          className="md:w-1/2"
                          disabled
                        />
                        <NumberInput
                          classNames={{
                            root: "md:col-span-2 col-span-6 h-full",
                            wrapper: "h-full",
                            input: clsx(
                              verdana.className,
                              "text-start bg-transparent text-white text-2xl h-auto border-transparent rounded-none"
                            ),
                          }}
                          defaultValue={inputValueToken0}
                          hideControls
                          value={inputValueToken0}
                          onChange={(value) =>
                            handleChangeToken0(value as number)
                          }
                          allowNegative={false}
                          trimLeadingZeroesOnBlur
                          thousandSeparator
                          decimalScale={6}
                        />
                      </div>
                      {/* <button className="md:col-span-2 col-span-12 flex justify-center">
                      <Image src="/img/icons/swapwewe.svg" alt="" width={36} height={36} />
                    </button> */}
                      <div className="bg_gray my-3 col-span-12 md:col-span-6 md:flex md:items-center md:ml-4">
                        <Dropdown
                          value={TOKEN_LIST[secondaryTokenIndex].address}
                          options={TOKEN_LIST.map((token, index) => ({
                            value: token.address,
                            icon: token.icon,
                            text: token.symbol,
                            index: index,
                          }))}
                          className="md:w-1/2"
                          disabled
                        />
                        <NumberInput
                          classNames={{
                            root: "md:col-span-2 col-span-6 h-full",
                            wrapper: "h-full",
                            input: clsx(
                              verdana.className,
                              "text-start bg-transparent text-white text-2xl h-auto border-transparent rounded-none"
                            ),
                          }}
                          defaultValue={inputValueToken1}
                          hideControls
                          value={inputValueToken1}
                          onChange={(value) =>
                            handleChangeToken1(value as number)
                          }
                          allowNegative={false}
                          trimLeadingZeroesOnBlur
                          thousandSeparator
                          decimalScale={6}
                        />
                      </div>
                    </div>
                    <div className="py-4">
                      <RangeSlider
                        min={0}
                        max={100}
                        value={Number(sliderValue)}
                        onChange={(e) => setSliderValue(Number(e.target.value))}
                      />
                    </div>
                    <div className="flex items-center justify-evenly text_light_gray">
                      <div className="flex items-center gap-2">
                        <Image
                          alt=""
                          src="/img/icons/wallet.svg"
                          width={24}
                          height={24}
                        />
                        <Typography size="xs">
                          {formatNumber(
                            ethers.formatUnits(
                              balanceToken0,
                              selectedPool?.token0.decimals
                            ),
                            {
                              decimalDigits: 6,
                            }
                          )}{" "}
                          {selectedPool?.token0.symbol}
                        </Typography>
                      </div>
                      <div className="flex items-center gap-2">
                        <Image
                          alt=""
                          src="/img/icons/wallet.svg"
                          width={24}
                          height={24}
                        />
                        <Typography size="xs">
                          {formatNumber(
                            ethers.formatUnits(
                              balanceToken1,
                              selectedPool?.token1.decimals
                            ),
                            {
                              decimalDigits: 6,
                            }
                          )}{" "}
                          {selectedPool?.token1.symbol}
                        </Typography>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 font-extrabold text-black text-sm">
                      <Button
                        className="bg_turq"
                        onClick={() => setSliderValue(50)}
                      >
                        <Typography secondary size="xs" fw={700} tt="uppercase">
                          50%
                        </Typography>
                      </Button>
                      <Button
                        className="bg_turq"
                        onClick={() => setSliderValue(100)}
                      >
                        <Typography secondary size="xs" fw={700} tt="uppercase">
                          MAX
                        </Typography>
                      </Button>
                    </div>
                    <Button
                      disabled={disableDepositButton(selectedPool) || false}
                      className="w-full mt-4"
                      onClick={
                        isConnected
                          ? () => {
                              onDeposit(inputValueToken0, inputValueToken1);
                              setSliderValue(50);
                            }
                          : () => openConnectModal && openConnectModal()
                      }
                    >
                      <Typography secondary tt="uppercase">
                        {disableDepositButton(selectedPool)
                          ? "Not Enough Balance / No Value"
                          : "Deposit"}
                      </Typography>
                    </Button>
                  </div>
                ) : (
                  <ZapInSection
                    zapAmount={zapAmount}
                    setZapAmount={setZapAmount}
                    zapTokenAddress={zapTokenAddress}
                    handleZapTokenChange={handleZapTokenChange}
                    selectedZapTokenBalance={selectedZapTokenBalance}
                    poolTokens={poolTokens}
                    sliderValue={sliderValue}
                    setSliderValue={setSliderValue}
                    onZapIn={onZapIn}
                    isConnected={isConnected}
                    openConnectModal={openConnectModal}
                  />
                )}
              </div>
            ) : (
              <div className="mt-5">
                <div className="my-8">
                  <Switch
                    value={zapOutSwitch}
                    onClick={() =>
                      setZapOutSwitch((zapOutSwitch) => !zapOutSwitch)
                    }
                    label="ZAP-OUT"
                    description="Withdraw from the pool into one token. The other pool token will be sold for the desired coin."
                  />
                </div>
                {!zapOutSwitch ? (
                  <>
                    <Typography>Withdraw amount</Typography>
                    <div className="bg_gray my-3 flex items-center gap-4">
                      <Dropdown
                        value={selectedPool.address}
                        options={[
                          {
                            value: selectedPool.address,
                            icon: "/img/tokens/shares.png",
                            text: "SHARES",
                            index: 0,
                          },
                        ]}
                        className="md:col-span-3 col-span-6 w-fit "
                        disabled
                      />
                      <NumberInput
                        classNames={{
                          root: "flex-1 w-auto",
                          input: clsx(
                            verdana.className,
                            "text-start bg-transparent text-white text-2xl h-auto border-transparent rounded-none"
                          ),
                        }}
                        onChange={(value) =>
                          setFormattedShares(value as number)
                        }
                        defaultValue="0"
                        value={formattedShares}
                        decimalScale={8}
                        hideControls
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center justify-center gap-5">
                        <div className="flex items-center gap-2">
                          <Image
                            src={selectedPool?.token0.icon}
                            height={20}
                            width={20}
                            alt=""
                          />
                          <Typography secondary>{formatShare0}</Typography>
                        </div>
                        <div className="flex items-center gap-2">
                          <Image
                            src={selectedPool?.token1.icon}
                            height={20}
                            width={20}
                            alt=""
                          />
                          <Typography secondary>{formatShare1}</Typography>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-2 py-3">
                        <Image
                          alt=""
                          src="/img/icons/wallet.svg"
                          width={24}
                          height={24}
                        />
                        <Typography size="xs" className="text_light_gray">
                          {parseFloat(
                            Number(
                              ethers.formatUnits(balanceShares.toString(), 18)
                            ).toFixed(8)
                          )}{" "}
                          SHARES
                        </Typography>
                      </div>
                    </div>
                    <div className="py-4">
                      <RangeSlider
                        min={0}
                        max={100}
                        value={Number(sliderValue)}
                        onChange={(e) => setSliderValue(Number(e.target.value))}
                      />
                    </div>
                    <div className="flex justify-end gap-4 font-extrabold text-black text-sm">
                      <Button
                        className="bg_turq"
                        onClick={() => setSliderValue(50)}
                      >
                        <Typography secondary size="xs" fw={700} tt="uppercase">
                          50%
                        </Typography>
                      </Button>
                      <Button
                        className="bg_turq"
                        onClick={() => setSliderValue(100)}
                      >
                        <Typography secondary size="xs" fw={700} tt="uppercase">
                          MAX
                        </Typography>
                      </Button>
                    </div>
                    <Button
                      onClick={handleWithdraw}
                      className="w-full mt-5 mb-2"
                    >
                      <Typography secondary>WITHDRAW</Typography>
                    </Button>
                  </>
                ) : (
                  <ZapOutSection
                    zapAmount={zapOutAmount}
                    setZapAmount={setZapOutAmount}
                    zapTokenAddress={zapOutTokenAddress}
                    handleZapTokenChange={handleZapOutTokenChange}
                    selectedZapTokenBalance={selectedZapOutTokenBalance}
                    poolTokens={poolTokens}
                    sliderValue={sliderZapOutValue}
                    setSliderValue={setSliderZapOutValue}
                    onZapOut={onZapOut}
                    isConnected={isConnected}
                    openConnectModal={openConnectModal}
                  />
                )}
              </div>
            )}
          </div>
          <Divider className="border-blue-700 mt-4" />
          <div className="p-5 my-5 flex flex-wrap items-center justify-center bg_light_dark h-full">
            <PoolChartCard address={selectedPool.address} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 my-3 gap-4 gap-y-8">
            <div className="flex flex-col items-center gap-4">
              <Typography className="text-sm sm:text-base font-extrabold">
                TVL
              </Typography>
              <Typography className="text-sm sm:text-base">
                $ {formatNumber(selectedPool.tvl)}
              </Typography>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Typography className="text-sm sm:text-base  font-extrabold">
                VOLUME
              </Typography>
              <Typography className="text-sm sm:text-base">
                $ {formatNumber(selectedPool.volume)}/day
              </Typography>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Typography className="text-sm sm:text-base  font-extrabold">
                INCENTIVES
              </Typography>
              <Typography className="text-sm sm:text-base">
                $ {selectedPool?.incentives}
              </Typography>
            </div>
            <div className="flex flex-col items-center gap-4">
              <Typography className="text-sm sm:text-base  font-extrabold line-clamp-1">
                DISTRIBUTED FEES
              </Typography>
              <Typography className="text-sm sm:text-base">
                ${" "}
                {new Intl.NumberFormat("en-US", {
                  minimumFractionDigits: 2,
                }).format(Number(selectedPool.dailyFeesInUsd))}
                /day
              </Typography>
            </div>
          </div>
        </Card>
        <Card>
          <Typography size="lg">
            When you add liquidity to an Active Pool:
          </Typography>

          <ul className="list-decimal list-inside text-sm">
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

export default PoolDeposit;
