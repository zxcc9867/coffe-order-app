# UI(프론트엔드) Render 배포 가이드

`coffe-order/ui` 를 Render **Static Site**로 배포할 때 필요한 **코드 수정 사항**과 **배포 과정**입니다.

---

## 1. 코드에서 수정할 부분

### ✅ 수정 없이 배포 가능

현재 코드는 이미 배포를 고려해 작성되어 있어 **추가 수정 없이** Render에 올릴 수 있습니다.

| 파일 | 내용 |
|------|------|
| `src/api.js` | `import.meta.env.VITE_API_URL || 'http://localhost:3000'` 로 API 주소 사용. 배포 시 Render에서 `VITE_API_URL`만 설정하면 됨. |
| 그 외 | localhost/3000 하드코딩 없음. |

### ⚠️ 반드시 할 일: 환경 변수만 설정

- **Vite**는 빌드 시점에 `VITE_` 로 시작하는 환경 변수를 코드에 **박아 넣습니다**.
- 따라서 **Render 대시보드에서 빌드 전에** `VITE_API_URL` 을 백엔드 URL로 설정해야 합니다.
- 설정하지 않으면 프론트가 `http://localhost:3000` 으로 요청을 보내서, 배포된 화면에서는 API가 동작하지 않습니다.

### (선택) 로컬 배포용 .env

로컬에서 배포용 빌드를 테스트할 때만 `ui/.env` 에 다음을 넣을 수 있습니다.  
**이 파일은 Git에 올리지 마세요.** (이미 `.gitignore`에 있을 수 있음)

```env
VITE_API_URL=https://실제백엔드URL.onrender.com
```

그 다음 `npm run build` → `npm run preview` 로 확인.

---

## 2. 배포 과정 (Render Static Site)

아래 순서대로 하면 됩니다. **백엔드(server)가 먼저 Render에 배포되어 있고, URL을 알고 있다고 가정합니다.**

### 2-1. 저장소 준비

- 프로젝트가 **GitHub(또는 GitLab)** 에 올라가 있어야 합니다.
- `coffe-order` 루트가 저장소 루트이고, 그 안에 `ui` 폴더가 있는 구조여야 합니다.

### 2-2. Render에서 Static Site 생성

1. [Render Dashboard](https://dashboard.render.com) 로그인
2. **New +** → **Static Site** 선택
3. **Connect a repository** 에서 사용하는 GitHub(또는 GitLab) 계정/저장소 선택
4. **coffe-order** 저장소 선택 후 **Connect** (이미 연결돼 있으면 해당 저장소 선택)

### 2-3. 설정 입력

| 항목 | 값 |
|------|-----|
| **Name** | `coffe-order-app` (원하는 이름) |
| **Region** | 원하는 지역 |
| **Root Directory** | `ui` **반드시 입력** (저장소 루트가 아니라 `ui` 폴더만 배포) |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

- **Root Directory** 를 `ui` 로 두지 않으면 `package.json` 을 찾지 못해 빌드가 실패합니다.

### 2-4. 환경 변수 추가 (필수)

1. **Environment** 섹션에서 **Add Environment Variable** 클릭
2. 다음 한 개 추가

   | Key | Value |
   |-----|--------|
   | `VITE_API_URL` | `https://실제백엔드서비스이름.onrender.com` |

   - **실제 백엔드 URL**은 Render에서 백엔드 Web Service 배포 후 나온 URL을 그대로 넣으면 됩니다.
   - 예: `https://coffe-order-app-backend.onrender.com`
   - **마지막 슬래시(`/`)는 넣지 마세요.**

3. **Save Changes** (또는 저장)

### 2-5. 배포 실행

1. **Create Static Site** 버튼 클릭
2. 첫 빌드가 자동으로 시작됩니다. 로그에서 `npm install` → `npm run build` 가 성공하는지 확인
3. 빌드가 성공하면 **Live URL** 이 생깁니다. (예: `https://coffe-order-app.onrender.com`)

### 2-6. 배포 후 확인

1. **Live URL** 로 접속
2. **주문하기** 탭에서 메뉴가 로드되는지, 장바구니·주문하기가 되는지 확인
3. **관리자** 탭에서 대시보드·재고·주문 목록이 로드되는지 확인
4. 문제가 있으면 브라우저 개발자 도구(F12) → **Network** 탭에서 API 요청 URL이 `https://...onrender.com/api/...` 로 나가는지 확인

---

## 3. 요약 체크리스트

- [ ] GitHub 등에 `coffe-order` 저장소 푸시 완료
- [ ] Render 백엔드(Web Service) 배포 완료, URL 확인
- [ ] Render **Static Site** 생성, **Root Directory = `ui`**
- [ ] **Build Command** = `npm install && npm run build`
- [ ] **Publish Directory** = `dist`
- [ ] **VITE_API_URL** = 백엔드 URL (슬래시 없이)
- [ ] 배포 후 Live URL에서 주문/관리자 동작 확인

---

## 4. 자주 나오는 문제

| 증상 | 확인할 것 |
|------|------------|
| 메뉴/주문/재고가 안 나옴 | `VITE_API_URL` 이 백엔드 URL과 일치하는지, **다시 빌드** 했는지 확인 (환경 변수 변경 후 재배포 필요) |
| 빌드 실패 (Cannot find package.json) | **Root Directory** 를 `ui` 로 설정했는지 확인 |
| 404 / 빈 화면 | **Publish Directory** 가 `dist` 인지 확인 |

이 문서는 `ui` 폴더 기준입니다. DB·백엔드 전체 배포는 루트의 **DEPLOY-RENDER.md** 를 참고하세요.
