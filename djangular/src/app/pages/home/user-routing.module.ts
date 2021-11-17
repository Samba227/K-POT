import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import {HomeComponent} from './home.component';
import {UserprofileComponent} from './userprofile/userprofile.component';
import {AuthGuard} from '../auth/auth-guard.service';
import {ConnexionsManagementComponent} from './connexions-management/connexions-management.component';
import { BlacklistComponent } from './blacklist/blacklist.component';
import {HoneypotConnectionsComponent} from './honeypot-connections/honeypot-connections.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {NetworkComponent} from './network/network.component';
import {ActiveIpsComponent} from './active-ips/active-ips.component';
import {ReportComponent} from './report/report.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [

      {
        path: '',
        redirectTo: 'activeIPs',
        pathMatch: 'full'
      },
      {
        path: 'network',
        component: NetworkComponent
      },
      {
        path: 'report',
        component: ReportComponent
      },
      {
        path: 'activeIPs',
        component: ActiveIpsComponent
      },
      {
        path: 'profile',
        component: UserprofileComponent
      }
      ,
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'connexions-management',
        component: ConnexionsManagementComponent
      },
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
