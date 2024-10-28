import { ActionIcon, Button, Popover, Stack } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";

export default function NewWantedItemButtonPopover({
  disabled,
  onNewItemClick,
}: // onExistingItemClick,
{
  disabled: boolean;
  onNewItemClick: () => void;
  // onExistingItemClick?: () => void;
}) {
  const [addButtonPopoverOpened, setAddButtonPopoverOpened] = useState(false);
  const ref = useClickOutside(() => setAddButtonPopoverOpened(false));
  return (
    <Popover
      opened={addButtonPopoverOpened}
      disabled={disabled}
      withArrow
      position="bottom"
      clickOutsideEvents={["mouseup", "touchend"]}
    >
      <Popover.Target>
        <ActionIcon
          onClick={() => setAddButtonPopoverOpened((prev) => !prev)}
          disabled={disabled}
        >
          <IconPlus />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack ref={ref}>
          <Button
            component="button"
            onClick={() => {
              setAddButtonPopoverOpened(false);
              onNewItemClick();
            }}
            disabled={disabled}
            fullWidth
          >
            New Item
          </Button>
          <Button
            onClick={() => {
              setAddButtonPopoverOpened(false);
              notifications.show({
                title: "Wip!",
                message:
                  "This feature is not implemented yet, but I'm working hard on it!",
              });
            }}
            disabled={disabled}
            fullWidth
          >
            Existing Item
          </Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
