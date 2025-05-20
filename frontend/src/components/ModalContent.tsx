import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";
import { homeAPIObject } from "../api/apiURL";
import { fetchDetailInfo, postAuthFetch } from "../api/fetch";
import { homeFormSchema, THomeForm } from "../schema/formSchema";
import { THomeTableItem } from "../types/form";
import { toastError, TOASTMESSAGE, toastSuccess } from "../utils/toastUtils";
import ProductForm from "./ProductForm";

const Wrapper = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
  background-color: ${({ theme }) => theme.colors.fg.disabled};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;
  width: 500px;
  height: auto;
  display: flex;
  flex-direction: column;
`;

type TModalProps = {
  onClose: () => void;
  paramsId?: string;
};

const ModalContent = ({ onClose, paramsId }: TModalProps) => {
  // react query
  const { data, error } = useQuery<THomeTableItem>({
    queryKey: ["detailInfo"],
    queryFn: async () => await fetchDetailInfo(paramsId),
    enabled: !!paramsId,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<THomeForm>({
    resolver: zodResolver(homeFormSchema),
    defaultValues: {
      ...data,
      purchase_date: data && new Date(data.purchase_date),
      release_date: data && new Date(data.release_date),
    },
  });
  // 서브밋 핸들러
  const onSubmit: SubmitHandler<THomeForm> = async (data: THomeForm) => {
    if (!paramsId) return;
    try {
      const newObj: THomeTableItem = {
        ...data,
        purchase_date: format(data.purchase_date, "yyyy-MM-dd"),
        release_date: format(data.release_date, "yyyy-MM-dd"),
        id: paramsId,
        created_by: "",
      };
      await mutation.mutateAsync(newObj);
      reset();
      toastSuccess(TOASTMESSAGE.SUCCESS_UPDATE);
      queryClient.invalidateQueries({ queryKey: ["detailInfo"] });
      onClose();
    } catch (e) {
      toastError(TOASTMESSAGE.ERROR_UPDATE);
    } finally {
    }
  };

  const mutation = useMutation({
    mutationFn: (data: THomeTableItem) => {
      return postAuthFetch(homeAPIObject.update, data);
    },
  });
  const isLoading = mutation.isPending;
  const queryClient = useQueryClient();

  return (
    <Wrapper>
      <div>
        <ProductForm
          isLoading={isLoading}
          onSubmit={onSubmit}
          useFormItem={{ register, control, errors, handleSubmit }}
          isEdit={true}
        />
      </div>
      <div>
        <button onClick={onClose}>닫기</button>
      </div>
    </Wrapper>
  );
};

export default ModalContent;
