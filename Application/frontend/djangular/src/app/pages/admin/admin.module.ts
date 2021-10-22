import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import {RouterModule} from '@angular/router';
import {UserModule} from '../home/user.module';
import {AdminRoutingModule} from './admin-routing.module';
import { AddEditUserComponent } from './users/add-edit-user/add-edit-user.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CheckboxModule} from 'primeng/checkbox';
import { OfflineConnexionsComponent } from './offline-connexions/offline-connexions.component';
import { FrameDetailComponent } from './offline-connexions/frame-detail/frame-detail.component';
import { CaptureSettingsComponent } from './capture-settings/capture-settings.component';
import {InputSwitchModule} from 'primeng/inputswitch';
import {AdminAuthGuard} from '../auth/auth-guard.service';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';



@NgModule({
  declarations: [
    AdminComponent,
    UsersComponent,
    AddEditUserComponent,
    OfflineConnexionsComponent,
    FrameDetailComponent,
    CaptureSettingsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    UserModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    CheckboxModule,
    InputSwitchModule,
    ButtonModule,
    RippleModule
  ],
  providers: [AdminAuthGuard],

})
export class AdminModule { }
