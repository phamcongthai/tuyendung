// src/types/jobs.enum.ts
export const JobsStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
} as const;

export type JobsStatus = typeof JobsStatus[keyof typeof JobsStatus];
