import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import { HomeComponent} from "./pages/home/home.component";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebsiteService } from "./services/website.service";
import { ButtonModule } from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormGroup} from "@angular/forms";
import {ProfileStorageService} from "./services/profile.service";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ButtonModule,
    CommonModule,
    InputTextModule,
    BrowserAnimationsModule
  ],
  providers: [WebsiteService, ProfileStorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
