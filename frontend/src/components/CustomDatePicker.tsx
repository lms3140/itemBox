import { Locale } from "date-fns";
import { JSX } from "react";
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

/**
 *
 * 날짜 선택 전용 커스텀 컴포넌트
 *
 * React Hook Form과 함께 사용할 수 있도록 onChange, onBlur를 prop으로 받습니다.
 *
 * locale에 따라 언어 포맷이 다르게 적용됩니다.
 *
 * 유효성 실패시 msg를 통해 에러 메세지를 출력할 수 있습니다.
 *
 * @example React Hook Form Controller 렌더 필드 내에서 사용됩니다.
 *
 * @param {TCustomDatePickerProps} props
 * @param {Locale} props.locale - 날짜 언어 (예예: ko, enUS)
 * @param {Date | undefined} props.selected - 선택된 날짜 값
 * @param {(date: Date | null,
 *          event?: React.MouseEvent|
 *                  React.KeyboardEvent)=>void} props.onChange - 날짜 변경 이벤트 핸들러
 * @param {FocusEventHandler} props.onBlur - 포커스 아웃 이벤트 핸들러
 * @param {string} props.placeholder - placeholder 텍스트
 * @param {string} [props.msg] - 유효성 에러 메시지
 * @returns {JSX.Element}
 */
function CustomDatePicker({
  locale,
  onBlur,
  onChange,
  placeholder,
  selected,
  msg,
}: TCustomDatePickerProps): JSX.Element {
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
