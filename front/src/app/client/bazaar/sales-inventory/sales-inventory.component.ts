import { Component, OnInit } from '@angular/core';
import Currency from '../../../model/currency';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { CountryCurrencyPriceService } from 'src/app/services/country-currency-price.service';

@Component({
  selector: 'app-sales-inventory',
  templateUrl: './sales-inventory.component.html',
  styleUrls: ['./sales-inventory.component.css']
})
export class SalesInventoryComponent implements OnInit {

  searchText;

  getSalesInventory: any = {};
  max_lctobtc = 0;
  min_lctobtc = 0;
  total_purchase = 0;

  userInfo: any;
  currency: Currency = new Currency;
  cCode = 'PH';
  curCode = 'PHP';
  currencyValue = 0;

  constructor(private api: HttpService, private share: ShareService, private ccp: CountryCurrencyPriceService) { }

    async ngOnInit() {
      this.getSalesInventory = {};
      // get user country code
      this.userInfo = await this.ccp.getUserInfo();
      this.cCode = this.userInfo['countryCode'];
      // get user country currency code
      this.curCode = this.currency[`${this.cCode}`];
      // get user country currency value
      this.currencyValue = await this.ccp.getCurrencyValue(this.curCode);
      this.api.postToBackend('/getSalesInventory', { shop_id: this.share.user.id }, this.share.user.token).then(res => {
        // console.log(res);
        this.getSalesInventory = res;
        if (Object.keys(res).length > 1) {
          this.api.postToBackend('/getMaxLcToBtc', { shop_id: this.share.user.id }, this.share.user.token).then(max => {
            this.max_lctobtc = max['payload'];
          });
          this.api.postToBackend('/getMinLcToBtc', { shop_id: this.share.user.id }, this.share.user.token).then(min => {
            this.min_lctobtc = min['payload'];
          });
          for (let i = 0; i < Object.keys(res).length; i++) {
            this.total_purchase += res[i]['lcamount'];
          }
        } else if (Object.keys(res).length === 1) {
          this.max_lctobtc = res[0]['lctobtc'];
          this.min_lctobtc = res[0]['lctobtc'];
          this.total_purchase = res[0]['lcamount'];
        }
      });
    }
}
