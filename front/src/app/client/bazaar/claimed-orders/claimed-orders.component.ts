import { Component, OnInit } from '@angular/core';
import Currency from '../../../model/currency';
import { SocketService } from 'src/app/services/socket.service';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { CountryCurrencyPriceService } from 'src/app/services/country-currency-price.service';

@Component({
  selector: 'app-claimed-orders',
  templateUrl: './claimed-orders.component.html',
  styleUrls: ['./claimed-orders.component.css']
})
export class ClaimedOrdersComponent implements OnInit {

  searchText;

  claimOrders: any = {};
  overallProductPurchased = 0;

  userInfo: any;
  currency: Currency = new Currency;
  cCode = 'PH';
  curCode = 'PHP';
  currencyValue = 0;

  constructor(private socket: SocketService, private api: HttpService, private share: ShareService,
    private ccp: CountryCurrencyPriceService) { }

  async ngOnInit() {
    this.claimOrders = {};
    // get user country code
    this.userInfo = await this.ccp.getUserInfo();
    this.cCode = this.userInfo['countryCode'];
    // get user country currency code
    this.curCode = this.currency[`${this.cCode}`];
    // get user country currency value
    this.currencyValue = await this.ccp.getCurrencyValue(this.curCode);
    this.api.postToBackend('/buyerClaimOrders', { userid: this.share.user.id }, this.share.user.token).then(res => {
      // console.log(res);
      if (Object.keys(res).length >= 1) {
        for (let i = 0; i < Object.keys(res).length; i++) {
          this.overallProductPurchased = this.overallProductPurchased + res[i]['lcamount'] - res[i]['tps'];
        }
      }
      this.claimOrders = res;
    });
    this.checkPeriod();
  }

  checkPeriod() {
    setTimeout(() => {
      this.ngOnInit();
    }, 10000);
  }

}
