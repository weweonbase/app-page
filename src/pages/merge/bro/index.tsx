"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, Typography } from "~/components/common";
import { BBroMergeForm } from "~/components/ui/Merge/Bro/BBroMergeForm";
import { BroMergeForm } from "~/components/ui/Merge/Bro/BroMergeForm";
import { CONTRACT_ADDRESSES } from "~/constants";
import { useEaterRate } from "~/hooks/useEater";
import * as dn from "dnum";
import { useTokenBalance } from "~/hooks/useTokenBalance";
import dayjs from "dayjs";

const startDateTimeStamp = 1728288000000;
const endDateTimeStamp = 1733472000000;

const BroMergePage = () => {
  const { rate: broEaterRate } = useEaterRate(CONTRACT_ADDRESSES.broEater);
  const { rate: bbroEaterRate } = useEaterRate(CONTRACT_ADDRESSES.bbroEater);

  const { data: broContractBalance } = useTokenBalance(CONTRACT_ADDRESSES.broEater, CONTRACT_ADDRESSES.wewe);
  const { data: bbroContractBalance } = useTokenBalance(CONTRACT_ADDRESSES.bbroEater, CONTRACT_ADDRESSES.wewe);

  const remainingDays = dayjs(endDateTimeStamp).diff(dayjs(), "day");
  const remainingMinutes = dayjs(endDateTimeStamp).diff(dayjs(), "minute");

  return (
    <div className="gap-5 grid grid-cols-12">
      <div className="md:col-span-8 col-span-12 gap-3 xl:w-[45rem] h-[100%]">
        <Card>
          <div className="md:flex items-center justify-between gap-3 text-center md:text-start">
            <Link href="/merge">
              <Typography secondary size="xl" tt="uppercase">
                <span>{"<"}</span>  MERGE NO&ensp;W
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
          <div className="flex flex-col my-5">
            <Typography size="lg">MERGE your BRO into WEWE</Typography>

            <ul className="list-decimal list-inside pt-3 text-sm text_light_gray">
              <li>Merge your $BRO to grab your $WEWE</li>
              <li>
                Fixed Rate of 1 $BRO to {dn.format([broEaterRate, 2], { locale: "en" })} $WEWE.
              </li>
              <li>Your can Merge $BRO from {dayjs(startDateTimeStamp).format("DD/MM/YY")} to {dayjs(endDateTimeStamp).format("DD/MM/YY")}</li>
            </ul>
          </div>
        </Card>

        <Card className="border-t-0 py-10">
          <BroMergeForm />
        </Card>

        <Card className="border-t-0">
          <div className="flex flex-col my-5">
            <Typography size="lg">MERGE your bBRO into WEWE</Typography>

            <ul className="list-decimal list-inside pt-3 text-sm text_light_gray">
              <li>Merge your $bBRO to grab your $WEWE</li>
              <li>
                Fixed Rate of 1 $bBRO to {dn.format([bbroEaterRate, 2], { locale: "en" })} $WEWE.
              </li>
              <li>Your can Merge $bBRO from {dayjs(startDateTimeStamp).format("DD/MM/YY")} to {dayjs(endDateTimeStamp).format("DD/MM/YY")}</li>
            </ul>
          </div>
        </Card>

        <Card className="border-t-0 py-10">
          <BBroMergeForm />
        </Card>
      </div>

      <div className="flex flex-col justify-between md:col-span-4 col-span-12 md:order-2 order-1">
        <Card className="flex flex-col items-center py-10 h-unset md:h-[544px] justify-between">
          <div className="flex flex-col items-center">
            <Typography
              size="sm"
              secondary
              className="font-black text-yellow">
              COUNTDOWN
            </Typography>

            <Typography
              size="lg"
              secondary
              className="font-bold my-8">
              {remainingDays > 0 ? `${remainingDays} DAYS` : remainingMinutes > 0 ? `${Math.floor(remainingMinutes / 60)} H ${remainingMinutes % 60} MIN` : "Merge completed"}
            </Typography>
          </div>

          <div className="flex flex-col items-center mb-5">
            <div className="flex justify-center gap-2 md:mb-4 mb-5">
              <Typography size="md" fw={600}>
                Ratio: 1
              </Typography>
              <Image
                src="/img/tokens/bro.svg"
                width={17}
                height={17}
                alt="BRO Logo"
              />

              <Typography size="md" fw={600}>
                ≈ {dn.format([broEaterRate, 2], { locale: "en" })}
              </Typography>

              <Image
                src="/img/tokens/wewe.svg"
                width={17}
                height={17}
                alt="WEWE Logo"
              />
            </div>
          </div>


          <div className="flex flex-col items-center">
            <Typography
              secondary
              size="sm"
              className="text-yellow font-black my-4"
            >
              AVAILABLE $WEWE:
            </Typography>

            <Typography
              secondary
              size="sm"
              className="font-black"
            >
              {dn.format([broContractBalance, 18], { locale: "en", digits: 0 })}
            </Typography>

          </div>

        </Card>

        <Card className="flex flex-col items-center py-10 h-unset justify-between md:h-[270px]">
          <div className="flex flex-col items-center mb-5">
            <div className="flex justify-center gap-2 md:mb-4 mb-5">
              <Typography size="md" fw={600}>
                Ratio: 1
              </Typography>
              <Image
                src="/img/tokens/bbro.svg"
                width={17}
                height={17}
                alt="bBRO Logo"
              />

              <Typography size="md" fw={600}>
                ≈ {dn.format([bbroEaterRate, 2], { locale: "en" })}
              </Typography>

              <Image
                src="/img/tokens/wewe.svg"
                width={17}
                height={17}
                alt="WEWE Logo"
              />
            </div>
          </div>


          <div className="flex flex-col items-center">
            <Typography
              secondary
              size="sm"
              className="text-yellow font-black my-4"
            >
              AVAILABLE $WEWE:
            </Typography>

            <Typography
              secondary
              size="sm"
              className="font-black"
            >
              {dn.format([bbroContractBalance, 18], { locale: "en", digits: 0 })}
            </Typography>

          </div>

        </Card>
      </div>
    </div>
  );
}

export default BroMergePage;
