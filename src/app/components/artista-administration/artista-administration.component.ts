import { Component } from '@angular/core';

@Component({
  selector: 'app-artista-administration',
  standalone: true,
  imports: [],
  templateUrl: './artista-administration.component.html',
  styleUrl: './artista-administration.component.css'
})
export class ArtistaAdministrationComponent {
  flag: boolean = false;

  showHome(show: boolean) {
    this.flag = show;
  }
}
