import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ObraService } from '../../services/obra.service';
import { Obra } from '../../models/Obra';
import { UserService } from '../../services/user.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ArtistService } from '../../services/artist.service';
import { Artista } from '../../models/Artista';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AutoCompleteModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
  providers: [ObraService]
})
export class ShopComponent {
  artistName: string = '';

  public status: number;
  public obra: Obra;
  public artista: Artista;
  constructor(
    private _obraService: ObraService,
    private _router: Router,
    private _artistas: ArtistService
  ) {
    this.status = -1;
    this.obra = new Obra(1, 1, "", "", "", 1, true, "", null, null, null);
    this.artista = new Artista(1, "", "", "", "", "");
  }

  items: any[] | undefined;
  selectedItem: any;
  suggestions: any[] = [];
  artistas: Artista[] = [];
  obras: Obra[] = [];
  auxObras: Obra[] = [];
  auxObras2: Obra[] = [];
  auxArtistas: Artista[] = [];
  categoryExists: string[] = [];
  selectedCategory: string = '';
  flag: boolean = true;
  onClick: boolean = false;
  all: boolean = false;
  artistaMenu: boolean = false;
  user: any;
  urlAPI: string = "http://127.0.0.1:8000/api/v1/obra/getimage/";

  ngOnInit(): void {
    // Aquí puedes llamar al método que desees que se ejecute al cargar el componente
    this.index();
    this.loadLoggedUser();
    this.indexArtista();
  }

  logOut() {
    sessionStorage.clear();
    this._router.navigate([''])
  }

  index() {
    this._obraService.index().subscribe({
      next: (response: any) => {
        this.obras = response['data'];
        this.loadCategorysExists();
      },
      error: (err: Error) => {

      }
    })
  }


  indexArtista() {
    this._artistas.index().subscribe({
      next: (response: any) => {

        this.auxArtistas = this.artistas = response['data'];
        console.log(this.artistas)

      },
      error: (err: Error) => {

      }
    })
  }

  countObrasOfArtista(id: number) {
    let i = 0;
    this.obras.forEach(obra => {
      if (obra.idArtista == id) {
        i++;
      }
    });
    return i;
  }

  loadCategorysExists() {
    if (this.obras.length >= 1) {
      this.obras.forEach(obra => {
        if (!this.categoryExists.includes(obra.categoria)) {
          this.categoryExists.push(obra.categoria);
        }
      });
    }
  }

  getArtistaById(id:number) {
    this.artistas.forEach(artista => {
      if (artista.id == id){
        this.artista = artista;
      }
    });
  }

  loadAuxObras(category: string) {
    this.auxObras = this.obras.filter(obra => obra.categoria === category);
  }

  categoryExistsLength(category: string) {
    this.loadAuxObras(category);
    return this.categoryExists.length;
  }

  loadObrasLength(category: string) {
    this.loadAuxObras(category);
    return this.auxObras.length;
  }

  loadLoggedUser() {
    this.user = sessionStorage.getItem('identity');
    this.user = JSON.parse(this.user);
  }

  getNumeroDeObras(categoria: { nombre: string, obras: any[] }): number {
    return categoria.obras.length;
  }

  // Método para manejar la selección de una categoría
  selectCategory(category: string) {
    this.selectedCategory = category;
    this.onClick = true;
    this.flag = false;
    this.all = false;
    this.artistaMenu = false
  }

  showHome(show: boolean) {
    this.flag = show;
    this.onClick = false;
    this.all = false;
    this.artistaMenu = false
  }

  showAll(all: boolean) {
    this.selectedCategory = '';
    this.all = all;
    this.flag = false;
    this.onClick = false;
    this.artistaMenu = false
  }
  showArtist(artistTrue: boolean) {
    this.all = false;
    this.flag = false;
    this.onClick = false;
    this.artistaMenu = artistTrue
  }

  loadAdmin() {
    this._router.navigate(['/admin'])
  }

  redirectToLoginArtist() {
    this._router.navigate(['/loginArtist']);
  }

  searchObras(event: any) {
    const query = event.target.value || '';
    const lowercaseQuery = query.toLowerCase();

    // Si el input está vacío, muestra todas las obras
    console.log(lowercaseQuery)
    if (lowercaseQuery === '') {
      this.index();
      this.auxObras = [...this.obras];
      this.obras = this.auxObras

    } else {
      // Filtra las obras de arte que coinciden con el texto de búsqueda en el nombre de la obra
      this.auxObras = this.obras.filter(obra => obra.nombre.toLowerCase().includes(lowercaseQuery));
      this.obras = this.auxObras
      this.selectedCategory = '';
      this.all = true;
      this.flag = false;
      this.onClick = false;
      this.artistaMenu = false;
      console.log("EL aux obras" + this.auxObras)
      console.log(this.obras)
    }
  }

  searchArtist(event: any) {
    const query = event.target.value || '';
    const lowercaseQuery = query.toLowerCase();

    // Si el input está vacío, muestra todas las obras
    console.log(lowercaseQuery)
    if (lowercaseQuery === '') {
      this.indexArtista();
      this.auxArtistas = [...this.artistas];
      this.artistas = this.auxArtistas

    } else {
      // Filtra las obras de arte que coinciden con el texto de búsqueda en el nombre de la obra
      this.auxArtistas = this.artistas.filter(artista => artista.nombre.toLowerCase().includes(lowercaseQuery));
      this.artistas = this.auxArtistas;
      console.log("EL aux obras" + this.auxArtistas)
      console.log(this.artistas)
    }
  }

  searchObrasByArtist(id: number) {
    this.obras.forEach(obra => {
      this.auxObras2 = this.obras.filter(obra => obra.idArtista == id);
      console.log(this.auxObras);
    });
    this.getArtistaById(id);
    this.all = false;
    this.flag = false;
    this.onClick = false;
    this.artistaMenu = true;
    // this.auxObras2 = this.auxObras;
  }
}
