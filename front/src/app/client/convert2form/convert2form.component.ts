import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ShareService } from '../../services/share.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-convert2form',
  templateUrl: './convert2form.component.html',
  styleUrls: ['./convert2form.component.css']
})
export class Convert2formComponent implements OnChanges {
  @Input() btc_balance;
  @Input() lc_balance;
  @Input() lc_btc;

  constructor(private api: HttpService, private share: ShareService, private socket: SocketService) { }
  rate = '0.00000001';
  amount_lc = 1000
  showResult = false
  showError = false
  buttonlock = false;
  result = {
    message: ''
  }
  error = {
    message: ''
  }
  btc_stocks = 0;
  conversion_limit = 0;

  ngOnChanges(changes: SimpleChanges) {
  	if(changes.lc_btc) {
  		this.rate = (changes.lc_btc.currentValue).toFixed(15);
  	}
    this.api.getToBackend("/getBTCStocks", this.share.user.token).then((result: any) => {
      this.btc_stocks = result.value;
      console.log(this.btc_stocks);
    });
    this.api.getToBackend("/getConversionLimit", this.share.user.token).then((result: any) => {
      this.conversion_limit = result.value;
      console.log(this.conversion_limit);
    });
  }

  addRate(v) {
  	if(+this.rate + v * Math.pow(10, -8) > 0)
    this.rate = (+this.rate + v * Math.pow(10, -8)).toFixed(15);
  }

  getReceive() {
    return this.amount_lc * +this.rate * (1 - this.socket.multiplier.CF);
  }

  send() {
  	this.showError = false;
  	this.showResult = false;
  	this.api.postToBackend('/recordOrder', {
  		rate: this.rate,
  		amount_lc: this.amount_lc,
      	type: 'ltob'
  	}, this.share.user.token).then(res=>{
  		this.showResult = true;
  		this.result.message = 'successfully'
  	}).catch(err => {
  		this.showError = true;
      
  		this.error.message = JSON.parse(err._body).payload;
  	});
    this.buttonlock = true;
    setTimeout(()=>{
      this.buttonlock = false;
    }, 30000);
  }

}
