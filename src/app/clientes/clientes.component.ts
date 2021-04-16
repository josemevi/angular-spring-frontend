import { Component, OnInit } from '@angular/core';
import { Cliente } from "./cliente";
import { ClientesService } from "./clientes.service";
import { ModalService } from "./detalle/modal.service";
import swal from "sweetalert2";
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from "../usuarios/auth.service";

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  swalWithBootstrapButtons: any = swal.mixin({
    customClass: {
      confirmButton: ' btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })

  clientes: Cliente[];
  clienteSeleccionado: Cliente;
  paginator: any;

  constructor(private clientesService: ClientesService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    public authService: AuthService) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( params => {
      let page: number = +params.get("page");
      if(!page){
        page = 0;
      }
      this.clientesService.getClientesPageable(page)
    .pipe(
      tap(response => {
        this.paginator = response;
        this.clientes = response.content as Cliente[];
      })
    )
    .subscribe();
    }); 

    this.modalService.notifyUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(oldClients => {
        if(oldClients.id == cliente.id){
          oldClients.photo = cliente.photo;
        }
        return oldClients;
      })
    })
  }

  delete(cliente: Cliente): void {
    this.swalWithBootstrapButtons.fire({
      title: '¿Estás Seguro?',
      text: `¿Estás seguro de eliminar al cliente ${cliente.nombre}?`,
      icon: 'warning',      
      showCancelButton: true,
      confirmButtonText: '<i class="fa fa-check-square-o" aria-hidden="true"></i> Eliminar',
      cancelButtonText: '<i class="fa fa-times-circle-o" aria-hidden="true"></i> Cancelar',
      reverseButtons: false,
      focusCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientesService.delete(cliente.id)
        .subscribe(res => {
          this.clientes = this.clientes.filter(cli => cli !== cliente);
          this.swalWithBootstrapButtons.fire(
            'Cliente Eliminado',
            `Cliente ${cliente.nombre} eliminado con éxito.`,
            'success'
          )
        })  
      } else (
        /* Read more about handling dismissals below */
        result.dismiss === swal.DismissReason.cancel
      )
    })
  }

  openModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.openModal();
  }

}
