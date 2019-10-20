/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SortableFermentableField, SortDirection, FermentableCategory, GrainType } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetFermentables
// ====================================================

export interface GetFermentables_fermentables_origin {
  __typename: "Country";
  id: string;
  name: string;
}

export interface GetFermentables_fermentables {
  __typename: "Fermentable";
  id: string;
  name: string;
  category: FermentableCategory;
  color: number | null;
  description: string | null;
  origin: GetFermentables_fermentables_origin;
  potential: number;
  grainType: GrainType | null;
  yield: number;
}

export interface GetFermentables {
  fermentables: GetFermentables_fermentables[];
}

export interface GetFermentablesVariables {
  sortBy?: SortableFermentableField | null;
  sortDirection?: SortDirection | null;
}
