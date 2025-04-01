import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  AllCommunityModule,
  CellClickedEvent,
  CellDoubleClickedEvent,
  CellValueChangedEvent,
  GridReadyEvent,
  ModuleRegistry,
  RowSelectionOptions,
  type ColDef,
} from "ag-grid-community";
import styled from "styled-components";
import { TItemDetailObj } from "./type";
import { Link, useNavigate } from "react-router-dom";
import { formDataToObj, postDataFetch } from "./utils/utils";
import { cellValueChangeHandler, deleteRowFunc } from "./utils/gridUtils";
import InputLabel from "./components/InputLabel";

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
  add: `${BASE_URL}/api/insertMainData`,
  delete: `${BASE_URL}/api/deleteMainGridData`,
  update: `${BASE_URL}/api/updateMainGridData`,
  get: `${BASE_URL}/api/getDetailGridData`,
};

function App() {
  const navigate = useNavigate();

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

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const dataObj = formDataToObj<TItemDetailObj>(event.currentTarget);
    dataObj.id = uuidv4();
    console.log(dataObj);

    setRowData((v) => [...v, dataObj]);

    postDataFetch(apiUrl.add, dataObj);
  };

  //데이터 받아오기
  const getGridData = () => {
    fetch(apiUrl.get)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRowData((prev) => [...prev, ...data]);
      });
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

  /**
   * AG Grid가 준비되었을때 실행되는 함수
   * @param event - AG Grid 이벤트 객체
   */
  const gridReady = (event: GridReadyEvent<TItemDetailObj, any>) => {
    event.api.sizeColumnsToFit();
    getGridData();
  };

  return (
    <>
      <Wrapper>
        <GridWrapper style={{ height: 500, width: 500 }}>
          <AgGridReact
            ref={gridRef}
            onGridReady={gridReady}
            rowSelection={rowSelection}
            getRowId={(p) => p.data.id}
            rowData={rowData}
            columnDefs={colDefs}
            onCellValueChanged={(e) => {
              cellValueChangeHandler(e, `${BASE_URL}/api/updateMainGridData`);
            }}
            onCellDoubleClicked={cellClickEvent}
          />
        </GridWrapper>
        <SideMenu>
          <FormWrapper>
            <form action="" onSubmit={submit}>
              <InputLabel
                label="이름"
                name="name"
                placeholder="이름"
                type="text"
                required={true}
              />
              <InputLabel
                label="판매 가격"
                name="price"
                placeholder="가격"
                type="text"
                required={true}
              />
              <InputLabel
                label="카테고리"
                name="category"
                placeholder="카테고리"
                type="text"
                required={true}
              />
              <InputLabel
                label="도매가"
                name="wholesale_price"
                placeholder="도매가"
                type="text"
                required={true}
              />
              <InputLabel
                label="소비자권장가격"
                name="category_price"
                placeholder="소비자권장가격"
                type="text"
                required={true}
              />

              <InputLabel
                label="수수료"
                name="fee"
                placeholder="수수료"
                type="text"
                required={true}
              />
              <InputLabel
                label="구매개수"
                name="purchase_quantity"
                placeholder="구매개수"
                type="text"
                required={true}
              />
              <InputLabel
                label="판매개수"
                name="sold_quantity"
                placeholder="판매개수"
                type="text"
                required={true}
              />
              <InputLabel
                label="발매날짜"
                name="release_date"
                placeholder="발매날짜"
                type="date"
              />
              <InputLabel
                label="구매날짜"
                name="purchase_date"
                placeholder="구매날짜"
                type="date"
              />
              <InputLabel
                label="판매유형"
                name="sales_type"
                placeholder="판매유형"
                type="text"
              />
              <InputLabel
                label="비고"
                name="etc"
                placeholder="비고"
                type="text"
              />
              <button type="submit">등록</button>
              <button
                type="button"
                onClick={() => {
                  deleteRowFunc(apiUrl.delete, gridRef, setRowData);
                }}
              >
                삭제
              </button>
            </form>
          </FormWrapper>
          <div></div>
        </SideMenu>
      </Wrapper>
    </>
  );
}

export default App;
