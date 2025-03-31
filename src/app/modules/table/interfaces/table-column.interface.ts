import { ICharacter } from "./character.interface";

export interface ITableColumn {
  columnDef: string;
  header: string;
  cellContent: (element: ICharacter) => string;
  isSortable?: boolean;
}
