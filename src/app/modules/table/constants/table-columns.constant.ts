import { ITableColumn } from "../interfaces/table-column.interface";
import { ICharacter } from "../interfaces/character.interface";

export const tableColumns: ITableColumn[] = [
  {
    columnDef: 'name',
    header: 'Character Name',
    cellContent: (character: ICharacter) => character.name,
    isSortable: true
  },
  {
    columnDef: 'gender',
    header: 'Gender',
    cellContent: (character: ICharacter) => character.gender,
    isSortable: false
  },
  {
    columnDef: 'birth_year',
    header: 'Birth Year',
    cellContent: (character: ICharacter) => character.birth_year,
    isSortable: false
  }
];
