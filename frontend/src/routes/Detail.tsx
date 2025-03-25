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
import { useMemo, useRef, useState } from "react";
import { formDataToObj } from "../utils";

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

// 테스트 Object
const testObj: TItemDetailObj = {
  id: "_",
  name: "미피 벞어진 인형",
  category: "인형",
  wholesalePrice: "864",
  categoryPrice: "1000",
  price: "23000",
  fee: "200",
  purchaseDate: "2025-03-10",
  purchaseQuantity: "2",
  releaseDate: "2025-02-10",
  soldQuantity: "1",
  salesType: "재고",
  etc: "",
};

// 타입
type TColItem = {
  id: string;
  customerName: string;
  platform: string;
  payment: string;
  customerAddress: string;
  etc: string;
};

const gridReady = (event: GridReadyEvent<TColItem, any>) => {
  event.api.sizeColumnsToFit();
};

function Detail() {
  const { id } = useParams();
  const gridRef = useRef<AgGridReact<TColItem>>(null);
  const [rowData, setRowData] = useState<TColItem[]>([]);

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

  // submit 함수
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formDataObject = formDataToObj<TColItem>(event.currentTarget);
    formDataObject.id = uuidv4();
    setRowData((v) => [...v, formDataObject]);
    event.currentTarget.reset();
  };

  // 삭제버튼
  const clickDeleteBtn = () => {
    const selected = gridRef.current?.api.getSelectedRows();
    if (!selected || selected.length === 0) return;
    const id = selected[0].id;
    setRowData((prev) => prev.filter((row) => row.id !== id));
  };

  const onCellValueChanged = async (
    e: CellValueChangedEvent<TColItem, any>
  ) => {
    const { newValue, oldValue } = e;
    const colField = e.column.getColDef().field;
    const dataObj = {
      newValue,
      id: e.data.id,
    };
    try {
      await fetch("http://127.0.0.1:5000/api/editDetailGridData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataObj),
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    } catch (error) {
      //에러난경우
      if (colField) {
        e.api.getRowNode(e.data.id)?.setDataValue(colField, oldValue);
      }
    }
  };

  const rowSelection = useMemo<RowSelectionOptions<TColItem, any>>(() => {
    return {
      mode: "singleRow",
    };
  }, []);

  return (
    <>
      <Wrapper>
        <h1>{testObj.name}</h1>
        <InfoWrapper>
          <InfoItem title="도매가" content={testObj.wholesalePrice} />
          <InfoItem title="소비자명시가" content={testObj.categoryPrice} />
          <InfoItem title="판매가" content={testObj.price} />
          <InfoItem title="수수료" content={testObj.fee} />
          <InfoItem title="카테고리" content={testObj.category} />
          <InfoItem title="판매형식" content={testObj.salesType} />
          <InfoItem title="주문수량" content={testObj.purchaseQuantity} />
          <InfoItem title="판매한수량" content={testObj.soldQuantity} />
          <InfoItem title="발매일자" content={testObj.releaseDate} />
          <InfoItem title="주문일자" content={testObj.purchaseDate} />
          <InfoItem
            className="etc"
            title="비고"
            content={testObj.soldQuantity}
          />
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
            <button onClick={clickDeleteBtn}>삭제</button>
          </div>
          <AgGridReact
            ref={gridRef}
            getRowId={(p) => p.data.id}
            rowSelection={rowSelection}
            onGridReady={gridReady}
            columnDefs={colDefs}
            rowData={rowData}
            onCellValueChanged={onCellValueChanged}
          />
        </div>
      </Wrapper>
    </>
  );
}

export default Detail;
