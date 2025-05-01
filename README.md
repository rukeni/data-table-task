# 회원 관리 테이블 프로젝트

회원 목록을 관리할 수 있는 테이블 애플리케이션입니다. 필드 타입별 커스터마이징이 가능하며, 확장성 있는 구조로 설계되었습니다.

## 기술 스택

- React
- TypeScript
- Ant Design (AntD)
- Vite
- pnpm

## Git 컨벤션

### 브랜치 전략 (TBD: Trunk-Based Development)

```
main (trunk)
  └── feature/{feature-name}
```

- `main`: 주요 개발 브랜치 (trunk)
- `feature/*`: 기능 개발 브랜치
  - 예: `feature/table-layout`, `feature/field-validation`

### 커밋 컨벤션 (Gitmoji)

주요 사용 이모지:

| 이모지 | 코드 | 설명 | 예시 |
|--------|------|------|------|
| ✨ | `:sparkles:` | 새로운 기능 | `✨ 테이블 필터링 기능 추가` |
| 🎨 | `:art:` | 코드 구조/형태 개선 | `🎨 필드 타입 인터페이스 리팩토링` |
| 🐛 | `:bug:` | 버그 수정 | `🐛 날짜 필드 유효성 검사 수정` |
| ♻️ | `:recycle:` | 코드 리팩토링 | `♻️ 스토리지 로직 분리` |
| 📝 | `:memo:` | 문서 추가/수정 | `📝 README 업데이트` |
| 🔧 | `:wrench:` | 설정 파일 수정 | `🔧 tsconfig 설정 변경` |
| ✅ | `:white_check_mark:` | 테스트 추가/수정 | `✅ 필드 검증 테스트 추가` |
| 🎉 | `:tada:` | 릴리즈 및 프로젝트 초기화 | `🎉 0.1.0 릴리즈` |

커밋 메시지 형식:
```
{이모지} {제목}

{본문}
```

예시:
```
✨ 회원 테이블 정렬 기능 추가

- 각 컬럼별 오름차순/내림차순 정렬 지원
- 다중 컬럼 정렬 지원
```

## 프로젝트 구조

```
src/
├── app/        # 애플리케이션 메인 컴포넌트
├── assets/     # 정적 리소스
├── styles/     # 스타일 파일
└── types/      # TypeScript 타입 정의
```

## 시작하기

### 필수 요구사항

- Node.js 18.0.0 이상
- pnpm 8.0.0 이상

### 설치

```bash
# 의존성 설치
pnpm install
```
