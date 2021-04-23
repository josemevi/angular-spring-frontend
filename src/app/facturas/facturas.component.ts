import { Component, OnInit } from '@angular/core';
import { Factura } from "./models/factura";
import { ClientesService } from "../clientes/clientes.service";
import { ActivatedRoute } from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
//import {filter, map, startWith } from 'rxjs/operators';
import { map,flatMap } from "rxjs/operators";

import { FacturaService } from "./services/factura.service";
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';


@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',

})
export class FacturasComponent implements OnInit {

  title: string = "Nueva Factura";
  factura: Factura = new Factura();

  autoCompleteControl = new FormControl();
  //productos: string[] = ['One', 'Two', 'Three'];
  //productosFiltrados: Observable<string[]>;
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClientesService,
    private activatedRoute: ActivatedRoute,
    private facturaService: FacturaService) { }

  ngOnInit(): void {

    this.productosFiltrados = this.autoCompleteControl.valueChanges
    .pipe(
      //startWith(''),
      //map(value => this._filter(value))
      map(value => typeof value === 'string'? value : value.nombre),
      flatMap(value => value ?  this._filter(value) : [])
    );

    this.activatedRoute.paramMap.subscribe(params => {
      let clientId = +params.get("clienteId");
      this.clienteService.getCliente(clientId).subscribe(cliente => {
        this.factura.cliente = cliente
      });
    });
  }


  private _filter(value: string): Observable<Producto[]>{
    const filterValue = value.toLowerCase();

    //return this.productos.filter(option => option.toLowerCase().includes(filterValue));

    return this.facturaService.filtrarProductos(filterValue);
  }

  showName(producto?: Producto): string | undefined{
    return producto? producto.nombre : undefined;
  }

  selectProducto(event: MatAutocompleteSelectedEvent): void {
    let producto = event.option.value as Producto;

    if(this.alreadyInList(producto.id)){
      this.incrementInList(producto.id)
    }else {
      let newItem = new ItemFactura();
      newItem.producto = producto;
      this.factura.items.push(newItem); 
    }

    this.autoCompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id: number, event: any): void{
    let cantidad: number = event.target.value as number;

    this.factura.items = this.factura.items.map((item:ItemFactura) => {
      if(id === item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    })
  }

  alreadyInList(id:number): boolean {
    let exist = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if(id === item.producto.id){
        exist = true;
      }
    })
    return exist;
  }

  incrementInList(id:number): void {

    this.factura.items = this.factura.items.map((item:ItemFactura) => {
      if(id === item.producto.id){
        ++item.cantidad;
      }
      return item;
    })
    
  }

}
