import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Usuario } from "./usuario";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Usuario;
  private _token: string;


  constructor(private http: HttpClient) { }

  public get usuario(): Usuario{
    if(this._usuario){
      return this._usuario;
    }else if(sessionStorage.getItem("usuarioData")){
      this._usuario = JSON.parse(sessionStorage.getItem("usuarioData")) as Usuario;
      return this._usuario;
    }
    return new Usuario();
  }

  public get token(): string{
    if(this._token){
      return this._token;
    }else if(sessionStorage.getItem("usuarioToken")){
      this._token = JSON.parse(sessionStorage.getItem("usuarioToken"));
      return this._token;
    }
    return null;
  }

  login(usuario: Usuario):Observable<any>{

    const urlEndpoint:string = "http://localhost:8082/oauth/token";

    const credentials: any = btoa("angularapp"+":"+"12345");

    const headers: any = {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic "+credentials
    }
    const httpHeaders: HttpHeaders = new HttpHeaders(headers);
    
    //Adding request params in x-www-form-urlencoded
    let params: URLSearchParams = new URLSearchParams();
    params.set("grant_type","password");
    params.set("username",usuario.username);
    params.set("password",usuario.password);
    return this.http.post(urlEndpoint, params.toString(), {headers: httpHeaders})
  }

  saveUser(accessToken: string): void {
    let payload = this.payloadDecodifier(accessToken);
    this._usuario = new Usuario;
    this._usuario.nombre = payload.nombre;
    this._usuario.apellido = payload.apellido;
    this._usuario.email = payload.email;
    this._usuario.username = payload.user_name;
    this._usuario.roles = payload.authorities;
    sessionStorage.setItem("usuarioData",JSON.stringify(this._usuario));
  }

  saveToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem("usuarioToken",JSON.stringify(this._token));
  }

  payloadDecodifier(accessToken: string):any{
    if(accessToken){
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  isAuthenticated(): boolean {
    let payload = this.payloadDecodifier(this.token);
    if(payload && payload.user_name && payload.user_name.length>0){
      return true;
    }
    return false;
  }

  logout(): void{
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
  }

  hasRole(role: string): boolean {
    if(this.usuario.roles.includes(role)){
      return true;
    }
    return false;
  }
}
