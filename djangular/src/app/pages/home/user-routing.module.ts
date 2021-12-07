import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import {HomeComponent} from './home.component';
import {UserprofileComponent} from './userprofile/userprofile.component';
import {AuthGuard} from '../auth/auth-guard.service';
import { BlacklistComponent } from './blacklist/blacklist.component';
import {HoneypotConnectionsComponent} from './honeypot-connections/honeypot-connections.component';
import {ReportComponent} from './report/report.component';
import {DashboardComponent} from './dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [

      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        component: DashboardComponent
      },
      {
        path: 'report',
        component: ReportComponent
      },
      {
        path: 'profile',
        component: UserprofileComponent
      }
      ,
      {
        path: 'blacklist',
        component: BlacklistComponent
      },
      {
        path: 'honeypot-connections',
        component: HoneypotConnectionsComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
  constructor(private router: Router) {
    this.router.errorHandler = (error: any) => {
        this.router.navigate(['/']); // or redirect to default route
    };
  }
}
