import type { ReservationPeriod, ReservationStatus } from "./validation";

export type ReservationBoardSummary = {
  id: string;
  createdAt: string;
  customerName: string;
  maskedPhone: string;
  peopleCount: number;
  reservationDate: string;
  reservationPeriod: ReservationPeriod;
  reservationHour: number;
  reservationSummary: string;
  leisureType: string;
  status: ReservationStatus;
};

export type CustomerReservationDetail = ReservationBoardSummary & {
  phone: string;
  depositorName: string;
  message: string;
  adminNote: string;
};

export type ReservationReplyView = {
  id: string;
  createdAt: string;
  authorType: "customer" | "admin";
  message: string;
};

export type ReservationDetailActionState =
  | {
      status: "locked";
      id: string;
      message: string;
    }
  | {
      status: "unlocked";
      id: string;
      password: string;
      post: CustomerReservationDetail;
      replies: ReservationReplyView[];
      message: string;
      replyError?: boolean;
    };
