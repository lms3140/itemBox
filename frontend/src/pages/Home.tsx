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
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { postAuthFetch } from "../api/fetch";
import {
  cellValueChangeHandler,
  deleteRowFunc,
  loadGridData,
} from "../api/gridService";
import { THomeTableItem } from "../types/form";
import {
  toastError,
  toastInfo,
  TOASTMESSAGE,
  toastSuccess,
} from "../utils/toastUtils";

import { zodResolver } from "@hookform/resolvers/zod";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import CustomButton from "../components/CustomButton";

import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import { homeAPIObject } from "../api/apiURL";
import ProductForm from "../components/ProductForm";
import { homeFormSchema } from "../schema/formSchema";
import { useThemeStore } from "../store/zustandStore";

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
  margin-left: 20px;
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
    {
      field: "created_at",
      minWidth: 100,
      headerName: "등록일",
      valueFormatter: ({ value }) =>
        value ? format(new Date(value), "yyyy-MM-dd HH:mm:ss") : "-",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  // 데이터
  const [rowData, setRowData] = useState<THomeTableItem[]>([]);
  const gridRef = useRef<AgGridReact<THomeTableItem>>(null);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<THomeForm>({
    resolver: zodResolver(homeFormSchema),
  });

  // 서브밋 핸들러
  const onSubmit: SubmitHandler<THomeForm> = async (data: THomeForm) => {
    try {
      setIsLoading(true);
      const newObj: THomeTableItem = {
        ...data,
        purchase_date: format(data.purchase_date, "yyyy-MM-dd"),
        release_date: format(data.release_date, "yyyy-MM-dd"),
        id: uuidv4(),
        created_by: "",
      };
      const result = await postAuthFetch(homeAPIObject.add, newObj);
      setRowData((v) => [...v, result.data]);
      reset();
      toastSuccess(TOASTMESSAGE.SUCCESS_ADD);
    } catch (e) {
      toastError(TOASTMESSAGE.ERROR_ADD);
    } finally {
      setIsLoading(false);
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
          <div style={{ textAlign: "end" }}>
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
        </GridWrapper>
        <SideMenu>
          <ProductForm
            isLoading={isLoading}
            onSubmit={onSubmit}
            onInvalid={onInvalid}
            useFormItem={{ register, handleSubmit, control, errors }}
          />
        </SideMenu>
      </Wrapper>
    </>
  );
}

export default Home;
