import { MantineStyleProp } from "@mantine/core";
import { DateValue, MonthPickerInput } from "@mantine/dates";

import classess from "./MonthInput.module.css";

// TODO: add focus on input
export default function MonthInput({
  label,
  disabled,
  error,
  placeholder,
  onChange,
  value = null,
  style,
}: {
  label?: string;
  error?: React.ReactNode;
  disabled?: boolean;
  placeholder?: string;
  onChange?: ((value: DateValue) => void) | undefined;
  value?: DateValue | undefined;
  style?: MantineStyleProp;
}) {
  return (
    <MonthPickerInput
      valueFormat="MMMM"
      disabled={disabled}
      error={error}
      size="md"
      label={label}
      placeholder={placeholder}
      allowDeselect
      clearable
      value={value}
      ariaLabels={{
        nextDecade: "Next decade",
        previousDecade: "Previous decade",
      }}
      classNames={{
        calendarHeader: classess.calendarHeader,
      }}
      onChange={onChange}
      style={style}
    />
  );
}
