import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Factura } from "../models/Factura";

@Injectable({
    providedIn: 'root'
})

export class FacturaService{
    private urlAPI:string;
    constructor(
        private _http:HttpClient
    ){
        this.urlAPI = server.url;
    }


    create(factura:Factura):Observable<any>{
        let facturaJson=JSON.stringify(factura);
        let params='data='+facturaJson;
        let headers=new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        let options={
            headers
        }
        return this._http.post(this.urlAPI+'factura/store',params,options);
    }

}