import { Component, OnInit, OnChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { ShareService } from '../../services/share.service';
import { SocketService } from '../../services/socket.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
    private storage: StorageService,
    private router: Router,
    private change: ChangeDetectorRef,
    public share: ShareService,
    private socket: SocketService) {
  }


  logout() {
    this.storage.destroyUser();
    this.share.updateUser(false);
    this.socket.reconnect();
    this.change.detectChanges();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
  }
}
