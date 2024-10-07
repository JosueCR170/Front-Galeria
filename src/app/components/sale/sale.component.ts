// import { Component, NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Obra } from '../../models/Obra';
// import { ObraService } from '../../services/obra.service';
// import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { UserService } from '../../services/user.service';
// import { FormsModule } from '@angular/forms';
// import { Envio } from '../../models/Envio';
// import { Factura } from '../../models/Factura';
// import { FacturaService } from '../../services/factura.service';
// import { EnvioService } from '../../services/envio.service';
// import Swal from 'sweetalert2';
// import { HttpErrorResponse } from '@angular/common/http';
// import { server } from '../../services/global';

// @Component({
//   selector: 'app-sale',
//   standalone: true,
//   imports: [RouterLink, FormsModule,CommonModule],
//   templateUrl: './sale.component.html',
//   styleUrl: './sale.component.css'
// })
// export class SaleComponent {

//   public shippingCost: string = '';
//   public totalCost: string = '';
//   //public productPrice: number = 1;
//   //public obra: Obra;
//   public obras: Obra[] = [];

//   public status: number;
//   public envio:Envio;

//   //public factura:Factura;
//   public facturas:Factura[]=[];

//   public errors:string[]=[];
//   public currentDate = new Date();
//   urlAPI:string;
// //Formateamos la fecha en formato YYYY-MM-DD
// public formattedDate = this.formatDate(this.currentDate);

//   constructor(
//     private _obraService: ObraService,
//     private _router: Router,
//     private _routes: ActivatedRoute,
//     private _userService: UserService,
//     private _facturaService: FacturaService,
//     private _envioService: EnvioService
    

//   ) {
//     this.status = -1;
//     this.urlAPI = server.url+'obra/getimage/';
    
//    // this.obra = new Obra(1, 1, "", "", "", 1, true, "", null, null, null);
//     this.envio=new Envio(1,0,"Espera","","","","","","");
//     //this.factura=new Factura(1,1,1,this.formattedDate,0,0,0);
//   }
//   user: any;
//   artista:any;
//   selectedOption: string = 'Select the method of receiving the product';

//   isOptionSelected(): boolean {
//     return this.selectedOption !== 'Select the method of receiving the product';
//   }

//   private formatDate(date: Date): string {
//     console.log(date);
    
//     const year = date.getFullYear();
//     const month = date.getMonth() + 1; // Agrega un cero al mes si es necesario
//     const day = date.getDate(); // Agrega un cero al día si es necesario
//     return `${year}-${month}-${day}`;
//   }

//   ngOnInit(): void {
//     const id = this._routes.snapshot.paramMap.get('id');
//     const artistId = this._routes.snapshot.paramMap.get('artistId');

//     console.log('ID obtenido de la ruta:', id);
//     console.log('ID del artista obtenido de la ruta:', artistId);

//     if (id) {
//       this.getObra(id);
//     }else{
//       this.getObrasCarrito(artistId)
//     }
//     this.createFacturas();
//     this.loadLoggedUser();
//   }


// getObrasCarrito(artistId:any):void
// {
//   const carrito= localStorage.getItem('obras');
//   this.obras=carrito? JSON.parse(carrito):[];
//   this.obras = Array.isArray( this.obras) ?  this.obras : [];
//   this.obras = this.obras.filter(obra => obra.idArtista == artistId);
//   console.log('Obras',this.obras);
//   this.obras.forEach(o => {console.log('Cada obra',o)
//   });
// }

// //METODO PARA CREAR LAS FACTURAS DE LAS OBRAS
// createFacturas(){this.obras.forEach(o => {this.facturas.push(new Factura(1,this.user['iss'],o.id,this.formattedDate,0,0,0));});}


//   getObra(id: string): void {
//        this._obraService.getArtworkById(id).subscribe(
//          data => {
//         this.obras=data['obra'];

//         this.artista=data['obra'].artista;
//         console.log('Artista: ',this.artista);

//         this.status = 1;
//       },
//       error => {
//         console.error('Error al obtener la obra:', error);
//         this.status = 0;
//       }
//     );
//   }

//   logOut(){
//     sessionStorage.clear();
//     this._router.navigate([''])
//   }  
  
//   loadLoggedUser(){
//     this.user = sessionStorage.getItem('identity');
//     this.user = JSON.parse(this.user);
//     //console.log( this.user)
//   }


  
//   loadAdmin(){
//     this._router.navigate(['/admin'])
//     }

//   updateShippingMethod(event: Event): void {
//     const selectElement = event.target as HTMLSelectElement;
//     const selectedValue = selectElement.value;
//     let total=0;
//     this.obras.forEach(o => {total=total+ o.precio;});
//     if (selectedValue === 'Home delivery') {
  
