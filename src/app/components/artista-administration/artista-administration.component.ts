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

  artStyles: string[] = [
    'Cubism',
    'Impressionism',
    'Expressionism',
    'Realism',
    'Surrealism',
    'Abstract',
    'Renaissance',
    'Baroque',
    'Rococo',
    'Romanticism',
    'Neoclassicism',
    'Modernism',
    'Pop Art',
    'Naïve Art'
  ]

  tecnicas: string[]=[
    'Oil on canvas',
    'Watercolor',
    'Watercolor on paper',
    'Tempera',
    'Pastel painting',
    'Fresco painting',
    'Digital painting',
    'Wood carving',
    'Marble sculpture',
    'Engraving',
    'Serigraphy',
    'Art photography',
    'Digital art',
    'Collage',
    'Pyrography',
    'Bronze sculpture'
  ]

  
  

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


  /**Parte del UPDATE Obra */
  selectedImageFile: File | null = null;

  selectCategoria(categoria: string) {
    this.obra.categoria = categoria;
  }

  selectTecnica(tecnica: string) {
    this.obra.tecnica = tecnica;
  }

  editObra(obra: Obra) {
    this.obra = { ...obra };
    this.productDialog = true;
  }

  onImageFileChange(event: any): void {
    this.selectedImageFile = event.target.files[0];
  }

  updateObra(): void {
    if (this.selectedImageFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.obra.imagen = e.target.result.split(',')[1]; // Extraer la imagen en base64
        this.saveUpdatedObra();
      };
      reader.readAsDataURL(this.selectedImageFile);
    } else {
      this.saveUpdatedObra();
    }
  }

  saveUpdatedObra(): void {
    this.obraService.update(this.obra).subscribe({
      next: (response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Obra Updated',
          life: 3000
        });
        this.index(); // Recargar las obras después de la actualización
      },
      error: (err: Error) => {
        console.error('Error al actualizar la obra', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update obra',
          life: 3000
        });
      }
    });
    this.productDialog = false;
  }
  
  
  /**Parte del DELETE Obra */
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

 /* onInput(event: any): void {
    const inputValue = (event.target as HTMLInputElement).value;
    this.dt.filterGlobal(inputValue, 'contains');
  }*/
  

}
