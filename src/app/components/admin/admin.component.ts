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
  imports: [RouterLink, TableModule, ConfirmDialogModule, ToastModule, ToolbarModule, CommonModule, DialogModule, FormsModule, IconFieldModule, InputIconModule, TagModule, DropdownModule, ButtonModule, InputTextModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  providers: [MessageService, ObraService, ConfirmationService],
})
export class AdminComponent {
  public artistasList: { key: number, value: string }[] = [];

  artStyles: string[] = [
    'Cubism', 'Impressionism', 'Expressionism', 'Realism', 'Surrealism', 'Abstract', 'Renaissance',
    'Baroque', 'Rococo', 'Romanticism', 'Neoclassicism', 'Modernism', 'Pop Art'
  ]

  tecnicas: string[] = [
    'Oil on canvas', 'Watercolor', 'Watercolor on paper', 'Tempera', 'Pastel painting', 'Fresco painting',
    'Digital painting', 'Wood carving', 'Marble sculpture', 'Engraving', 'Serigraphy', 'Art photography',
    'Digital art', 'Collage', 'Pyrography', 'Bronze sculpture'
  ]

  public status: number;
  public obra: Obra;
  public _user: User;
  public _artista: Artista;
  public currentDate = new Date();
  public formattedDate = this.formatDate(this.currentDate);
  public errores: string[] = [];

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
    this.obra = new Obra(1, 1, "", "", "", 1, true, "", null, null, null);
    this._user = new User(1, "", false, "", "", null, "");
    this._artista = new Artista(1, "", "", "", "", "");
  }

  totalRecords!: number;

  statuses!: any[];
  auxObras: Obra[] = [];
  categoryExists: string[] = [];

  clonedProducts: { [s: string]: Obra } = {};
  selectedCategory: string = '';
  selectAll: boolean = false;
  submitted: boolean = false;
  editing: boolean = false;
  displayConfirmationDialog: boolean = false;
  delivry: boolean = false;
  administration: boolean = false;
  productDialog: boolean = false;
  flag: boolean = true;
  userClick: boolean = false;
  artistClick: boolean = false;
  invoiceClick: boolean = false;
  shippingClick: boolean = false;
  workClick: boolean = false;
  user: any;
  artist: any;
  urlAPI: string;
  selectedFile: File | null = null;


  obras: Obra[] = [];
  selectedObras!: Obra[];
  selectedObra!: Obra[];

  /** Variables y Elementos para la tabla de Users **/
  userAux = new User(1, "", false, "", "", null, "");
  users: User[] = [];
  selectedUsers: User[] = [];
  selectedUser: User[] = [];
  /** Variables y Elementos para la tabla de Artists **/
  artistaAux = new Artista(1, "", "", "", "", "");
  artistas: Artista[] = [];
  selectedArtistas: Artista[] = [];
  selectedArtista: Artista[] = [];

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
  ngOnInit(): void {
    this.loadLoggedUser();
    this.index();
    this.indexUsers();
    this.indexArtista()
  }

  loadLoggedUser() {
    this.user = sessionStorage.getItem('identity');
    this.user = JSON.parse(this.user);
  }

  authTokenUserAdmin() {
    let aux = sessionStorage.getItem('identity');
    if (aux == null) {
      return false;
    } else {
      let jason = JSON.parse(aux);
      return jason.tipoUsuario;
    }
  }

  redirectToUserLogin() {
    this._router.navigate(['login'])
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  loadAdmin() {
    this._router.navigate(['/shop'])
  }

  redirectToLoginArtist() {
    this._router.navigate(['/loginArtist']);
  }
  logOut() {
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
    this.obra = new Obra(1, null, "", "", "", 1, true, "", null, null, null);
    this.submitted = false;
    this.productDialog = true;
  }

  openNewUser() {
    this.userAux = new User(1, "", true, "", "", null, "")
    this.submitted = false;
    this.productDialog = true;
  }

  openNewArtista() {
    this.artistaAux = new Artista(1, "", "", "", "", "")
    this.submitted = false;
    this.productDialog = true;
  }

  /********************************* INDEX  *********************************/
  index() {
    this._obraService.index().subscribe({
      next: (response: any) => {
        this.obras = response['data'];

        this.artistasList = [];
        this.loadArtistaName();

        console.log();
      },
      error: (err: Error) => {
        console.error('Error al cargar las obras', err);
      }
    });
  }

  indexUsers() {
    this._userService.index().subscribe({
      next: (response: any) => {
        console.log(response);
        this.users = response['data'].filter((user: any) => user.id !== this.user.iss);
      },
      error: (err: Error) => {
        console.error('Error al cargar los users', err);
      }
    });
  }

  indexArtista() {
    this._artistaService.index().subscribe({
      next: (response: any) => {
        this.artistas = response['data'];

      },
      error: (err: Error) => {
        console.error('Error al cargar los artistas', err);
      }
    });
  }

  /******************************** EDIT ********************************/
  editObra(obra: Obra) {
    this.obra = { ...obra };
    this.productDialog = true;
  }

  editUser(user: User) {
    if (user.password == '') { return }
    this.userAux = { ...user };
    this.productDialog = true;
  }

  editArtista(_artista: Artista) {
    if (_artista.password == '') { return }
    this.artistaAux = { ..._artista };
    this.productDialog = true;
  }

  selectCategoria(categoria: string) {
    this.obra.categoria = categoria;
  }

  selectTecnica(tecnica: string) {
    this.obra.tecnica = tecnica;
  }

  onImageFileChange(event: any): void {
    this.selectedFile = event.target.files[0];
  }
  /********************************* UPDATE *********************************/
  updateObra(filename: any) {
    if (this.selectedFile) {
      this._obraService.updateImage(this.selectedFile, filename).subscribe({
        next: (response: any) => {
          console.log(response);
          this.selectedObras = [];
          this.msgAlert('updated artwork', '', 'success')
        },
        error: (err: Error) => {
          console.log(err.message);
          this.msgAlert('error updating artwork', '', 'error')
        }
      });
    }
    this._obraService.update(this.obra).subscribe({
      next: (response: any) => {
        console.log(response);
        this.index()
      },
      error: (err: Error) => {
        console.log(err);
      }
    });
  }

  updateUser() {
    if (this.userAux.password === '') {
      this.msgAlert('Error, empty password', '', 'error')
      return;
    }

    this._userService.update(this.userAux).subscribe({
      next: (response: any) => {
        console.log('Usuario actualizado', response);
        this.msgAlert('updated user', '', 'success');
        // this.userAux = new User(1,"",false,"","",null,"");
        this.selectedUsers = [];
        this.indexUsers();
      },
      error: (err: any) => {
        console.error('Error al actualizar el usuario', err);
        this.msgAlert('error updating user', '', 'error')
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to update user: ${this.userAux.nombre}`,
          life: 3000
        });
      }
    });
  }

  updateArtista() {

    if (this.artistaAux.password == '') {
      this.msgAlert('Error, empty password', '', 'error')
      return;
    }

    this._artistaService.update(this.artistaAux).subscribe({
      next: (response: any) => {
        console.log('Artista actualizado', response);
        this.selectedArtistas = [];
        this.msgAlert('Artist updated', '', 'success')
        this.artistasList = [];
        this.loadArtistaName();
        this.indexArtista()
      },
      error: (err: any) => {
        console.error('Error al actualizar el artista', err);
        this.msgAlert('error updating artist', '', 'error')
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to update artist: ${this.artistaAux.nombre}`,
          life: 3000
        });
      }
    });

  }

  /********************************* STORE *********************************/
  storeObra(form: any): void {
    // if (form.valid) {
    console.log('Obra:', this.obra);
    if (this.selectedFile) {
      console.log('Imagen:', this.selectedFile);
      this._obraService.upLoadImage(this.selectedFile).subscribe({
        next: (response: any) => {
          console.log(response);
          if (response.filename) {
            this.obra.imagen = response.filename;
            this.obra.fechaCreacion = this.fechaSeleccionada;
            this.obra.fechaRegistro = this.formattedDate;
            this._obraService.create(this.obra).subscribe({
              next: (response2: any) => {
                console.log(response2);
                this.index()
                this.msgAlert('saved artwork', '', 'success')
              },
              error: (error: any) => {
                if (error.status === 406 && error.error && error.error.error) {
                  this.errores = [];
                  const errorObj = error.error.error;
                  for (const key in errorObj) {
                    if (errorObj.hasOwnProperty(key)) {
                      this.errores.push(...errorObj[key]);
                    }
                  }
                  //console.error(this.errores);
                  this.msgAlert('Error adding artwork', this.errores, 'error');

                } else {
                  console.error('Other type of error:', error);
                  this.msgAlert('Error from the server, contact an administrator', '', 'error');
                }
              }
            });
          } else {
            console.error('No se recibió el nombre del archivo.');
          }
        },
        error: (error: any) => {
          if (error.status === 406 && error.error && error.error.error) {
            this.errores = [];
            const errorObj = error.error.error;
            for (const key in errorObj) {
              if (errorObj.hasOwnProperty(key)) {
                this.errores.push(...errorObj[key]);
              }
            }
            //console.error(this.errores);
            this.msgAlert('Error adding artwork', this.errores, 'error');

          } else {
            console.error('Other type of error:', error);
            this.msgAlert('Error from the server, contact an administrator', '', 'error');
          }

        }
      });
    } else { this.msgAlert('Error you must choose an image for the artwork', '', 'error'); }
    // }
  }

  storeUser(form: any): void {
    if (form.valid) {
      console.log(this.userAux.tipoUsuario);
      this._userService.create(this.userAux).subscribe({
        next: (response) => {

          console.log(response);
          if (response.status == 201) {
            form.reset();
            this.msgAlert('User added successfully', '', 'success');
          } else {
            console.error('No se pudo ingresar el usuario');
          }
        },
        error: (error: any) => {
          if (error.status === 406 && error.error && error.error.error) {
            this.errores = [];
            const errorObj = error.error.error;
            for (const key in errorObj) {
              if (errorObj.hasOwnProperty(key)) {
                this.errores.push(...errorObj[key]);
              }
            }
            //console.error(this.errores);
            this.msgAlert('Error adding user', this.errores, 'error');

          } else {
            console.error('Other type of error:', error);
            this.msgAlert('Error from the server, contact an administrator', '', 'error');
          }

        }
      });
      this.indexUsers();
    }
  }

  storeArtista(form: any): void {
    if (form.valid) {
      this._artistaService.create(this.artistaAux).subscribe({
        next: (response) => {

          console.log(response);
          if (response.status == 201) {
            form.reset();
            this.msgAlert('Artist added successfully', '', 'success');
            this.artistasList = [];
            this.loadArtistaName();
          } else {
            console.error('The artist could not be entered');
          }
        },
        error: (error: any) => {
          if (error.status === 406 && error.error && error.error.errors) {
            this.errores = [];
            const errorObj = error.error.errors;
            for (const key in errorObj) {
              if (errorObj.hasOwnProperty(key)) {
                this.errores.push(...errorObj[key]);
              }
            }
            //console.error(this.errores);
            this.msgAlert('Error adding artist', this.errores, 'error');

          } else {
            console.error('Other type of error:', error);
            this.msgAlert('Error from the server, contact an administrator', '', 'error');
          }
        }
      });
      this.indexArtista()
    }
  }

  /********************************* DELETE *********************************/


  deleteImage(filename: string | null) {

    if (filename == null) {
      this.msgAlert('Imagen no eliminada, contiene null', '', 'error');
      return;
    }

    this._obraService.destroyImage(filename).subscribe({
      next: (response: any) => {
        console.log(response);
        //this.msgAlert('Imagen eliminada','','success');
      },
      error: (error: any) => {
        console.error(error);
        // this.msgAlert('Imagen no eliminada','','error');
      }
    });
  }
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
      this._obraService.deleted(obra.id).subscribe({
        next: () => {
          this.obras = this.obras.filter(o => o.id !== obra.id);
          this.deleteImage(obra.imagen);
          this.totalRecords--;
          this.msgAlert('Deleted artwork', '', 'error');
        },
        error: (err: Error) => {
          console.error('Error al eliminar la obra', err);
          this.msgAlert('Error when deleting artwork', '', 'error');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to delete obra: ${obra.nombre}`,
            life: 3000
          });
        }
      });
    });

    this.selectedObras = [];
    this.displayConfirmationDialog = false;
  }

  deleteSelectedUsers() {
    this.selectedUsers.forEach(_user => {
      this._userService.deleted(_user.id).subscribe({
        next: () => {
          this.users = this.users.filter(o => o.id !== _user.id);
          this.totalRecords--;
          this.msgAlert('User Deleted', '', 'error');
        },
        error: (err: Error) => {
          console.error('Error al eliminar el usuario', err);
          this.msgAlert('Error deleting user', '', 'error');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to delete user: ${_user.nombre}`,
            life: 3000
          });
        }
      });
    });

    this.selectedUsers = [];
    this.displayConfirmationDialog = false;
  }

  deleteSelectedArtistas() {

    //verifica si existen artistas con obras vendidas
    this.selectedArtistas.forEach(_artista => {
      this.obras.forEach(element => {
        if (element.idArtista == _artista.id && !element.disponibilidad) {
          this.selectedArtistas = [];
          this.displayConfirmationDialog = false;
          this.msgAlert('Error, verify that the artists do not have sold artwork', '', 'error');
          return;
        }
      });
    });

    this.selectedArtistas.forEach(_artista => {

      this._artistaService.deleted(_artista.id).subscribe({
        next: () => {
          this.artistas = this.artistas.filter(o => o.id !== _artista.id);
          this.totalRecords--;
          this.msgAlert('Artist successfully removed', '', 'success');
          this.artistasList = [];
          this.loadArtistaName();

        },
        error: (err: Error) => {
          console.error('Error al eliminar el artista', err);
        }
      });

      this.selectedArtistas = [];
      this.displayConfirmationDialog = false;
    });
  }



  hideConfirmationDialog() {
    this.displayConfirmationDialog = false;
  }

  /*****************************  Obtener nombre  *****************************/

  loadArtistaName() {
    this._artistaService.index().subscribe({
      next: (response: any) => {
        //console.log(response)
        let artistas = response['data'];
        artistas.forEach((e: any) => {
          this.artistasList.push({
            key: e.id,
            value: e.nombre
          });
        });
      },
      error: (err: Error) => {
        console.error('Error al buscar el artista', err);
      }
    });
  }

  getArtistaNameById(id: number): string {
    const artista = this.artistasList.find(p => p.key === id);
    return artista ? artista.value : 'Desconocido';
  }


  /************************************************************************ */

  fechaSeleccionada: string = '';
  ano: number | null = null;
  mes: string | null = null;
  dia: string | null = null;

  onFechaChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const fecha = new Date(input.value);
    this.ano = fecha.getFullYear();
    this.mes = ('0' + (fecha.getMonth() + 1)).slice(-2); // Mes se cuenta desde 0
    this.dia = ('0' + fecha.getDate()).slice(-2);
    this.fechaSeleccionada = `${this.ano}-${this.mes}-${this.dia}`;
  }

  private formatDate(date: Date): string {
    console.log(date);

    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Agrega un cero al mes si es necesario
    const day = date.getDate(); // Agrega un cero al día si es necesario
    return `${year}-${month}-${day}`;
  }

  msgAlert = (title: any, text: any, icon: any) => {
    Swal.fire({
      title,
      text,
      icon,
    })
  }

  public parseInt(value: string){
    return parseInt(value, 10);
  }

}
