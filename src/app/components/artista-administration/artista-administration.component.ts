import { Component, OnInit } from '@angular/core';
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
import Swal from 'sweetalert2';
import { server } from '../../services/global';
import { FacturaService } from '../../services/factura.service';
import { Factura } from '../../models/Factura';
import { Router, RouterLink } from '@angular/router';
import { Envio } from '../../models/Envio';
import { Pedido } from '../../models/Pedido';
import { EnvioService } from '../../services/envio.service';
@Component({
  selector: 'app-artista-administration',
  standalone: true,
  imports: [TableModule, ConfirmDialogModule, ToastModule, ToolbarModule, CommonModule, DialogModule, FormsModule, IconFieldModule, InputIconModule, TagModule, DropdownModule, ButtonModule, InputTextModule],
  templateUrl: './artista-administration.component.html',
  styleUrl: './artista-administration.component.css',
  providers: [ProductService, MessageService, ObraService, ConfirmationService],

})
export class ArtistaAdministrationComponent {
  public currentDate = new Date();
  
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

  delivry: boolean = false;
  administration: boolean = true;
  obras: Obra[] = [];
  facturasArtist:Factura[]=[];
  enviosArtist:Envio[]=[];
  selectedPedidos:Pedido[]=[];
  
  pedidosArtist:Pedido[]=[];
  
  fechaSeleccionada: string ='';
  ano: number | null = null;
  mes: string | null = null;
  dia: string | null = null;

  obrasPorArtista: Obra[] = [];
  public status: number;
  public obra: Obra;
  public pedido:Pedido;
  artist: any;
  selectedFile: File | null = null;
  urlAPI: string;

  artStyles: string[] = [
    'Cubism','Impressionism','Expressionism','Realism','Surrealism','Abstract','Renaissance',
    'Baroque','Rococo','Romanticism','Neoclassicism','Modernism','Pop Art','Naïve Art'
  ]

  tecnicas: string[]=[
    'Oil on canvas','Watercolor','Watercolor on paper','Tempera','Pastel painting','Fresco painting',
    'Digital painting','Wood carving','Marble sculpture','Engraving','Serigraphy','Art photography',
    'Digital art','Collage','Pyrography','Bronze sculpture'
  ]
  

  public formattedDate = this.formatDate(this.currentDate);
  constructor(
    private obraService: ObraService,
    private messageService: MessageService,
    private facturaService:FacturaService,
    private envioService: EnvioService,
    private _router:Router,
  ) {
    this.status = -1;
    this.urlAPI = server.url + 'obra/getimage/';

    this.pedido=new Pedido(new Envio(1,0,"Espera","","","","","",""), 
    new Factura(0,null,null,null,null,null,null));

    this.obra = new Obra(1, 1, "", "", "", 1, true, "", null, null, this.formattedDate);
  }

  ngOnInit(): void {
    this.loadLoggedArtist();
    this.index();
    this.getFacturasByArtist();
    this.indexEnvioByArtist();
  }

  logOut() {
    sessionStorage.clear();
    this._router.navigate([''])
  }

  loadLoggedArtist() {
    this.artist = sessionStorage.getItem('identity');
    this.artist = JSON.parse(this.artist);
  }

  private formatDate(date: Date): string {
    console.log(date);
    
    const year = date.getFullYear();
    const month = date.getMonth(); // Agrega un cero al mes si es necesario
    const day = date.getDate(); // Agrega un cero al día si es necesario
    return `${year}-${month}-${day}`;
  }


