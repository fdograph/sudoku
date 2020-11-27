import { List } from 'immutable';

export type Coords = {
  row: number;
  col: number;
};
export type BoardMatrix = List<List<number>>;
