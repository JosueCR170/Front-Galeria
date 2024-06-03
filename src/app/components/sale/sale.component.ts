import { Component, NgModule } from '@angular/core';
import { Obra } from '../../models/Obra';
import { ObraService } from '../../services/obra.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sale',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './sale.component.html',
  styleUrl: './sale.component.css'
})
export class SaleComponent {

   shippingCost: string = '';
   totalCost: string = '';
   productPrice: number = 1;
  public obra: Obra;
  public status: number;

  constructor(
    private _obraService: ObraService,
    private _router: Router,
    private _routes: ActivatedRoute,
    private _userService: UserService
  ) {
    this.status = -1;
    this.obra = new Obra(1, 1, "", "", "", 1, true, "", null, null, null);
  }
  user: any;

  ngOnInit(): void {
    const id = this._routes.snapshot.paramMap.get('id');
    console.log('ID obtenido de la ruta:', id); // Verificar que el ID se está obteniendo correctamente
    if (id) {
      this.getObra(id);
    }
    this.loadLoggedUser();
  }
     getObra(id: string): void {
       this._obraService.getArtworkById(id).subscribe(
         data => {
        //console.log('Obra obtenida:', data); // Verificar los datos obtenidos
        this.obra = data['obra'];
        this.status = 1;
      },
      error => {
        console.error('Error al obtener la obra:', error);
        this.status = 0;
      }
    );
  }

  logOut(){
    sessionStorage.clear();
    this._router.navigate([''])
  }

  getImage(obra: Obra): string | null {
    if (obra.imagen) {
      // Decodificar la imagen base64 y devolverla como una URL base64
      return 'data:image/jpeg;base64,' + obra.imagen;
  
    } else {
      return null;
    }
  }
  
  
  loadLoggedUser(){
    this.user = sessionStorage.getItem('identity');
    this.user = JSON.parse(this.user);
    console.log( this.user)
  }


  
  loadAdmin(){
    this._router.navigate(['/admin'])
    }
    updateShippingMethod(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    if (selectedValue === 'Home delivery') {
      this.shippingCost = '3.000';
      this.totalCost = (this.obra.precio + 3000).toString();
    } else if (selectedValue === 'Product recall') {
      this.shippingCost = 'Free';
      this.totalCost = this.obra.precio .toString();
    } else {
      this.shippingCost = '';
      this.totalCost = this.obra.precio .toString();
    }
  }
  /*
  onSubmit(form:any){
    this.user.tipoUsuario=false;
    this._userService.create(this.user).subscribe({
      next:(response)=>{
        console.log(response);
        if(response.status==201){
          form.reset();            
          this.changeStatus(0);
          this.msgAlert('Usuario registrado con éxito','', 'success');
          setTimeout(()=>{
            this.redirectToLogin()
          },1000);
        }else{
          this.changeStatus(1);
        }
      },
      error:(error:HttpErrorResponse)=>{
        //console.error('Error:', error);
        if (error.status === 406 && error.error && error.error.error) {
          this.errors = [];
          const errorObj = error.error.error;
          for (const key in errorObj) {
            if (errorObj.hasOwnProperty(key)) {
              this.errors.push(...errorObj[key]);
            }
          }
          console.error(this.errors);
        } else {
          console.error('Otro tipo de error:', error.statusText);
          this.msgAlert('Error, desde el servidor. Contacte al administrador','','error');
        }
        this.changeStatus(2);
      }
    })
  }*/

}
