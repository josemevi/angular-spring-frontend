import { Producto } from "./producto";

export class ItemFactura {
    producto: Producto;
    cantidad: number = 1;
    amount: number;

    public calcularImporte(): number {
        return this.cantidad*this.producto.precio;
    }
}
