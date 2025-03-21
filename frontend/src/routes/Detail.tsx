import { useParams } from "react-router";
import { TItemDetailObj } from "../type";
import styled from "styled-components";
import InfoItem from "../components/InfoItem";
import { AgGridReact } from "ag-grid-react";
import { GridReadyEvent, type ColDef } from "ag-grid-community";
import { useState } from "react";

// styled components
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

const ListFormWrapper = styled.div``;

// styled components end
// 테스트
const testObj: TItemDetailObj = {
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

// 테스트 끝

// 타입
type TColItem = {
  customerName: string;
  platform: string;
  payment: string;
  customerAddress: string;
  etc: string;
};

// AGGrid 함수
const gridReady = (event: GridReadyEvent<TColItem, any>) => {
  event.api.sizeColumnsToFit();
};

function Detail() {
  const { id } = useParams();

  const [colDefs, setColDefs] = useState<ColDef<TColItem>[]>([
    { field: "customerName", headerName: "주문자" },
    { field: "customerAddress", headerName: "주소" },
    { field: "payment", headerName: "결제금액" },
    { field: "platform", headerName: "판매플랫폼" },
    { field: "etc", headerName: "비고" },
  ]);

  const [rowData, setRowData] = useState<TColItem[]>([]);

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
          <form>
            <input type="text" name="customerName" placeholder="주문자" />
            <input type="text" name="customerAddress" placeholder="주소" />
            <input type="text" name="payment" placeholder="결제금액" />
            <input type="text" name="platform" placeholder="판매플랫폼" />
            <input type="text" name="etc" placeholder="비고" />
          </form>
        </ListFormWrapper>

        <div style={{ width: 500, height: 500 }}>
          <AgGridReact
            onGridReady={gridReady}
            columnDefs={colDefs}
            rowData={rowData}
          />
        </div>
      </Wrapper>
    </>
  );
}

export default Detail;
