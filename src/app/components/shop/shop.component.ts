import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ButtonModule, BrowserAnimationsModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {
 

  categorias = [
    {
      nombre: 'Cubismo',
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
      nombre: 'Realismo',
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
}
