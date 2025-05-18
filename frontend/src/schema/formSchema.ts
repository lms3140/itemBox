import { z } from "zod";

// formSchema.ts
// - Home 페이지 : homeFormSchema
// - Detail 페이지 : detailFormSchema
// 추후 스키마가 많아지면 파일 분리 고려

// Home.tsx 의 Form에 사용되는 스키마
export const homeFormSchema = z.object({
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

// Detail.tsx 의 Form에 사용되는 스키마
export const detailFormSchema = z.object({
  customerName: z.string().min(1, { message: "이름은 필수." }),
  platform: z.string().min(1, { message: "플랫폼은 필수입니다." }),
  payment: z.string().min(1, { message: "결제금액" }),
  customerAddress: z.string().min(1, { message: "주소가 없나요?" }),
  etc: z.string(),
});

export const loginFormSchema = z.object({
  id: z.string().min(1, { message: "아이디를 입력해주세요." }),
  password: z.string().min(1, { message: "비밀번호를 입력해주세요" }),
});
