# Render.com 배포 가이드 (COZY 커피 주문)

배포 순서: **1. 데이터베이스 → 2. 백엔드 → 3. 프론트엔드**

---

## 1단계: 데이터베이스 (PostgreSQL)

1. [Render Dashboard](https://dashboard.render.com) → **New +** → **PostgreSQL**
2. 설정
   - **Name**: `coffe-order-db` (원하는 이름)
   - **Region**: Singapore 또는 가까운 지역
   - **Plan**: Free 선택
3. **Create Database** 클릭
4. 생성 후 **Internal Database URL** 복사 (예: `postgres://user:pass@host/dbname`)
   - 배포된 백엔드와 같은 서비스면 Internal, 외부 접속이면 **External Database URL** 사용

### DB 스키마 및 시드 적용

DB가 준비된 뒤 **로컬에서 한 번만** 실행합니다.

```bash
cd server
# .env에 Render에서 복사한 URL 설정 (또는 아래처럼 직접 지정)
set DATABASE_URL=postgres://...   # Windows CMD
# 또는 PowerShell: $env:DATABASE_URL="postgres://..."
node scripts/init-db.js
```

- `DATABASE_URL`만 있으면 됩니다. (Render PostgreSQL은 이 하나로 연결)
- 테이블 생성 + 메뉴 5종, 재고 3종 시드가 들어갑니다.

---

## 2단계: 백엔드 (Web Service)

1. Render Dashboard → **New +** → **Web Service**
2. 저장소 연결
   - GitHub/GitLab 연결 후 **coffe-order** 저장소 선택
   - **Root Directory**: `server` 로 지정 (루트가 아닌 server 폴더만 배포)
3. 설정
   - **Name**: `coffe-order-api` (원하는 이름)
   - **Region**: DB와 동일 권장
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

4. **Environment** 변수 추가

   | Key           | Value                    |
   |---------------|--------------------------|
   | `PORT`        | `3000`                   |
   | `DATABASE_URL`| (1단계에서 복사한 Internal Database URL) |

   - Render PostgreSQL를 같은 계정에서 만들었다면 **Internal Database URL** 사용
   - DB와 다른 서비스면 **External Database URL** 사용

5. **Create Web Service** 후 배포 완료될 때까지 대기
6. 배포된 URL 확인 (예: `https://coffe-order-api.onrender.com`)

---

## 3단계: 프론트엔드 (Static Site 또는 Web Service)

### 방법 A: Static Site (권장, 무료)

1. Render Dashboard → **New +** → **Static Site**
2. 같은 저장소 선택
3. **Root Directory**: `ui` 로 지정
4. 설정
   - **Name**: `coffe-order-app`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist` (Vite 기본 출력 폴더)

5. **Environment** 변수 추가 (빌드 시점에만 사용)

   | Key              | Value                                  |
   |------------------|----------------------------------------|
   | `VITE_API_URL`    | `https://coffe-order-api.onrender.com` |

   ⚠️ 반드시 **2단계 백엔드 URL**을 그대로 넣어야 합니다. (마지막 `/` 제거)

6. **Create Static Site** 후 배포
7. 배포된 프론트 URL에서 주문/관리자 화면 동작 확인

### 방법 B: Web Service로 프론트 서빙

- Node로 `ui`를 빌드한 뒤 `serve` 등으로 `dist`를 서빙할 수도 있으나, Static Site가 더 단순합니다.

---

## 체크리스트

- [ ] 1. PostgreSQL 생성 후 **Internal/External URL** 복사
- [ ] 2. 로컬에서 `DATABASE_URL` 설정 후 `node scripts/init-db.js` 실행
- [ ] 3. 백엔드 Web Service 생성, **Root Directory = `server`**, `DATABASE_URL`, `PORT` 설정
- [ ] 4. 백엔드 URL 확인 (예: `https://xxx.onrender.com`)
- [ ] 5. 프론트 Static Site 생성, **Root Directory = `ui`**, **VITE_API_URL = 백엔드 URL**
- [ ] 6. 프론트 URL에서 로그인/주문/관리자 동작 확인

---

## 참고

- **Free Plan** 백엔드는 약 15분 미사용 시 sleep → 첫 요청 시 수 초 지연될 수 있음
- Render PostgreSQL Free는 90일 후 데이터 삭제될 수 있음 (정책 확인)
- CORS: 백엔드는 `Access-Control-Allow-Origin: *` 로 모든 도메인 허용 중 (Render 프론트에서 그대로 호출 가능)
- DB SSL: Render PostgreSQL은 HTTPS 연결을 쓰므로, `db.js`는 production에서 `ssl: { rejectUnauthorized: false }` 로 연결함
