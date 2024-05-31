import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ViewArtworkComponent } from './components/view-artwork/view-artwork.component';
import { ShopComponent } from './components/shop/shop.component';
import { SaleComponent } from './components/sale/sale.component';

export const routes: Routes = [
    {path:'',component: HomeComponent},
    {path:'login',component: LoginComponent},
    {path:'login/signup', component: SignupComponent},
    {path:'viewArtwork', component: ViewArtworkComponent},
    {path:'shop',component:ShopComponent},
    {path: 'sale',component:SaleComponent}

];
