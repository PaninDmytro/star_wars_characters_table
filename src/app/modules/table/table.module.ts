import { NgModule } from '@angular/core';
import { RouterModule } from "@angular/router";

import { TableComponent } from "./table.component";
import { routes } from "./table.routes";



@NgModule({
  declarations: [TableComponent],
  imports: [
    RouterModule.forChild(routes),
  ]
})
export class TableModule { }
