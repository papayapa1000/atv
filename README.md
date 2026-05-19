# 제천 ATV & 수상레저 홈페이지

청풍호 수상레저와 ATV 예약을 위한 Next.js 랜딩 페이지입니다. 현재는 PDF 기획 문서와 로컬 참고 이미지를 기준으로 메인 화면, 테마, 요금/예약 안내, 갤러리 프리뷰를 먼저 구현했습니다.

## Quick Start

```bash
npm install
npm run dev
```

개발 서버 기본 주소는 `http://127.0.0.1:3000` 또는 `http://localhost:3000`입니다.

## Commands

| Command | Description |
| --- | --- |
| `npm run dev` | 개발 서버 실행 |
| `npm run lint` | ESLint 검사 |
| `npm run build` | 프로덕션 빌드 |
| `npm audit --audit-level=moderate` | moderate 이상 보안 감사 |

## Theme Direction

- 핵심 톤: 청풍호의 고요한 풍경과 수상레저/ATV의 속도감을 함께 보여주는 실사용 랜딩
- 컬러: 딥 레이크, 포레스트, 미스트, 선셋 오렌지, 선 옐로우
- 첫 화면: `석양모터보트(메인).jpg`를 웹 최적화해 풀블리드 히어로로 사용
- 정보 우선순위: 전화예약, 요금, 운행시간, 단체 예약, 안전 안내를 첫 진입에서 빠르게 확인

## Structure

- `src/app/page.tsx`: 메인 랜딩 조립
- `src/components/home/*`: 히어로, 프로그램, 요금, 예약, 갤러리, 푸터 섹션
- `src/lib/site-data.ts`: PDF 기반 카피, 요금, 예약/안전 규정 데이터
- `public/images/*`: 참고이미지에서 선별한 웹용 최적화 이미지

## Next Steps

- Supabase Storage: 갤러리, 동영상, 손님 자랑하기 이미지 업로드
- Supabase Database: 예약 문의, 갤러리 게시물, 주변 숙박 목록 테이블
- 관리자 화면: 쥔장 사진/영상 등록, 예약 문의 확인, 숙박 업체 관리
