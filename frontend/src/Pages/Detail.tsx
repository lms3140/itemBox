import {
  GridReadyEvent,
  RowSelectionOptions,
  type ColDef,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import InfoItem from "../components/InfoItem";
import { TItemDetailObj } from "../type";
import {
  cellValueChangeHandler,
  deleteRowFunc,
  loadGridData,
} from "../utils/gridUtils";
import { toastError, toastSuccess } from "../utils/toastUtils";
import { getDataFetch, postDataFetch } from "../utils/utils";

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
  add: `${BASE_URL}/api/detail/grid-row/add`,
  update: `${BASE_URL}/api/detail/grid-row/update`,
  delete: `${BASE_URL}/api/detail/grid-row/delete`,
  get: (id: string) => `${BASE_URL}/api/detail/grid-rows/${id}`,
  getInfo: (id: string) => `${BASE_URL}/api/detail/${id}`,
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

type TDetailFormData = {
  customerName: string;
  platform: string;
  payment: string;
  customerAddress: string;
  etc: string;
};

function Detail() {
  const { paramId } = useParams();
  const gridRef = useRef<AgGridReact<TColItem>>(null);
  const [rowData, setRowData] = useState<TColItem[]>([]);
  const [detailInfo, setDetailInfo] = useState<TItemDetailObj>();

  const [colDefs, _] = useState<ColDef<TColItem>[]>([
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

  const { register, handleSubmit, reset } = useForm<TDetailFormData>();

  const fetchDetailInfo = async () => {
    if (!paramId) return;
    const res = await getDataFetch(apiUrlObj.getInfo(paramId));
    return res.json();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchDetailInfo();
        setDetailInfo(result);
      } catch (e) {
        toastError("데이터를 불러오는중 오류가 발생했습니다.");
      }
    };
    fetchData();
  }, []);

  const gridReady = async (event: GridReadyEvent<TColItem, any>) => {
    event.api.sizeColumnsToFit();
    if (!paramId) return;
    try {
      await loadGridData(apiUrlObj.get(paramId), setRowData);
    } catch (e) {
      toastError("데이터를 불러오는 중 오류가 발생했습니다.");
    }
  };

  const onSubmit: SubmitHandler<TDetailFormData> = async (data) => {
    if (!paramId) return;
    try {
      const newData: TColItem = { id: uuidv4(), itemId: paramId, ...data };
      const result = await postDataFetch(apiUrlObj.add, newData);
      setRowData((v) => [...v, result.data]);
      reset();
      toastSuccess("등록을 완료했습니다.");
    } catch (e) {
      toastError("등록 작업중 오류가 발생했습니다.");
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
          <ListForm onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="">주문자</label>
            <input {...register("customerName", { required: true })} />
            <label htmlFor="">주소</label>
            <input {...register("customerAddress", { required: true })} />
            <label htmlFor="">결제금액</label>
            <input {...register("payment", { required: true })} />
            <label htmlFor="">판매 플랫폼</label>
            <input {...register("platform", { required: true })} />
            <label htmlFor="">비고</label>
            <input {...register("etc")} />
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
