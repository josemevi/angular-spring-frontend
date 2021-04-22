import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Factura } from "../models/factura";

@Injectable({
  providedIn: 'root'
})
export class FacturasService {

  private urlEndPoint:string = 'http://localhost:8082/api/facturas'

  constructor(private http: HttpClient) { }

  getFactura(id: number):Observable<Factura>{
    return this.http.get<Factura>(`${this.urlEndPoint}/${id}`);
  }
}
