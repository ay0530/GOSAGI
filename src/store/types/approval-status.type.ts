export const ApprovalStatus = {
  PENDINF: 0,
  APPROVED: 1,
  REJECTED: 2,
} as const;

export type ApprovalStatusType =
  (typeof ApprovalStatus)[keyof typeof ApprovalStatus];
