import { TrialType } from "../enums/trial.enum";

export interface DinoData {
  id: string,
  name: string,
  growthLabel: string,
}

export interface TrialData {
  type: TrialType,
  data: any,
}