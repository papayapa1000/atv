"use client";

import { PaperPlaneTilt } from "@phosphor-icons/react";
import { useActionState } from "react";
import { createReservationAction, type ReservationActionState } from "@/app/reservation/actions";

const leisureOptions = [
  "수상스키",
  "웨이크보드",
  "바나나보트",
  "플라이피쉬",
  "밴드웨곤",
  "땅콩보트",
  "빅마블",
  "모터보트",
  "ATV",
  "단체 패키지",
];

const hours = Array.from({ length: 12 }, (_, index) => index + 1);

const initialReservationActionState: ReservationActionState = {
  message: "",
  errors: {},
  values: {},
};

const fieldLabelClass = "text-xs font-bold text-foreground";
const fieldControlClass =
  "mt-1.5 w-full border border-foreground/14 bg-white px-3 py-2.5 text-sm text-foreground outline-none transition focus:border-foreground focus:ring-2 focus:ring-sun/20";

function fieldError(state: ReservationActionState, name: string) {
  const message = state.errors[name];

  if (!message) {
    return null;
  }

  return <p className="mt-1.5 text-xs font-bold text-sunset">{message}</p>;
}

type TextFieldProps = {
  state: ReservationActionState;
  name: keyof ReservationActionState["values"];
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "numeric";
};

function TextField({ state, name, label, type = "text", placeholder, required, autoComplete, inputMode }: TextFieldProps) {
  return (
    <label className="block">
      <span className={fieldLabelClass}>{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={state.values[name] ?? ""}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className={fieldControlClass}
      />
      {fieldError(state, name)}
    </label>
  );
}

export function ReservationWriteForm() {
  const [state, formAction, pending] = useActionState(createReservationAction, initialReservationActionState);

  return (
    <form action={formAction} className="grid gap-4">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {state.message ? (
        <div role="alert" className="border border-sunset/30 bg-sun/12 px-3 py-2.5 text-xs font-bold text-foreground">
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          state={state}
          name="customerName"
          label="예약자 성함"
          placeholder="홍길동"
          required
          autoComplete="name"
        />
        <TextField
          state={state}
          name="password"
          label="비밀번호"
          type="password"
          placeholder="4자 이상"
          required
          autoComplete="new-password"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
        <TextField
          state={state}
          name="phone"
          label="연락처"
          placeholder="010-0000-0000"
          required
          autoComplete="tel"
          inputMode="tel"
        />
        <TextField
          state={state}
          name="peopleCount"
          label="인원수"
          type="number"
          placeholder="5"
          required
          inputMode="numeric"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <TextField state={state} name="reservationDate" label="예약날짜" type="date" required />

        <label className="block">
          <span className={fieldLabelClass}>예약시간</span>
          <select
            name="reservationPeriod"
            required
            defaultValue={state.values.reservationPeriod ?? ""}
            className={fieldControlClass}
          >
            <option value="">선택</option>
            <option value="오전">오전</option>
            <option value="오후">오후</option>
          </select>
          {fieldError(state, "reservationPeriod")}
        </label>

        <label className="block">
          <span className={fieldLabelClass}>시간선택</span>
          <select
            name="reservationHour"
            required
            defaultValue={state.values.reservationHour ?? ""}
            className={fieldControlClass}
          >
            <option value="">선택</option>
            {hours.map((hour) => (
              <option key={hour} value={hour}>
                {hour}시
              </option>
            ))}
          </select>
          {fieldError(state, "reservationHour")}
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className={fieldLabelClass}>이용레저</span>
          <input
            name="leisureType"
            list="leisure-options"
            defaultValue={state.values.leisureType ?? ""}
            placeholder="이용하실 레저"
            className={fieldControlClass}
          />
          <datalist id="leisure-options">
            {leisureOptions.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
          {fieldError(state, "leisureType")}
        </label>
        <TextField state={state} name="depositorName" label="입금자명" placeholder="입금자명" />
      </div>

      <label className="block">
        <span className={fieldLabelClass}>전하실 말씀</span>
        <textarea
          name="message"
          rows={5}
          defaultValue={state.values.message ?? ""}
          placeholder="예약 확인에 필요한 내용을 남겨 주세요."
          className={`${fieldControlClass} resize-y leading-6`}
        />
        {fieldError(state, "message")}
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="submit"
          disabled={pending}
          className="spring inline-flex items-center justify-center gap-2 border border-sun bg-sun px-5 py-3 text-sm font-bold text-white hover:-translate-y-0.5 hover:border-sunset hover:bg-sunset hover:text-white disabled:cursor-not-allowed disabled:opacity-55"
        >
          <PaperPlaneTilt aria-hidden="true" className="h-4 w-4" weight="bold" />
          {pending ? "저장 중" : "작성완료"}
        </button>
      </div>
    </form>
  );
}
