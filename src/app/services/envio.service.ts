import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Envio } from "../models/Envio";

@Injectable({
    providedIn: 'root'
})

export class EnvioService{
    private urlAPI:string;
    constructor(
        private _http:HttpClient
    ){
        this.urlAPI = server.url;
    }


    create(envio:Envio):Observable<any>{
        let envioJson=JSON.stringify(envio);
        let params='data='+envioJson;
        let headers=new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        let options={
            headers
        }
        return this._http.post(this.urlAPI+'envio/store',params,options);
    }

}