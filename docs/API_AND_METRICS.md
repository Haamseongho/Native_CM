# API 및 집계 규칙

## 1. API 설계 원칙

| 원칙 | 설명 |
|---|---|
| 프로젝트 기준 조회 | 대부분의 목록은 `projectId` 또는 `projectCode` 필터를 지원 |
| CM 중심 변경관리 | 커밋, 변경 파일, TSR은 반드시 CM 패키지에 연결 |
| 서버 집계 우선 | 완성도, PASS율, 리소스 수는 서버에서 계산해 화면 불일치를 방지 |
| 이력 보존 | 삭제보다 비활성 또는 상태 변경을 우선 적용 |
| 보고서 재생성 가능 | 보고서는 저장된 스냅샷과 최신 데이터 재생성을 모두 지원 |

## 2. 주요 API

### 2.1 Dashboard

| Method | Path | 설명 |
|---|---|---|
| GET | `/api/dashboard/summary` | 전체 프로젝트, CM, 파일, 커밋, TSR, 공수 요약 |
| GET | `/api/dashboard/projects/progress` | 프로젝트별 완성도 목록 |
| GET | `/api/dashboard/tsr-results` | 전체 TSR 결과 분포 |
| GET | `/api/dashboard/bottlenecks` | 지연 프로젝트, FAIL TSR, 증적 누락 목록 |
| GET | `/api/dashboard/recent-activities` | 최근 커밋, 변경 파일, TSR 변경 이력 |

### 2.2 Projects

| Method | Path | 설명 |
|---|---|---|
| GET | `/api/projects` | 프로젝트 목록 조회 |
| POST | `/api/projects` | 프로젝트 생성 |
| GET | `/api/projects/{projectId}` | 프로젝트 상세 조회 |
| PATCH | `/api/projects/{projectId}` | 프로젝트 수정 |
| POST | `/api/projects/{projectId}/close` | 프로젝트 마감 |
| GET | `/api/projects/{projectId}/summary` | 프로젝트 집계 요약 |

### 2.3 Deliverables and Requirements

| Method | Path | 설명 |
|---|---|---|
| GET | `/api/projects/{projectId}/deliverables` | 산출물 목록 |
| PUT | `/api/deliverables/{deliverableId}` | 산출물 상태/완료율 수정 |
| GET | `/api/projects/{projectId}/requirements` | 요구사항 목록 |
| POST | `/api/projects/{projectId}/requirements` | 요구사항 생성 |
| PATCH | `/api/requirements/{requirementId}` | 요구사항 수정 |

### 2.4 CM Packages

| Method | Path | 설명 |
|---|---|---|
| GET | `/api/cm-packages` | CM 패키지 목록 |
| POST | `/api/projects/{projectId}/cm-packages` | CM 패키지 생성 |
| GET | `/api/cm-packages/{cmPackageId}` | CM 상세 조회 |
| PATCH | `/api/cm-packages/{cmPackageId}` | CM 수정 |
| POST | `/api/cm-packages/{cmPackageId}/requirements` | 요구사항 연결 |
| GET | `/api/cm-packages/{cmPackageId}/summary` | CM 집계 요약 |

### 2.5 Commits and File Changes

| Method | Path | 설명 |
|---|---|---|
| GET | `/api/cm-packages/{cmPackageId}/commits` | CM별 커밋 목록 |
| POST | `/api/cm-packages/{cmPackageId}/commits` | 커밋 등록 |
| GET | `/api/commits/{commitId}/file-changes` | 커밋별 변경 파일 목록 |
| POST | `/api/commits/{commitId}/file-changes` | 변경 파일 등록 |
| GET | `/api/file-changes/{fileChangeId}` | 변경 파일 상세 |
| PATCH | `/api/file-changes/{fileChangeId}` | 변경 파일 수정 |
| PUT | `/api/file-changes/{fileChangeId}/comparison` | 변경 전/후 비교 저장 |

### 2.6 TSR and Evidence

