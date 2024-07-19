import { Divider, Modal, ModalRootProps, Text } from "@mantine/core";
import Image from "next/image";
import { Button } from "~/components/common";

export const PoolAddModal = (props: ModalRootProps) => {
  return (
    <Modal.Root centered {...props}>
      <Modal.Overlay />
      <Modal.Content classNames={{ content: "bg-black text-white p-6" }}>
        <Modal.Header className="bg-transparent p-0">
          <div className="w-full flex items-center justify-between pb-3">
            <Modal.Title>
              <Text size="lg" className="uppercase">
                Add liquidity
              </Text>
            </Modal.Title>
            <Modal.CloseButton className="text-white !bg-transparent" />
          </div>
        </Modal.Header>

        <Modal.Body className="flex flex-col gap-5 p-0">
          <Divider className="border-blue-800" />

          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Text size="xs" className="verdana">
                START WEWE
              </Text>
              <div className="flex items-center gap-2">
                <Text size="xs" fw={700} className="verdana">
                  0.428156
                </Text>
                <Image
                  src="/img/tokens/wewe.png"
                  width={40}
                  height={40}
                  alt=""
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Text size="xs" className="verdana">
                END USDC
              </Text>
              <div className="flex items-center gap-2">
                <Text size="xs" fw={700} className="verdana">
                  0.001079432
                </Text>
                <Image
                  src="/img/tokens/usdc.png"
                  width={40}
                  height={40}
                  alt=""
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Text size="xs" className="verdana">
                END WEWE
              </Text>
              <div className="flex items-center gap-2">
                <Text size="xs" fw={700} className="verdana">
                  0.001079432
                </Text>
                <Image
                  src="/img/tokens/weth.png"
                  width={40}
                  height={40}
                  alt=""
                />
              </div>
            </div>
          </div>

          <Divider className="border-blue-800" />

          <div className="flex items-center justify-between">
            <Text size="xs" className="verdana">
              Refund
            </Text>
            <Text size="xs" className="verdana">
              Estimated ammount
            </Text>
          </div>

          <Button className="w-full" onClick={props.onClose}>
            <Text size="md">Add Liquidity</Text>
          </Button>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
};
