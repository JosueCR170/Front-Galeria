import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ObraService } from '../../services/obra.service';
import { Obra } from '../../models/Obra';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

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


  constructor(
    private _obraService: ObraService,
    private _router: Router,
    private _routes: ActivatedRoute,
    private _userService: UserService
  ) {
    this.status = -1;
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
        this.loadCategorysExists();
      },
      error: (err: Error) => {

      }
    })
  }

  getImage(obra: Obra): string | null {
    if (obra.imagen) {
      // Decodificar la imagen base64 y devolverla como una URL base64
      return 'data:image/jpeg;base64,' + obra.imagen;
    } else {
      return null;
    }
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
  cant = this.getNumeroDeObras;

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

  redirectToLoginArtist() {
    this._router.navigate(['/loginArtist']);
  }

}
