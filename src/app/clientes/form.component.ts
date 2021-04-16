import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { Region } from './region';
import { ClientesService } from "./clientes.service";
import { Router, ActivatedRoute } from "@angular/router";

import swal from "sweetalert2";


@Component( {
    selector: 'app-form',
    templateUrl: './form.component.html'
  }

) export class FormComponent implements OnInit {
  public titulo: string="Crear Cliente";
  //if the structure is a interface do this.
  // public cliente: Cliente = {
  //   id:null,
  //   nombre : "",
  //   apellido : "",
  //   email : "",
  //   createAt : ""
  // };
  cliente: Cliente=new Cliente();
  errores: string[];
  regiones: Region[];

  constructor(private clienteService: ClientesService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.cargarcliente();
    this.clienteService.getRegiones().subscribe(regiones => {
      this.regiones = regiones;
    })
  }

  cargarcliente(): void {
    this.activatedRoute.params 
    .subscribe(params=> {
        let id = +params['id'];
        if(id) {
          this.clienteService.getCliente(id).subscribe(res=> {
              this.cliente=res;
            }
          )
        }       
      }
    )
  };

  create(): void {
    this.clienteService.createClientes(this.cliente) 
    .subscribe(res=> {
        console.log(res);
        swal.fire(`Nuevo Cliente "${res.cliente.nombre}"`, res.mensaje, 'success');
        this.router.navigate(['/clientes']);
    }, err=> {
        console.error("Codigo de error:"+ err.status);
        console.error(err.error.errors);
        this.errores=err.error.errors as string[];
      }
    )
  };

  update(): void {
    this.clienteService.update(this.cliente) 
    .subscribe(res=> {
        swal.fire(`Cliente "${res.cliente.nombre}"actualizado`, res.mensaje, 'success');
        this.router.navigate(['/clientes']);
    },err=> {
        console.error("Codigo de error:"+ err.status);
        console.error(err.error.errors);
        this.errores=err.error.errors as string[];
      }
    )
  };

  compareRegion(o1:Region, o2:Region): Boolean{
    if(o1 === undefined && o2 === undefined){
      return true;
    }
    return o1 == null || o2 == null ? false: o1.id === o2.id;

  }
};
