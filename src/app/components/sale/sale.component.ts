import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent {

   shippingCost: string = '';
   totalCost: string = '';
   productPrice: number = 19000;

  updateShippingMethod(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    if (selectedValue === 'Home delivery') {
      this.shippingCost = '3.000';
      this.totalCost = (this.productPrice + 3000).toString();
    } else if (selectedValue === 'Product recall') {
      this.shippingCost = 'Free';
      this.totalCost = this.productPrice.toString();
    } else {
      this.shippingCost = '';
      this.totalCost = this.productPrice.toString();
    }
  }
}
