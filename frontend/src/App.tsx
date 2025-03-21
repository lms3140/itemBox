import { AgGridReact } from "ag-grid-react";
import { useEffect, useRef, useState } from "react";
import {
  AllCommunityModule,
  CellClickedEvent,
  GridReadyEvent,
  ModuleRegistry,
  type ColDef,
} from "ag-grid-community";
import styled from "styled-components";
import { TItemDetailObj } from "./type";
import { Link, useNavigate } from "react-router-dom";

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
  height: 150px;
  box-sizing: border-box;
`;

// styled-components end

// 데이터 타입
type TGoods = {
  id: string;
  name: string;
  price: string;
  category: string;
};

function App() {
  const navigate = useNavigate();

  // 표 머리글
  const [colDefs, _] = useState<ColDef<TGoods>[]>([
    { field: "id", maxWidth: 70 },
    { field: "name", minWidth: 100 },
    { field: "price", minWidth: 100 },
    { field: "category", minWidth: 100 },
  ]);

  // 데이터
  const [rowData, setRowData] = useState<TGoods[]>([]);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const dataObj = Object.fromEntries(formData) as TGoods;
    console.log(event);
    // 숫자
    if (Number.isNaN(Number(dataObj.price))) {
      console.log("숫자만 입력해주세요");
    } else {
      setRowData((v) => [...v, dataObj]);
    }
  };

  //데이터 받아오기
  const getGridData = () => {
    fetch("http://127.0.0.1:5000/api/griddata")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setRowData((prev) => [...prev, ...data]);
      });
  };

  // 데이터 보내버리기
  const postData = () => {
    const initData: TItemDetailObj = {
      name: "포리",
      category: "인형",
      wholesalePrice: "100",
      fee: "12312",
      price: "10000",
      purchaseDate: "2025-03-07",
      purchaseQuantity: "2",
      releaseDate: "2025-03-04",
      soldQuantity: "1",
      etc: "",
      categoryPrice: "",
      salesType: "",
    };
    fetch("http://127.0.0.1:5000/api/postData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(initData),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error("Error:", err));
  };

  //셀 클릭 이벤트
  const cellClickEvent = (event: CellClickedEvent<TGoods, any>) => {
    if (!event.data) return;
    const { id } = event.data;

    navigate(`/detail/${id}`);
  };

  /**
   * AG Grid가 준비되었을때 실행되는 함수
   * @param event - AG Grid 이벤트 객체
   */
  const gridReady = (event: GridReadyEvent<TGoods, any>) => {
    event.api.sizeColumnsToFit();
    getGridData();
  };

  return (
    <>
      <Wrapper>
        <GridWrapper style={{ height: 500, width: 500 }}>
          <AgGridReact
            onGridReady={gridReady}
            rowData={rowData}
            columnDefs={colDefs}
            onCellClicked={cellClickEvent}
          />
        </GridWrapper>
        <SideMenu>
          <FormWrapper>
            <form action="" onSubmit={submit}>
              <input type="text" name="name" placeholder="이름" />
              <input type="number" name="price" placeholder="가격" />
              <input type="text" name="category" placeholder="카테고리" />
              <input type="date" />
              <button type="submit">등록</button>
            </form>
          </FormWrapper>
        </SideMenu>
      </Wrapper>
      <Link to={"/detail/11"}>123</Link>
    </>
  );
}

export default App;
