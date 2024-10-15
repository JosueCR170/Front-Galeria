import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ObraService } from '../../services/obra.service';
import { Obra } from '../../models/Obra';
import { server } from '../../services/global';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ArtistService } from '../../services/artist.service';
import { Artista } from '../../models/Artista';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { User } from '../../models/user';

import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, AutoCompleteModule],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css',
  providers: [ObraService, MessageService]
})
export class ShopComponent {

  @ViewChild('liveToast', { static: true }) liveToast: ElementRef | undefined
  artistName: string = '';
  public status: number;
  //public obra: Obra;
  urlAPI: string;

  public artista: Artista;
  obrasAgrupadasPorArtista: any[] = [];
  constructor(
    private _obraService: ObraService,
    private _router: Router,
    private _artistas: ArtistService,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.status = -1;
    this.urlAPI = server.url + 'obra/getimage/';
   // this.obra = new Obra(1, 1, "", "", "", 1, true, "", null, null, null);
    this.artista = new Artista(1, "", "", "", "", "");
  }

  flagNoti: boolean = false;
  items: any[] | undefined;
  selectedItem: any;
  suggestions: any[] = [];
  obrasCarrito: Obra[] = [];
  artistas: Artista[] = [];
  obras: Obra[] = [];
  auxObras: Obra[] = [];
  auxObras2: Obra[] = [];
  auxArtistas: Artista[] = [];
  categoryExists: string[] = [];
  selectedCategory: string = '';
  flag: boolean = true;
  onClick: boolean = false;
  all: boolean = false;
  artistaMenu: boolean = false;
  total: number = 1;
  user: any;
  public acc: any[] = [];
  userAux = new User(1, "", false, "", "", null, "");

  ngOnInit(): void { 
    this.index();
    this.loadLoggedUser();
    this.indexCarrito();
  }

  logOut() {
    sessionStorage.clear();
    this._router.navigate([''])
  }

  index() {
    this._obraService.index().subscribe({
      next: (response: any) => {
        this.obras = response['data'].map((obra: any) => {
          obra.disponibilidad = obra.disponibilidad === '1' || obra.disponibilidad === 1;
          return obra;
        });
        this.loadCategorysExists();
        this.indexArtista();
        console.log("Obras: ",this.obras);
        console.log("AuxObras: ",this.auxObras);
      },
      error: (err: Error) => {

      }
    })


  }
  indexArtista() {
    this._artistas.index().subscribe({
      next: (response: any) => {
        this.auxArtistas = this.artistas = response['data'];
        console.log(this.artistas)

      },
      error: (err: Error) => {

      }
    });


  }

  indexCarrito() {
    const carrito = sessionStorage.getItem('obrasCarrito');
    this.obrasCarrito = carrito ? JSON.parse(carrito) : [];
    this.obrasCarrito = Array.isArray(this.obrasCarrito) ? this.obrasCarrito : [];
    this.agrupamiento();
  }

  addCarFuncion(id: number) {
    let obra = this.obras.find((o: any) => o.id === id);
    console.log(obra)
    if (obra) {
      const yaEnCarrito = this.obrasCarrito.some((item: any) => item.id === obra?.id);
      if (!yaEnCarrito) {
        this.obrasCarrito.push(obra)
        sessionStorage.setItem('obrasCarrito', JSON.stringify(this.obrasCarrito));
        this.msgAlertGood('added work', '', 'success', '#000', '#ffffff');
      } else {
        this.msgAlertGood('You cannot add the same artwork to the cart', '', 'error', '#ffffff', '#eb5151');
      }
    }

  }

  /*ANIMACION DE DESAPARECER CARD DEL CARRITO*/
  startFadeOut(car: any) {
    car.isFadingOut = true;
    this.deleteItemCar(car.id);
  }

