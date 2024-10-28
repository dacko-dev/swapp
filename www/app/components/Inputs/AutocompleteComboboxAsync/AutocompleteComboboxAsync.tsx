import { useRef, useState } from "react";
import {
  Combobox,
  ComboboxProps,
  Loader,
  TextInput,
  TextInputProps,
  useCombobox,
} from "@mantine/core";
import { debounce } from "~/lib/utils";

// const MOCKDATA = [
//   "🍎 Apples",
//   "🍌 Bananas",
//   "🥦 Broccoli",
//   "🥕 Carrots",
//   "🍫 Chocolate",
//   "🍇 Grapes",
//   "🍋 Lemon",
//   "🥬 Lettuce",
//   "🍄 Mushrooms",
//   "🍊 Oranges",
//   "🥔 Potatoes",
//   "🍅 Tomatoes",
//   "🥚 Eggs",
//   "🥛 Milk",
//   "🍞 Bread",
//   "🍗 Chicken",
//   "🍔 Hamburger",
//   "🧀 Cheese",
//   "🥩 Steak",
//   "🍟 French Fries",
//   "🍕 Pizza",
//   "🥦 Cauliflower",
//   "🥜 Peanuts",
//   "🍦 Ice Cream",
//   "🍯 Honey",
//   "🥖 Baguette",
//   "🍣 Sushi",
//   "🥝 Kiwi",
//   "🍓 Strawberries",
// ];

// function getAsyncData(searchQuery: string, signal: AbortSignal) {
//   return new Promise<string[]>((resolve, reject) => {
//     signal.addEventListener("abort", () => {
//       reject(new Error("Request aborted"));
//     });

//     setTimeout(() => {
//       resolve(
//         MOCKDATA.filter((item) =>
//           item.toLowerCase().includes(searchQuery.toLowerCase())
//         ).slice(0, 5)
//       );
//     }, Math.random() * 1000);
//   });
// }

export function AutocompleteComboboxAsync({
  textInputProps,
  comboboxProps,
  onSubmitOption,
  getAsyncData,
}: {
  textInputProps?: TextInputProps;
  comboboxProps?: ComboboxProps;
  onSubmitOption?: (optionValue: string) => void;
  getAsyncData: (query: string, signal: AbortSignal) => Promise<string[]>;
}) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string[] | null>(null);
  const [value, setValue] = useState("");
  const [empty, setEmpty] = useState(false);
  const abortController = useRef<AbortController>();

  const fetchOptions = (query: string) => {
    abortController.current?.abort();
    abortController.current = new AbortController();
    setLoading(true);

    getAsyncData(query, abortController.current.signal)
      .then((result) => {
        setData(result);
        setLoading(false);
        setEmpty(result.length === 0);
        abortController.current = undefined;
      })
      .catch(() => {});
  };

  const debouncedFetchOptions = debounce(fetchOptions, 400);

  const options = (data || []).map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        setValue(optionValue);
        if (onSubmitOption) {
          onSubmitOption(optionValue);
        }
        combobox.closeDropdown();
      }}
      withinPortal={false}
      store={combobox}
      {...comboboxProps}
    >
      <Combobox.Target>
        <TextInput
          value={value}
          onChange={(event) => {
            const query = event.currentTarget.value;
            setValue(query);
            // TODO: debounce
            // fetchOptions(event.currentTarget.value);
            if (query.length > 1) {
              debouncedFetchOptions(query);
            }
            combobox.resetSelectedOption();
            combobox.openDropdown();
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => {
            combobox.openDropdown();
            if (data === null) {
              fetchOptions(value);
            }
          }}
          onBlur={() => combobox.closeDropdown()}
          rightSection={loading && <Loader size={18} />}
          {...textInputProps}
        />
      </Combobox.Target>

      <Combobox.Dropdown hidden={data === null}>
        <Combobox.Options>
          {options}
          {empty && <Combobox.Empty>No results found</Combobox.Empty>}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
