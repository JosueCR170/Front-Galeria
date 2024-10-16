import { Component, OnInit } from '@angular/core';
import { ObraService } from '../../services/obra.service';
import { TallerService} from '../../services/taller.service';
import { Obra } from '../../models/Obra';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
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
import { HttpErrorResponse } from '@angular/common/http';
import { RippleModule } from 'primeng/ripple';
import { DetalleFacturaService } from '../../services/detalleFactura.service';
import { Taller } from '../../models/Taller';

@Component({
  selector: 'app-artista-administration',
  standalone: true,
  imports: [TableModule, ConfirmDialogModule, ToastModule, ToolbarModule, CommonModule, DialogModule, FormsModule, TagModule, DropdownModule, ButtonModule, RippleModule],
  templateUrl: './artista-administration.component.html',
  styleUrl: './artista-administration.component.css',
  providers: [MessageService, ObraService, ConfirmationService],

})
export class ArtistaAdministrationComponent {
  public currentDate = new Date();
  errors:string[]=[];
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

  /*----------
  
  Talleres

  selectedTalleres!: Taller[];
  talleres: Taller[] = [];
  talleresPorArtista: Taller[] = [];
  public taller: Taller;

 */
  delivry: boolean = false;
  administration: boolean = true;
  obras: Obra[] = [];
  facturasArtist: Factura[] = [];
  enviosArtist: Envio[] = [];
  selectedPedidos!: Pedido[];

  pedidosArtist: Pedido[] = [];

  fechaSeleccionada: string = '';
  ano: number | null = null;
  mes: string | null = null;
  dia: string | null = null;

  obrasPorArtista: Obra[] = [];
  public status: number;
  public obra: Obra;
  public pedido: Pedido;
  artist: any;
  selectedFile: File | null = null;
  urlAPI: string;

  artStyles: string[] = [
    'Cubism', 'Impressionism', 'Expressionism', 'Realism', 'Surrealism', 'Abstract', 'Renaissance',
    'Baroque', 'Rococo', 'Romanticism', 'Neoclassicism', 'Modernism', 'Pop Art', 'Naïve Art'
  ]

  tecnicas: string[] = [
    'Oil on canvas', 'Watercolor', 'Watercolor on paper', 'Tempera', 'Pastel painting', 'Fresco painting',
    'Digital painting', 'Wood carving', 'Marble sculpture', 'Engraving', 'Serigraphy', 'Art photography',
    'Digital art', 'Collage', 'Pyrography', 'Bronze sculpture'
  ]

