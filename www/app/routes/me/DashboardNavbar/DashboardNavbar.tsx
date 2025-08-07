import { Group, Avatar, Text, Button, Anchor } from "@mantine/core";
import {
  IconBellRinging,
  IconSettings,
  IconLogout,
  IconKeyframesFilled,
  IconTransfer,
  IconUserSquareRounded,
  IconLifebuoy,
  IconMessage,
  IconHeartFilled,
} from "@tabler/icons-react";

import classes from "./DashboardNavbar.module.css";
import { NavLink, useLocation } from "@remix-run/react";
import cx from "clsx";
import React from "react";
import { SignOutButton } from "@clerk/remix";

const data = [
  { link: "/me/items", label: "My Items", icon: IconKeyframesFilled },
  { link: "/me/transactions", label: "Transactions", icon: IconTransfer },
  { link: "/me/favourites", label: "Favourites", icon: IconHeartFilled },
  { link: "/me/messages", label: "Messages", icon: IconMessage },
  { link: "/me/notifications", label: "Notifications", icon: IconBellRinging },
  { link: "/me/account", label: "Account", icon: IconUserSquareRounded },
  { link: "/me/settings", label: "Settings", icon: IconSettings },
];

// IconMoodPuzzled

function DashboardNavbar() {
  const location = useLocation();
  console.log(location.pathname);

  const links = data.map((item) => (
    <NavLink
      data-active={location.pathname === item.link || undefined}
      className={({ isActive, isPending }) => {
        if (isActive) {
          return cx(classes.link, classes["link-active"]);
        }
        return classes.link;
      }}
      to={item.link}
      key={item.link}
    >
      <item.icon />
      {item.label}
    </NavLink>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header}>
          <Text fw={700} fz={"h3"}>
            John Doe
          </Text>
          <Avatar radius="xl" />
        </Group>
        <div className="flex flex-col gap-1">{links}</div>
      </div>

      <div className={classes.footer}>
        <a
          href="/"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconLifebuoy className={classes.linkIcon} stroke={1.5} />
          <span>Help</span>
        </a>
        <SignOutButton>
          <Anchor
            w="100%"
            component="button"
            className={classes.link}
            onClick={(event) => event.preventDefault()}
          >
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            Logout
          </Anchor>
        </SignOutButton>
      </div>
    </nav>
  );
}

export default React.memo(DashboardNavbar);
