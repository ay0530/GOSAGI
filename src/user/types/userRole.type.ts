export const UserRole = {
  ADMIN: 0,
  USER: 1,
  SELLER: 2,
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
