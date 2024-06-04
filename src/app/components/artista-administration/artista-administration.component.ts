import { Component, OnInit} from '@angular/core';
import { ObraService } from '../../services/obra.service';

import { Obra } from '../../models/Obra';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductService } from '../../services/productservice';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { trigger, state, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-artista-administration',
  standalone: true,
  imports: [TableModule, ConfirmDialogModule ,ToastModule,ToolbarModule, CommonModule,DialogModule  ,FormsModule, IconFieldModule, InputIconModule , TagModule, DropdownModule, ButtonModule, InputTextModule],
  templateUrl: './artista-administration.component.html',
  styleUrl: './artista-administration.component.css',
  providers: [ProductService,MessageService,ObraService, ConfirmationService],

})
export class ArtistaAdministrationComponent {

    productDialog: boolean = false;
    selectedObras!: Obra[];
    submitted: boolean = false;
    statuses!: any[];
    selectAll: boolean = false;
    selectedObra!: Obra[];
    totalRecords!: number;

    clonedProducts: { [s: string]: Obra } = {};
  
    editing: boolean = false;
  /*-------*/
  displayConfirmationDialog: boolean = false;

  flag: boolean = true;
  delivry: boolean = false;
  administration: boolean = false;
  obras: Obra[] = [];
  obrasPorArtista: Obra[] = [];
  public status: number;
  public obra: Obra;
  artist: any;

  constructor(
    private obraService: ObraService,
    private messageService: MessageService,
    
  ) {
    this.status = -1;
    this.obra = new Obra(1, 1, "", "", "", 1, true, "", null, null, null);
  }


  ngOnInit(): void {
    this.loadLoggedArtist();
    this.index();
  }
  
  loadLoggedArtist(){
    this.artist = sessionStorage.getItem('identity');
    this.artist = JSON.parse(this.artist);
  }

  index() {
    this.obraService.index().subscribe({
      next: (response: any) => {
        this.obras = response['data'];
        this.filterObrasByArtista(this.artist.iss);
        console.log(this.obrasPorArtista);
        this.obras=this.obrasPorArtista;
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
  openNew() {
    this.obra = new Obra(1, this.artist.iss, "", "", "", 1, true, "", null, null, null);
    this.submitted = false;
    this.productDialog = true;
}


  onSelectionChange(value = []) {
    this.selectAll = value.length === this.totalRecords;
    this.selectedObra = value;
  }

  getImage(obra: Obra): string | null {
    if (obra.imagen) {
      // Decodificar la imagen base64 y devolverla como una URL base64
      return 'data:image/jpeg;base64,' + obra.imagen;
    } else {
      return null;
    }
  }

  showConfirmationDialog() {
    this.displayConfirmationDialog = true;
  }

  deleteSelectedObras() {
    this.selectedObras.forEach(obra => {
      this.obraService.deleted(obra.id).subscribe({
        next: () => {
          this.obras = this.obras.filter(o => o.id !== obra.id);
          this.totalRecords--;
        },
        error: (err: Error) => {
          console.error('Error al eliminar la obra', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to delete obra: ${obra.nombre}`,
            life: 3000
          });
        }
      });
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Obras Deleted',
      life: 3000
    });

    this.selectedObras = [];
    this.displayConfirmationDialog = false;
  }

  hideConfirmationDialog() {
    this.displayConfirmationDialog = false;
  }
  
//   onSelectAllChange(event: any) {
//     const checked = event.checked;

//     if (checked) {
//         this.obraService.getProducts().then((res) => {
//             this.selectedObra = res;
//             this.selectAll = true;
//         });
//     } else {
//         this.selectedObra = [];
//         this.selectAll = false;
//     }
// }


// loadProducts() {
//   this.obras = this.obraService.index();
//   this.totalRecords = this.obras.length;
// }


// onRowEditInit(product: Obra, index: number) {
//   this.clonedProducts[product.id as string] = { ...product };
//   this.editing = true;
// }

// onRowEditSave(product: Obra) {
//   delete this.clonedProducts[product.id as string];
//   this.editing = false;
// }

// onRowEditCancel(product: Obra, index: number) {
//   this.obras[index] = this.clonedProducts[product.id as string];
//   delete this.clonedProducts[product.id as string];
//   this.editing = false;
// }

}
