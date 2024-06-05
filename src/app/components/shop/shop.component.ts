import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ObraService } from '../../services/obra.service';
import { Obra } from '../../models/Obra';
import { UserService } from '../../services/user.service';
import { server } from '../../services/global';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
  providers: [ObraService]
})
export class ShopComponent {
  public status: number;
  public obra: Obra;
urlAPI: string;

  constructor(
    private _obraService: ObraService,
    private _router: Router,
    private _routes: ActivatedRoute,
    private _userService: UserService
  ) {
    this.status = -1;
    this.urlAPI = server.url+'obra/getimage/';
    this.obra = new Obra(1, 1, "", "", "", 1, true, "", null, null, null);
  }


  obras: Obra[] = [];
  auxObras: Obra[] = [];
  categoryExists: string[] = [];
  selectedCategory: string = '';
  flag: boolean = true;
  onClick: boolean = false;
  all: boolean = false;
  user: any;
  

  ngOnInit():void {
    // Aquí puedes llamar al método que desees que se ejecute al cargar el componente
    this.index();
    this.loadLoggedUser();
  }

  logOut(){
    sessionStorage.clear();
    this._router.navigate([''])
  }

  index() {
    this._obraService.index().subscribe({
      next: (response: any) => {
        this.obras = response['data'];
        this.auxObras = [...this.obras];
        this.loadCategorysExists();
      },
      error: (err: Error) => {

      }
    })
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

  loadAuxObras(category:string){
    this.auxObras = this.obras.filter(obra => obra.categoria === category);
  }

  categoryExistsLength(category:string){
    this.loadAuxObras(category);
    return this.categoryExists.length;
  }

  loadObrasLength(category:string){
    this.loadAuxObras(category);
    return this.auxObras.length;
  }

  loadLoggedUser(){
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
  }

  showHome(show: boolean) {
    this.flag = show;
    this.onClick = false;
    this.all = false;
  }

  showAll(all: boolean) {
    this.selectedCategory = '';
    this.all = all;
    this.flag = false;
    this.onClick = false;
  }

  loadAdmin(){
    this._router.navigate(['/admin'])
    }
    
  redirectToLoginArtist() {
    this._router.navigate(['/loginArtist']);
  }

  searchObras(event: any) {
    const inputValue = (event.target as HTMLInputElement)?.value;
    if (inputValue !== undefined && inputValue !== null) {
      this.auxObras = this.obras.filter(obra => obra.nombre.toLowerCase().includes(inputValue.toLowerCase()));
      
    } else {
      this.auxObras = [...this.obras];
    }
  }
  

}
