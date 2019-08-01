import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BazaarService } from 'src/app/bazaar.service';
import { ShareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-bazaar-home',
  templateUrl: './bazaar-home.component.html',
  styleUrls: ['./bazaar-home.component.css']
})
export class BazaarHomeComponent implements OnInit {

  bazaars: any = {};
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  constructor(private bzs: BazaarService, private share: ShareService) { }

  async ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      processing: true,
      ordering: true
    };
    this.bazaars = await this.bzs.getBazaars(this.share.user.user_country);
    this.dtTrigger.next();
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

}
