import { Injectable } from '@angular/core';
// import { formatDate, DatePipe } from "@angular/common";
// import { CLIENTES } from "./clientes.json";
import { Cliente } from "./cliente";
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { map, catchError, tap } from "rxjs/operators";
//import swal from "sweetalert2";
import { Router } from "@angular/router";
import { Region } from './region';
// import { AuthService } from '../usuarios/auth.service';


@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private urlEndPoint:string = 'http://localhost:8082/api/clientes'
  
  //by default the httpHeader objects are inmutable, this means each time we add mith .push a header
  //this will return a new instance
  // private httpHeaders: HttpHeaders = new HttpHeaders({'Content-Type' : 'application/json'})

  // constructor(private http: HttpClient, private router: Router,
  //   private authService: AuthService) { }

    constructor(private http: HttpClient, private router: Router) { }
  


//Since we're using a interceptor to add the headers isn't longer needed
  // private addHeaders(): HttpHeaders{
  //     let token = this.authService.token;
  //     if(token){
  //       return this.httpHeaders.append('Authorization', 'Bearer '+token);
  //     }
  //     return this.httpHeaders;
  // }

  //sice we're implemeting a http interceptor to manage response status we will remove this method ftom here
  // private isNotAuthorized(e: any): boolean {
  //   if(e.status == 401){
  //     if(this.authService.isAuthenticated()){
  //       this.authService.logout();
  //     }
  //     this.router.navigate(['/login']);
  //     return true;
  //   }else if(e.status == 403){
  //     this.router.navigate(['/clientes']);
  //     swal.fire("Permisos Insuficientes", `${this.authService.usuario.username} no tienes suficientes permisos para acceder al recurso.`, 'warning');
  //     return true;
  //   }else  {
  //     return false;
  //   }
  // }

  getRegiones(): Observable<Region[]>{
    //return this.http.get<Region[]>(`${this.urlEndPoint}/regiones`, {headers: this.addHeaders()}).pipe(
    return this.http.get<Region[]>(`${this.urlEndPoint}/regiones`).pipe(
      catchError(e => {
        // this.isNotAuthorized(e);
        return throwError(e);
      })
    )
  }

  getClientes(): Observable<Cliente[]> {
    // return of(CLIENTES);
    // We can do the mapping logic for any typo to a specific data structure in two ways: 
    // 1. Using casting like below
    // return this.http.get<Cliente[]>(this.urlEndPoint);
    // 2. using map operator this is also casting
    return this.http.get(this.urlEndPoint).pipe(
      tap(response => {
        console.log("tap 1");
        let cliente = response as Cliente[];
        cliente.forEach(cliente => {
          console.log(cliente.nombre)
        })
      }),
      map(response =>{

        //using map operator to modify data instead of using pipe
        let clientes = response as Cliente[];

        return clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');          
          // let datePipe = new DatePipe('es');          
          // cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy')
          return cliente;
        })
      }),
      tap(response => {
        console.log("tap 2");
        response.forEach(cliente => {
          console.log(cliente.nombre);
        })
      }),
    )
  }

  getClientesPageable(page: number): Observable<any> {
    return this.http.get(`${this.urlEndPoint}/page/${page}`);
  }

  getCliente(id: number): Observable<Cliente>{
    //return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.addHeaders()})
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`)
    .pipe(catchError(e => {

        // if(this.isNotAuthorized(e)){
        //   return throwError(e); 
        // }
        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
        
        // swal.fire('Error al consultar', e.error.mensaje, 'error');
        if(e.status != 401 && e.error.mensaje){
          this.router.navigate(['/cliente']);

        }
        //console.error(e.error);
        return throwError(e);        
      })
    )
  }
  //any typo is used when we need flexibility in the response
  createClientes(cliente: Cliente): Observable<any> {
    //return this.http.post<any>(this.urlEndPoint, cliente, {headers: this.addHeaders()})
    return this.http.post<any>(this.urlEndPoint, cliente)
    .pipe(catchError(e => {

        // if(this.isNotAuthorized(e)){
        //   return throwError(e); 
        // }

        if(e.status == 400){
          return throwError(e); 
        }

        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }

        //console.error(e.error);
        // swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);        
      })
    );
  }

  update(cliente: Cliente):Observable<any> {
    //return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.addHeaders()})
    return this.http.put<Cliente>(`${this.urlEndPoint}/${cliente.id}`, cliente)
    .pipe(catchError(e => {

        // if(this.isNotAuthorized(e)){
        //   return throwError(e); 
        // }

        if(e.status == 400){
          return throwError(e); 
        }

        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }

        //console.error(e.error);
        // swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);        
      })
    );
  }

  delete(id: number):Observable<Cliente> {
    // return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.addHeaders()})
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`)
    .pipe(catchError(e => {

        // if(this.isNotAuthorized(e)){
        //   return throwError(e); 
        // }
        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
        // console.error(e.error);
        // swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);        
      })
    );
  }

  uploadPhoto(photo: File, id: any):Observable<HttpEvent<{}>>{
    let form = new FormData();
    form.append("image", photo);
    form.append("id", id);

    // let httpHeaders = new HttpHeaders();
    // let token = this.authService.token
    // if(token){
    //   httpHeaders = httpHeaders.append('Authorization', 'Bearer '+token);
    // }

    const req = new HttpRequest('POST',`${this.urlEndPoint}/upload`, form, {
    // headers: httpHeaders,
      reportProgress: true
     
    });
    return this.http.request(req).pipe(
      catchError(e => {
        // this.isNotAuthorized(e);
        return throwError(e);
      })
    )
  //   return this.http.post(`${this.urlEndPoint}/upload`, form)
  //   .pipe(
  //     map((response: any) => response.cliente as Cliente), 
  //     catchError(e => {
  //       console.error(e.error);
  //       swal.fire(e.error.mensaje, e.error.error, 'error');
  //       return throwError(e);
  //     })
  //   )
  // }
  }
}
