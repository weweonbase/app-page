import { BuildData, RouteData, RouterMessageType } from "~/models";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { ERC20Abi } from "~/lib/abis";
import { Chain, CONTRACT_ADDRESSES } from "~/constants";
import { Button, Typography } from "~/components/common";
import { useEffect } from "react";
import { useSwapContext } from "./SwapContext";
import api from "~/api/swap";
type SwapButtonProps = {};

export const SwapButton = (props: SwapButtonProps) => {
  const {
    swapState,
    setSwapState,
    routeData,
    swapSlippage,
    setEncodedData,
    openSwapModal,
  } = useSwapContext();
  const { address, chain } = useAccount();
  const { data: allowance, refetch } = useReadContract({
    address: routeData?.inputToken.address,
    abi: ERC20Abi,
    functionName: "allowance",
    args: [address, CONTRACT_ADDRESSES.kyberSwapAgg],
  });
  const {
    data: writeContractResult,
    writeContractAsync: writeContract,
    error: approveError,
  } = useWriteContract();

  const { data: approvalReceiptData, isLoading: isApproving } =
    useWaitForTransactionReceipt({
      hash: writeContractResult,
    });

  const handleApprove = async () => {
    await writeContract({
      address: routeData!.inputToken.address,
      abi: ERC20Abi,
      functionName: "approve",
      args: [
        CONTRACT_ADDRESSES.kyberSwapAgg,
        BigInt(routeData!.routeSummary!.amountIn),
      ],
    });
  };

  const handleBuild = () => {
    api.router
      .build(Chain.BASE, routeData!.routeSummary, address!, swapSlippage)
      .then((res) => {
        setSwapState({ ...swapState, loading: false });
        const data = res.data;
        if (data.message == RouterMessageType.Succussful) {
          setSwapState({ ...swapState, approved: true });
          setEncodedData(data.data as BuildData);
          openSwapModal();
        } else {
          setSwapState({ ...swapState, approved: false });
          setEncodedData(undefined);
        }
      })
      .catch((err) => {
        console.log("err:", err);
        setSwapState({ ...swapState, approved: false, loading: false });
        setEncodedData(undefined);
      });
  };
  useEffect(() => {
    refetch();
  }, [approvalReceiptData]);

  return (
    <>
      {allowance==undefined || ((allowance as bigint) >= BigInt(routeData!.routeSummary.amountIn)) ? (
        <>
          <Button
            className="w-full"
            disabled={!routeData}
            onClick={handleBuild}
          >
            <Typography secondary size="md" fw={700} tt="uppercase">
              Swap
            </Typography>
          </Button>
        </>
      ) : (
        <>
          <Button
            className="w-full"
            disabled={isApproving || !routeData}
            onClick={handleApprove}
          >
            <Typography secondary size="md" fw={700} tt="uppercase">
              {isApproving
                ? "Approving..."
                : ` Approve ${routeData!.inputToken.symbol}`}
            </Typography>
          </Button>
        </>
      )}
    </>
  );
};
