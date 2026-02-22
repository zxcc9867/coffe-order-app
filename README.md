# COZY 커피 주문 앱

고객이 메뉴를 보고 주문하고, 관리자가 주문·재고를 처리하는 **[커피 주문 웹 앱](https://coffe-order-app-frontend.onrender.com/)**입니다.



---

## 이 앱으로 할 수 있는 것

| 대상 | 기능 |
|------|------|
| **고객 (주문하기)** | 메뉴 보기 → 옵션 선택 → 장바구니에 담기 → 수량 조절 → 주문하기 → 완료 알림 |
| **관리자** | 주문 현황 보기, 제조 시작/제조 완료 처리, 재고 현황 보기·수량 조절 |

---

## 화면 구성

- **주문하기**: 메뉴 카드(이미지·가격·옵션), 장바구니(수량 ±), 주문하기 버튼, 완료 토스트
- **관리자**: 대시보드(총 주문/접수/제조 중/완료), 재고 현황(± 버튼·새로고침), 주문 목록(제조 시작·제조 완료)

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| **프론트엔드** | React, Vite |
| **백엔드** | Node.js, Express |
| **DB** | PostgreSQL |
| **배포** | Render.com (가이드: [DEPLOY-RENDER.md](./DEPLOY-RENDER.md)) |

---

## 프로젝트 구조

```
coffe-order/
├── ui/                 # 프론트엔드 (React + Vite)
│   ├── public/images/  # 메뉴 이미지
│   ├── src/
│   │   ├── api.js      # 백엔드 API 호출
│   │   ├── App.jsx
│   │   ├── components/ # 주문 화면, 장바구니, 관리자 컴포넌트
│   │   └── ...
│   └── package.json
├── server/             # 백엔드 (Express)
│   ├── src/
│   │   ├── index.js    # 서버 진입점
│   │   ├── app.js      # 라우트·CORS
│   │   ├── db.js       # PostgreSQL 연결
│   │   └── routes/     # /api/menus, /api/orders, /api/stock
│   ├── scripts/
│   │   └── init-db.js  # 테이블 생성 + 시드(메뉴·재고)
│   └── package.json
├── DEPLOY-RENDER.md    # Render 배포 순서·설정
├── PRD-화면.md         # 화면 기획
└── README.md           # 이 파일
```

---

## 로컬에서 실행하기

### 1. 데이터베이스 준비

PostgreSQL에서 DB 생성:

```sql
CREATE DATABASE coffe_order;
```

### 2. 백엔드

```bash
cd server
cp .env.example .env   # .env에 DB 비밀번호 등 입력
npm install
node scripts/init-db.js   # 테이블 + 시드 (최초 1회)
npm run dev
```

→ **http://localhost:3000** 에서 API 동작

### 3. 프론트엔드

```bash
cd ui
npm install
npm run dev
```

→ **http://localhost:5173** 에서 앱 접속 (주문하기 / 관리자 탭)

---

## 환경 변수 요약

| 위치 | 변수 | 설명 |
|------|------|------|
| **server** | `PORT` | 서버 포트 (기본 3000) |
| **server** | `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | PostgreSQL 연결 (로컬) |
| **server** | `DATABASE_URL` | 한 줄 연결 문자열 (Render 등 배포 시 사용) |
| **ui** (빌드 시) | `VITE_API_URL` | 백엔드 API 주소 (배포 시 필수, 예: `https://xxx.onrender.com`) |

---

## API 개요

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/menus` | 메뉴 목록 |
| GET | `/api/orders` | 주문 목록 |
| GET | `/api/orders/stats` | 주문 통계 (총/접수/제조중/완료) |
| POST | `/api/orders` | 주문 생성 |
| PATCH | `/api/orders/:id` | 주문 상태 변경 (제조 시작/완료 시 재고 차감) |
| GET | `/api/stock` | 재고 조회 |
| PATCH | `/api/stock` | 재고 수정 |

---

## 라이선스

ISC
