export enum FermentableCategory {
  ADJUNCT = 'ADJUNCT',
  DRY_EXTRACT = 'DRY_EXTRACT',
  FRUIT = 'FRUID',
  GRAIN = 'GRAIN',
  JUICE = 'JUICE',
  LIQUID_EXTRACT = 'LIQUID_EXTRACT',
  SUGAR = 'SUGAR'
}

export enum GrainType {
  BASE = 'BASE'
}

export type Country = {
  id: string,
  name: string,
};

export type Fermentable = {
  category: FermentableCategory,
  color: number,
  description: string,
  name: string,
  origin?: Country,
  potential?: number,
  type?: GrainType,
  yield: number,
};

export type FermentableInput = {
  id?: string,
  input: Fermentable & {
    originId: string,
  }
};

export type Hop = {
  aaLow?: number,
  aaHigh?: number,
  aroma: boolean,
  bittering: boolean,
  betaLow?: number,
  betaHigh?: number,
  description: string,
  name: string,
  origin?: Country,
};

export type HopInput = {
  id?: string,
  input: Hop & {
    originId: string,
  },
};

export type Invitation = {
  id?: string,
  code: string,
  email: string,
};

export type InvitationInput = {
  email: string,
  sendEmail: boolean,
};

export type UserRole = {
  name: string,
  code: string,
};

export type YeastLab = {
  id: string,
  name: string,
};

export enum YeastForm {
  DRY = 'DRY',
  LIQUID = 'LIQUID',
}

export enum YeastType {
  ALE = 'ALE',
  CHAMPAGNE = 'CHAMPAGNE',
  LAGER = 'LAGER',
  WHEAT = 'WHEAT',
  WINE = 'WINE',
}

export type Yeast = {
  description?: string,
  name: string,
  form: YeastForm,
  lab?: YeastLab,
  type: YeastType,
};

export type YeastInput = {
  id?: string,
  input: Yeast & { labId: string },
};

export type Water = {
  name: string,
  pH: number,
  alkalinity: number,
  calcium: number,
  magnesium: number,
  sodium: number,
  sulfate: number,
  chloride: number,
  bicarbonate: number,
  description: string,
};

export type WaterInput = {
  id?: string,
  input: Water,
};
