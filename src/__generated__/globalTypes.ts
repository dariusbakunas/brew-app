/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum SortDirection {
  ASCENDING = "ASCENDING",
  DESCENDING = "DESCENDING",
}

export enum SortableHopField {
  NAME = "NAME",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
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
