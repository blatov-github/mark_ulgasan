import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { ShareService } from '../../services/share.service';
import { HttpService } from 'src/app/services/http.service';
import { CountryCurrencyPriceService } from '../../services/country-currency-price.service';
import Currency from '../../model/currency';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  // variable define
  userInfo: any;
  currency: Currency = new Currency;
  cCode = 'PH';
  curCode = 'PHP';
  currencyValue = 0;
  interval: any;

  constructor(
    private socket: SocketService,
    private share: ShareService,
    private ccp: CountryCurrencyPriceService,
    private api: HttpService
  ) {
  }

  async ngOnInit() {
    // get user country code
    this.userInfo = await this.ccp.getUserInfo();
    // user country code
    this.cCode = this.userInfo['countryCode'];
    // get user country currency code
    this.curCode = this.currency[`${this.cCode}`];
    // get user country currency value
    this.currencyValue = await this.ccp.getCurrencyValue(this.curCode);
    // periodly update
    this.interval = setInterval(async () => {
      this.currencyValue = await this.ccp.getCurrencyValue(this.curCode);
    }, 1200000);
  }

}
