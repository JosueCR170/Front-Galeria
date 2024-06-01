import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers:[UserService]
})
export class LoginComponent {
  public status:number;
  public user:User;
  constructor(
    private _userService:UserService,
    private _router:Router,
    private _routes:ActivatedRoute
  ){
    this.status=-1;
    this.user=new User(1, "", true, "", "", "","")
  }

  onSubmit(form:any){
    this._userService.login(this.user).subscribe({
      next:(response:any)=>{
        if(response.status != 401){
          sessionStorage.setItem("token", response);
          this._userService.getIdentityFromAPI().subscribe({
            next:(resp:any)=>{
              sessionStorage.setItem('identity', resp);
              this._router.navigate(['/shop'])
            },
            error:(error:Error)=>{

            }
          })
        } else {
          this.status = 0;
        }
      },
      error:(err:any)=>{
        this.status = -1;
      }
    })
  }
}
