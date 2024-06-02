export class User{
    constructor(
        public id:number,
        public nombre:string,
        public tipoUsuario:boolean,
        public email:string,
        public password:string,
        public telefono:string | null,
        public nombreUsuario:string
    ){}
}