  index() {
    this.obraService.index().subscribe({
      next: (response: any) => {
        this.obras = response['data'];
        this.filterObrasByArtista(this.artist.iss);
        //console.log(this.obrasPorArtista);
        this.obras = this.obrasPorArtista;
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
    this.delivry = false;
    this.administration = false;
  }
  showDelivery(show: boolean) {
    this.delivry = show;
    this.administration = false;
  }
  adminObras(show: boolean) {
    this.delivry = false;
    this.administration = show;
  }

  /************************* */
  
  openNew() {
    this.obra = new Obra(1, this.artist.iss, "", "", "", 1, true, "", "", null, null);
    this.submitted = false;
    this.productDialog = true;
  }


  onSelectionChange(value = []) {
    this.selectAll = value.length === this.totalRecords;
    this.selectedObra = value;
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
    this.selectedFile = event.target.files[0];
  }

  updateObra(filename: any) {
    if (this.selectedFile) {
      this.obraService.updateImage(this.selectedFile, filename).subscribe({
        next: (response: any) => {
          console.log(response);
        },
        error: (err: Error) => {
          console.log(err.message);
        }
      });
    }
    this.obraService.update(this.obra).subscribe({
      next:(response:any)=>{
        console.log(response);
        location.reload();
      },
      error:(err:Error)=>{
        console.log(err);
      }
    });
  }

  storePedido(form: any): void {
    if (form.valid) {
      if (this.selectedFile) {
        console.log('Imagen:', this.selectedFile);
        this.facturaService.create(this.pedido.factura).subscribe({
          next: (response: any) => {
            console.log(response);
            if (response.idFactura) {
              this.pedido.envio.idFactura = response.idFactura;
              this.envioService.create(this.pedido.envio).subscribe({
                next: (response2: any) => {
                  console.log(response2); 
                  location.reload();
                },
                error: (err: any) => {
                  console.error(err);
                }
              });
            } else {
              console.error('No se recibió el id de la factura');
            }
          },
          error: (err: any) => {
            console.error(err);
          }
        });
      }
    }
  }

  updatePedido(){
    this.envioService.update(this.pedido.envio).subscribe({
      next: (response: any) => {
        console.log(response);
        location.reload();
      },
      error: (err: Error) => {
        console.log(err.message);
      }
    });
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

  msgAlert = (title: any, text: any, icon: any) => {
    Swal.fire({
      title,
      text,
      icon,
    })
  }

  storeImage(form: any): void {
    if (form.valid) {
      console.log('Obra:', this.obra);
      if (this.selectedFile) {
        console.log('Imagen:', this.selectedFile);
        this.obraService.upLoadImage(this.selectedFile).subscribe({
          next: (response: any) => {
            console.log(response);
            if (response.filename) {
              this.obra.imagen = response.filename;
              this.obra.fechaCreacion = this.fechaSeleccionada;
              this.obra.fechaRegistro = this.formattedDate;
              console.log(this.obra)
              this.obraService.create(this.obra).subscribe({
                next: (response2: any) => {
                  console.log(response2); console.log(this.obra)
                  location.reload();
                },
                error: (err: any) => {
                  console.error(err);

                }
              });
            } else {
              console.error('No se recibió el nombre del archivo.');
            }
          },
          error: (err: any) => {
            console.error(err);
          }
        });
      }
    }
  }



  indexEnvioByArtist() {
    this.envioService.indexByArtist().subscribe({
      next: (response: any) => {
        this.enviosArtist = response['data'];
        console.log(this.enviosArtist);
        this.fillPedidos();
      },
      error: (err: Error) => {
        console.error('Error al cargar los envios del artista', err);
      }
    });
  }


  getFacturasByArtist() {
    this.facturaService.indexByArtistId(this.artist['iss']).subscribe({
      next: (response: any) => {
        this.facturasArtist = response['data'];
        console.log(this.facturasArtist);
       // this.fillPedidos();
      },
      error: (err: Error) => {
        console.error('Error al cargar las facturas', err);
      }
    });
  }

  fillPedidos() {
    this.pedidosArtist = [];
    for (let envio of this.enviosArtist) {
        let factura = this.facturasArtist.find(f => f.id === envio.idFactura);
        if (factura) {
            let direccionCompleta = `${envio.direccion}, ${envio.provincia}, ${envio.ciudad}, Postal code: ${envio.codigoPostal}`;
            envio.direccion = direccionCompleta; // Agregar el atributo direcciónCompleta al envío
            let pedido = new Pedido(envio, factura);
            this.pedidosArtist.push(pedido);
        }
    }
    console.log("Pedidos: ", this.pedidosArtist);
}

 

  onFechaChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const fecha = new Date(input.value);
    this.ano = fecha.getFullYear();
    this.mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Mes se cuenta desde 0
    this.dia = ('0' + fecha.getDate()).slice(-2);
    this.fechaSeleccionada = `${this.ano}-${this.mes}-${this.dia}`;
  }

}
