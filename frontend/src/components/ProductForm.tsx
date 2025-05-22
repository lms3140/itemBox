import { ko } from "date-fns/locale";
import {
  Control,
  Controller,
  FieldErrors,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import styled from "styled-components";
import { z } from "zod";
import { homeFormSchema, THomeForm } from "../schema/formSchema";
import CustomButton from "./CustomButton";
import CustomDatePicker from "./CustomDatePicker";
import Input from "./RHFInput";

const FormWrapper = styled.div`
  padding: 7px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 5px;
  box-sizing: border-box;

  input {
    background-color: ${({ theme }) => theme.colors.fg.active};
  }
`;

type TProductFormProps = {
  onSubmit: SubmitHandler<THomeForm>;
  onInvalid?: SubmitErrorHandler<THomeForm>;
  isEdit?: boolean;
  isLoading: boolean;
  useFormItem: {
    register: UseFormRegister<THomeForm>;
    handleSubmit: UseFormHandleSubmit<THomeForm>;
    control: Control<THomeForm>;
    errors: FieldErrors<THomeForm>;
  };
};

const ProductForm = ({
  onSubmit,
  onInvalid,
  isEdit,
  isLoading,
  useFormItem,
}: TProductFormProps) => {
  const { register, handleSubmit, control, errors } = useFormItem;
  return (
    <FormWrapper>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <Input
          label="이름"
          name="name"
          msg={errors.name?.message}
          register={register}
        />
        <Input
          label="판매가격"
          name="price"
          msg={errors.price?.message}
          register={register}
        />
        <Input
          label="카테고리"
          name="category"
          msg={errors.category?.message}
          register={register}
        />
        <Input
          label="도매가"
          name="wholesale_price"
          msg={errors.wholesale_price?.message}
          register={register}
        />
        <Input
          label="소비자권장가격"
          name="category_price"
          msg={errors.category_price?.message}
          register={register}
        />
        <Input
          label="수수료"
          name="fee"
          msg={errors.fee?.message}
          register={register}
        />
        <Input
          label="구매개수"
          name="purchase_quantity"
          msg={errors.purchase_quantity?.message}
          register={register}
        />
        <Input
          label="판매개수"
          name="sold_quantity"
          msg={errors.sold_quantity?.message}
          register={register}
        />
        <label>발매날짜</label>
        <Controller
          name="release_date"
          control={control}
          render={({ field }) => (
            <CustomDatePicker
              locale={ko}
              selected={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              placeholder="발매날짜"
              msg={errors.release_date?.message}
            />
          )}
        />

        <label>구매날짜</label>
        <Controller
          name="purchase_date"
          control={control}
          render={({ field }) => (
            <CustomDatePicker
              locale={ko}
              onBlur={field.onBlur}
              onChange={field.onChange}
              placeholder="구매날짜"
              selected={field.value}
              msg={errors.release_date?.message}
            />
          )}
        />
        <Input
          label="판매유형"
          name="sales_type"
          msg={errors.sales_type?.message}
          register={register}
        />
        <Input
          label="비고"
          name="etc"
          msg={errors.etc?.message}
          register={register}
        />
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
          }}
        >
          <CustomButton disabled={isLoading} variant="primary" type="submit">
            {isEdit ? "수정" : "등록"}
          </CustomButton>
        </div>
      </form>
    </FormWrapper>
  );
};

export default ProductForm;
