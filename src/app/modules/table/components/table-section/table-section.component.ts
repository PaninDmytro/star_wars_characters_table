import { Component, EventEmitter, input, InputSignal, Output, ViewChild } from '@angular/core';
import {
  MatCell,
  MatCellDef, MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef, MatNoDataRow,
  MatRow,
  MatRowDef, MatTable, MatTableDataSource
} from "@angular/material/table";
import { MatSort, MatSortHeader } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";

import { tableColumns } from "../../constants/table-columns.constant";
import { ICharacter } from "../../interfaces/character.interface";
import { displayedColumns } from "../../constants/displayed-columns.constant";
import { IShowPlanet } from "../../interfaces/show-planet.interface";

@Component({
  selector: 'app-table-section',
  standalone: true,
  imports: [
    MatCell,
    MatCellDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatNoDataRow,
  ],
  templateUrl: './table-section.component.html',
  styleUrl: './table-section.component.scss'
})
export class TableSectionComponent {
  public displayedColumns: string[] = displayedColumns;

  protected readonly tableColumns = tableColumns;

  @ViewChild(MatSort) sort!: MatSort;

  dataSource: InputSignal<MatTableDataSource<ICharacter, MatPaginator> | undefined> = input();
  inputValue: InputSignal<string> = input<string>('');
  errorMessage: InputSignal<string | null> = input<string | null>(null);

  @Output()
  showPlanetInfoEmitter: EventEmitter<IShowPlanet> = new EventEmitter<IShowPlanet>();

  public showPlanet(character: ICharacter, event: MouseEvent): void {
    this.showPlanetInfoEmitter.emit({ character, event })
  }
}
