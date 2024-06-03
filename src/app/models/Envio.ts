export class Envio{
    constructor(
        public id:number,
        public idFactura:number,
        public estado:string,
        public direccion:string,
        public codigoPostal:string,
        public fechaEnviado:Date | null,
        public fechaRecibido:Date | null,
    ){}
}