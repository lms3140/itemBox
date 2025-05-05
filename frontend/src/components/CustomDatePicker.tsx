import { Locale } from "date-fns";
import DatePicker from "react-datepicker";
import styled from "styled-components";

const CalendarWrapper = styled.div`
  .react-datepicker__header {
    h2,
    div {
      color: ${({ theme }) => theme.colors.text};
    }
    background-color: ${({ theme }) => theme.colors.bg};
  }
  .react-datepicker__month {
    margin: 0;
    padding: 0.4rem;
    background-color: ${({ theme }) => theme.colors.fg.active};
  }
  .react-datepicker__day {
    color: ${({ theme }) => theme.colors.text};
    &:hover {
      background-color: ${({ theme }) => theme.colors.hover};
    }
    &:active {
      background-color: ${({ theme }) => theme.colors.primary};
    }
  }
  .react-datepicker__day--keyboard-selected,
  .react-datepicker__day--selected {
    background-color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
  }
`;
const ErrorMessage = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.error};
`;

type TCustomDatePickerProps = {
  locale: Locale;
  selected: Date | undefined;
  onChange: (
    date: Date | null,
    event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>
  ) => void;
  onBlur: React.FocusEventHandler<HTMLElement>;
  placeholder: string;
  msg?: string;
};

function CustomDatePicker({
  locale,
  onBlur,
  onChange,
  placeholder,
  selected,
  msg,
}: TCustomDatePickerProps) {
  return (
    <CalendarWrapper>
      <DatePicker
        autoComplete="off"
        locale={locale}
        dateFormat={"yyyy-MM-dd"}
        selected={selected}
        onChange={onChange}
        onBlur={onBlur}
        placeholderText={placeholder}
      />
      <ErrorMessage>{msg}</ErrorMessage>
    </CalendarWrapper>
  );
}

export default CustomDatePicker;
