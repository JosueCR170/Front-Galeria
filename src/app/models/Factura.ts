export class Factura{
    constructor(
        public id:number,
        public idUsuario:number,
        public idObra:number,
        public fecha:string | null,
        public total:number,
        public subTotal:number,
        public descuento:number
    ){}
}