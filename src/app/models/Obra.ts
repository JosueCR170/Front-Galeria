

export class Obra{
    constructor(
        public id:number,
        public idArtista:number,
        public tecnica:string,
        public nombre:string,
        public tamano:string,
        public precio:number,
        public disponibilidad:boolean, 
        public categoria:string,
        public imagen:string | null,
        public fechaCreacion:Date | null,
        public fechaRegistro:Date | null
    ){}
}