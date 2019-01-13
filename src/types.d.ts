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

/**
 * input FermentableInput {
  name: String!
  category: FermentableCategory!
  color: Float
  description: String
  originId: ID!
  type: FermentableType
  potential: Float
  yield: Float!
}
 */

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
