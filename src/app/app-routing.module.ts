import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiagComponent } from './diag/diag.component';
import { SysPrefsComponent } from './sys-prefs/sys-prefs.component';


const routes: Routes = [
  { path: 'diag', component: DiagComponent},
  { path: 'sys-prefs', component: SysPrefsComponent},
  { path: '', redirectTo: '/diag', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
