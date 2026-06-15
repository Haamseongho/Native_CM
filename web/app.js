const { createApp, computed, ref } = Vue;

createApp({
  setup() {
    const activeView = ref("dashboard");
    const keyword = ref("");
    const selectedProjectStatus = ref("전체");
    const isMenuOpen = ref(false);

    const navigation = [
      { id: "dashboard", label: "전체 대시보드", icon: "▦" },
      { id: "projects", label: "프로젝트", icon: "▤" },
      { id: "cm", label: "CM 패키지", icon: "▧" },
      { id: "changes", label: "변경관리", icon: "⇄" },
      { id: "tsr", label: "TSR", icon: "✓" },
      { id: "reports", label: "보고서", icon: "▣" },
    ];

    const projects = [
      {
        id: "PRJ-001",
        name: "로그인/푸시 안정화",
        status: "완료",
        progress: 100,
        cmCount: 4,
        fileCount: 18,
        tsrCount: 30,
        md: 12.0,
        owner: "함성호",
        period: "2026-06-01 ~ 2026-06-14",
        resource: { new: 3, modify: 14, delete: 1 },
      },
      {
        id: "PRJ-002",
        name: "QR 스캔/EMVCo 파싱 개선",
        status: "진행중",
        progress: 68,
        cmCount: 5,
        fileCount: 26,
        tsrCount: 38,
        md: 15.5,
        owner: "함성호",
        period: "2026-06-10 ~ 2026-06-30",
        resource: { new: 6, modify: 19, delete: 1 },
      },
      {
        id: "PRJ-003",
        name: "eKYC 결과값 정규화",
        status: "진행중",
        progress: 48,
        cmCount: 3,
        fileCount: 13,
        tsrCount: 18,
        md: 7.0,
        owner: "함성호",
        period: "2026-06-15 ~ 2026-07-05",
        resource: { new: 2, modify: 11, delete: 0 },
      },
    ];

    const cmPackages = [
      {
        id: "CM-001",
        projectId: "PRJ-001",
        title: "로그인 API 예외 처리 개선",
        status: "완료",
        files: 5,
        commits: 3,
        tsr: 8,
        md: "3.0 MD",
        description: "네트워크 타임아웃과 서버 오류를 분리하고 사용자 안내 메시지를 개선합니다.",
        tags: ["REQ-001", "REQ-002", "고영향도"],
      },
      {
        id: "CM-003",
        projectId: "PRJ-001",
        title: "푸시 수신 처리 개선",
        status: "완료",
        files: 6,
        commits: 4,
        tsr: 10,
        md: "4.0 MD",
        description: "포그라운드/백그라운드 푸시 수신과 딥링크 이동 조건을 안정화합니다.",
        tags: ["REQ-005", "REQ-006", "검증완료"],
      },
      {
        id: "CM-006",
        projectId: "PRJ-002",
        title: "EMVCo TLV 파싱 개선",
        status: "진행중",
        files: 7,
        commits: 4,
        tsr: 10,
        md: "4.5 MD",
        description: "ID/Length/Value 구조를 안정적으로 파싱하고 CRC 영역 탐색을 보완합니다.",
        tags: ["REQ-010", "REQ-011", "TLV"],
      },
      {
        id: "CM-007",
        projectId: "PRJ-002",
        title: "Unicode QR 데이터 처리",
        status: "진행중",
        files: 6,
        commits: 3,
        tsr: 8,
        md: "3.5 MD",
        description: "다국어 QR 데이터의 UTF-8 바이트 길이 기준 Value 추출을 처리합니다.",
        tags: ["REQ-012", "UTF-8", "CRC"],
      },
    ];

    const changes = [
      {
        cmId: "CM-001",
        file: "LoginService.swift",
        path: "/ios/Network/LoginService.swift",
        type: "수정",
        impact: "high",
        impactText: "높음",
        summary: "네트워크 타임아웃 발생 시 1회 재시도 처리 추가",
      },
      {
        cmId: "CM-001",
        file: "ErrorMessage.swift",
        path: "/ios/Common/ErrorMessage.swift",
        type: "수정",
        impact: "medium",
        impactText: "중간",
        summary: "오류 원인별 사용자 안내 문구 분리",
      },
      {
        cmId: "CM-006",
        file: "EMVCoParser.swift",
        path: "/ios/QR/EMVCoParser.swift",
        type: "신규",
        impact: "high",
        impactText: "높음",
        summary: "TLV 전용 파서 신규 추가",
      },
      {
        cmId: "CM-006",
        file: "QRParser.swift",
        path: "/ios/QR/QRParser.swift",
        type: "수정",
        impact: "high",
        impactText: "높음",
        summary: "문자열 길이 기준에서 UTF-8 바이트 기준 파싱으로 변경",
      },
      {
        cmId: "CM-006",
        file: "CRCValidator.swift",
        path: "/ios/QR/CRCValidator.swift",
        type: "수정",
        impact: "high",
        impactText: "높음",
        summary: "UTF-8 기준 CRC 검증 구조 보완",
      },
    ];

    const tsrCases = [
      {
        id: "TSR-001",
        name: "정상 로그인 테스트",
        projectId: "PRJ-001",
        cmId: "CM-001",
        change: "로그인 API 정상 처리",
        device: "iPhone 15",
        os: "iOS 18",
        md: 0.25,
        result: "PASS",
      },
      {
        id: "TSR-002",
        name: "네트워크 타임아웃 테스트",
        projectId: "PRJ-001",
        cmId: "CM-001",
        change: "재시도 로직 확인",
        device: "iPhone 14",
        os: "iOS 17",
        md: 0.5,
        result: "PASS",
      },
      {
        id: "TSR-021",
        name: "일반 EMVCo QR 파싱 테스트",
        projectId: "PRJ-002",
        cmId: "CM-006",
        change: "TLV 구조 정상 파싱",
        device: "Galaxy S23",
        os: "Android 15",
        md: 0.625,
        result: "PASS",
      },
      {
        id: "TSR-022",
        name: "ID 순서 불규칙 QR 파싱 테스트",
        projectId: "PRJ-002",
        cmId: "CM-006",
        change: "ID 64 이후 63 미출현 케이스",
        device: "iPhone 15",
        os: "iOS 18",
        md: 0.75,
        result: "진행중",
      },
      {
        id: "TSR-023",
        name: "Unicode QR 파싱 테스트",
        projectId: "PRJ-002",
        cmId: "CM-007",
        change: "UTF-8 바이트 기준 Value 추출",
        device: "Galaxy Z Fold",
        os: "Android 15",
        md: 0.75,
        result: "진행중",
      },
      {
        id: "TSR-031",
        name: "eKYC 결과값 정규화 테스트",
        projectId: "PRJ-003",
        cmId: "CM-010",
        change: "OCR 결과 필드 매핑 확인",
        device: "Galaxy S23",
        os: "Android 15",
        md: 0.625,
        result: "대기",
      },
    ];

    const totals = {
      projects: 3,
      runningProjects: 2,
      completedProjects: 1,
      cm: 12,
      completedCm: 8,
      files: 57,
      commits: 24,
      tsr: 86,
      tsrPass: 72,
      tsrFail: 5,
      tsrRunning: 6,
      tsrPending: 3,
      md: 34.5,
    };

    const projectStatuses = ["전체", "진행중", "완료"];

    const currentTitle = computed(() => {
      return navigation.find((item) => item.id === activeView.value)?.label || "전체 대시보드";
    });

    const averageProgress = computed(() => {
      const total = projects.reduce((sum, project) => sum + project.progress, 0);
      return Math.round(total / projects.length);
    });

    const passRate = computed(() => Math.round((totals.tsrPass / totals.tsr) * 1000) / 10);

    const donutStyle = computed(() => {
      const pass = (totals.tsrPass / totals.tsr) * 100;
      const fail = (totals.tsrFail / totals.tsr) * 100;
      const running = (totals.tsrRunning / totals.tsr) * 100;
      return {
        background: `conic-gradient(#1f9d68 0 ${pass}%, #d44949 ${pass}% ${pass + fail}%, #d99a22 ${pass + fail}% ${pass + fail + running}%, #8d96a8 ${pass + fail + running}% 100%)`,
      };
    });

    const summaryCards = computed(() => [
      { label: "전체 프로젝트", value: `${totals.projects}개`, note: `진행중 ${totals.runningProjects} · 완료 ${totals.completedProjects}` },
      { label: "CM 패키지", value: `${totals.cm}개`, note: `완료 ${totals.completedCm}개` },
      { label: "변경 파일", value: `${totals.files}개`, note: `커밋 ${totals.commits}건 연결` },
      { label: "TSR 테스트", value: `${totals.tsr}건`, note: `PASS ${totals.tsrPass}건` },
      { label: "총 공수", value: `${totals.md} MD`, note: "분석 · 개발 · 검증 · 보고" },
    ]);

    const normalizedKeyword = computed(() => keyword.value.trim().toLowerCase());

    function containsKeyword(...values) {
      if (!normalizedKeyword.value) return true;
      return values.some((value) => String(value).toLowerCase().includes(normalizedKeyword.value));
    }

    const filteredProjects = computed(() => {
      return projects.filter((project) => containsKeyword(project.id, project.name, project.status, project.owner));
    });

    const projectRows = computed(() => {
      return filteredProjects.value.filter((project) => {
        return selectedProjectStatus.value === "전체" || project.status === selectedProjectStatus.value;
      });
    });

    const filteredCmPackages = computed(() => {
      return cmPackages.filter((cm) => containsKeyword(cm.id, cm.projectId, cm.title, cm.status, cm.tags.join(" ")));
    });

    const filteredChanges = computed(() => {
      return changes.filter((change) => containsKeyword(change.cmId, change.file, change.path, change.summary));
    });

    const filteredTsr = computed(() => {
      return tsrCases.filter((test) => containsKeyword(test.id, test.name, test.projectId, test.cmId, test.result));
    });

    const bottlenecks = computed(() => [
      {
        level: "high",
        levelText: "주의",
        title: "PRJ-003 완성도 48%",
        description: "eKYC 결과값 정규화 프로젝트의 요구사항 분석과 TSR 진행률 확인이 필요합니다.",
      },
      {
        level: "medium",
        levelText: "검토",
        title: "CM-006 진행중 테스트",
        description: "ID 순서 불규칙 QR 파싱 테스트가 진행중이며 CRC 영역 검증 보완이 남아 있습니다.",
      },
      {
        level: "low",
        levelText: "대기",
        title: "CM-008 CRC 검증 로직",
        description: "QR 프로젝트 내 대기 상태 CM으로, 최종 보고 전 작업 계획 반영이 필요합니다.",
      },
    ]);

    function setView(viewId) {
      activeView.value = viewId;
      isMenuOpen.value = false;
    }

    function selectProject(project) {
      keyword.value = project.id;
      activeView.value = "cm";
    }

    function statusClass(status) {
      if (status === "완료" || status === "PASS") return "done";
      if (status === "진행중") return "running";
      if (status === "FAIL") return "fail";
      return "pending";
    }

    return {
      activeView,
      averageProgress,
      bottlenecks,
      changes,
      cmPackages,
      currentTitle,
      donutStyle,
      filteredChanges,
      filteredCmPackages,
      filteredProjects,
      filteredTsr,
      isMenuOpen,
      keyword,
      navigation,
      passRate,
      projectRows,
      projects,
      projectStatuses,
      selectedProjectStatus,
      selectProject,
      setView,
      statusClass,
      summaryCards,
      totals,
    };
  },
}).mount("#app");
