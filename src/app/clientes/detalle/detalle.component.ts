import { HttpEventType } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { Cliente } from '../cliente';
import { ClientesService } from '../clientes.service';
import { ModalService } from "./modal.service";
import { AuthService } from "../../usuarios/auth.service";

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
  constructor(private clientesService: ClientesService,
    //private activatedRoute: ActivatedRoute,
    public modalService: ModalService,
    public authService: AuthService) { }

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

  close(){
    this.modalService.closeModal();
    this.photo = null;
    this.progress = 0;
    this.imgInput = "";
  }

}
