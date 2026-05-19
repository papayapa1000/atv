export const reservationPeriods = ["오전", "오후"] as const;
export const reservationStatuses = ["pending", "confirmed", "cancelled"] as const;

export type ReservationPeriod = (typeof reservationPeriods)[number];
export type ReservationStatus = (typeof reservationStatuses)[number];

export type RawReservationForm = {
  customerName?: FormDataEntryValue | string | null;
  password?: FormDataEntryValue | string | null;
  phone?: FormDataEntryValue | string | null;
  peopleCount?: FormDataEntryValue | string | number | null;
  reservationDate?: FormDataEntryValue | string | null;
  reservationPeriod?: FormDataEntryValue | string | null;
  reservationHour?: FormDataEntryValue | string | number | null;
  leisureType?: FormDataEntryValue | string | null;
  depositorName?: FormDataEntryValue | string | null;
  message?: FormDataEntryValue | string | null;
  website?: FormDataEntryValue | string | null;
};

export type NormalizedReservationForm = {
  customerName: string;
  password: string;
  phone: string;
  peopleCount: number;
  reservationDate: string;
  reservationPeriod: ReservationPeriod | "";
  reservationHour: number;
  leisureType: string;
  depositorName: string;
  message: string;
  website: string;
};

export type ReservationValidationResult =
  | { ok: true; data: NormalizedReservationForm; errors: Record<string, never> }
  | { ok: false; data: NormalizedReservationForm; errors: Record<string, string> };

export type ReservationBoardPageMeta = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  offset: number;
};

const koreanNamePattern = /^[가-힣\s]{2,20}$/;
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

function fieldToString(value: FormDataEntryValue | string | number | null | undefined) {
  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export function normalizeReservationForm(input: RawReservationForm): NormalizedReservationForm {
  return {
    customerName: fieldToString(input.customerName),
    password: fieldToString(input.password),
    phone: fieldToString(input.phone),
    peopleCount: Number.parseInt(fieldToString(input.peopleCount), 10) || 0,
    reservationDate: fieldToString(input.reservationDate),
    reservationPeriod: fieldToString(input.reservationPeriod) as ReservationPeriod | "",
    reservationHour: Number.parseInt(fieldToString(input.reservationHour), 10) || 0,
    leisureType: fieldToString(input.leisureType),
    depositorName: fieldToString(input.depositorName),
    message: fieldToString(input.message),
    website: fieldToString(input.website),
  };
}

export function getKoreaDateString(dayOffset = 0) {
  const koreaFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  return koreaFormatter.format(date);
}

export function validateReservationForm(
  data: NormalizedReservationForm,
  today = getKoreaDateString(),
): ReservationValidationResult {
  const errors: Record<string, string> = {};
  const phoneDigits = data.phone.replace(/\D/g, "");

  if (data.website) {
    errors.website = "예약을 다시 시도해 주세요.";
  }

  if (!koreanNamePattern.test(data.customerName)) {
    errors.customerName = "예약자 성함은 국문 2-20자로 입력해 주세요.";
  }

  if (data.password.length < 4 || data.password.length > 30) {
    errors.password = "비밀번호는 4-30자로 입력해 주세요.";
  }

  if (!/^0\d{8,10}$/.test(phoneDigits)) {
    errors.phone = "연락 가능한 휴대폰 번호를 입력해 주세요.";
  }

  if (!Number.isInteger(data.peopleCount) || data.peopleCount < 1 || data.peopleCount > 300) {
    errors.peopleCount = "인원수는 1명 이상 300명 이하로 입력해 주세요.";
  }

  if (!isoDatePattern.test(data.reservationDate) || data.reservationDate <= today) {
    errors.reservationDate = "예약날짜는 다음 날 이후로 선택해 주세요.";
  }

  if (!reservationPeriods.includes(data.reservationPeriod as ReservationPeriod)) {
    errors.reservationPeriod = "예약시간 구분을 선택해 주세요.";
  }

  if (!Number.isInteger(data.reservationHour) || data.reservationHour < 1 || data.reservationHour > 12) {
    errors.reservationHour = "예약시간은 1시부터 12시 사이로 선택해 주세요.";
  }

  if (data.leisureType.length > 80) {
    errors.leisureType = "이용레저는 80자 이하로 입력해 주세요.";
  }

  if (data.depositorName.length > 30) {
    errors.depositorName = "입금자명은 30자 이하로 입력해 주세요.";
  }

  if (data.message.length > 2000) {
    errors.message = "전하실 말씀은 2,000자 이하로 입력해 주세요.";
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, data, errors };
  }

  return { ok: true, data, errors: {} };
}

export function maskPhoneNumber(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length < 9) {
    return "연락처 확인";
  }

  const first = digits.slice(0, 3);
  const middle = digits.length === 10 ? digits.slice(3, 6) : digits.slice(3, 7);

  return `${first}-${middle}-····`;
}

export function formatReservationDate(date: string) {
  return date.replaceAll("-", ".");
}

export function formatReservationTime(date: string, period: ReservationPeriod, hour: number, peopleCount: number) {
  return `${formatReservationDate(date)} / ${period} ${hour}시 (${peopleCount}인)`;
}

export function getReservationBoardTitle(customerName: string) {
  return `${customerName} 님의 예약 문의`;
}

export function normalizeReservationBoardPage(
  rawPage: FormDataEntryValue | string | number | null | undefined,
  totalCount: number,
  pageSize = 10,
): ReservationBoardPageMeta {
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const safeTotalCount = Math.max(0, Math.floor(totalCount));
  const totalPages = Math.max(1, Math.ceil(safeTotalCount / safePageSize));
  const parsedPage = Number.parseInt(String(rawPage ?? ""), 10);
  const page = Math.min(Math.max(Number.isFinite(parsedPage) ? parsedPage : 1, 1), totalPages);

  return {
    page,
    pageSize: safePageSize,
    totalCount: safeTotalCount,
    totalPages,
    offset: (page - 1) * safePageSize,
  };
}

export function getStatusLabel(status: ReservationStatus) {
  switch (status) {
    case "confirmed":
      return "예약완료";
    case "cancelled":
      return "예약취소";
    case "pending":
    default:
      return "예약대기";
  }
}
