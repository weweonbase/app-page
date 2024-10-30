import Image from "next/image";
import { Loader, ModalRootProps, Modal as MtModal } from "@mantine/core";
import { Button, Typography } from "~/components/common";
import * as dn from "dnum";
import { Hex } from "viem";

type MergeCompleteModalProps = {
  hash: Hex;
  amount?: string;
  ratio: bigint;
  inputToken: "BRO" | "bBRO";
  onClose: () => void;
} & ModalRootProps;

export const MergeCompleteModal = (props: MergeCompleteModalProps) => {
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
            successfully merged
          </Typography>
          <div className="my-2 mb-10 flex justify-center gap-2 md:my-5">
            <Typography size="md" fw={600}>
              Ratio: 1
            </Typography>
            <Image
              src={
                props.inputToken === "BRO"
                  ? "/img/tokens/bro.svg"
                  : "/img/tokens/bbro.svg"
              }
              width={17}
              height={17}
              alt="BRO logo"
            />

            <Typography size="md" fw={600}>
              ≈ {dn.format([props.ratio, 2], { locale: "en" })}
            </Typography>

            <Image
              src="/img/tokens/wewe.svg"
              width={17}
              height={17}
              alt="WEWE logo"
            />
          </div>
          <div className="flex items-center justify-center gap-2">
            <img src="/img/tokens/wewe.svg" alt="WEWE logo" />
            <div className="flex flex-col">
              {props.amount ? (
                <>
                  <Typography size="sm" className="text_light_gray">
                    CLAIMED
                  </Typography>
                  <Typography size="md" className="font-bold">
                    {props.amount}
                  </Typography>
                </>
              ) : (
                <Loader />
              )}
            </div>
          </div>
          <Image
            src="/videos/bro-merge-animation.gif"
            width={272}
            height={152}
            alt="BRO merge animation"
            className="w-full"
          />
          <div className="flex flex-col gap-2">
            <Button className="w-full" onClick={props.onClose}>
              <Typography secondary size="md" fw={700} tt="uppercase">
                completed
              </Typography>
            </Button>

            <Button
              className="border-1 w-full border border-white !bg-black !bg-none"
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
