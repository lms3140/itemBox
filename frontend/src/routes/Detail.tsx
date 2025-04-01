import { useParams } from "react-router";
import { TItemDetailObj } from "../type";
import styled from "styled-components";
import InfoItem from "../components/InfoItem";
import { AgGridReact } from "ag-grid-react";
import { v4 as uuidv4 } from "uuid";
import {
  CellValueChangedEvent,
  GridReadyEvent,
  RowSelectionMode,
  RowSelectionOptions,
  type ColDef,
} from "ag-grid-community";
import { useEffect, useMemo, useRef, useState } from "react";
import { formDataToObj, postDataFetch } from "../utils/utils";
import { cellValueChangeHandler, deleteRowFunc } from "../utils/gridUtils";

// styledComponents

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const InfoWrapper = styled.div`
  background-color: wheat;
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
  width: 500px;
  background-color: aliceblue;
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
    border: 1px solid #ccc;
    padding: 10px;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }
  button {
    grid-column: span 2;
    border: #ccc 1px solid;
    border-radius: 5px;
    width: 300px;
    justify-self: center;
    cursor: pointer;
    margin-top: 20px;
  }
`;

const BASE_URL = "http://127.0.0.1:5000";

//URL OBJECT
const apiUrlObj = {
  add: `${BASE_URL}/api/insertDetailData`,
  update: `${BASE_URL}/api/editDetailGridData`,
  delete: `${BASE_URL}/api/deleteDetailGridData`,
};

// 타입
type TColItem = {
  id: string;
  customerName: string;
  platform: string;
  payment: string;
  customerAddress: string;
  etc: string;
  itemId: string;
};

function Detail() {
  const { paramId } = useParams();
  const gridRef = useRef<AgGridReact<TColItem>>(null);
  const [rowData, setRowData] = useState<TColItem[]>([]);
  const [detailInfo, setDetailInfo] = useState<TItemDetailObj>();

  const [colDefs, setColDefs] = useState<ColDef<TColItem>[]>([
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
  const fetchDetailInfo = async () => {
    const res = await fetch(`${BASE_URL}/api/getDetailInfo/${paramId}`);
    return res.json();
  };

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchDetailInfo();
      setDetailInfo((prev) => (prev = result));
    };
    fetchData();
  }, []);

  const gridReady = (event: GridReadyEvent<TColItem, any>) => {
    event.api.sizeColumnsToFit();
    fetch(`http://127.0.0.1:5000/api/getDetailGridData/${paramId}`)
      .then((res) => res.json())
      .then((data) => setRowData((prev) => [...prev, ...data]));
  };

  // submit 함수
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(paramId);
    if (!paramId) return;
    const formDataObject = formDataToObj<TColItem>(event.currentTarget);
    formDataObject.id = uuidv4();
    formDataObject.itemId = paramId;
    setRowData((v) => [...v, formDataObject]);
    event.currentTarget.reset();

    fetch(apiUrlObj.add, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formDataObject),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  // 삭제버튼
  const clickDeleteBtn = () => {
    if (gridRef === null) return;
    deleteRowFunc(apiUrlObj.delete, gridRef, setRowData);
  };

  const rowSelection = useMemo<RowSelectionOptions<TColItem, any>>(() => {
    return {
      mode: "singleRow",
    };
  }, []);

  return (
    <>
      <Wrapper>
        <h1>{detailInfo?.name}</h1>
        <InfoWrapper>
          <InfoItem title="도매가" content={detailInfo?.wholesale_price} />
          <InfoItem title="소비자명시가" content={detailInfo?.category_price} />
          <InfoItem title="판매가" content={detailInfo?.price} />
          <InfoItem title="수수료" content={detailInfo?.fee} />
          <InfoItem title="카테고리" content={detailInfo?.category} />
          <InfoItem title="판매형식" content={detailInfo?.sales_type} />
          <InfoItem title="주문수량" content={detailInfo?.purchase_quantity} />
          <InfoItem title="판매한수량" content={detailInfo?.sold_quantity} />
          <InfoItem title="발매일자" content={detailInfo?.release_date} />
          <InfoItem title="주문일자" content={detailInfo?.purchase_date} />
          <InfoItem className="etc" title="비고" content={detailInfo?.etc} />
        </InfoWrapper>

        <ListFormWrapper>
          <ListForm onSubmit={onSubmit}>
            <div>
              <label htmlFor="">주문자</label>
              <input type="text" name="customerName" placeholder="주문자" />
            </div>
            <div>
              <label htmlFor="">주소</label>
              <input type="text" name="customerAddress" placeholder="주소" />
            </div>
            <div>
              <label htmlFor="">결제금액</label>
              <input type="text" name="payment" placeholder="결제금액" />
            </div>
            <div>
              <label htmlFor="">판매 플랫폼</label>
              <input type="text" name="platform" placeholder="판매플랫폼" />
            </div>
            <div>
              <label htmlFor="">비고</label>
              <input type="text" name="etc" placeholder="비고" />
            </div>
            <button>등록</button>
          </ListForm>
        </ListFormWrapper>

        <div style={{ width: 800, height: 500 }}>
          <div>
            <button
              onClick={() => {
                deleteRowFunc(apiUrlObj.delete, gridRef, setRowData);
              }}
            >
              삭제
            </button>
          </div>
          <AgGridReact
            ref={gridRef}
            getRowId={(p) => p.data.id}
            rowSelection={rowSelection}
            onGridReady={gridReady}
            columnDefs={colDefs}
            rowData={rowData}
            onCellValueChanged={(e) => {
              cellValueChangeHandler(e, apiUrlObj.update);
            }}
          />
        </div>
      </Wrapper>
    </>
  );
}

export default Detail;