| Method | Path | 설명 |
|---|---|---|
| GET | `/api/tsr-cases` | TSR 목록 |
| POST | `/api/cm-packages/{cmPackageId}/tsr-cases` | TSR 생성 |
| GET | `/api/tsr-cases/{tsrCaseId}` | TSR 상세 |
| PATCH | `/api/tsr-cases/{tsrCaseId}` | TSR 수정 |
| POST | `/api/tsr-cases/{tsrCaseId}/evidence` | 증적 업로드 |
| DELETE | `/api/evidence/{evidenceId}` | 증적 삭제 또는 비활성 |

### 2.7 Reports

| Method | Path | 설명 |
|---|---|---|
| POST | `/api/reports/personal/generate` | 개인 실적 보고서 생성 |
| POST | `/api/reports/project-final/generate` | 프로젝트 최종 보고서 생성 |
| GET | `/api/reports/{reportId}` | 보고서 상세 |
| POST | `/api/reports/{reportId}/submit` | 보고서 제출 |
| POST | `/api/reports/{reportId}/approve` | 보고서 승인 |
| GET | `/api/reports/{reportId}/export` | Markdown, HTML, PDF 내보내기 |

## 3. 요청/응답 예시

### 3.1 프로젝트 생성

```json
{
  "projectCode": "PRJ-002",
  "name": "QR 스캔/EMVCo 파싱 개선",
  "leaderId": "user-001",
  "ownerId": "user-002",
  "startDate": "2026-06-10",
  "endDate": "2026-06-30",
  "status": "진행중"
}
```

### 3.2 CM 패키지 생성

```json
{
  "cmCode": "CM-006",
  "title": "EMVCo TLV 파싱 개선",
  "ownerId": "user-002",
  "status": "진행중",
  "md": 4.5,
  "requirementIds": ["req-010", "req-011"]
}
```

### 3.3 커밋 등록

```json
{
  "commitHash": "q1w2e3r",
  "message": "EMVCo TLV 파서 신규 추가",
  "authorId": "user-002",
  "committedAt": "2026-06-15",
  "changeType": "신규",
  "impactLevel": "높음"
}
```

### 3.4 변경 파일 등록

```json
{
  "fileName": "EMVCoParser.swift",
  "filePath": "/ios/QR/EMVCoParser.swift",
  "changeType": "신규",
  "beforeSummary": "기존 파서 없음",
  "afterSummary": "TLV 전용 파서 추가",
  "impactLevel": "높음",
  "testRequired": true
}
```

### 3.5 TSR 결과 수정

```json
{
  "result": "PASS",
  "actualResult": "일반 EMVCo QR이 TLV 구조로 정상 파싱됨",
  "testedAt": "2026-06-15",
  "testerId": "user-002"
}
```

## 4. 집계 규칙

### 4.1 전체 요약

| 지표 | 계산식 |
|---|---|
| 전체 프로젝트 수 | `count(projects)` |
| 진행 중 프로젝트 | `count(projects where status in ('진행중', '검증중'))` |
| 완료 프로젝트 | `count(projects where status = '완료')` |
| 전체 CM 패키지 수 | `count(cm_packages)` |
| 완료 CM 패키지 수 | `count(cm_packages where status = '완료')` |
| 전체 변경 파일 수 | `count(file_changes)` |
| 전체 커밋 수 | `count(commit_records)` |
| 전체 TSR 수 | `count(tsr_cases)` |
| PASS TSR 수 | `count(tsr_cases where result = 'PASS')` |
| 총 투입 공수 | `sum(cm_packages.md) + sum(tsr_cases.md)` 또는 프로젝트 기준 정책값 |
| 평균 완성도 | `avg(projects.progress_rate)` |

### 4.2 프로젝트 완성도

```text
deliverableRate =
  workPlanRate * 0.10
+ ioAnalysisRate * 0.10
+ requirementAnalysisRate * 0.15

cmRate = completedCmCount / totalCmCount * 100
tsrCompletionRate = completedTsrCount / totalTsrCount * 100
evidenceRate = tsrWithEvidenceCount / evidenceRequiredTsrCount * 100
reportRate = finalReportCompletionRate

projectProgress =
  deliverableRate
+ cmRate * 0.30
+ tsrCompletionRate * 0.20
+ evidenceRate * 0.10
+ reportRate * 0.05
```

