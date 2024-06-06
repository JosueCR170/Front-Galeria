export class Factura{
    constructor(
        public id:number,
        public idUsuario:number | null,
        public idObra:number | null,
        public fecha:string | null,
        public total:number | null,
        public subTotal:number | null,
        public descuento:number | null
    ){}
}