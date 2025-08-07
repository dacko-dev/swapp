import { useUser } from "@clerk/remix";
import { Avatar, Loader, Menu, rem, Stack } from "@mantine/core";
import {
  IconKeyframesFilled,
  IconMessageCircle,
  IconPhoto,
  IconSettings,
  IconShoppingBag,
  IconTransfer,
} from "@tabler/icons-react";
import React, { forwardRef } from "react";
import AvatarButton, {
  AvatarButtonProps,
} from "~/components/ui/Buttons/AvatarButton/AvatarButton";
import LoginButton from "~/components/ui/Buttons/LoginButton/LoginButton";
import SignOutButton from "~/components/ui/Buttons/SignOutButton/SignOutButton";
import SignupButton from "~/components/ui/Buttons/SignupButton/SignupButton";
import optimizeAvatar from "~/lib/utils";

export default function AvatarMenuButton({
  ...props
}: {
  props?: AvatarButtonProps;
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  return (
    <Menu trigger="hover" openDelay={100} shadow="md" width={200}>
      <Menu.Target>
        {isLoaded ? (
          <AvatarButton
            name={user?.username || undefined}
            image={optimizeAvatar(user?.imageUrl)}
            {...props}
          />
        ) : (
          <Avatar>
            <Loader size="xs" />
          </Avatar>
        )}
        {/* <Avatar component="button" name="John Doe" />; */}
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item
          component="a"
          href="/me/settings"
          leftSection={
            <IconSettings style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Settings
        </Menu.Item>
        <Menu.Item
          component="a"
          href="/me/messages"
          leftSection={
            <IconMessageCircle style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Messages
        </Menu.Item>
        <Menu.Item
          component="a"
          href="/me/transactions"
          leftSection={
            <IconTransfer style={{ width: rem(14), height: rem(14) }} />
          }
        >
          Transactions
        </Menu.Item>
        <Menu.Item
          component="a"
          href="/me/items"
          leftSection={
            <IconKeyframesFilled style={{ width: rem(14), height: rem(14) }} />
          }
        >
          My Items
        </Menu.Item>

        <Menu.Divider />
        {isSignedIn ? (
          <SignOutButton />
        ) : (
          <Stack gap={"4"}>
            <LoginButton
              style={{
                width: "100%",
              }}
            />
            <SignupButton
              style={{
                width: "100%",
              }}
            />
          </Stack>
        )}
      </Menu.Dropdown>
    </Menu>
  );
}
