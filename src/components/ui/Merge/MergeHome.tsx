"use client";

import { Text } from "@mantine/core";
import Image from "next/image";
import { Button, Card } from "~/components/common";
import { dogica, verdana } from "~/fonts";

export const MergeHome = () => {
  return (
    <>
      <Card>
        <div className="md:flex items-center justify-between gap-3 text-center md:text-start  ">
          <Text size="xl" className="uppercase">
            MERGE NOW
          </Text>
          <Text size="xl">🔥 🔥 🔥</Text>
        </div>
        <Text
          size="sm"
          className="verdana uppercase pt-4 text-center md:text-start"
        >
          Forever merge your coins
        </Text>
      </Card>

      <Card className="flex flex-col gap-5">
        <div className="bg-gray-900 flex items-center justify-between gap-3 p-4">
          <div className="flex-1 flex items-center gap-3">
            <Image src="/img/tokens/wewe.png" width={32} height={32} alt="" />
            <Text size="md">WEWE</Text>
          </div>
          <Image
            src="/img/icons/arrow_right.svg"
            width={16}
            height={16}
            alt=""
          />
          <div className="flex-1 flex items-center justify-end gap-3">
            <Image src="/img/tokens/vult.svg" width={32} height={32} alt="" />
            <Text size="md">VULT</Text>
          </div>
        </div>

        <div
          className={`${verdana.className} w-full sm:w-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3`}
        >
          <div>
            <div className="flex items-center gap-3">
              <Image src="/img/tokens/wewe.png" width={24} height={24} alt="" />
              <Text size="md">WEWE</Text>
            </div>
            <div className="flex items-center gap-3 pt-3">
              <Text size="xs">1,616,522 WEWE</Text>
              <Image
                src="/img/icons/arrow_right1.svg"
                width={19}
                height={9}
                alt=""
              />
              <Text size="xs">Max: 1,650.52 VULT</Text>
            </div>
          </div>

          <Button className="w-full sm:w-auto">
            <Text
              size="sm"
              fw={700}
              className={`uppercase ${dogica.className}`}
            >
              Merge
            </Text>
          </Button>
        </div>
      </Card>

      <Card>
        <Text size="lg" className={verdana.className}></Text>

        <ul
          className={`list-decimal list-inside pt-3 ${verdana.className} text-sm`}
        >
          <li>Click MERGE to burn your $WEWE and receive $VULT</li>
          <li>Starting price is 1,000 $WEWE to 1 $VULT, but this will rise</li>
          <li>Your $VULT will be locked until the public launch</li>
        </ul>
      </Card>
    </>
  );
};
