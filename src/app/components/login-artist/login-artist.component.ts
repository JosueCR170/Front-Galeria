import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Artista } from '../../models/Artista';
import { ArtistService } from '../../services/artist.service';

@Component({
  selector: 'app-login-artist',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login-artist.component.html',
  styleUrl: './login-artist.component.css',
  providers:[ArtistService]
})
export class LoginArtistComponent {
  public status:number;
  public artist:Artista;
  constructor(
    private _artistService: ArtistService,
    private _router:Router,
    private _routes:ActivatedRoute
  ){
    this.status=-1;
    this.artist=new Artista(1,"","","","","")
  }


  onSubmit(form:any){
    this._artistService.loginArtist(this.artist).subscribe({
      next:(response:any)=>{
        if(response.status != 401){
          sessionStorage.setItem("token", response);
          this._artistService.getIdentityFromAPI().subscribe({
            next:(resp:any)=>{
              sessionStorage.setItem('identity', resp);
              this._router.navigate(['/artistaAdministration'])
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