  deleteItemCar(id: number) {
    const carrito = sessionStorage.getItem('obrasCarrito');
    this.obrasCarrito = carrito ? JSON.parse(carrito) : [];
    this.obrasCarrito = Array.isArray(this.obrasCarrito) ? this.obrasCarrito : [];

    // this.obrasCarrito.forEach(obraSeleccionada => {
    //   if (obraSeleccionada.id === id) {
    //     this.total -= obraSeleccionada.precio;
    //   }
    // })

    this.obrasCarrito = this.obrasCarrito.filter(obra => obra.id != id);
    sessionStorage.setItem('obrasCarrito', JSON.stringify(this.obrasCarrito));
    if (this.obrasCarrito.length != 0) {
      this.agrupamiento();
      console.log(this.obrasCarrito.length)
    } else { this.indexCarrito() }
  }
  agrupamiento() {
    let idArtista:any;
    const groupedObras = this.obrasCarrito.reduce((acc, obra) => {
      if(typeof obra.idArtista==='string'){
        idArtista= parseInt(obra.idArtista);
      }else{ idArtista = obra.idArtista;}

      //console.log("idArtista tipo: ",typeof idArtista)

      if (typeof idArtista === 'number') {
        if (!acc[idArtista]) {
          acc[idArtista] = [];
        }
        acc[idArtista].push(obra);
      }
      return acc;
    }, {} as { [key: number]: any[] });

    //console.log("Obras agrupadas", groupedObras);

    this.obrasAgrupadasPorArtista = Object.entries(groupedObras);
    this.obrasAgrupadasPorArtista.forEach(grupo => {
      grupo.total = this.calcularTotalPrecios(grupo[1]);

      //console.log("Total", grupo.total)
      console.log("Grupo", grupo)
    });
  }
  calcularTotalPrecios(obras: any[]): number {
    return this.total = obras.reduce((total, obra) => total + parseInt(obra.precio), 0);
  }

  comprarObras(obras:any[]){
    sessionStorage.setItem('comprarObras', JSON.stringify(obras));
  }

  countObrasOfArtista(id: number) {
    let i = 0;
    this.obras.forEach(obra => {
      if (obra.idArtista == id) {
        i++;
      }
    });
    return i;
  }

  loadCategorysExists() {
    if (this.obras.length >= 1) {
      this.obras.forEach(obra => {
        if (!this.categoryExists.includes(obra.categoria)) {
          this.categoryExists.push(obra.categoria);
        }
      });
    }
  }

  getArtistaById(id: number | null): Artista | undefined {
    if (id === null) {
      return undefined; // O manejar el caso de manera apropiada
    }
    return this.artistas.find(artista => artista.id === id);
  }
  loadAuxObras(category: string) {
    this.auxObras = this.obras.filter(obra => obra.categoria === category);
  }

  categoryExistsLength(category: string) {
    this.loadAuxObras(category);
    return this.categoryExists.length;
  }

  loadObrasLength(category: string) {
    this.loadAuxObras(category);
    return this.auxObras.length;
  }

  loadLoggedUser() {
    this.user = sessionStorage.getItem('identity');
    console.log('User', this.user);
    this.user = JSON.parse(this.user);
    //console.log('User',this.user);
    this.userAux = { ...this.user };
  }

  getNumeroDeObras(categoria: { nombre: string, obras: any[] }): number {
    return categoria.obras.length;
  }

  // Método para manejar la selección de una categoría
  selectCategory(category: string) {
    this.selectedCategory = category;
    this.onClick = true;
    this.flag = false;
    this.all = false;
    this.artistaMenu = false
  }

  showHome(show: boolean) {
    this.flag = show;
    this.onClick = false;
    this.all = false;
    this.artistaMenu = false
  }

  showAll(all: boolean) {
    this.selectedCategory = '';
    this.all = all;
    this.flag = false;
    this.onClick = false;
    this.artistaMenu = false
  }
  showArtist(artistTrue: boolean) {
    this.selectedCategory = '';
    this.all = false;
    this.flag = false;
    this.onClick = false;
    this.artistaMenu = artistTrue
  }
  navigateToCourses() {
    window.open('/courses', '_blank');
  }

