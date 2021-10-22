import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { TokenStorageService} from '../../services/token-storage.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenStorageService: TokenStorageService, public router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    // update this page to redirect user to login page when not logged in
    if (this.tokenStorageService.getToken() == null){
      this.router.navigate(['/auth/login'], { queryParams: { next: state.url } });
      return this.tokenStorageService.getToken() == null;
    }
    return this.tokenStorageService.getToken() != null;
  }
}


@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(private tokenStorageService: TokenStorageService, public router: Router) {
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    // update this page to redirect user to login page when not logged in
    const role = this.tokenStorageService.getUser().is_superuser;
    if (role === true){
      return true;
    }
    else {
      console.log('not admin');
      this.router.navigate(['/auth-admin']);
      return false;
    }
  }
}
