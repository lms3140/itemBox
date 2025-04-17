import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  AllCommunityModule,
  CellDoubleClickedEvent,
  GridReadyEvent,
  ModuleRegistry,
  provideGlobalGridOptions,
  RowSelectionOptions,
  themeAlpine,
  themeQuartz,
  type ColDef,
} from "ag-grid-community";
import styled from "styled-components";
import { TItemDetailFormData, TItemDetailObj } from "../type";
import { useNavigate } from "react-router-dom";
import { postDataFetch } from "../utils/utils";
import {
  cellValueChangeHandler,
  deleteRowFunc,
  loadGridData,
} from "../utils/gridUtils";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  toastError,
  toastInfo,
  TOASTMESSAGE,
  toastSuccess,
} from "../utils/toastUtils";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import CustomButton from "../components/CustomButton";

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
  border: 1px solid #ddd;
  border-radius: 5%;
  box-sizing: border-box;
`;

// styled-components end

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
  const { register, handleSubmit, reset } = useForm<TItemDetailFormData>();

  const onSubmit: SubmitHandler<TItemDetailFormData> = async (
    data: TItemDetailFormData
  ) => {
    try {
      const newObj: TItemDetailObj = {
        ...data,
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
            <form action="" onSubmit={handleSubmit(onSubmit)}>
              <label>이름</label>
              <input {...register("name", { required: true })} />
              <label>판매가격</label>
              <input {...register("price", { required: true })} />
              <label>카테고리</label>
              <input {...register("category", { required: true })} />
              <label>도매가</label>
              <input {...register("wholesale_price", { required: true })} />
              <label>소비자권장가격</label>
              <input {...register("category_price", { required: true })} />
              <label>수수료</label>
              <input {...register("fee", { required: true })} />
              <label>구매개수</label>
              <input {...register("purchase_quantity", { required: true })} />
              <label>판매개수</label>
              <input {...register("sold_quantity", { required: true })} />
              <label>발매날짜</label>
              <input
                type="date"
                {...register("release_date", { required: true })}
              />
              <label>구매날짜</label>
              <input type="date" {...register("purchase_date")} />
              <label>판매유형</label>
              <input {...register("sales_type", { required: true })} />
              <label>비고</label>
              <input {...register("etc")} />
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  justifyContent: "center",
                }}
              >
                <CustomButton type="submit">등록</CustomButton>
                <CustomButton
                  onClick={() => {
                    deleteRowFunc(apiUrl.delete, gridRef, setRowData);
                  }}
                  variant="danger"
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
