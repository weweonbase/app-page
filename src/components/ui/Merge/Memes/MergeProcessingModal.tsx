import React, { useEffect } from "react";
import Image from "next/image";
import { Divider, Loader, ModalRootProps } from "@mantine/core";
import { Modal, Typography } from "~/components/common";
import { useApproveToken } from "~/hooks/useApproveToken";
import { useMemeEat } from "~/hooks/useMemeEater";
import { TokenItem } from "~/models";
import { Hex } from "viem";
import { useAccount } from "wagmi";

export type PayloadMergeProcessingModal = {
  amountToMerge: string;
  token: TokenItem;
  eater: Hex;
  uniAdapter: Hex;
};

type MergeProcessingProps = {
  onClose: () => void;
  onOpen: () => void;
  onTxError: (hash?: Hex) => void;
  onMergeSuccess: (hash?: Hex) => void;
  opened: boolean;
  data: PayloadMergeProcessingModal;
} & ModalRootProps;

const MergeProcessingModal = ({
  data,
  onClose,
  onTxError,
  onMergeSuccess,
  opened,
}: MergeProcessingProps) => {
  const { address } = useAccount();

  const {
    hash: hashApproveToken,
    isPending: isPendingApproveToken,
    isConfirming: isConfirmingApproveToken,
    isError: isErrorApproveToken,
    approve: approveToken,
  } = useApproveToken();

  const {
    hash: hashEatToken,
    isPending: isPendingEatToken,
    isError: isErrorEatToken,
    eat: eat,
  } = useMemeEat(data.eater);

  useEffect(() => {
    async function startEat() {
      try {
        await approveToken(
          data.token.address,
          data.eater,
          BigInt(data.amountToMerge || "0")
        );
        await eat(data.amountToMerge);
      } catch {
        onTxError(hashEatToken || hashApproveToken);
      }
    }
    startEat();
  }, [data, address]);

  useEffect(() => {
    if (isErrorEatToken || isErrorApproveToken) {
      onTxError(hashEatToken || hashApproveToken);
    }
  }, [isErrorEatToken, isErrorApproveToken, hashEatToken, hashApproveToken]);

  const finishSuccessfully =
    hashEatToken &&
    hashApproveToken &&
    !isPendingApproveToken &&
    !isPendingEatToken &&
    !isConfirmingApproveToken;

  useEffect(() => {
    if (hashEatToken && !isPendingEatToken) {
      onMergeSuccess(hashEatToken);
    }
  }, [hashEatToken, isPendingEatToken]);

  return (
    <Modal
      title={`MERGE ${data.token.symbol} TOKENS`}
      onClose={onClose}
      opened={opened}
    >
      <div className="flex items-center gap-3">
        {isPendingApproveToken ||
        isConfirmingApproveToken ||
        !hashApproveToken ? (
          <>
            <Loader color="grey" />
            <Typography>Please Approve {data.token.symbol}</Typography>
          </>
        ) : (
          <>
            <Image src="/img/icons/success.svg" width={36} height={36} alt="" />
            <Typography>{data.token.symbol} Approved</Typography>
          </>
        )}
      </div>
      <div className="flex items-center gap-3">
        {isPendingEatToken || !hashEatToken ? (
          <>
            <Loader color="grey" />
            <Typography>Please merge tokens</Typography>
          </>
        ) : (
          <>
            <Image src="/img/icons/success.svg" width={36} height={36} alt="" />
            <Typography>Tokens merged</Typography>
          </>
        )}
      </div>
      {!isConfirmingApproveToken &&
        !isPendingEatToken &&
        !finishSuccessfully && (
          <div className="flex items-center gap-3">
            <Image src="/img/icons/inform.svg" width={36} height={36} alt="" />
            <Typography>Please sign transaction</Typography>
          </div>
        )}
      <Divider className="border-blue-700" />
      <div className="flex justify-end">
        <Typography className="text_light_gray" size="xs">
          Total fee cost: $0.10
        </Typography>
      </div>
    </Modal>
  );
};

export default MergeProcessingModal;
