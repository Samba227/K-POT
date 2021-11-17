import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {DropdownModule} from 'primeng/dropdown';
import { ScrollTopModule } from 'primeng/scrolltop';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import {ToolbarModule} from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {PanelModule} from 'primeng/panel';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './services/auth.service';
import {TokenStorageService} from './services/token-storage.service';
import {AdminAuthGuard, AuthGuard} from './pages/auth/auth-guard.service';
import {AuthModule} from './pages/auth/auth.module';
import {UserService} from './services/user.service';
import {UserModule} from './pages/home/user.module';
import { CheckboxModule } from 'primeng/checkbox';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ConnexionsService} from './services/connexions.service';
import {AdminModule} from './pages/admin/admin.module';
import {FrameSortService} from './services/frame-sort.service';
import {DashboardService} from './services/dashboard.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DropdownModule,
    CheckboxModule,
    ScrollTopModule,
    InputTextModule,
    ToolbarModule,
    ButtonModule,
    ScrollPanelModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    AuthModule,
    UserModule,
    AdminModule,
    PanelModule,
  ],
  providers: [AuthService, TokenStorageService, AuthGuard, UserService, ConnexionsService, DashboardService, AdminAuthGuard, FrameSortService],
  exports: [
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
