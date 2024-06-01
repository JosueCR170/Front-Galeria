import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global";
import { Obra } from "../models/Obra";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ObraService{
    private urlAPI:string;

    constructor(
        private _http:HttpClient
    ){
        this.urlAPI = server.url;
    }

    index():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        let options = {
            headers
        };
        return this._http.get(this.urlAPI+'obra', options);
    }
}