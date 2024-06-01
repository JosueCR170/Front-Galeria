import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ObraService } from '../../services/obra.service';
import { Obra } from '../../models/Obra';

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
    private _routes: ActivatedRoute
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

  categorias = [
    {
      nombre: 'Cubism',
      obras: [
        { nombre: 'Obra 1', precio: 1900, imagen: '/assets/img/prueba2.jpg' },
        { nombre: 'Obra 2', precio: 1900, imagen: '/assets/img/prueba2.jpg' },
        { nombre: 'Obra 4', precio: 1900, imagen: '/assets/img/prueba2.jpg' },
        { nombre: 'Obra 5', precio: 1900, imagen: '/assets/img/prueba2.jpg' },
        { nombre: 'Obra 6', precio: 1900, imagen: '/assets/img/prueba2.jpg' },
        { nombre: 'Obra 7', precio: 1900, imagen: '/assets/img/prueba2.jpg' },
        { nombre: 'Obra 8', precio: 1900, imagen: '/assets/img/prueba2.jpg' },
        { nombre: 'Obra 9', precio: 1900, imagen: '/assets/img/prueba2.jpg' },
        // Añade las demás obras de cubismo aquí
      ]
    },
    {
      nombre: 'Impressionism',
      obras: [
        { nombre: 'Obra 1', precio: 1900, imagen: '/assets/img/prueba2.jpg' },
        { nombre: 'Obra 2', precio: 1900, imagen: '/assets/img/prueba2.jpg' },
        // Añade las demás obras de realismo aquí
      ]
    },
    // Añade más categorías si es necesario
  ];

  ngOnInit(): void {
    // Aquí puedes llamar al método que desees que se ejecute al cargar el componente
    this.index();
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

  loadCategorysExists() {
    if (this.obras.length >= 1) {
      this.obras.forEach(obra => {
        if (!this.categoryExists.includes(obra.categoria)) {
        this.categoryExists.push(obra.categoria);
        }
      });
    }
    console.log(this.categoryExists);
  }

  loadAuxObras(category:string){
    this.auxObras = this.obras.filter(obra => obra.categoria === category);
  }

  categoryExistsLength(category:string){
    console.log(1);
    this.loadAuxObras(category);
    return this.categoryExists.length;
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
  }
  selectNav(category: string) {
    this.selectedCategory = category;
  }

  // Método para obtener las obras por categoría

  getObrasByCategory(category: string) {
    const categoria = this.categorias.find(cat => cat.nombre === category);
    return categoria ? categoria.obras : [];
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
}
