"use client";
import Image from "next/image";
import { Divider, Modal as MtModal, ModalRootProps } from "@mantine/core";
import { Typography } from "~/components/common/Typography";
import { Button } from "~/components/common/Button";
import { BuildData, TokenItem } from "~/models";
import { formatEther, Hex } from "viem";

type MergeCompleteProps = {
  hash: Hex;
  amount: string;
  ratio: bigint
  onClose: () => void;
} & ModalRootProps;

export const MergeCompleteModal = (props: MergeCompleteProps) => {
  const handleDetails = () => {
    window.open(
      `https://basescan.org/tx/${props.hash}`,
      "_blank",
      "noopener,noreferrer"
    );
  };
  return (
    <MtModal.Root centered {...props}>
      <MtModal.Overlay />
      <MtModal.Content
        classNames={{ content: "bg-black border_stroke text-white p-6" }}
      >
        <MtModal.Body className="flex flex-col gap-5 p-0">
          <div className="flex flex-col items-center">
            <img
              src="/img/icons/check.svg"
              className="w-[76px]"
              alt="succesful"
            />
          </div>

          <Typography
            secondary
            size="xs"
            tt="uppercase"
            className="text_light_gray"
            ta="center"
          >
            successfuly merged
          </Typography>
          <div className="flex justify-center gap-2 md:my-5 my-2 md:mb-5 mb-10">
            <Typography size="md" fw={600}>
              Ratio: 1000
            </Typography>
            <Image
              src="/img/tokens/wewe.svg"
              width={17}
              height={17}
              alt="Vult"
            />

            <Typography size="md" fw={600}>
              ≈ {Number(formatEther(props.ratio)).toLocaleString()}
            </Typography>

            <Image
              src="/img/tokens/vult-border.svg"
              width={17}
              height={17}
              alt="Vult"
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <img
              src="/img/tokens/vult.base.svg"
              alt="Vult"
            />
            <div className="flex flex-col">
              <Typography size="md" fw={700}>
                {/* ${Number(encodedData!.amountOutUsd).toFixed(2)} */}
                {props.amount}
              </Typography>
              <Typography size="xs" className="text_light_gray">
                {/* US$ {Number(encodedData!.gasUsd).toFixed(2)} estimated fees */}
                US$ 0.00 estimated fees
              </Typography>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button className="w-full" onClick={props.onClose}>
              <Typography secondary size="md" fw={700} tt="uppercase">
                completed
              </Typography>
            </Button>

            <Button
              className="w-full bg-black border border-1 border-white"
              onClick={handleDetails}
            >
              <Typography secondary size="md" fw={700} tt="uppercase">
                view details
              </Typography>
            </Button>
          </div>
        </MtModal.Body>
      </MtModal.Content>
    </MtModal.Root>
  );
};
