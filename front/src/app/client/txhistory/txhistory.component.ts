import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ShareService } from '../../services/share.service';

@Component({
  selector: 'app-txhistory',
  templateUrl: './txhistory.component.html',
  styleUrls: ['./txhistory.component.css']
})
export class TxhistoryComponent implements OnInit {

  constructor(private api: HttpService, private share: ShareService) { }
  transactions = [];
  overall_received = 0;
  overall_sent = 0;
  overall_reward = 0;
  display = [];
  type;
  referred_count = 0;
  ngOnInit() {
  	this.type = 'all';
  	this.api.getToBackend('/getAllTransactions', this.share.user.token).then((response:any) => {
  		this.transactions = response;
  		this.display = this.transactions;
  		response.map(transaction => {
  			if(transaction.type == 'sent') {
  				this.overall_sent += transaction.amount;
  			}
  			if(transaction.type == 'received') {
  				this.overall_received += transaction.amount;
  			}
        if(transaction.type == 'reward') {
          this.overall_reward += transaction.amount;
        }
  		})
  	})
    this.api.getToBackend('/getReferredCount', this.share.user.token).then((response:any) => {
      this.referred_count = response.result;
    })
  }

  show(type) {
  	this.type = type;
  	this.display = this.transactions.filter(transaction => {
  		if(type == 'all') return true;
  		return transaction.type == type;
  	})
  }

}
