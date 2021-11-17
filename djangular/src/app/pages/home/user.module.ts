import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { UserprofileComponent } from './userprofile/userprofile.component';
import {HomeComponent} from './home.component';
import {DialogModule} from 'primeng/dialog';
import {UserRoutingModule} from './user-routing.module';
import {CheckboxModule} from 'primeng/checkbox';
import {SidebarComponent} from '../sidebar/sidebar.component';
import {NavbarComponent} from '../navbar/navbar.component';
import {ScrollTopModule} from 'primeng/scrolltop';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {InputTextModule} from 'primeng/inputtext';
import {ChartModule} from 'primeng/chart';
import {AvatarModule} from 'primeng/avatar';
import {AvatarGroupModule} from 'primeng/avatargroup';
import {ButtonModule} from 'primeng/button';
import {DropdownModule} from 'primeng/dropdown';
import {PanelModule} from 'primeng/panel';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TableModule} from 'primeng/table';
import { NetworkComponent } from './network/network.component';
import { ActiveIpsComponent } from './active-ips/active-ips.component';
import { ActiveIpsDetailsComponent } from './active-ips/active-ips-details/active-ips-details.component';
import { ConnexionsManagementComponent } from './connexions-management/connexions-management.component';
import { FrameDetailComponent } from './connexions-management/frame-detail/frame-detail.component';
import { BlacklistComponent } from './blacklist/blacklist.component';
import { HoneypotConnectionsComponent } from './honeypot-connections/honeypot-connections.component';
import { ConnectionProfileComponent } from './honeypot-connections/connection-profile/connection-profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportComponent } from './report/report.component';
import {RippleModule} from 'primeng/ripple';
import {TooltipModule} from "primeng/tooltip";

@NgModule({
  declarations: [
    HomeComponent,
    UserprofileComponent,
    SidebarComponent,
    NavbarComponent,
    NetworkComponent,
    ActiveIpsComponent,
    ActiveIpsDetailsComponent,
    ConnexionsManagementComponent,
    FrameDetailComponent,
    BlacklistComponent,
    HoneypotConnectionsComponent,
    ConnectionProfileComponent,
    DashboardComponent,
    ReportComponent,
  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        UserRoutingModule,
        CheckboxModule,
        ButtonModule,
        ScrollTopModule,
        ScrollPanelModule,
        InputTextModule,
        DropdownModule,
        PanelModule,
        BrowserAnimationsModule,
        ChartModule,
        AvatarModule,
        AvatarGroupModule,
        TableModule,
        RippleModule,
        TooltipModule
    ],
  exports: [
    SidebarComponent,
    NavbarComponent
  ]
})
export class UserModule { }
