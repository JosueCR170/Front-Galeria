export class User{
    constructor(
        public id:number,
        public nombre:string,
        public tipoUsuario:boolean,
        public correo:string,
        public password:string,
        public telefono:string,
        public nombreUsuario:string
    ){}
    
}