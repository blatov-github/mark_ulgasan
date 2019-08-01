import { Component, OnInit } from '@angular/core';
import Currency from '../../../model/currency';
import { SocketService } from 'src/app/services/socket.service';
import { HttpService } from 'src/app/services/http.service';
import { ShareService } from 'src/app/services/share.service';
import { CountryCurrencyPriceService } from 'src/app/services/country-currency-price.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-unclaimed-orders',
  templateUrl: './unclaimed-orders.component.html',
  styleUrls: ['./unclaimed-orders.component.css']
})
export class UnclaimedOrdersComponent implements OnInit {

  searchText;
  diable_flag = false;

  unclaimOrders: any = {};

  userInfo: any;
  currency: Currency = new Currency;
  cCode = 'PH';
  curCode = 'PHP';
  currencyValue = 0;

  constructor(private socket: SocketService, private api: HttpService, private share: ShareService,
    private ccp: CountryCurrencyPriceService, private notify: NotificationsService) { }

  async ngOnInit() {
    this.unclaimOrders = {};
    // get user country code
    this.userInfo = await this.ccp.getUserInfo();
    this.cCode = this.userInfo['countryCode'];
    // get user country currency code
    this.curCode = this.currency[`${this.cCode}`];
    // get user country currency value
    this.currencyValue = await this.ccp.getCurrencyValue(this.curCode);
    this.api.postToBackend('/buyerUnclaimOrders', { userid: this.share.user.id }, this.share.user.token).then(res => {
      // console.log(res);
      this.unclaimOrders = res;
    });
  }

  buyer() {
    this.diable_flag = !this.diable_flag;
    this.searchText = '';
    this.ngOnInit();
  }

  seller() {
    this.diable_flag = !this.diable_flag;
    this.searchText = '';
    this.unclaimOrders = {};
    this.api.postToBackend('/sellerUnclaimOrders', { userid: this.share.user.id }, this.share.user.token).then(res => {
      // console.log(res);
      this.unclaimOrders = res;
    });
  }

  reset_seller() {
    this.searchText = '';
    this.unclaimOrders = {};
    this.api.postToBackend('/sellerUnclaimOrders', { userid: this.share.user.id }, this.share.user.token).then(res => {
      this.unclaimOrders = res;
    });
  }

  releaseItem(lcamount: number, tps: number, buyerid: number, tas: number, orderid: number) {
    // shop owner balance increase
    this.api.postToBackend('/increaseLcBalance', { userid: this.share.user.id, amount: lcamount }, this.share.user.token);
    // buyer balance increase
    this.api.postToBackend('/increaseLcBalance', { userid: buyerid, amount: tps }, this.share.user.token);
    // agent balance increase
    if (this.share.user.agent_id !== 0) {
      this.api.postToBackend('/increaseLcBalance', { userid: this.share.user.agent_id, amount: tas }, this.share.user.token);
    }
    // update order status unclaim -> claim
    this.api.postToBackend('/updateOrderToClaim', { userid: buyerid, orderid: orderid }, this.share.user.token).then(res => {
      if (res['status'] === 'success') {
        this.notify.info('INFO', res['payload'], { timeOut: 5000 });
        this.reset_seller();
      }
    });
    // agent information up to 10 level getting for indirective savings
    // this.api.postToBackend('/agentInfo', { buyerid: buyerid }, this.share.user.token).then(res => {
    //   console.log(res);
    // });
  }

}
