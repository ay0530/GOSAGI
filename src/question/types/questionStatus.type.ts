export const QuestionStatus = {
  ACTIVATE: 0,
  DELETED: 1,
} as const;

export type QuestionStatusType =
  (typeof QuestionStatus)[keyof typeof QuestionStatus];
