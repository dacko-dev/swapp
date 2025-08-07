/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Stack,
  TextInput,
  Select,
  TagsInput,
  Button,
  Collapse,
  Flex,
  Textarea,
  Text,
  Box,
  ComboboxData,
} from "@mantine/core";
import { DropzoneImages } from "~/components/ui/Buttons/DropzoneImages/DropzoneImages";
import TextEditor from "~/components/TextEditor/TextEditor";
import { UseFormReturnType } from "@mantine/form";
import React, { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import ColorPicker from "~/components/inputs/ColorPicker/ColorPicker";
import { TFormNewItem, TSerializedItemFormData } from "~/lib/types";
import CityAutocomplete from "./CityAutocomplete/CityAutocomplete";
import AutocompleteCombobox from "./AutocompleteCombobox/AutocompleteCombobox";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import YearInput from "~/components/inputs/YearInput/YearInput";
import MonthInput from "~/components/inputs/MonthInput/MonthInput";
import { DayOfMonthInput } from "~/components/inputs/DayOfMonthInput/DayOfMonthInput";
import { MAX_ITEM_IMAGES, MAX_ITEM_IMAGES_SIZE_BYTES } from "~/lib/constants";
import { bytesToNumberSize, bytesToReadableSize } from "~/lib/utils";
import CountryAutocompleteAsync from "./CountryAutocompleteAsync/CountryAutocompleteAsync";

function ItemForm({
  GRAPHQL_ENDPOINT,
  form, // Mantine form
  itemFormData,
  noDescription = false,
  geoapifyApkiKey,
  imagesInputId,
}: {
  GRAPHQL_ENDPOINT: string;
  form: UseFormReturnType<TFormNewItem>;
  itemFormData: TSerializedItemFormData;
  noDescription?: boolean;
  geoapifyApkiKey: string;
  imagesInputId?: string;
}) {
  const [opened, { toggle }] = useDisclosure(false);
  const {
    // Brand: brands,
    Category: categories,
    Color: colors,
    Condition: conditions,
    Country: countries,
    City: cities,
    Size: sizes,
    Subcategory: subcategories,
  } = { ...itemFormData };

  const [sizeData, setSizeData] = useState<ComboboxData | undefined>([]);
  const imagesFilelist = form.getValues().images;
  const imagesSizeMb = imagesFilelist
    ? bytesToNumberSize({
        bytes: Array.from(imagesFilelist).reduce(
          (acc, file) => acc + file.size,
          0
        ),
        toSizeType: "MB",
      })
    : null;

  // ANCHOR TODO: fix subcategory select displaying reseted value, unless clicked and blured
  form.watch("categoryId", ({ previousValue, value }) => {
    if (form.getValues().subcategoryId && previousValue !== value) {
      form.setValues({
        subcategoryId: "",
      });
      form.getInputNode("subcategoryId")?.focus();
      form.getInputNode("subcategoryId")?.click();
      form.getInputNode("subcategoryId")?.blur();
    }
  });

  form.watch("subcategoryId", ({ value, previousValue }) => {
    const hasSubcategoriesChanged = value !== previousValue && value;
    if (hasSubcategoriesChanged) {
      const newSizeData = subcategories
        .find((subcategory) => String(subcategory.id) === value)
        ?.SizeSubcategories.map((size) => {
          // return String(size.sizeId);
          return {
            value: String(size.sizeId),
            label:
              sizes.find((s) => s.id === size.sizeId)?.value +
              " " +
              sizes.find((s) => s.id === size.sizeId)?.unit,
          };
        });
      setSizeData(newSizeData);
      form.getInputNode("sizeId")?.focus();
      form.getInputNode("sizeId")?.click();
      form.getInputNode("sizeId")?.blur();
    }
  });

  return (
    <Box>
      <Stack gap={"xl"}>
        <TextInput
          size="md"
          label="Name"
          placeholder="Item name"
          key={form.key("name")}
          name="name"
          {...form.getInputProps("name")}
        />
        <Select
          error={form.errors.categoryId}
          size="md"
          maxDropdownHeight={200}
          withScrollArea={true}
          label="Category"
          data={
            categories
              ? categories.map((category) => {
                  return {
                    value: String(category.id),
                    label: category.name,
                  };
                })
              : []
          }
          name="categoryId"
          {...form.getInputProps("categoryId")}
        />
        <Select
          error={form.errors.subcategoryId}
          size="md"
          maxDropdownHeight={200}
          withScrollArea={true}
          label="Subcategory"
          data={
            form.getValues().categoryId
              ? subcategories
                  .filter(
                    (subcategory) =>
                      String(subcategory.categoryId) ===
                      form.getValues().categoryId
                  )
                  .map((subcategory) => {
                    return {
                      value: String(subcategory.id),
                      label: subcategory.name,
                    };
                  })
              : []
          }
          name="subcategoryId"
          {...form.getInputProps("subcategoryId")}
        />
        <TagsInput
          clearable={true}
          {...form.getInputProps("tags")}
          size="md"
          label="Press Enter to submit a tag"
          placeholder="Enter tag"
          name="tags"
          error={form.errors.tags}
          defaultValue={[]}
        />
        <Select
          maxDropdownHeight={200}
          withScrollArea={true}
          error={form.errors.sizeId}
          size="md"
          label="Size"
          placeholder="Size"
          data={sizeData}
          name="sizeId"
          {...form.getInputProps("sizeId")}
        />

        <Select
          error={form.errors.conditionId}
          maxDropdownHeight={200}
          withScrollArea={true}
          size="md"
          label="Condition"
          data={
            conditions
              ? conditions.map((condition) => {
                  return {
                    value: String(condition.id),
                    label: condition.name,
                  };
                })
              : []
          }
          name="conditionId"
          {...form.getInputProps("conditionId")}
        />

        <Stack gap={2}>
          <Text
            style={{
              fontWeight: 500,
              fontSize: "var(--input-label-size, var(--mantine-font-size-md))",
            }}
            component="label"
          >
            Main Color
          </Text>
          <ColorPicker
            error={form.errors.mainColorId}
            allColors={colors}
            onClick={(color) => form.setFieldValue("mainColorId", color.id)}
            selectedColor={colors.find(
              (color) => color.id === form.getValues().mainColorId
            )}
          />
          <input
            type="hidden"
            name="mainColorId"
            {...form?.getInputProps("mainColorId")}
          />
        </Stack>

        <Flex
          display="flex"
          direction={{
            xs: "column",
            sm: "row",
          }}
          gap={"lg"}
          w={"100%"}
          align="flex-end"
        >
          <CountryAutocompleteAsync
            GRAPHQL_ENDPOINT={GRAPHQL_ENDPOINT}
            form={form}
            onSubmitOption={(optionValue) => {
              form.setFieldValue("shippingFromCountryName", optionValue);
            }}
          />

          <input
            type="hidden"
            name="shippingFromCountryId"
            {...form.getInputProps("shippingFromCountryId")}
          />

          <CityAutocomplete
            comboboxProps={{
              disabled: !form.getValues().shippingFromCountryName,
            }}
            inputProps={{
              // ...form.getInputProps("shippingFromCityName"),
              label: "Shipping From City",
              placeholder: "City of shipping",
              w: "100%",
              error: form.errors.shippingFromCityId,
              name: "shippingFromCityName",
              size: "md",
            }}
            geoapifyApkiKey={geoapifyApkiKey}
            form={form}
            cities={cities}
            selectedCountry={String(
              countries.find(
                (country) =>
                  String(country.name) ===
                  form.getValues().shippingFromCountryName
              )?.iso
            ).toLowerCase()}
          />

          <input
            name="shippingFromCityId"
            type="hidden"
            {...form.getInputProps("shippingFromCityId")}
          />
        </Flex>

        <Text fz={"md"} fw={"bold"}>
          Want to add more details?
          <Button
            style={{
              marginLeft: "10px",
            }}
            size="compact-sm"
            onClick={toggle}
            rightSection={opened ? <IconChevronUp /> : <IconChevronDown />}
          >
            {opened ? "Hide" : "Show"}
          </Button>
        </Text>
        <Collapse in={opened}>
          <Stack gap={"lg"}>
            <TextInput
              label="Model"
              size="md"
              placeholder="Model"
              key={form.key("model")}
              name="model"
              {...form.getInputProps("model")}
            />

            <Stack gap={0}>
              <Text
                style={{
                  fontWeight: 500,
                  fontSize:
                    "var(--input-label-size, var(--mantine-font-size-md))",
                }}
                component="label"
              >
                Manufactury Date
              </Text>
              <Flex
                style={{
                  width: "100%",
                  flexWrap: "wrap",
                }}
                gap={"lg"}
              >
                <YearInput
                  placeholder="Year"
                  maxYear={new Date().getFullYear()}
                  minYear={1900}
                  error={form.errors.manufacturyDateYear}
                  onChange={(date) =>
                    form.setFieldValue(
                      "manufacturyDateYear",
                      date?.getFullYear()
                    )
                  }
                  value={
                    form.getValues().manufacturyDateYear !== undefined
                      ? new Date(form.getValues().manufacturyDateYear!, 1)
                      : undefined
                  }
                  style={{
                    flexGrow: 1,
                    // width: "100%",
                  }}
                />
                <input
                  type="hidden"
                  {...form.getInputProps("manufacturyDateYear")}
                />
                <MonthInput
                  disabled={form.getValues().manufacturyDateYear === undefined}
                  placeholder="Month"
                  error={form.errors.manufacturyDateMonth}
                  value={
                    form.getValues().manufacturyDateMonth !== undefined
                      ? new Date(
                          form.getValues().manufacturyDateYear || 0,
                          form.getValues().manufacturyDateMonth!
                        )
                      : undefined
                  }
                  onChange={(date) =>
                    form.setFieldValue("manufacturyDateMonth", date?.getMonth())
                  }
                  style={{
                    // width: "100%",
                    flexGrow: 1,
                    calendarHeader: {
                      display: "none",
                    },
                  }}
                />
                <input
                  type="hidden"
                  {...form.getInputProps("manufacturyDateMonth")}
                />
                <DayOfMonthInput
                  excludeDate={(date) => {
                    if (
                      form.getValues().manufacturyDateYear ===
                        date.getFullYear() ||
                      form.getValues().manufacturyDateMonth === date.getMonth()
                    ) {
                      return false;
                    }
                    return true;
                  }}
                  placeholder="Day"
                  disabled={form.getValues().manufacturyDateMonth === undefined}
                  value={
                    form.getValues().manufacturyDateDay !== undefined
                      ? new Date(
                          form.getValues().manufacturyDateYear || 0,
                          form.getValues().manufacturyDateMonth || 0,
                          form.getValues().manufacturyDateDay
                        )
                      : undefined
                  }
                  date={
                    form.getValues().manufacturyDateYear !== undefined &&
                    form.getValues().manufacturyDateMonth !== undefined
                      ? new Date(
                          form.getValues().manufacturyDateYear || 0,
                          form.getValues().manufacturyDateMonth || 0
                        )
                      : undefined
                  }
                  onChange={(date) =>
                    form.setFieldValue("manufacturyDateDay", date?.getDate())
                  }
                  error={form.errors.manufacturyDateDay}
                  style={{
                    flexGrow: 1,
                    // width: "100%",
                  }}
                />
                <input
                  type="hidden"
                  {...form.getInputProps("manufacturyDateDay")}
                />
              </Flex>
            </Stack>
            <TextInput
              label="Brand"
              size="md"
              placeholder="Brand"
              key={form.key("brand")}
              name="brand"
              {...form.getInputProps("brand")}
            />
            <Select
              clearable={true}
              label="Made in"
              size="md"
              placeholder="Country"
              searchable
              key={form.key("madeInCountryId")}
              data={
                countries
                  ? countries.map((country) => {
                      return {
                        value: String(country.id),
                        label: country.name,
                      };
                    })
                  : []
              }
              name="madeInCountryId"
              {...form.getInputProps("madeInCountryId")}
            />
          </Stack>
        </Collapse>
        <Textarea
          label="Quick Info"
          size="md"
          description="Short info about the item that will be displayed on the item card"
          placeholder="Info..."
          key={form.key("quickInfo")}
          name="quickInfo"
          {...form.getInputProps("quickInfo")}
        />
        {/* Extra Info */}

        <Stack gap={0}>
          <Text
            style={{
              fontWeight: 500,
              fontSize: "var(--input-label-size, var(--mantine-font-size-md))",
            }}
            component="label"
            htmlFor="imagesDropzone"
          >
            Images{" "}
            {imagesFilelist && imagesFilelist.length > 0 && (
              <span>
                ({imagesFilelist.length} of {MAX_ITEM_IMAGES})
              </span>
            )}
          </Text>
          <Flex gap={4}>
            <Text size="sm" c="dimmed">
              Up to {MAX_ITEM_IMAGES} images, files should not exceed{" "}
              {bytesToReadableSize({
                bytes: MAX_ITEM_IMAGES_SIZE_BYTES,
                toSizeType: "MB",
                round: true,
              })}{" "}
              MB{" "}
            </Text>
            {imagesFilelist && imagesFilelist.length > 0 && (
              <Text
                size="sm"
                c={
                  imagesSizeMb &&
                  imagesSizeMb >
                    bytesToNumberSize({
                      bytes: MAX_ITEM_IMAGES_SIZE_BYTES,
                      toSizeType: "MB",
                    })
                    ? "var(--mantine-color-error)"
                    : "dimmed"
                }
              >
                ({imagesSizeMb?.toFixed(2)} MB)
              </Text>
            )}
          </Flex>
          <DropzoneImages
            wrapperProps={{
              className: "mt-1",
            }}
            id={imagesInputId ? imagesInputId : "imagesDropzone"}
            name="images"
            form={form}
          />
          {form.errors.images && (
            <Text mt={"sm"} c="var(--mantine-color-error)" size="sm">
              {form.errors.images}
            </Text>
          )}
        </Stack>

        {noDescription ? null : (
          <Stack gap={0}>
            <Text
              style={{
                fontWeight: 500,
                fontSize:
                  "var(--input-label-size, var(--mantine-font-size-md))",
              }}
              component="label"
              htmlFor="description"
            >
              Description
            </Text>
            <TextEditor
              debounceTime={650}
              onUpdate={(content) => form.setFieldValue("description", content)}
              initialContent={form.getValues().description}
            />
            <input
              type="hidden"
              name="description"
              {...form.getInputProps("description")}
            />
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

export default React.memo(ItemForm);
