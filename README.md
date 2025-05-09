# 상품 관리 시스템 (React + AG-Grid)

## 프로젝트 개요

이 프로젝트는 상품 정보를 테이블 기반으로 관리할 수 있는
UI 시스템을 React로 구현한것입니다.

단순 구현이 아닌 유지보수를 쉽게 할 수 있는 것에 중점을 두었습니다.

설계를 연습하기 위한 프로젝트입니다.

---

## 주요기능

- AG-Grid 기반 테이블 UI
- React Hook Form + zod 폼 시스템
- 날짜 입력 커스텀 컴포넌트 (DataPicker + React Hook Form + theme)
- Toast 메시지를 통한 사용자 피드백 일관성 유지
- 테마 전환 (zustand + Styled Components)
- Framer Motion을 활용한 버튼 애니메이션 및 인터렉션 강화
- Flask + SQLite 백엔드 연동

---

## 기술 스택

| 범주        | 내용                              |
| ----------- | --------------------------------- |
| 프론트엔드  | React, TypeScript, Vite           |
| 테이블      | AG-Grid                           |
| 폼          | React Hook Form, zod              |
| 전역 상태   | zustand                           |
| 스타일링    | styled-components + ThemeProvider |
| 날짜 선택   | react-datepicker                  |
| 알림        | react-toastify                    |
| 애니메이션  | Framer Motion                     |
| 백엔드 연동 | Flask + SQLite (RESTful API)      |

---

## 설계 포인트

### 1. 상태와 스타일의 분리

- ThemeProvider로 스타일 계층 분리
- zustand로 전역 상태 관리 → 테마 토글 독립화

### 2. 유효성 검증 구조화

- zod로 폼 유효성 로직을 schema 단위로 통합
- RHF Controller로 외부 컴포넌트(DatePicker)와 안정적으로 연동

### 3. 유틸 함수 추상화

- `getDataFetch`, `postDataFetch` 등 fetch 로직 공통화
- Toast 메시지도 상수화로 일관성 유지

### 4. 컴포넌트 재사용성 확보

- CustomButton, RHFInput, CustomDatePicker로 공통 인터페이스 유지
- motion 적용을 위한 prop 기반 확장성 고려

---

## 배운점

- **공식문서를 잘 확인하자**
  → 왠만한 오류는 여기서 잡을 수 있다고 느낌

- **주석을 잘 달아두자**
  → 일주일 뒤의 내가 모르면 그 누구도 모르는 코드

## 향후 계획

- 사용자 인증 + 로그인 연동
- 테스트 코드 해보기
- Theme 상태 localStorage에 저장

## 폴더 구조 요약

src/
┣ components/ # 공통 UI 컴포넌트
┣ pages/ # Home, Detail 등 페이지
┣ store/ # zustand 전역 상태
┣ layout/ # 레이아웃 컴포넌트
┣ utils/ # fetch, toast, grid 유틸
┣ theme.ts # 다크/라이트 테마 정의
┣ routes.tsx # React Router 설정
┣ styled.d.ts # styled-components 타입
┗ main.tsx # 앱 진입점
