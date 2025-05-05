// Main의 아이템 등록에 쓰는 타입
export type TItemDetailObj = {
  id: string;
  name: string; // 이름
  price: string; // 실제 가격
  category_price: string; // 소비자가
  wholesale_price: string; // 도매가
  category: string; // 카테고리
  fee: string; // 수수료
  purchase_quantity: string; // 구매개수
  sold_quantity: string; // 판매개수
  purchase_date: string; // 구매날짜
  release_date: string; // 발매날짜
  sales_type: string; // 판매유형
  etc: string; // 비고
  created_by: string; // 작성자 (소유자)
  created_at?: string; // 등록일
};

// 음... 나중에 하기
export type TResult = {
  message: string;
  data: string;
};
