import { Envio } from "./Envio";
import { Factura } from "./Factura";

export class Pedido{
    constructor(
        public envio:Envio,
        public factura:Factura,
    ){}
}