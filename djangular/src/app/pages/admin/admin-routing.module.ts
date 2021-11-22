import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AdminAuthGuard} from '../auth/auth-guard.service';
import {AdminComponent} from './admin.component';
import {UsersComponent} from './users/users.component';
import {OfflineConnexionsComponent} from './offline-connexions/offline-connexions.component';
import {CaptureSettingsComponent} from './capture-settings/capture-settings.component';
import {ComputersComponent} from './computers/computers.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminAuthGuard],
    children: [

      {
        path: '',
        redirectTo: 'users',
        pathMatch: 'full'
      },
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'offline-connexions',
        component: OfflineConnexionsComponent
      },
      {
        path: 'capture-settings',
        component: CaptureSettingsComponent
      },
      {
        path: 'computers',
        component: ComputersComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {

}
