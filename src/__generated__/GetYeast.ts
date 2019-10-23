/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SortableYeastField, SortDirection, YeastForm, YeastType, YeastFlocculation } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetYeast
// ====================================================

export interface GetYeast_yeast_lab {
  __typename: "YeastLab";
  id: string;
  name: string;
}

export interface GetYeast_yeast {
  __typename: "Yeast";
  id: string;
  name: string;
  form: YeastForm;
  type: YeastType;
  description: string | null;
  lab: GetYeast_yeast_lab;
  maxTemp: number | null;
  minTemp: number | null;
  minAttenuation: number | null;
  maxAttenuation: number | null;
  flocculation: YeastFlocculation | null;
}

export interface GetYeast {
  yeast: GetYeast_yeast[];
}

export interface GetYeastVariables {
  sortBy?: SortableYeastField | null;
  sortDirection?: SortDirection | null;
}
