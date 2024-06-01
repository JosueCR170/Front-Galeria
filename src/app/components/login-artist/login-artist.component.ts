import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/User';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-artist',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login-artist.component.html',
  styleUrl: './login-artist.component.css'
})
export class LoginArtistComponent {
  public status:number;
  public user:User;
  constructor(
    private _router:Router,
    private _routes:ActivatedRoute
  ){
    this.status=-1;
    this.user=new User(1, "",true, "", "", "","")
  }
}
