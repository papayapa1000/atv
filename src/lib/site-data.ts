export const phoneNumber = "010-4634-5020";
export const phoneHref = "tel:01046345020";

export const businessInfo = {
  name: "제천수상레저(주)",
  representative: "박병익",
  registrationNumber: "304-81-22695",
  postalCode: "27211",
  address: "충청북도 제천시 금성면 청풍호로 1482",
} as const;

export const depositAccounts = [
  {
    key: "water-leisure",
    title: "수상레저 예약금",
    target: "수상스키, 웨이크보드, 수상 놀이기구, 모터보트, 단체 패키지",
    owner: "제천수상레저(주)",
    bank: "농협",
    accountNumber: "351-1008-4485-63",
    guidance: "수상스키, 웨이크보드, 수상 놀이기구, 모터보트 예약금은 이 계좌로 입금해 주세요.",
  },
  {
    key: "atv",
    title: "ATV 예약금",
    target: "ATV 이용 시",
    owner: "장완주",
    bank: "국민은행",
    accountNumber: "702701-01-514922",
    guidance: "즐길거리에서 ATV를 선택했다면 이 계좌로 입금해 주세요.",
  },
] as const;

export const navItems = [
  {
    label: "수상스키/ATV",
    href: "/water-ski-atv",
    subItems: [
      { label: "인사말", href: "/water-ski-atv#greeting" },
      { label: "주변관광지", href: "/water-ski-atv#nearby" },
      { label: "찾아오시는 길", href: "/water-ski-atv#location" },
    ],
  },
  { label: "즐길거리", href: "/activities" },
  {
    label: "예약하기",
    href: "/reservation",
    subItems: [
      { label: "예약게시판", href: "/reservation/board" },
      { label: "예약글쓰기", href: "/reservation/write" },
      { label: "예약안내", href: "/reservation" },
    ],
  },
  { label: "갤러리", href: "/gallery" },
  { label: "동영상", href: "/videos" },
  { label: "자랑하기", href: "/showcase" },
  { label: "주변 숙박", href: "/stay" },
];

export const heroHighlights = [
  { label: "운영 시간", value: "09:00 - 19:00" },
  { label: "단체 예약", value: "10인 이상 사전 문의" },
  { label: "예약금", value: "50,000원 선입금" },
  { label: "대표 전화", value: phoneNumber },
];

export const programCards = [
  {
    title: "수상스키",
    eyebrow: "Water Skiing",
    description: "보트의 견인력을 이용해 물 위를 활주하는 대표 수상 스포츠입니다. 초보강습은 지상교육, 봉 1회, 로프 1회와 장비 무상대여를 포함합니다.",
    image: "/images/activity-water-ski.webp",
    price: "초보강습 80,000원 / 아웃보트 28,000원 / 매직보트 33,000원",
  },
  {
    title: "웨이크보드",
    eyebrow: "Wakeboarding",
    description: "보트가 만든 물결을 따라 하나의 보드 위에서 균형감과 속도감을 함께 즐기는 코스입니다. 수상스키와 같은 강습 및 장비 무상대여 기준으로 운영합니다.",
    image: "/images/activity-wakeboard.webp",
    price: "초보강습 80,000원 / 아웃보트 28,000원 / 매직보트 33,000원",
  },
  {
    title: "플라이피쉬",
    eyebrow: "Flyfish",
    description: "물살과 바람을 동시에 받으며 위로 떠오르는 강한 스릴형 놀이기구입니다. 짧고 선명한 체험을 원하는 분에게 잘 맞습니다.",
    image: "/images/activity-flyfish-1.webp",
    price: "1인 25,000원",
  },
  {
    title: "바나나보트",
    eyebrow: "Banana Boat",
    description: "친구, 가족, 워크숍 단체가 함께 타기 좋은 기본 놀이기구입니다. 여러 명이 함께 웃고 즐기는 단체 체험에 적합합니다.",
    image: "/images/activity-banana-boat.webp",
    price: "1인 20,000원",
  },
  {
    title: "밴드웨건",
    eyebrow: "Bandwagon",
    description: "넓은 탑승감과 빠른 견인감이 함께 있는 단체형 놀이기구입니다. 인원이 많거나 여러 코스를 묶는 일정에 함께 상담하기 좋습니다.",
    image: "/images/activity-bandwagon.webp",
    price: "1인 20,000원",
  },
  {
    title: "땅콩보트",
    eyebrow: "Peanut Boat",
    description: "낮은 자세로 물살을 가까이 느끼는 놀이기구입니다. 가볍게 시작하면서도 속도감을 느끼고 싶은 방문객에게 맞습니다.",
    image: "/images/activity-peanut-boat.webp",
    price: "1인 20,000원",
  },
  {
    title: "빅마블",
    eyebrow: "Big Marble",
    description: "회전감과 튀어 오르는 움직임이 강한 인기 놀이기구입니다. 바나나보트보다 더 큰 자극을 원하는 분에게 적합합니다.",
    image: "/images/activity-big-marble.webp",
    price: "1인 20,000원",
  },
  {
    title: "자이언트마블",
    eyebrow: "Giant Marble",
    description: "빅마블보다 큰 탑승감으로 물살 위 움직임을 크게 느끼는 코스입니다. 현장 상황과 인원에 맞춰 이용 가능 여부를 확인합니다.",
    image: "/images/activity-giant-marble.webp",
    price: "1인 20,000원",
  },
  {
    title: "G-Ral",
    eyebrow: "Thrill Ride",
    description: "강한 방향 전환과 빠른 견인감이 중심인 스릴형 놀이기구입니다. 탑승 전 안전요원 안내에 따라 이용합니다.",
    image: "/images/activity-g-ral.webp",
    price: "1인 20,000원",
  },
  {
    title: "핵사곤",
    eyebrow: "Hexagon",
    description: "여럿이 함께 타는 수상 놀이기구로 단체 일정에 넣기 좋습니다. 다른 놀이기구와 묶는 패키지 구성은 전화로 확인합니다.",
    image: "/images/activity-hexagon.webp",
    price: "1인 20,000원",
  },
  {
    title: "모터보트",
    eyebrow: "Motor Boat",
    description: "청풍호 풍경을 가장 빠르고 선명하게 둘러보는 보트 투어입니다. 실버코스와 골드코스로 나뉘며 4인 기준 요금으로 안내합니다.",
    image: "/images/motorboat.webp",
    price: "실버 60,000원 / 골드 120,000원",
  },
  {
    title: "ATV",
    eyebrow: "Trail Ride",
    description: "수상레저 후 이어가기 좋은 육상 액티비티입니다. 1인용 ATV와 2인용 버기카 모두 안전교육을 진행하고 레저보험에 가입되어 있어 안전하게 이용할 수 있습니다.",
    image: "/images/atv-lakeside.webp",
    price: "1인용 30,000원 / 2인용 버기카 60,000원",
  },
];

