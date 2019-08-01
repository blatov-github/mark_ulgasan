import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service'
import { ShareService } from '../../services/share.service'
@Component({
  selector: 'app-successfulorder',
  templateUrl: './successfulorder.component.html',
  styleUrls: ['./successfulorder.component.css']
})
export class SuccessfulorderComponent implements OnInit {

  constructor(private api: HttpService, private share: ShareService) { }
  orders = [];
  ngOnInit() {
  	this.api.getToBackend('/getSuccessfulOrders', this.share.user.token).then((result: any) => {
  		this.orders = result
  		console.log(result)
  	})
  }

}
