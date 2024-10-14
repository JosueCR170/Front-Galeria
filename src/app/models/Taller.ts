export class Taller{
    constructor(
        public id:number,
        public nombre:string,
        public descripcion:string,
        public duracion:number,
        public costo:number,
        public idArtista:number | null,
        public categoria:string,
    ){}
}