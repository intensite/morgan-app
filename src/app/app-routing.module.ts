import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DiagComponent } from './diag/diag.component';
import { SysPrefsComponent } from './sys-prefs/sys-prefs.component';
import { PyroComponent } from './pyro/pyro.component';
import { GuidanceComponent } from './guidance/guidance.component';


const routes: Routes = [
  { path: 'diag', component: DiagComponent},
  { path: 'sys-prefs', component: SysPrefsComponent},
  { path: 'pyro', component: PyroComponent},
  { path: 'guidance', component: GuidanceComponent},
  { path: '', redirectTo: '/diag', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