//       this.shippingCost = '3.000';
//       this.facturas.forEach(f => {f.total=total+3000});
//      // this.factura.total=total+3000;
//       this.totalCost = (total+3000).toString();
//     } else if (selectedValue === 'Product recall') {
    
//       this.shippingCost = 'Free';
     
//       this.factura.total=total
//       this.totalCost = total.toString();
//     } else {
//       this.shippingCost = '';
//       this.totalCost = total.toString();
//     }
//   }
  
//   onSubmit(form:any){
//     this.obras.forEach(o => {
//       if(o.disponibilidad){
//         this.factura.idUsuario=this.user['iss'];
//         this.factura.subTotal=this.factura.total;
        
//        // console.log(this.factura);
    
//         this._facturaService.create(this.factura).subscribe({
//           next:(facturaResponse)=>{
//             console.log('facturaResponse',facturaResponse);
    
//             if(facturaResponse.status==201){
//               this.envio.idFactura = facturaResponse.Factura.id;
              
//               try{
//                 this.envioCreate();
//                 //actualizar disponibilidad de obra
//                 this.updateDisponibilidadObra(false);
//               }catch(err){
//                 console.log(err);
//               }
    
//              // form.reset();        
//               //this.msgAlert('Factura registrada con éxito','', 'success');
//             }else{
//               //this.changeStatus(1);
//             }
//           },
//           error:(error:HttpErrorResponse)=>{
//             //console.error('Error:', error);
//             if (error.status === 406 && error.error && error.error.errors) {
//               this.errors = [];
//               const errorObj = error.error.errors;
//               for (const key in errorObj) {
//                 if (errorObj.hasOwnProperty(key)) {
//                   this.errors.push(...errorObj[key]);
//                 }
//               }
//               console.error(this.errors);
//             } else {
//               console.error('Otro tipo de error:', error);
//               this.msgAlert('Error, from the server. Contact administrator','','error');
//             }
//            // this.changeStatus(2);
//           }
//         })
//       }else {this.msgAlert('Work not available','','error'); }
    
//     })

//   }

//   envioCreate(){
//     this._envioService.create(this.envio).subscribe({
//       next:(envioResponse)=>{
//         console.log('envioResponse',envioResponse);
//         if(envioResponse.status==201){

//         var mensaje = `Take screenshot<br>
//             <p>Contact the author of <strong>${this.obra.nombre}</strong> to make the payment</p>
//             <p>Artist phone: <strong>${this.artista['telefono']}</strong> </p>
//             <p>Artist email: <strong>${this.artista['correo']}</strong></p>`

//           this.msgAlertHTML('Shipment registered successfully',mensaje, 'success');
//         }else{
//           //this.changeStatus(1);
//         }
//       },
//       error:(error:HttpErrorResponse)=>{
//         if(error.status===406 && error.error && error.error.errors){
//           this.errors=[];
//           const errorObj = error.error.errors;
//           for (const key in errorObj) {
//             if (errorObj.hasOwnProperty(key)) {
//               this.errors.push(...errorObj[key]);
//             }
//           }
//           console.error(this.errors);
//         } else {
//           console.error('Otro tipo de error:', error);
//           this.msgAlert('Error, from the server. Contact administrator','','error');
//         }
//         }
//     })
//   }

//   updateDisponibilidadObra(disponibilidad:boolean){
//     this.obra.disponibilidad=disponibilidad;

//     this._obraService.updateDisponibilidad(this.obra).subscribe({
//       next:(response)=>{
//         console.log('obraResponse',response);
//         if(response.status==201){
//           this.msgAlert('Successfully updated availability','', 'success');
//         }else{
//           //this.changeStatus(1);
//         }
//       },
//       error:(error:HttpErrorResponse)=>{
//         if(error.status===406 && error.error && error.error.errors){
//           this.errors=[];
//           const errorObj = error.error.errors;
//           for (const key in errorObj) {
//             if (errorObj.hasOwnProperty(key)) {
//               this.errors.push(...errorObj[key]);
//             }
//           }
//           console.error(this.errors);
//         } else {
//           console.error('Otro tipo de error:', error);
//           this.msgAlert('Error, from the server. Contact administrator','','error');
//         }
//         }
//     })
//   }

//   msgAlert(title: any, text: any, icon: any) {
//     Swal.fire({
//       title,
//       text,
//       icon,
//     });
//   }

//   msgAlertHTML(title: any, html: any, icon: any)
//   {
//     Swal.fire({
//       title,
//       html,
//       icon,
//       confirmButtonText: 'OK'
//     });
//   }




// }
