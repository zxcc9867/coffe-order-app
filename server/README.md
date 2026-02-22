# COZY 커피 주문 앱 - 백엔드 (Express)

Express + PostgreSQL 기반 API 서버.

## 사전 요구사항

- Node.js 18+
- PostgreSQL 설치 및 실행

## 데이터베이스 생성

PostgreSQL에 접속한 뒤 다음으로 DB를 생성한다.

```sql
CREATE DATABASE coffe_order;
```

(필요 시 사용자/비밀번호 생성 후 권한 부여)

## 환경 설정

`.env` 파일을 프로젝트 루트에 만들고 다음 변수를 설정한다. (`.env.example` 참고)

| 변수 | 설명 | 기본값 |
|------|------|--------|
| PORT | 서버 포트 | 3000 |
| DB_HOST | PostgreSQL 호스트 | localhost |
| DB_PORT | PostgreSQL 포트 | 5432 |
| DB_NAME | DB 이름 | coffe_order |
| DB_USER | DB 사용자 | postgres |
| DB_PASSWORD | DB 비밀번호 | (필수) |

## 실행

```bash
# 의존성 설치 (최초 1회)
npm install

# 개발 서버 (파일 변경 시 자동 재시작)
npm run dev

# 프로덕션 실행
npm run start
```

기본 주소: **http://localhost:3000**

## API

- `GET /api/health` - 서버 상태
- `GET /api/health/db` - DB 연결 상태 (연결 실패 시 503)

## 폴더 구조

```
server/
├── src/
│   ├── index.js   # 진입점 (dotenv 로드, 서버 기동)
│   ├── app.js     # Express 앱
│   └── db.js      # PostgreSQL 연결 (pg Pool)
├── .env.example
├── package.json
└── README.md
```

## 사용 패키지

- **express** - 웹 서버
- **pg** - PostgreSQL 클라이언트
- **dotenv** - 환경 변수 로드
- **nodemon** (dev) - 개발 시 자동 재시작
