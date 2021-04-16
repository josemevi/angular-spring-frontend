import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { Usuario } from "./usuario";
import { AuthService } from "./auth.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: string = "Iniciar Sesión"

  usuario: Usuario;

  constructor(private authService: AuthService,private router: Router) { 

    this.usuario = new Usuario();

  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      Swal.fire("Ya has Iniciado Sesión", `Hola ${this.authService.usuario.username}`,"info");
      this.router.navigate(['/clientes']);
    }
  }

  login():void{
    if(!this.usuario.username || !this.usuario.password){
      Swal.fire("Error al Iniciar Sesión", "Campos vacios en formulario.", "error");
      return;
    }

    this.authService.login(this.usuario).subscribe(response => {
      console.log(response);
      //decodifing the token payload to get his params
  
      
      this.authService.saveToken(response.access_token);
      this.authService.saveUser(response.access_token);
      
      let userData: Usuario = this.authService.usuario;
      Swal.fire("Inicio de Sesión Éxitoso", `Hola ${userData.username}`,"success")
      this.router.navigate(["/clientes"]);
    }, err => {
      console.log(err);
      if(err.status == 400){
        Swal.fire("Error al Iniciar Sesión", "Datos incorrectos.", "error");
      }
    })
  }

}
