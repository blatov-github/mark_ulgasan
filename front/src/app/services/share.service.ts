import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  user: any = false;
  admin_user: any = false;

  constructor(private storage: StorageService) {
    this.user = this.storage.getUser();
    this.admin_user = this.storage.getAdminUser();
  }

  updateUser(user) {
    this.user = user;
  }

  updateAdminUser(user) {
    this.admin_user = user;
  }
}
