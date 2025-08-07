import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useRef } from "react";

export default function Searchbar() {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <TextInput
      ref={inputRef}
      aria-label="Search for items"
      type="search"
      w={"100%"}
      radius={"xl"}
      placeholder="Search for items"
      leftSection={
        <IconSearch
          onClick={() => {
            inputRef.current?.focus();
          }}
          style={{ width: 20, height: 20 }}
        />
      }
    />
  );
}
