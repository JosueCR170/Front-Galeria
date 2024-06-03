import { Component } from '@angular/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

  flag: boolean = true;
  delivry: boolean = false;
  administration: boolean = false;

  showHome(show: boolean) {
    this.flag = show;
    this.delivry = false;
    this.administration = false;
  }
  showDelivery(show: boolean) {
    this.flag = false;
    this.delivry = show;
    this.administration = false;
  }
  adminObras(show: boolean) {
    this.flag = false;
    this.delivry = false;
    this.administration = show;
  }
}
