import {
  AllCommunityModule,
  CellDoubleClickedEvent,
  GridReadyEvent,
  ModuleRegistry,
  RowSelectionOptions,
  type ColDef,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { Component, useEffect, useMemo, useRef, useState } from "react";
import {
  Controller,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { TItemDetailObj } from "../type";
import {
  cellValueChangeHandler,
  deleteRowFunc,
  loadGridData,
} from "../utils/gridUtils";
import {
  toastError,
  toastInfo,
  TOASTMESSAGE,
  toastSuccess,
} from "../utils/toastUtils";
import { postDataFetch } from "../utils/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import CustomButton from "../components/CustomButton";
import Input from "../components/RHFInput";

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import CustomDatePicker from "../components/CustomDatePicker";
import { format } from "date-fns";
//agGrid를 사용하기 위한 설정... 이게 뭔지는 제대로 모르겠음
ModuleRegistry.registerModules([AllCommunityModule]);

// styled-components start

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

const Wrapper = styled.div`
  display: flex;
  gap: 5px;
`;

const GridWrapper = styled.div`
  width: 500px;
  height: 500px;
`;

const SideMenu = styled.div`
  display: flex;
  justify-content: center;
  width: 200px;
`;

const FormWrapper = styled.div`
  padding: 7px;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 5px;
  box-sizing: border-box;

  input {
    background-color: ${({ theme }) => theme.colors.fg.active};
  }
`;

// styled-components end

// zod 스키마
const itemDetailSchema = z.object({
  name: z.string().min(1, { message: "이름은 필수 항목입니다" }),
  price: z.string().min(1, { message: "가격은 필수 항목입니다." }),
  category_price: z
    .string()
    .min(1, { message: "소비자 명시가는 필수 항목입니다." }),
  wholesale_price: z.string().min(1, { message: "원가는 필수 항목입니다." }),
  category: z.string().min(1, { message: "카테고리는 필수 항목입니다." }),
  fee: z.string().min(1, { message: "수수료는 필수 항목입니다." }),
  purchase_quantity: z
    .string()
    .min(1, { message: "구매개수는 필수 항목입니다." }),
  sold_quantity: z.string().min(1, { message: "판매개수는 필수 항목입니다." }),
  purchase_date: z.date({ required_error: "구매일자는 필수입니다!!" }),
  release_date: z.date({ required_error: "발매날짜는 필수입니다." }),
  sales_type: z.string().min(1, { message: "판매유형은 필수 항목입니다." }),
  etc: z.string(),
});

type TItemDetailFormData = z.infer<typeof itemDetailSchema>;

// url
const BASE_URL = "http://127.0.0.1:5000";
const apiUrl = {
  add: `${BASE_URL}/api/main/grid-row/add`,
  delete: `${BASE_URL}/api/main/grid-row/delete`,
  update: `${BASE_URL}/api/main/grid-data/update`,
  get: `${BASE_URL}/api/main/grid-rows`,
};

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    toastInfo("한번 테스트 해볼까요??");
  }, []);
  // 표 머리글
  const [colDefs, _] = useState<ColDef<TItemDetailObj>[]>([
    { field: "id", maxWidth: 70, hide: true },
    { field: "name", minWidth: 100, headerName: "이름", editable: true },
    { field: "price", minWidth: 100, headerName: "판매가", editable: true },
    {
      field: "category",
      minWidth: 100,
      headerName: "카테고리",
      editable: true,
    },
    {
      field: "category_price",
      minWidth: 100,
      headerName: "소비자가",
      editable: true,
    },
    {
      field: "wholesale_price",
      minWidth: 100,
      headerName: "도매가",
      editable: true,
    },
    { field: "fee", minWidth: 100, headerName: "수수료", editable: true },
    {
      field: "purchase_quantity",
      minWidth: 100,
      headerName: "구매수",
      editable: true,
    },
    {
      field: "sold_quantity",
      minWidth: 100,
      headerName: "판매수",
      editable: true,
    },
    {
      field: "release_date",
      minWidth: 100,
      headerName: "출시일",
      editable: true,
    },
    {
      field: "purchase_date",
      minWidth: 100,
      headerName: "구매일",
      editable: true,
    },
    {
      field: "sales_type",
      minWidth: 100,
      headerName: "판매유형",
      editable: true,
    },
    { field: "etc", minWidth: 100, headerName: "비고", editable: true },
  ]);

  // 데이터
  const [rowData, setRowData] = useState<TItemDetailObj[]>([]);
  const gridRef = useRef<AgGridReact<TItemDetailObj>>(null);
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<TItemDetailFormData>({
    resolver: zodResolver(itemDetailSchema),
  });
  console.log(watch());
  const onSubmit: SubmitHandler<TItemDetailFormData> = async (
    data: TItemDetailFormData
  ) => {
    try {
      const newObj: TItemDetailObj = {
        ...data,
        purchase_date: format(data.purchase_date, "yyyy-MM-dd"),
        release_date: format(data.release_date, "yyyy-MM-dd"),
        id: uuidv4(),
        created_by: "admin",
      };
      const result = await postDataFetch(apiUrl.add, newObj);
      setRowData((v) => [...v, result.data]);
      reset();
      toastSuccess(TOASTMESSAGE.SUCCESS_ADD);
    } catch (e) {
      toastError(TOASTMESSAGE.ERROR_ADD);
    }
  };

  const onInvalid: SubmitErrorHandler<TItemDetailFormData> = (errors) => {
    toastError("폼 입력을 확인해주세요.");
  };

  const rowSelection = useMemo<RowSelectionOptions<TItemDetailObj, any>>(() => {
    return {
      mode: "singleRow",
    };
  }, []);

  //셀 클릭 이벤트 - 상세페이지로 넘어가기 위함함
  const cellClickEvent = (
    event: CellDoubleClickedEvent<TItemDetailObj, any>
  ) => {
    if (!event.data) return;
    const { id } = event.data;
    navigate(`/detail/${id}`);
  };

  // agGrid가 마운트 될때 실행되는 함수.
  const gridReady = async (event: GridReadyEvent<TItemDetailObj, any>) => {
    event.api.sizeColumnsToFit();
    try {
      await loadGridData(apiUrl.get, setRowData);
    } catch (e) {
      toastError(TOASTMESSAGE.ERROR_GET);
    }
  };

  return (
    <>
      <Wrapper>
        <GridWrapper style={{ height: 500, width: 500 }}>
          <AgGridReact
            theme="legacy"
            className="ag-theme-alpine-dark"
            ref={gridRef}
            onGridReady={gridReady}
            rowSelection={rowSelection}
            getRowId={(p) => p.data.id}
            rowData={rowData}
            columnDefs={colDefs}
            onCellValueChanged={(e) => {
              cellValueChangeHandler(e, apiUrl.update);
            }}
            onCellDoubleClicked={cellClickEvent}
          />
        </GridWrapper>
        <SideMenu>
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
                <CustomButton variant="primary" type="submit">
                  등록
                </CustomButton>
                <CustomButton
                  onClick={() => {
                    deleteRowFunc(apiUrl.delete, gridRef, setRowData);
                  }}
                  variant="danger"
                  type="button"
                >
                  삭제
                </CustomButton>
              </div>
            </form>
          </FormWrapper>
        </SideMenu>
      </Wrapper>
    </>
  );
}

export default Home;
