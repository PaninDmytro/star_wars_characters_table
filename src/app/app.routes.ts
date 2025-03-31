import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./modules/table/table.module').then(m => m.TableModule),
  },
];