완료 TSR의 기본 정의는 PASS 또는 FAIL이다. 진행중/미수행은 완료로 보지 않는다.

### 4.3 CM 패키지 완성도

| 항목 | 가중치 |
|---|---:|
| 요구사항 연결 | 15% |
| 개발 항목 완료율 | 25% |
| 커밋 등록 | 15% |
| 변경 파일 등록 및 비교 | 20% |
| TSR 완료율 | 20% |
| 증적 등록률 | 5% |

### 4.4 TSR 지표

| 지표 | 계산식 |
|---|---|
| 테스트 완료율 | `(PASS + FAIL + 보류) / 전체 TSR * 100` |
| PASS율 | `PASS / 전체 TSR * 100` |
| 실행 기준 PASS율 | `PASS / (PASS + FAIL) * 100` |
| 증적 등록률 | `증적 있는 TSR / 증적 필요 TSR * 100` |
| FAIL율 | `FAIL / 전체 TSR * 100` |

대시보드 기본 PASS율은 원본 문서와 맞춰 `PASS / 전체 TSR`로 계산한다. 품질 분석 화면에서는 실행 기준 PASS율을 별도 표시한다.

### 4.5 리소스 처리 점수

초기 점수는 업무량과 난이도를 함께 반영한다.

```text
resourceScore =
  신규 파일 수 * 3
+ 수정 파일 수 * 2
+ 삭제 파일 수 * 1
+ 고영향도 파일 수 * 3
+ 커밋 수 * 1
+ PASS TSR 수 * 0.5
```

조직 평가 기준에 맞춰 가중치는 관리자 설정으로 분리한다.

## 5. 유효성 검증

| 상황 | 처리 |
|---|---|
| CM 없이 커밋 등록 | 400 오류 |
| 커밋 없이 변경 파일 등록 | 400 오류 |
| PASS인데 증적 없음 | 저장은 허용하되 품질 점검 경고 또는 완료 불가 |
| FAIL인데 실제 결과 없음 | 저장 불가 |
| 프로젝트 완료 시 미완료 CM 존재 | 완료 불가 |
| 프로젝트 완료 시 증적 누락 존재 | 경고 또는 완료 불가, 정책값으로 제어 |

## 6. 보고서 생성 규칙

### 6.1 개인 실적 보고서

입력:

| 항목 | 설명 |
|---|---|
| 대상자 | 보고 대상 사용자 |
| 기간 | 시작일, 종료일 |
| 프로젝트 필터 | 선택 |

포함 지표:

| 지표 | 기준 |
|---|---|
| 담당 프로젝트 수 | 기간 내 대상자가 담당자 또는 참여자인 프로젝트 |
| 담당 CM 수 | 대상자가 owner인 CM |
| 변경 파일 수 | 대상자 커밋에 연결된 파일 |
| 커밋 수 | 대상자 커밋 |
| TSR 수 | 대상자가 작성 또는 수행한 TSR |
| PASS 수 | 대상자 TSR 중 PASS |
| 공수 | CM MD + TSR MD |
| 정량 성과 | 프로젝트별 성과 지표 중 대상자 기여 항목 |

### 6.2 프로젝트 최종 보고서

포함 섹션:

| 섹션 | 내용 |
|---|---|
| 프로젝트 개요 | 기간, 리더, 담당자, 상태, 완성도 |
| 요구사항 처리 | 요구사항 수, 완료율, 미결 이슈 |
| CM 처리 | CM 목록, 상태, 공수 |
| 변경 리소스 | 신규/수정/삭제 파일, 고영향도 파일 |
| 테스트 결과 | TSR 결과, PASS율, FAIL 목록 |
| 증적 | 증적 등록률, 누락 항목 |
| 성과 | 개선 전/후 지표, 변화량 |
| 잔여 리스크 | 미완료, 보류, 재검증 필요 항목 |