  loadAdmin() {
    this._router.navigate(['/admin'])
  }

  redirectToLoginArtist() {
    this._router.navigate(['/loginArtist']);
  }

  searchObras(event: any) {
    const query = event.target.value || '';
    const lowercaseQuery = query.toLowerCase();

    // Si el input está vacío, muestra todas las obras
    console.log(lowercaseQuery)
    if (lowercaseQuery === '') {
      this.index();
      this.auxObras = [...this.obras];
      this.obras = this.auxObras

    } else {
      // Filtra las obras de arte que coinciden con el texto de búsqueda en el nombre de la obra
      this.auxObras = this.obras.filter(obra => obra.nombre.toLowerCase().includes(lowercaseQuery));
      this.obras = this.auxObras
      this.selectedCategory = '';
      this.all = true;
      this.flag = false;
      this.onClick = false;
      this.artistaMenu = false;
      console.log("EL aux obras" + this.auxObras)
      console.log(this.obras)
    }
  }

  searchArtist(event: any) {
    const query = event.target.value || '';
    const lowercaseQuery = query.toLowerCase();

    // Si el input está vacío, muestra todas las obras
    console.log(lowercaseQuery)
    if (lowercaseQuery === '') {
      this.indexArtista();
      this.auxArtistas = [...this.artistas];
      this.artistas = this.auxArtistas

    } else {
      // Filtra las obras de arte que coinciden con el texto de búsqueda en el nombre de la obra
      this.auxArtistas = this.artistas.filter(artista => artista.nombre.toLowerCase().includes(lowercaseQuery));
      this.artistas = this.auxArtistas;
      console.log("EL aux obras" + this.auxArtistas)
      console.log(this.artistas)
    }
  }

  searchObrasByArtist(id: number) {
    this.obras.forEach(obra => {
      this.auxObras2 = this.obras.filter(obra => obra.idArtista == id);
      console.log(this.auxObras);
    });
    this.getArtistaById(id);
    this.all = false;
    this.flag = false;
    this.onClick = false;
    this.artistaMenu = true;

  }

  updateUser() {

    this.user.id = this.user.iss;
    console.log('User antes de ', this.user);
    this.userService.update(this.user).subscribe({
      next: (response: any) => {
        console.log('Usuario actualizado', response);
        this.msgAlert('updated user', '', 'success');
        //this.loadLoggedUser();

        let storedUserInfo = sessionStorage.getItem('identity');
        let userInfo;
        if (storedUserInfo) {
          userInfo = JSON.parse(storedUserInfo);
        } else {
          // Proporcionar un objeto predeterminado en caso de que storedUserInfo sea null
          userInfo = {};
        }
        // Actualiza solo las propiedades necesarias
        userInfo.telefono = this.user.telefono;
        userInfo.nombre = this.user.nombre;
        // Guarda el objeto actualizado de nuevo en sessionStorage
        sessionStorage.setItem('identity', JSON.stringify(userInfo));
        location.reload();
        this._router.navigate(['/shop']);
        console.log('User', this.user);
        // console.log('UserAUX',this.userAux);
      },
      error: (err: any) => {
        console.error('Error al actualizar el usuario', err.error.message);
        this.msgAlert('error updating user', '', 'error');


      }
    });
  }

  resetUserData() {
    this.user = { ...this.userAux };
  }

  msgAlert = (title: any, text: any, icon: any) => {
    Swal.fire({
      title,
      text,
      icon,
    })
  }
  msgAlertGood = (title: any, text: any, icon: any, color: any, background: any) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      title,
      text,
      icon,
      color,
      timer: 2000,
      showConfirmButton: false,
      background,

    })
  }

  public parseBool(value: string):boolean{
    return value==='1';
  }
}
