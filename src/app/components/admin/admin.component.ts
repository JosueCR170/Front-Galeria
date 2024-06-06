import { Component } from '@angular/core';
import { ObraService } from '../../services/obra.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Obra } from '../../models/Obra';
import { TableModule } from 'primeng/table';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from '../../models/user';
import { Artista } from '../../models/Artista';
import { ArtistService } from '../../services/artist.service';
import { server } from '../../services/global';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink,TableModule, ConfirmDialogModule ,ToastModule,ToolbarModule, CommonModule,DialogModule  ,FormsModule, IconFieldModule, InputIconModule , TagModule, DropdownModule, ButtonModule, InputTextModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  providers: [MessageService,ObraService, ConfirmationService],
})
export class AdminComponent {
  
  artStyles: string[] = [
    'Cubism','Impressionism','Expressionism','Realism','Surrealism','Abstract','Renaissance',
    'Baroque','Rococo','Romanticism','Neoclassicism','Modernism','Pop Art','Naïve Art'
  ]

  tecnicas: string[]=[
    'Oil on canvas','Watercolor','Watercolor on paper','Tempera','Pastel painting','Fresco painting',
    'Digital painting','Wood carving','Marble sculpture','Engraving','Serigraphy','Art photography',
    'Digital art','Collage','Pyrography','Bronze sculpture'
  ]

  public status: number;
  public _obra: Obra;
  public _user: User;
  public _artista: Artista;

  constructor(
    private _obraService: ObraService,
    private _userService: UserService,
    private _artistaService: ArtistService,
    private _router: Router,
    private _routes: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.status = -1;
    this.urlAPI = server.url + 'obra/getimage/';
    this._obra = new Obra(1, 1,"","","",1,true,"",null,null,null);
    this._user = new User(1,"",false,"","",null,"");
    this._artista = new Artista(1,"","","","","");
  }

  userClick: boolean = false;
  artistClick: boolean = false;
  invoiceClick: boolean = false;
  shippingClick: boolean = false;
  workClick: boolean = false;
  delivry: boolean = false;

  selectAll: boolean = false;
  submitted: boolean = false;
  editing: boolean = false;
  displayConfirmationDialog: boolean = false;
  administration: boolean = false;
  productDialog: boolean = false;
  totalRecords!: number;
  statuses!: any[];


  auxObras: Obra[] = [];
  categoryExists: string[] = [];
  clonedProducts: { [s: string]: Obra } = {};
  selectedCategory: string = '';
  
  flag: boolean = true;
  
  user: any;
  artist: any;
  urlAPI: string;
  selectedFile: File | null = null;

  obras: Obra[] = [];
  selectedObras!: Obra[];
  selectedObra!: Obra[];

  /** Variables y Elementos para la tabla de Users **/
  users: User[] = [];
  selectedUsers: User[] = [];
  

  showHome(show: boolean) {
    this.flag = show;
    this.userClick = false;
    this.artistClick = false;
    this.invoiceClick = false;
    this.shippingClick = false;
    this.workClick = false;
  }

  showUser(all: boolean) {
    this.flag = false;
    this.userClick = all;
    this.artistClick = false;
    this.invoiceClick = false;
    this.shippingClick = false;
    this.workClick = false;
  }

  showArtist(all: boolean) {
    this.flag = false;
    this.userClick = false;
    this.artistClick = all;
    this.invoiceClick = false;
    this.shippingClick = false;
    this.workClick = false;
  }
  showWork(all: boolean) {
    this.flag = false;
    this.userClick = false;
    this.artistClick = false;
    this.invoiceClick = false;
    this.shippingClick = false;
    this.workClick = true;
  }
  showInvoice(all: boolean) {
    this.flag = false;
    this.userClick = false;
    this.artistClick = false;
    this.invoiceClick = true;
    this.shippingClick = false;
    this.workClick = false;
  }
  showShipping(all: boolean) {
    this.flag = false;
    this.userClick = false;
    this.artistClick = false;
    this.invoiceClick = false;
    this.shippingClick = true;
    this.workClick = false;
  }
  adminObras(show: boolean) {
    this.flag = false;
    this.delivry = false;
    this.administration = show;
    
  }

  /*********************************************************************************************/
  ngOnInit():void {
    this.loadLoggedUser();
    this.index();
    //this.indexUsers();
  }

