export type StepBoxProps = {
  step: number;
  title: string;
  subtitle: string;
  active: boolean;
  completed: boolean;
};

export type UIMapping = {
  sourceField: string;
  targetField: string;
  matchPercentage: number;
  sampleValues: string[];
  textColor?: string;
  bgColor?: string;
  borderColor?: string;
  outerBorderColor?: string;
  shadowBoxColor?: string;
};

export const DEFAULT_CRM_FIELDS = [
  "firstName",
  "lastName",
  "phoneNo",
  "email",
  "agentEmail",
  "country",
  "city",
  "intentType",
] as const;

export type TargetField = (typeof DEFAULT_CRM_FIELDS)[number];
