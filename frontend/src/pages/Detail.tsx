import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GridReadyEvent,
  RowSelectionOptions,
  type ColDef,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { detailAPIObject, homeAPIObject } from "../api/apiURL";
import {
  fetchDetailInfo,
  getDataFetch,
  postAuthFetch,
  postDataFetch,
} from "../api/fetch";
import {
  cellValueChangeHandler,
  deleteRowFunc,
  loadGridData,
} from "../api/gridService";
import CustomButton from "../components/CustomButton";
import InfoItem from "../components/InfoItem";
import Input from "../components/RHFInput";
import { detailFormSchema } from "../schema/formSchema";
import { useAuthStore, useThemeStore } from "../store/zustandStore";
import { TDetailTableItem, THomeTableItem } from "../types/form";
import { toastError, toastSuccess } from "../utils/toastUtils";
import ModalContent from "../components/ModalContent";

// styledComponents

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  h1 {
    font-size: 44px;
    margin-bottom: 20px;
  }
`;
const InfoWrapper = styled.div`
  background-color: ${(props) => props.theme.colors.bg};
  height: 300px;
  max-width: 500px;
  width: 100%;
  border-radius: 10px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 1fr 1fr 1fr;
  .etc {
    grid-column: span 2;
  }
`;

const ListFormWrapper = styled.div`
  margin-top: 5px;
  border-radius: 5px;
  border: 1px solid ${(props) => props.theme.colors.border};
  width: 500px;
  background-color: ${(props) => props.theme.colors.bg};
  padding: 5px 4px 10px 4px;
  margin-bottom: 10px;
  box-sizing: border-box;
`;

const ListForm = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;

  div {
    margin: 5px;
  }

  input {
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: 10px;
    border-radius: 5px;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }
`;

const FormControllWrapper = styled.div`
  display: flex;
  justify-content: end;
  grid-area: 4/2;
`;

// react hook form을 위한 타입
type TDetailForm = z.infer<typeof detailFormSchema>;

