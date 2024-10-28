import { MantineStyleProp } from "@mantine/core";
import { DateValue, YearPickerInput } from "@mantine/dates";

export default function YearInput({
  label,
  placeholder,
  error,
  maxYear,
  minYear,
  onChange,
  value = null,
  style,
}: {
  label?: string;
  placeholder?: string;
  error?: React.ReactNode;
  maxYear: number;
  minYear: number;
  onChange?: (value: DateValue) => void | undefined;
  value?: DateValue | undefined;
  style?: MantineStyleProp;
}) {
  return (
    <YearPickerInput
      label={label}
      placeholder={placeholder}
      error={error}
      minDate={minYear ? new Date(minYear, 1) : undefined}
      maxDate={maxYear ? new Date(maxYear, 1) : undefined}
      allowDeselect
      clearable
      value={value}
      ariaLabels={{
        nextDecade: "Next decade",
        previousDecade: "Previous decade",
      }}
      onChange={onChange}
      style={style}
      size="md"
    />
  );
}
