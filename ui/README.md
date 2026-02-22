# COZY 커피 주문 앱 - 프론트엔드

React + Vite + JavaScript 기반 UI.

## 실행

```bash
# 의존성 설치 (최초 1회)
npm install

# 개발 서버 (핫 리로드)
npm run dev
```

개발 서버 기본 주소: http://localhost:5173

## 스크립트

| 명령어 | 설명 |
|--------|------|
| `npm run dev` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 결과물 로컬 미리보기 |
| `npm run lint` | ESLint 실행 |

## 기술 스택

- **React** 19.x
- **Vite** 7.x
- **JavaScript** (바닐라 JS + JSX)

## 폴더 구조

```
ui/
├── public/
├── src/
│   ├── main.jsx    # 진입점
│   ├── App.jsx     # 루트 컴포넌트
│   ├── index.css   # 전역 스타일
│   └── assets/
├── index.html
├── vite.config.js
└── package.json
```
