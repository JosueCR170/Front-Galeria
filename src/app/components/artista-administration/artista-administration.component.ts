import { Component, OnInit} from '@angular/core';
import { ObraService } from '../../services/obra.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Obra } from '../../models/Obra';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { ProductService } from '../../services/productservice';
import { Product } from '../../models/Product';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-artista-administration',
  standalone: true,
  imports: [TableModule, ToastModule,FormsModule, CommonModule, TagModule, DropdownModule, ButtonModule, InputTextModule],
  templateUrl: './artista-administration.component.html',
  styleUrl: './artista-administration.component.css',
  providers: [ProductService, MessageService]
})
export class ArtistaAdministrationComponent {
  productDialog: boolean = false;

    products!: Product[];

    cantidad!: Product[];

    product!: Product;

    selectedProducts!: Product[] | null;

    submitted: boolean = false;

    statuses!: any[];

    selectAll: boolean = false;

    selectedProduct!: Product[];
    totalRecords!: number;

    clonedProducts: { [s: string]: Product } = {};
  
    editing: boolean = false;
  /*-------*/

  flag: boolean = true;
  delivry: boolean = false;
  administration: boolean = false;
  obras: Obra[] = [];
  obrasPorArtista: any[] = [];
  public status: number;
  public obra: Obra;
  selectedArtistId: number = 1;
  constructor(
    private productService: ProductService,
    private _obraService: ObraService,
    private messageService: MessageService
    
  ) {
    this.status = -1;
    this.obra = new Obra(1, 1, "", "", "", 1, true, "", null, null, null);
  }


  ngOnInit(): void {
    this.loadProducts();
  }
  

  index() {
    this._obraService.index().subscribe({
      next: (response: any) => {
        this.obras = response['data'];
        this.filterObrasByArtista(this.selectedArtistId);
      },
      error: (err: Error) => {
        console.error('Error al cargar las obras', err);
      }
    });
  }

  filterObrasByArtista(idArtista: number) {
    this.obrasPorArtista = this.obras.filter(obra => obra.idArtista === idArtista);
  }

  showHome(show: boolean) {
    this.flag = show;
    this.delivry = false;
    this.administration = false;
  }
  showDelivery(show: boolean) {
    this.flag = false;
    this.delivry = show;
    this.administration = false;
  }
  adminObras(show: boolean) {
    this.flag = false;
    this.delivry = false;
    this.administration = show;
  }

  /************************* */
  onSelectionChange(value = []) {
    this.selectAll = value.length === this.totalRecords;
    this.selectedProduct = value;
  }
  
  onSelectAllChange(event: any) {
    const checked = event.checked;

    if (checked) {
        this.productService.getProducts().then((res) => {
            this.selectedProduct = res;
            this.selectAll = true;
        });
    } else {
        this.selectedProduct = [];
        this.selectAll = false;
    }
}


loadProducts() {
  this.products = this.productService.getProductsData();
  this.totalRecords = this.products.length;
}

onRowEditInit(product: Product, index: number) {
  this.clonedProducts[product.id as string] = { ...product };
  this.editing = true;
}

onRowEditSave(product: Product) {
  delete this.clonedProducts[product.id as string];
  this.editing = false;
}

onRowEditCancel(product: Product, index: number) {
  this.products[index] = this.clonedProducts[product.id as string];
  delete this.clonedProducts[product.id as string];
  this.editing = false;
}

}
