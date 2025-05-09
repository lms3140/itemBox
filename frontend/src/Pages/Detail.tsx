import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  GridReadyEvent,
  RowSelectionOptions,
  type ColDef,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import CustomButton from "../components/CustomButton";
import InfoItem from "../components/InfoItem";
import Input from "../components/RHFInput";
import { useThemeStore } from "../store/zustandStore";
import { TDetailTableItem, THomeTableItem } from "../types/form";
import {
  cellValueChangeHandler,
  deleteRowFunc,
  loadGridData,
} from "../api/gridService";
import { toastError, toastSuccess } from "../utils/toastUtils";
import { getDataFetch, postDataFetch } from "../api/fetch";
import { detailFormSchema } from "../schema/formSchema";
import { detailAPIObject } from "../api/apiURL";

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
      const result = await postDataFetch(detailAPIObject.add, newData);
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

  // zustand
  const { isDark } = useThemeStore();

  // 상품 상세정보를 가져오는 fetch 함수
  const fetchDetailInfo = async () => {
    if (!paramId) throw new Error("paramId 이 없습니다.");
    const res = await getDataFetch(detailAPIObject.getInfo(paramId));
    return res;
  };

  // react query
  const { data, error } = useQuery<THomeTableItem>({
    queryKey: ["detailInfo"],
    queryFn: fetchDetailInfo,
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
          <InfoItem title="도매가" content={data?.wholesale_price + "엔"} />
          <InfoItem
            title="소비자명시가"
            content={data?.category_price + "엔"}
          />
          <InfoItem title="판매가" content={data?.price + "원"} />
          <InfoItem title="수수료" content={data?.fee + "원"} />
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
        </InfoWrapper>

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