  constructor(
    private obraService: ObraService,
    private messageService: MessageService,
    private facturaService: FacturaService,
    private detalleFacturaService:DetalleFacturaService,
    private envioService: EnvioService,
    //private tallerService: TallerService,
    private _router: Router,
  ) {
    this.status = -1;
    this.urlAPI = server.url + 'obra/getimage/';

    this.pedido = new Pedido(new Envio(1, 0, "Espera", "", "", "", "", "", ""),
      new Factura(0,null,"",0));
    this.obra = new Obra(1, 1, "", "", "", 0 , true, "", null, null, "");
    //this.taller = new Taller(1,"","",1,1);
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

  redirectToArtistLogin() {
    this._router.navigate(['loginArtist'])
  }

  authTokenArtist() {
    let aux = sessionStorage.getItem('identity');
    if (aux == null) {
      return false;
    } else {
      let jason = JSON.parse(aux);
      if (jason.nombreArtista == null) {
        return false;
      }
      return true;
    }
  }

  reloadTablePedidos() {
    this.indexEnvioByArtist();
    this.selectedPedidos = [];
  }

  loadLoggedArtist() {
    this.artist = sessionStorage.getItem('identity');
    this.artist = JSON.parse(this.artist);
  }

  index() {
    this.obraService.getArtworkByArtistId(this.artist['iss']).subscribe({
      next: (response: any) => {
        this.obras = response['data'];
        console.log("Obras de artista: ",this.obras)
      },
      error: (err: Error) => {
        console.error('Error al cargar las obras', err);
      }
    });
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
    this.obra = new Obra(1, this.artist.iss, "", "", "", 0, true, "", "", null, null);
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

  editPedido(pedido: Pedido) {
    this.pedido = { ...pedido };
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
      next: (response: any) => {
        console.log(response);
        location.reload();
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
  }

  storePedido(form: any): void {
    // if (form.valid) {
    //   let obrita = this.obras.find(o => o.id == this.pedido.factura.idObra);
    //   if (obrita?.disponibilidad) {
    //     this.facturaService.create(this.pedido.factura).subscribe({
    //       next: (response: any) => {
    //         if (response['Factura'].id) {
    //           this.pedido.envio.idFactura = response['Factura'].id;
    //           this.envioService.create(this.pedido.envio).subscribe({
    //             next: (response2: any) => {
    //               console.log(response2);
    //               this.updateDisponibilidadObra(obrita,false);
    //               this.msgAlert('Order saved successfully','','success');
    //               //location.reload();

    //             },
    //             error: (err: any) => {
    //               console.error(err);
    //             }
    //           });
    //         } else {
    //           console.error('No se recibió el id de la factura');
    //         }
    //       },
    //       error: (err: any) => {
    //         console.error(err);
    //       }
    //     });
    //   } else {
    //     this.msgAlert('Order not save successfully','','error');

    //   }
    // }
  }

  updatePedido(envio: Envio) {
    //console.log(envio);
    this.envioService.update(envio).subscribe({
      next: (response: any) => {

       // console.log(response);
        this.msgAlert('Order updated successfully','','success');
        this.selectedPedidos = [];
       // this.indexEnvioByArtist();

      },
      error: (err: Error) => {
        console.log(err);
        this.msgAlert('Error, from the server. Contact administrator','','error');
      }
    });
  }


  deleteImage(filename:string|null){

    if(filename==null){
      this.msgAlert('Imagen no eliminada, contiene null','','error');
      return;
    }

    this.obraService.destroyImage(filename).subscribe({
      next:(response:any)=>{
        console.log(response);
        //this.msgAlert('Imagen eliminada','','success');
      },
      error:(error:any)=>{
        console.error(error);
       // this.msgAlert('Imagen no eliminada','','error');
      }
    });
  }
  /**Parte del DELETE Obra */
  deleteSelectedObras() {
    let allAvailable = true;

    this.selectedObras.forEach(obra => {
        if (!obra.disponibilidad) {
            allAvailable = false;
        }
    });

    if (!allAvailable) {
      this.selectedObras = [];
        this.msgAlert('Error when deleting artwork, check that they are not sold', '', 'error');
        return;
    }

    this.selectedObras.forEach(obra => {
     

      this.obraService.deleted(obra.id).subscribe({
        next: () => {

          this.deleteImage(obra.imagen);

          this.obras = this.obras.filter(o => o.id !== obra.id);
          this.totalRecords--;
          this.msgAlert('artwork successfully eliminated','','success');
        },
        error: (err: Error) => {
          console.error('Error al eliminar la obra', err);
          this.msgAlert('Error, from the server. Contact administrator','','error');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to delete obra: ${obra.nombre}`,
            life: 3000
          });
        }
      });
})
    
  ;

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

  storeImage(form: any) {
    if (form.valid) {
      //console.log('Obra:', this.obra);
      if (this.selectedFile) {
        //console.log('Imagen:', this.selectedFile);
        this.obraService.upLoadImage(this.selectedFile).subscribe({
          next: (response: any) => {
            console.log(response);
            if (response.filename) {
              this.obra.imagen = response.filename;
              //this.obra.fechaCreacion = this.fechaSeleccionada;
              this.obra.fechaRegistro = this.dateToString(new Date());
              //console.log(this.obra);
              this.obraService.create(this.obra).subscribe({
                next: (response2: any) => {
                 // console.log(response2); console.log(this.obra)
                  location.reload();
                  this.msgAlert('Saved artwork','','success');

                },
                error: (err: any) => {
                  console.error(err);
                 this.msgAlert('Error, the artwork was not saved','','error');

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
      }else{this.msgAlert('Error, file not chosen','','error');}
    }else{console.error('No se hizo nada');}
  }



  indexEnvioByArtist() {
    this.envioService.indexByArtist().subscribe({
      next: (response: any) => {
        this.enviosArtist = response['data'];
        console.log("Envios: ",this.enviosArtist);
        this.fillPedidos();
      },
      error: (err: Error) => {
        console.error('Error al cargar los envios del artista', err);
      }
    });
  }


  getFacturasByArtist() {
    console.log("idArtista: ", this.artist['iss'])

    this.facturaService.indexByArtistId(this.artist['iss']).subscribe({
      next: (response: any) => {
        this.facturasArtist = response['data'];
       console.log("data: ",this.facturasArtist);
        this.fillPedidos();
      },
      error: (err: Error) => {
        console.error('Error al cargar las facturas', err);
      }
    });
  }

  fillPedidos() {
    this.pedidosArtist = [];
    for (let envio of this.enviosArtist) {
      if(typeof envio.idFactura ==='string'){envio.idFactura=parseInt(envio.idFactura)}

      // this.facturasArtist.forEach(e => {
      //   console.log("fact: ",e.id)
      //   console.log("usr: ",e.idUsuario)
      // });console.log("env: ",envio.id)
      

      let factura = this.facturasArtist.find(f => f.id === envio.idFactura);

      console.log("Factura",factura)
      if (factura) {
        if(typeof factura.idUsuario ==='string'){factura.idUsuario=parseInt(factura.idUsuario)}
        let direccionCompleta = `${envio.direccion}, ${envio.provincia}, ${envio.ciudad}, Postal code: ${envio.codigoPostal}`;
        envio.direccion = direccionCompleta; // Agregar el atributo direcciónCompleta al envío
        let pedido = new Pedido(envio, factura);
        this.pedidosArtist.push(pedido);
      }
    }
    console.log("Pedidos: ", this.pedidosArtist);
  }

  dateToString(date: Date): string {
    this.ano = date.getFullYear();
    this.mes = ('0' + (date.getMonth() + 1)).slice(-2); // Mes se cuenta desde 0
    this.dia = ('0' + date.getDate()).slice(-2);
    return `${this.ano}-${this.mes}-${this.dia}`;
  }

  public formatDate(event:Event): string {
    const input = event.target as HTMLInputElement;
    const fecha = new Date(input.value);
    this.ano = fecha.getFullYear();
    this.mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Mes se cuenta desde 0
    this.dia = ('0' + fecha.getDate()).slice(-2);
    return `${this.ano}-${this.mes}-${this.dia}`;
  }


  openNewPedido() {
    this.pedido = new Pedido(new Envio(1, 0, "Espera", "", "", "", "", "", ""),
    new Factura(0,null,"",0));
    this.submitted = false;
    this.productDialog = true;

  }


  updateDisponibilidadObra(obrita:Obra,disponibilidad:boolean){
    obrita.disponibilidad=disponibilidad;

    this.obraService.updateDisponibilidad(obrita).subscribe({
      next:(response)=>{
        //console.log('obraResponse',response);
        if(response.status==201){
          this.msgAlert('Successfully updated availability','', 'success');
        }else{
          //this.changeStatus(1);
        }
      },
      error:(error:HttpErrorResponse)=>{
        if(error.status===406 && error.error && error.error.errors){
          this.errors=[];
          const errorObj = error.error.errors;
          for (const key in errorObj) {
            if (errorObj.hasOwnProperty(key)) {
              this.errors.push(...errorObj[key]);
            }
          }
          console.error(this.errors);
        } else {
          console.error('Otro tipo de error:', error);
          this.msgAlert('Error, from the server. Contact administrator','','error');
        }
        }
    })
  }
}