export const pricingGroups = [
  {
    title: "수상스키",
    items: ["초보강습 80,000원", "아웃보트 28,000원", "매직보트 33,000원"],
    note: "초보강습은 지상교육, 봉 1회, 로프 1회, 장비 무상대여를 포함하며 패키지 요금은 별도 문의입니다.",
  },
  {
    title: "웨이크보드",
    items: ["초보강습 80,000원", "아웃보트 28,000원", "매직보트 33,000원"],
    note: "수상스키와 동일하게 지상교육, 봉 1회, 로프 1회, 장비 무상대여 기준으로 운영합니다.",
  },
  {
    title: "놀이기구",
    items: [
      "플라이피쉬 1인 기준 25,000원",
      "바나나보트 1인 기준 20,000원",
      "밴드웨건 1인 기준 20,000원",
      "땅콩보트 1인 기준 20,000원",
      "빅마블·자이언트마블 1인 기준 20,000원",
      "G-Ral·핵사곤 1인 기준 20,000원",
    ],
    note: "여러 번 이용하거나 단체로 묶는 경우 패키지 요금은 별도 전화 문의로 안내합니다.",
  },
  {
    title: "모터보트",
    items: ["실버 코스 4인 기준 60,000원", "골드 코스 4인 기준 120,000원"],
    note: "인원과 코스 변경은 전화로 확인해 주세요.",
  },
  {
    title: "ATV",
    items: ["1인용 30,000원", "2인용 버기카 60,000원"],
    note: "안전교육을 진행하고 레저보험에 가입되어 있어 안전하게 이용할 수 있습니다.",
  },
  {
    title: "예약금",
    items: ["예약 시 50,000원 선입금", "패키지 할인은 전화 문의"],
    note: "예약 당일 미방문 상황이 있어 선입금 방식으로 진행하며, 이용 종목에 맞는 계좌로 입금해 주세요.",
  },
];

export const reservationSteps = [
  "예약문의 게시판 또는 전화로 운영 여부와 이용 가능 시간을 먼저 확인합니다.",
  "이용 종목에 맞는 계좌로 예약금 50,000원을 선입금한 뒤 예약 정보를 남깁니다.",
  "예약문의 게시판 또는 유선 확인 방식으로 예약을 확정합니다.",
  "인원이 많거나 여러 번 이용하는 경우 패키지 할인 상담을 진행합니다.",
  "예약일 변경은 최소 1일 전 게시판 또는 전화로 알려 주세요.",
];

export const safetyNotes = [
  "사전에 안전수칙을 충분히 숙지하고 안전요원의 안내에 따라 행동합니다.",
  "구명조끼 등 안전 보호장비를 반드시 착용합니다.",
  "식후 또는 음주 후에는 수상레저 활동을 자제합니다.",
  "충분한 준비운동 후 수상레저를 이용합니다.",
  "예약 인원에서 인원이 추가되는 경우 미리 알려 주세요.",
  "유아와 미성년자는 보호자 동의하에 이용할 수 있습니다.",
];

export const reservationFields = [
  "예약자 성함",
  "비밀번호",
  "연락처",
  "인원수",
  "예약날짜",
  "예약시간",
  "이용하실 레저",
  "입금자명",
];

export const refundRules = [
  { label: "5일 전 취소", value: "전액 환불" },
  { label: "1-4일 전 취소", value: "50% 환불" },
  { label: "당일 취소", value: "환불 불가" },
];

export const galleryImages = [
  { src: "/images/hero-sunset-boat.webp", alt: "청풍호 석양 아래 모터보트" },
  { src: "/images/atv-family.webp", alt: "ATV를 즐기는 가족" },
  { src: "/images/workshop.webp", alt: "단체 워크숍 수상레저" },
  { src: "/images/paddle-boat.webp", alt: "청풍호 패들보트" },
  { src: "/images/night-party.webp", alt: "청풍호 야간 파티" },
];
