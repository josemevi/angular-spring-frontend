import { Component, OnInit } from '@angular/core';
import { Factura } from "./models/factura";
import { ClientesService } from "../clientes/clientes.service";
import { ActivatedRoute } from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',

})
export class FacturasComponent implements OnInit {

  title: string = "Nueva Factura";
  factura: Factura = new Factura();

  autoCompletecontrol = new FormControl();
  productos: string[] = ['One', 'Two', 'Three'];
  productosFiltrados: Observable<string[]>;

  constructor(private clienteService: ClientesService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.productosFiltrados = this.autoCompletecontrol.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.activatedRoute.paramMap.subscribe(params => {
      let clientId = +params.get("clienteId");
      this.clienteService.getCliente(clientId).subscribe(cliente => {
        this.factura.cliente = cliente
      });
    });
  }


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.productos.filter(option => option.toLowerCase().includes(filterValue));
  }

}
