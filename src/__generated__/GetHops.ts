/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

import { SortableHopField, SortDirection } from "./globalTypes";

// ====================================================
// GraphQL query operation: GetHops
// ====================================================

export interface GetHops_hops_origin {
  __typename: "Country";
  id: string;
  name: string;
}

export interface GetHops_hops {
  __typename: "Hop";
  id: string;
  name: string;
  aaHigh: number | null;
  aaLow: number | null;
  aroma: boolean;
  betaHigh: number | null;
  betaLow: number | null;
  bittering: boolean;
  description: string | null;
  origin: GetHops_hops_origin;
}

export interface GetHops {
  hops: GetHops_hops[];
}

export interface GetHopsVariables {
  sortBy?: SortableHopField | null;
  sortDirection?: SortDirection | null;
}
