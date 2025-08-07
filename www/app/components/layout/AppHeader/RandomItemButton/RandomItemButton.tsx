import { ActionIcon, Tooltip } from "@mantine/core";
import { IconDice5 } from "@tabler/icons-react";

export default function RandomItemButton() {
  return (
    <Tooltip label="Random item" openDelay={300}>
      <ActionIcon
        variant="default"
        size="lg"
        aria-label="Random Item"
        radius="xl"
      >
        <IconDice5 size={20} />
      </ActionIcon>
    </Tooltip>
  );
}
