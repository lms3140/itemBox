import {
  AllCommunityModule,
  CellDoubleClickedEvent,
  GridReadyEvent,
  ModuleRegistry,
  RowSelectionOptions,
  type ColDef,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { THomeTableItem } from "../types/form";
import {
  cellValueChangeHandler,
  deleteRowFunc,
  loadGridData,
} from "../api/gridService";
import {
  toastError,
  toastInfo,
  TOASTMESSAGE,
  toastSuccess,
} from "../utils/toastUtils";
import { postDataFetch } from "../api/fetch";

import { zodResolver } from "@hookform/resolvers/zod";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import CustomButton from "../components/CustomButton";
import Input from "../components/RHFInput";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import CustomDatePicker from "../components/CustomDatePicker";
import { useThemeStore } from "../store/zustandStore";
import { homeFormSchema } from "../schema/formSchema";
import { homeAPIObject } from "../api/apiURL";

//agGrid를 사용하기 위한 설정... 이게 뭔지는 제대로 모르겠음
ModuleRegistry.registerModules([AllCommunityModule]);

// styled-components start

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

// form 타입
type THomeForm = z.infer<typeof homeFormSchema>;

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    toastInfo("한번 테스트 해볼까요??");
  }, []);
  // 표 머리글
  const [colDefs, _] = useState<ColDef<THomeTableItem>[]>([
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
  const [rowData, setRowData] = useState<THomeTableItem[]>([]);
  const gridRef = useRef<AgGridReact<THomeTableItem>>(null);
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<THomeForm>({
    resolver: zodResolver(homeFormSchema),
  });

  // 서브밋 핸들러
  const onSubmit: SubmitHandler<THomeForm> = async (data: THomeForm) => {
    try {
      const newObj: THomeTableItem = {
        ...data,
        purchase_date: format(data.purchase_date, "yyyy-MM-dd"),
        release_date: format(data.release_date, "yyyy-MM-dd"),
        id: uuidv4(),
        created_by: "admin",
      };
      const result = await postDataFetch(homeAPIObject.add, newObj);
      setRowData((v) => [...v, result.data]);
      reset();
      toastSuccess(TOASTMESSAGE.SUCCESS_ADD);
    } catch (e) {
      toastError(TOASTMESSAGE.ERROR_ADD);
    }
  };

  // 에러 핸들러
  const onInvalid: SubmitErrorHandler<THomeForm> = () => {
    toastError("폼 입력을 확인해주세요.");
  };

  const rowSelection = useMemo<RowSelectionOptions<THomeTableItem, any>>(() => {
    return {
      mode: "singleRow",
    };
  }, []);

  //셀 클릭 이벤트 - 상세페이지로 넘어가기 위함함
  const cellClickEvent = (
    event: CellDoubleClickedEvent<THomeTableItem, any>
  ) => {
    if (!event.data) return;
    const { id } = event.data;
    navigate(`/detail/${id}`);
  };

  // agGrid가 마운트 될때 실행되는 함수.
  const gridReady = async (event: GridReadyEvent<THomeTableItem, any>) => {
    event.api.sizeColumnsToFit();
    try {
      await loadGridData(homeAPIObject.get, setRowData);
    } catch (e) {
      toastError(TOASTMESSAGE.ERROR_GET);
    }
  };

  // 전역 상태 관리 (store/zustandStore 참고)
  const { isDark } = useThemeStore();

  return (
    <>
      <Wrapper>
        <GridWrapper style={{ height: 500, width: 500 }}>
          <AgGridReact
            theme="legacy"
            className={isDark ? "ag-theme-alpine-dark" : "ag-theme-alpine"}
            ref={gridRef}
            onGridReady={gridReady}
            rowSelection={rowSelection}
            getRowId={(p) => p.data.id}
            rowData={rowData}
            columnDefs={colDefs}
            onCellValueChanged={(e) => {
              cellValueChangeHandler(e, homeAPIObject.update);
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
                    deleteRowFunc(homeAPIObject.delete, gridRef, setRowData);
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
