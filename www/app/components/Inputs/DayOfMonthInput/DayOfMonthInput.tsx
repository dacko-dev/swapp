import { MantineStyleProp } from "@mantine/core";
import { DatePickerInput, DateValue } from "@mantine/dates";

import classess from "./DayOfMonthInput.module.css";

// TODO: add focus on input
export function DayOfMonthInput({
  minDate,
  maxDate,
  label,
  disabled,
  date,
  error,
  placeholder,
  onChange,
  excludeDate,
  value = null,
  style,
}: {
  minDate?: Date | undefined;
  maxDate?: Date | undefined;
  label?: string;
  error?: React.ReactNode;
  date?: Date | undefined;
  disabled?: boolean;
  placeholder?: string;
  excludeDate?: ((date: Date) => boolean) | undefined;
  onChange?: ((value: DateValue) => void) | undefined;
  value?: DateValue | undefined;
  style?: MantineStyleProp;
}) {
  return (
    <DatePickerInput
      hideOutsideDates
      excludeDate={excludeDate}
      minDate={minDate}
      maxDate={maxDate}
      allowDeselect
      clearable
      error={error}
      size="md"
      valueFormat="DD"
      label={label}
      disabled={disabled}
      style={style}
      placeholder={placeholder}
      value={value}
      date={date}
      classNames={{
        calendarHeader: classess.calendarHeader,
      }}
      // date={value ? new Date(value.getFullYear(), value.getMonth()) : undefined}
      onChange={onChange}
    />
  );
}
