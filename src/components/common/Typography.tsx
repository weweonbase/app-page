import clsx from "clsx";
import { Text, TextProps } from "@mantine/core";
import { dogica, verdana } from "~/fonts";
import { truncateValues } from "~/utils";

type TypographyProps = {
  secondary?: boolean;
  truncate?: boolean;
  children: any;
} & TextProps;

export const Typography = ({
  secondary,
  className,
  truncate,
  children,
  ...props
}: TypographyProps) => {
  return (
    <Text
      className={clsx(
        secondary ? dogica.className : verdana.className,
        className
      )}
      {...props}
    >
      {truncate ? truncateValues(children) : children}
    </Text>
  );
};
