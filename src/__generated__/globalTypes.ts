/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum FermentableCategory {
  ADJUNCT = "ADJUNCT",
  DRY_EXTRACT = "DRY_EXTRACT",
  FRUIT = "FRUIT",
  GRAIN = "GRAIN",
  JUICE = "JUICE",
  LIQUID_EXTRACT = "LIQUID_EXTRACT",
  SUGAR = "SUGAR",
}

export enum GrainType {
  ADJUNCT = "ADJUNCT",
  BASE = "BASE",
  CARAMEL_CRYSTAL = "CARAMEL_CRYSTAL",
  COLOR = "COLOR",
  ROASTED = "ROASTED",
  SPECIALTY = "SPECIALTY",
}

export enum SortDirection {
  ASCENDING = "ASCENDING",
  DESCENDING = "DESCENDING",
}

export enum SortableFermentableField {
  NAME = "NAME",
}

export enum SortableHopField {
  NAME = "NAME",
}

export enum SortableYeastField {
  NAME = "NAME",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum YeastFlocculation {
  HIGH = "HIGH",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
}

export enum YeastForm {
  DRY = "DRY",
  LIQUID = "LIQUID",
}

export enum YeastType {
  ALE = "ALE",
  CHAMPAGNE = "CHAMPAGNE",
  LAGER = "LAGER",
  WHEAT = "WHEAT",
  WINE = "WINE",
}

export interface RegistrationInput {
  firstName?: string | null;
  lastName?: string | null;
  username: string;
  email: string;
  code: string;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
