import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';
import Swal from 'sweetalert2';

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
  public user: User;
  constructor(
    private _userService:UserService,
    private _router:Router,
    private _routes:ActivatedRoute
  ){
    this.status=-1;
    this.user=new User(1, "", true, "", "", null,"")
  }

  loadArtist(){
    this._router.navigate(['/admin'])
    }

  onSubmit(form:any){
    console.log(this.user)
    this._userService.login(this.user).subscribe({
      next:(response:any)=>{
        if(response.status != 401){
          console.log(response)
          sessionStorage.setItem("token", response);
          this._userService.getIdentityFromAPI().subscribe({
            next:(resp:any)=>{
              sessionStorage.setItem('identity', JSON.stringify(resp));
              this._router.navigate(['/shop'])
              //console.log(resp);
            },
            error:(error:Error)=>{

            }
          })
        } else {
          this.status = 0;
          this.msgAlert('Usuario y/o contraseña incorrecta','error');
          form.reset(); 
        }
      },
      error:(err:any)=>{
        this.status = 1;
        this.msgAlert('Error, desde el servidor. Contacte al administrador','error');
      }
    })
  }

  backLogin(){
    
  }

  msgAlert= (title:any, icon:any) =>{
    Swal.fire({
      title,
      icon,
    })
  }
}
