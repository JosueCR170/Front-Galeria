export class Envio{
    constructor(
        public id:number,
        public idFactura:number,
        public estado:string,
        public fechaEnviado:Date,
        public fechaRecibido:Date,
    ){}
}