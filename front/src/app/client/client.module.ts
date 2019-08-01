import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClientRoutingModule } from './client-routing.module';
import { ClientLayoutComponent } from './client-layout/client-layout.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { Convert1Component } from './convert1/convert1.component';
import { Convert2Component } from './convert2/convert2.component';
import { OpenorderComponent } from './openorder/openorder.component';
import { SuccessfulorderComponent } from './successfulorder/successfulorder.component';
import { SubheaderComponent } from './subheader/subheader.component';
import { AboutComponent } from './about/about.component';
import { FaqComponent } from './faq/faq.component';
import { RetypepasswordDirective } from '../directives/retypepassword.directive';
import { SocketService } from '../services/socket.service';
import { ChangeLCComponent } from './change-lc/change-lc.component';
import { TxtypePipe } from './txtype.pipe';
import { BalancetypePipe } from './balancetype.pipe';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LastConvertComponent } from './last-convert/last-convert.component';
import { RewardComponent } from './reward/reward.component';
import { TxhistoryComponent } from './txhistory/txhistory.component';
import { Convert1formComponent } from './convert1form/convert1form.component';
import { Convert2formComponent } from './convert2form/convert2form.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CryptoBazaarComponent } from './crypto-bazaar/crypto-bazaar.component';
import { BazaarHomeComponent } from './bazaar/bazaar-home/bazaar-home.component';
import { PreCheckoutOrdersComponent } from './bazaar/pre-checkout-orders/pre-checkout-orders.component';
import { OpenOrdersComponent } from './bazaar/open-orders/open-orders.component';
import { UnclaimedOrdersComponent } from './bazaar/unclaimed-orders/unclaimed-orders.component';
import { ClaimedOrdersComponent } from './bazaar/claimed-orders/claimed-orders.component';
import { SalesInventoryComponent } from './bazaar/sales-inventory/sales-inventory.component';
import { IndirectSavingsComponent } from './bazaar/indirect-savings/indirect-savings.component';
import { PersonalAgentSavingsComponent } from './bazaar/personal-agent-savings/personal-agent-savings.component';
import { PromoItemsComponent } from './bazaar/promo-items/promo-items.component';
import { TopRewardsComponent } from './bazaar/top-rewards/top-rewards.component';
import { FileSelectDirective } from 'ng2-file-upload';
import { DataTablesModule } from 'angular-datatables';
import { BazaarProductComponent } from './bazaar/bazaar-product/bazaar-product.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BazaarProductEditComponent } from './bazaar/bazaar-product-edit/bazaar-product-edit.component';

@NgModule({
  imports: [
    CommonModule,
    ClientRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    Ng2SearchPipeModule,
  ],
  declarations: [
    ClientLayoutComponent,
    HomeComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    WithdrawalComponent,
    Convert1Component,
    Convert2Component,
    OpenorderComponent,
    SuccessfulorderComponent,
    SubheaderComponent,
    AboutComponent,
    FaqComponent,
    RetypepasswordDirective,
    ChangeLCComponent,
    TxtypePipe,
    BalancetypePipe,
    DashboardComponent,
    LastConvertComponent,
    RewardComponent,
    TxhistoryComponent,
    Convert1formComponent,
    Convert2formComponent,
    HowItWorksComponent,
    ContactUsComponent,
    ForgotPasswordComponent,
    CryptoBazaarComponent,
    BazaarHomeComponent,
    PreCheckoutOrdersComponent,
    OpenOrdersComponent,
    UnclaimedOrdersComponent,
    ClaimedOrdersComponent,
    SalesInventoryComponent,
    IndirectSavingsComponent,
    PersonalAgentSavingsComponent,
    PromoItemsComponent,
    TopRewardsComponent,
    FileSelectDirective,
    BazaarProductComponent,
    BazaarProductEditComponent
  ],
  providers: [
    SocketService, DecimalPipe
  ]
})
export class ClientModule { }
