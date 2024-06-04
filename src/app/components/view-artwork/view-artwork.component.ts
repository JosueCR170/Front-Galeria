import { Component } from '@angular/core';
import { Obra } from '../../models/Obra';
import { ObraService } from '../../services/obra.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { ArtistService } from '../../services/artist.service';

@Component({
  selector: 'app-view-artwork',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './view-artwork.component.html',
  styleUrl: './view-artwork.component.css',
  providers: [ObraService, ArtistService]
})
export class ViewArtworkComponent {
  public obra: Obra;
  public status: number;

  constructor(
    private _obraService: ObraService,
    private _artistService: ArtistService,
    private _router: Router,
    private _routes: ActivatedRoute,
    private _userService: UserService
  ) {
    this.status = -1;
    this.obra = new Obra(1, 1, "", "", "", 1, true, "", null, null, null);
  }
  user: any;
  artistName:string='Anonimo';


  ngOnInit(): void {
    const id = this._routes.snapshot.paramMap.get('id');
    console.log('ID obtenido de la ruta:', id); // Verificar que el ID se está obteniendo correctamente
    if (id) {
      this.getObra(id);
      //console.log(this.obra);
      //this.getArtista(this.obra.idArtista);
    }
    this.loadLoggedUser();
  }
  
  getObra(id: string): void {
    this._obraService.getArtworkById(id).subscribe(
      data => {
        //console.log('Obra obtenida:', data); // Verificar los datos obtenidos
        this.obra = data['obra'];
        this.artistName=data['obra'].artista.nombreArtista;
        this.status = 1;
      },
      error => {
        console.error('Error al obtener la obra:', error);
        this.status = 0;
      }
    );
  }

  
  loadLoggedUser(){
    this.user = sessionStorage.getItem('identity');
    this.user = JSON.parse(this.user);
  }

  loadAdmin(){
    this._router.navigate(['/admin'])
    }

  
  logOut(){
    sessionStorage.clear();
    this._router.navigate([''])
  }

  getImage(obra: Obra): string | null {
  if (obra.imagen) {
    // Decodificar la imagen base64 y devolverla como una URL base64
    return 'data:image/jpeg;base64,' + obra.imagen;

  } else {
    return null;
  }
}
redirectToSale() {
  this._router.navigate(['sale', this.obra.id]);
}

}



