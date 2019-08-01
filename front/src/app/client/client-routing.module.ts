import { NgModule } from '@angular/core';
import { Injectable } from '@angular/core';
import { Routes, RouterModule, CanActivate, Router } from '@angular/router';
import { ClientLayoutComponent } from './client-layout/client-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { WithdrawalComponent } from './withdrawal/withdrawal.component';
import { Convert1Component } from './convert1/convert1.component';
import { Convert2Component } from './convert2/convert2.component';
import { OpenorderComponent } from './openorder/openorder.component';
import { SuccessfulorderComponent } from './successfulorder/successfulorder.component';
import { AboutComponent } from './about/about.component';
import { FaqComponent } from './faq/faq.component';
import { StorageService } from '../services/storage.service';
import { TxhistoryComponent } from './txhistory/txhistory.component';
import { RewardComponent } from './reward/reward.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { CryptoBazaarComponent } from './crypto-bazaar/crypto-bazaar.component';
import { BazaarProductComponent } from './bazaar/bazaar-product/bazaar-product.component';
import { PreCheckoutOrdersComponent } from './bazaar/pre-checkout-orders/pre-checkout-orders.component';
import { BazaarProductEditComponent } from './bazaar/bazaar-product-edit/bazaar-product-edit.component';

@Injectable()
export class Guard implements CanActivate {
	constructor(private storage: StorageService, private router: Router) { }
	canActivate() {
		if (!this.storage.getUser() /* check user logged or not */) {
			this.router.navigate(['/login']);
			return false;
		}
		return true;
	}
}

const routes: Routes = [
	{
		path: '',
		component: ClientLayoutComponent,
		children: [
			{
				path: '',
				redirectTo: 'home',
				pathMatch: 'full'
			},
			{
				path: 'login',
				component: LoginComponent
			},
			{
				path: 'home',
				component: HomeComponent
			},
			{
				path: 'register',
				component: RegisterComponent
			},
			{
				path: 'register/:id',
				component: RegisterComponent
			},
			{
				path: 'dashboard',
				canActivate: [Guard],
				component: DashboardComponent
			},
			{
				path: 'withdrawal',
				canActivate: [Guard],
				component: WithdrawalComponent
			},
			{
				path: 'convert-btc-to-lc',
				canActivate: [Guard],
				component: Convert1Component
			},
			{
				path: 'convert-lc-to-btc',
				canActivate: [Guard],
				component: Convert2Component
			},
			{
				path: 'open-order',
				canActivate: [Guard],
				component: OpenorderComponent
			},
			{
				path: 'successful-order',
				canActivate: [Guard],
				component: SuccessfulorderComponent
			},
			{
				path: 'txhistory',
				canActivate: [Guard],
				component: TxhistoryComponent
			},
			{
				path: 'about',
				component: AboutComponent
			},
			{
				path: 'faq',
				component: FaqComponent
			},
			{
				path: 'how',
				component: HowItWorksComponent
			},
			{
				path: 'contact',
				component: ContactUsComponent
			},
			{
				path: 'forgot',
				component: ForgotPasswordComponent
			},
			{
				path: 'cryptobazaar',
				component: CryptoBazaarComponent
			},
			{
				path: 'cryptobazaar/shop/:id',
				component: BazaarProductComponent
			},
			{
				path: 'cryptobazaar/shop/:id/product/edit/:id',
				component: BazaarProductEditComponent
			},
			{
				path: 'cryptobazaar/shop/:id/precheckout',
				component: PreCheckoutOrdersComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ClientRoutingModule { }
