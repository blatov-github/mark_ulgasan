import { Component, OnInit } from '@angular/core';
import { HttpService } from '../../services/http.service';
import { ShareService } from '../../services/share.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bazaar-value-settings',
  templateUrl: './bazaar-value-settings.component.html',
  styleUrls: ['./bazaar-value-settings.component.css']
})
export class BazaarValueSettingsComponent implements OnInit {

  constructor(private api: HttpService, private share: ShareService, private toastr: ToastrService) { }

  btc_conversion_target = 0;
  refill_product_availavility = 0;
  lc_maintaining_balance = 0;
  showSuccess = false;
  success = { message: '' };
  showError = false;
  error = { message: '' };

  ngOnInit() {
    this.api.getToBackend('/admin/getBazaarValueSettings', this.share.admin_user.token).then((response: any) => {
      // console.log(response);
      this.btc_conversion_target = response.BtcConversionTarget;
      this.refill_product_availavility = response.RefillProductAvailavility;
      this.lc_maintaining_balance = response.LcMaintainingBalance;
    });
  }

  save() {
    this.showError = false;
    this.showSuccess = false;

    this.api.postToBackend('/admin/setBazaarValueSettings',
    { BtcConversionTarget: this.btc_conversion_target,
      RefillProductAvailavility: this.refill_product_availavility,
      LcMaintainingBalance: this.lc_maintaining_balance
    }, this.share.admin_user.token).then((response: any) => {
      if (response.status === 'success') {
        this.success.message = 'Successfully saved!';
        this.toastr.info('Bazaar Value Setting Success!', 'INFO');
        this.showSuccess = true;
      }
      if (response.status === 'error') {
        this.showError = true;
        this.error.message = response.payload;
        this.toastr.error('Invalid Setting Value!', 'ERROR');
      }
      console.log(response);
    });
  }

}