  loadLoggedUser(){
    this.user = sessionStorage.getItem('identity');
    this.user = JSON.parse(this.user);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  loadAdmin(){
    this._router.navigate(['/shop'])
    }
    
  redirectToLoginArtist() {
    this._router.navigate(['/loginArtist']);
  }
  logOut(){
    sessionStorage.clear();
    this._router.navigate([''])
  }

  showConfirmationDialog() {
    this.displayConfirmationDialog = true;
  }

  
  getImage(obra: Obra): string | null {
    if (obra.imagen) {
      // Decodificar la imagen base64 y devolverla como una URL base64
      return 'data:image/jpeg;base64,' + obra.imagen;
    } else {
      return null;
    }
  }

  /********************************* OPEN  *********************************/
  openNew() {
    this._obra = new Obra(1, this.artist.iss, "", "", "", 1, true, "", null, null, null);
    this.submitted = false;
    this.productDialog = true;
  }

  openNewUser() {
    this._user = new User(1, "", true,"","",null,"")
    this.submitted = false;
    this.productDialog = true;
  }

  openNewArtist(){
    this._artista = new Artista(1,"","","","","")
    this.submitted = false;
    this.productDialog = true;
  }
  
  /********************************* INDEX  *********************************/
  index() {
    this._obraService.index().subscribe({
      next: (response: any) => {
        this.obras = response['data'];
      },
      error: (err: Error) => {
        console.error('Error al cargar las obras', err);
      }
    });
  }

  indexUsers() {
    this._userService.index().subscribe({
      next: (response: any) => {
        this.user = response['data'];
      },
      error: (err: Error) => {
        console.error('Error al cargar los users', err);
      }
    });
  }

  indexArtist() {
    this._artistaService.index().subscribe({
      next: (response: any) => {
        this.artist = response['data'];
      },
      error: (err: Error) => {
        console.error('Error al cargar los artistas', err);
      }
    });
  }

  /******************************** EDIT ********************************/
    editObra(obra: Obra) {
      this._obra = { ...obra };
      this.productDialog = true;
    }
    
    editUser(user: User) {
      this._user = { ...user };
      this.productDialog = true;
    }

  /********************************* UPDATE *********************************/
    selectCategoria(categoria: string) {
      this._obra.categoria = categoria;
    }

    selectTecnica(tecnica: string) {
      this._obra.tecnica = tecnica;
    }

  


  onImageFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  updateObra(filename: any) {
    if (this.selectedFile) {
      this._obraService.updateImage(this.selectedFile, filename).subscribe({
        next: (response: any) => {
          console.log(response);
        },
        error: (err: Error) => {
          console.log(err.message);
        }
      });
    }
    this._obraService.update(this._obra).subscribe({
      next:(response:any)=>{
        console.log(response);
      },
      error:(err:Error)=>{
        console.log(err);
      }
    });
  }

  storeImage(form: any): void {
    if (form.valid) {
      console.log('Obra:', this._obra);
      if (this.selectedFile) {
        console.log('Imagen:', this.selectedFile);
        this._obraService.upLoadImage(this.selectedFile).subscribe({
          next: (response: any) => {
            console.log(response);
            if (response.filename) {
              this._obra.imagen = response.filename;
              this._obraService.create(this._obra).subscribe({
                next: (response2: any) => {
                  console.log(response2);
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
  
  /********************************* DELETE *********************************/
  deleteSelectedObras() {
    this.selectedObras.forEach(obra => {
      this._obraService.deleted(obra.id).subscribe({
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

  deleteSelectedUsers() {
    this.selectedObras.forEach(_user => {
      this._userService.deleted(_user.id).subscribe({
        next: () => {
          this.users = this.users.filter(o => o.id !== _user.id);
          this.totalRecords--;
        },
        error: (err: Error) => {
          console.error('Error al eliminar el usuario', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to delete user: ${_user.nombre}`,
            life: 3000
          });
        }
      });
    });

    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Users Deleted',
      life: 3000
    });

    this.selectedUsers = [];
    this.displayConfirmationDialog = false;
  }



  hideConfirmationDialog() {
    this.displayConfirmationDialog = false;
  }

  /************************************************************************ */
  
}
