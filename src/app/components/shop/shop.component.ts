import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./shop.component.html',
  styleUrl:'./shop.component.css'
})
export class ShopComponent {
  selectedCategory: string = '';

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

  getNumeroDeObras(categoria: { nombre: string, obras: any[] }): number {
    return categoria.obras.length;
  }
  cant=this.getNumeroDeObras;

  // Método para manejar la selección de una categoría
  selectCategory(category: string) {
    this.selectedCategory = category;
  }
  selectNav(category: string) {
    this.selectedCategory = category;
  }

  // Método para obtener las obras por categoría
  getObrasByCategory(category: string) {
    const categoria = this.categorias.find(cat => cat.nombre === category);
    return categoria ? categoria.obras : [];
  }
}
