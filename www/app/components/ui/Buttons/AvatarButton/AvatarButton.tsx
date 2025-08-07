import { Avatar, AvatarProps, PolymorphicComponentProps } from "@mantine/core";
import React, { forwardRef } from "react";

export interface AvatarButtonProps
  extends PolymorphicComponentProps<"button", AvatarProps> {
  image?: string;
  name?: string;
}

const AvatarButton = forwardRef<HTMLButtonElement, AvatarButtonProps>(
  ({ image, name, ...others }: AvatarButtonProps, ref) => (
    <Avatar
      variant="gradient"
      size={"md"}
      name={name}
      ref={ref}
      component="button"
      src={image}
      radius="xl"
      {...others}
    />
  )
);
AvatarButton.displayName = "AvatarButton";

export default React.memo(AvatarButton);
