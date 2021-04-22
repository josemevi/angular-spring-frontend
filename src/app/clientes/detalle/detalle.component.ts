import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClientesService } from '../clientes.service';
import { ModalService } from "./modal.service";
import { AuthService } from "../../usuarios/auth.service";

import { FacturaService } from "../../facturas/services/factura.service";
import { Factura } from "../../facturas/models/factura";

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit { 

  @Input() cliente: Cliente;

  titulo: string = "Detalle del cliente"

  photo: File;

  imgInput: string;

  progress: number = 0;

  swalWithBootstrapButtons: any = Swal.mixin({
    customClass: {
      confirmButton: ' btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })

  constructor(private clientesService: ClientesService,
    //private activatedRoute: ActivatedRoute,
    public modalService: ModalService,
    public authService: AuthService,
    private facturaService: FacturaService) { }

  ngOnInit(): void {
    // this.activatedRoute.paramMap.subscribe(params => {
    //   let id = +params.get('id');
    //   if(id){
    //     this.clientesService.getCliente(id).subscribe(cliente => {
    //       this.cliente = cliente;
    //       console.log(this.cliente);
    //     });
    //   }
    // })
  }


  selectedPhoto(event){
    this.progress = 0;
    this.photo = event.target.files[0];
    if(this.photo.type.indexOf('image') < 0){
      Swal.fire("Error al seleccionar archivo",`Debe seleccionar una imagen`, 'error');
      this.photo = null;
      this.imgInput = "";
    }
  }

  uploadPhoto(){
    if(this.photo){
      this.clientesService.uploadPhoto(this.photo, this.cliente.id)
      .subscribe(event => {
        if(event.type === HttpEventType.UploadProgress){
          this.progress = Math.round((event.loaded/event.total)*100);
        }else if(event.type === HttpEventType.Response){
          let response: any = event.body;
          this.cliente = response.cliente as Cliente;
          this.modalService.notifyUpload.emit(this.cliente);
          Swal.fire("La foto se ha subido correctamente",response.mensaje, 'success');
        }
        // this.cliente = response;        
      });
    }else {
      Swal.fire("Error al subir",`Debe seleccionar una imagen`, 'error')
    }
  }

  close(): void{
    this.modalService.closeModal();
    this.photo = null;
    this.progress = 0;
    this.imgInput = "";
  }

  delete(factura: Factura): void{
    this.swalWithBootstrapButtons.fire({
      title: '¿Estás Seguro?',
      text: `¿Estás seguro de eliminar la factura ${factura.description}?`,
      icon: 'warning',      
      showCancelButton: true,
      confirmButtonText: '<i class="fa fa-check-square-o" aria-hidden="true"></i> Eliminar',
      cancelButtonText: '<i class="fa fa-times-circle-o" aria-hidden="true"></i> Cancelar',
      reverseButtons: false,
      focusCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.facturaService.delete(factura.id)
        .subscribe(res => {
          this.cliente.facturas = this.cliente.facturas.filter(fac=> fac !== factura);
          this.swalWithBootstrapButtons.fire(
            'Factura Eliminado',
            `Factura "${factura.description}" eliminada con éxito.`,
            'success'
          )
        })  
      } else (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      )
    })
  }

}
