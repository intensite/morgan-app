import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SysPrefsComponent } from './sys-prefs/sys-prefs.component';
import { DiagComponent } from './diag/diag.component';
import { PyroComponent } from './pyro/pyro.component';
import { GuidanceComponent } from './guidance/guidance.component';
import { DataComponent } from './data/data.component';


const routes: Routes = [
  { path: 'sys-prefs', component: SysPrefsComponent},
  { path: 'diag', component: DiagComponent},
  { path: 'pyro', component: PyroComponent},
  { path: 'guidance', component: GuidanceComponent},
  { path: 'data', component: DataComponent},
  { path: '', redirectTo: '/diag', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