function Detail() {
  const { paramId } = useParams();
  const gridRef = useRef<AgGridReact<TDetailTableItem>>(null);
  const [rowData, setRowData] = useState<TDetailTableItem[]>([]);
  const [colDefs, _] = useState<ColDef<TDetailTableItem>[]>([
    { field: "id", headerName: "id", width: 80, hide: true },
    {
      field: "customerName",
      headerName: "주문자",
      editable: true,
    },
    { field: "customerAddress", headerName: "주소", editable: true },
    { field: "payment", headerName: "결제금액", editable: true },
    { field: "platform", headerName: "판매플랫폼", editable: true },
    { field: "etc", headerName: "비고", editable: true },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TDetailForm>({
    resolver: zodResolver(detailFormSchema),
  });

  // 그리드 준비되면 실행되는 함수.
  const gridReady = async (event: GridReadyEvent<TDetailTableItem, any>) => {
    event.api.sizeColumnsToFit();
    if (!paramId) return;
    try {
      await loadGridData(detailAPIObject.get(paramId), setRowData);
    } catch (e) {
      toastError("데이터를 불러오는 중 오류가 발생했습니다.");
    }
  };

  // form 등록 함수
  const onSubmit: SubmitHandler<TDetailForm> = async (data) => {
    if (!paramId) return;
    try {
      const newData: TDetailTableItem = {
        id: uuidv4(),
        itemId: paramId,
        ...data,
      };
      const result = await postAuthFetch(detailAPIObject.add, newData);
      setRowData((v) => [...v, result.data]);
      reset();
      toastSuccess("등록을 완료했습니다.");
    } catch (e) {
      toastError("등록 작업중 오류가 발생했습니다.");
    }
  };

  // AgGrid 선택 옵션
  const rowSelection = useMemo<
    RowSelectionOptions<TDetailTableItem, any>
  >(() => {
    return {
      mode: "singleRow",
    };
  }, []);
  const [showModal, setShowModal] = useState(false);
  const [isLoss, setIsLoss] = useState(false);

  // zustand
  const { isDark } = useThemeStore();

  // react query
  const { data, error } = useQuery<THomeTableItem & { margin: number }>({
    queryKey: ["detailInfo"],
    queryFn: async () => {
      const res = await fetchDetailInfo(paramId);
      const price = Number(res.price);
      const fee = Number(res.fee);
      const wholesale_price = Number(res.wholesale_price);
      const margin = price - (fee + wholesale_price);
      if (margin < 0) {
        setIsLoss(true);
      } else setIsLoss(false);
      return { ...res, margin };
    },

    enabled: !!paramId,
  });

  if (error) {
    toastError("데이터를 불러오지 못했습니다.");
  }

  return (
    <>
      <Wrapper>
        <h1>{data?.name}</h1>
        <InfoWrapper>
          <InfoItem title="도매가" content={data?.wholesale_price} />
          <InfoItem title="소비자명시가" content={data?.category_price} />
          <InfoItem title="판매가" content={data?.price} />
          <InfoItem title="수수료" content={data?.fee} />
          <InfoItem title="카테고리" content={data?.category} />
          <InfoItem title="판매형식" content={data?.sales_type} />
          <InfoItem title="주문수량" content={data?.purchase_quantity} />
          <InfoItem title="판매한수량" content={data?.sold_quantity} />
          <InfoItem
            title="재고"
            content={String(
              Number(data?.purchase_quantity) - Number(data?.sold_quantity)
            )}
          />
          <InfoItem title="발매일자" content={data?.release_date.toString()} />
          <InfoItem title="주문일자" content={data?.purchase_date.toString()} />
          <InfoItem title="비고" content={data?.etc} />
          <InfoItem
            title="이익"
            content={String(
              Number(data?.price) -
                (Number(data?.wholesale_price) + Number(data?.fee))
            )}
            className={isLoss ? "loss" : "profit"}
          />
        </InfoWrapper>
        <div>
          <CustomButton
            variant="primary"
            onClick={() => {
              setShowModal(true);
            }}
          >
            수정
          </CustomButton>
        </div>
        {showModal &&
          createPortal(
            <ModalContent
              paramsId={paramId}
              onClose={() => setShowModal(false)}
            />,
            document.body
          )}
        <ListFormWrapper>
          <ListForm onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="주문자"
              name="customerName"
              register={register}
              msg={errors.customerName?.message}
            />
            <Input
              label="주소"
              name="customerAddress"
              register={register}
              msg={errors.customerAddress?.message}
            />
            <Input
              label="결제금액"
              name="payment"
              register={register}
              msg={errors.payment?.message}
            />
            <Input
              label="판매 플랫폼"
              name="platform"
              register={register}
              msg={errors.platform?.message}
            />
            <Input
              label="비고"
              name="etc"
              register={register}
              msg={errors.etc?.message}
            />
            <FormControllWrapper>
              <CustomButton type="submit" variant="primary">
                등록
              </CustomButton>
            </FormControllWrapper>
          </ListForm>
        </ListFormWrapper>

        <div style={{ width: 800, height: 500 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginBottom: "10px",
            }}
          >
            <CustomButton
              variant="danger"
              onClick={() => {
                deleteRowFunc(detailAPIObject.delete, gridRef, setRowData);
              }}
            >
              삭제
            </CustomButton>
          </div>

          <AgGridReact
            theme="legacy"
            className={isDark ? "ag-theme-alpine-dark" : "ag-theme-alpine"}
            ref={gridRef}
            getRowId={(p) => p.data.id}
            rowSelection={rowSelection}
            onGridReady={gridReady}
            columnDefs={colDefs}
            rowData={rowData}
            onCellValueChanged={(e) => {
              cellValueChangeHandler(e, detailAPIObject.update);
            }}
          />
        </div>
      </Wrapper>
    </>
  );
}

export default Detail;
