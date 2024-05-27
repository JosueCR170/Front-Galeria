import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ShopComponent } from './components/shop/shop.component';

export const routes: Routes = [
    {path:'',component: HomeComponent},
    {path:'shop',component:ShopComponent}
];
