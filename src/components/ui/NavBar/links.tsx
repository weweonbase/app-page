import { ChaosIconFill, EarnIcon, MergeIcon, PoolIcon, SwapIcon } from "~/components/common/Icons";

export const PAGE_LINKS = [
  {
    icon: ({ className }: { className?: string }) => (
      <SwapIcon
        className={className}
      />
    ),
    text: "Swap",
    href: "/swap",
  },
  {
    icon: ({ className }: { className?: string }) => (
      <PoolIcon
        className={className}
      />
    ),
    text: "Pools",
    href: "/pools",
  },

  {
    icon: ({ className }: { className?: string }) => (
      <MergeIcon
        className={className}
      />
    ),
    text: "Merge",
    href: "/merge",
  },
  {
    icon: ({ className }: { className?: string }) => (
      <ChaosIconFill
        className={className}
      />
    ),
    text: "Chaos",
    href: "/chaos",
  }
];
