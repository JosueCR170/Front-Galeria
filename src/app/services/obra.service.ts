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
    apiUrl: any;

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
    
    
    getArtworkById(id: string): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        let options = {
            headers
        };
        return this._http.get(`${this.urlAPI}obra/${id}`, options);
    }
    
    deleted(id:number):Observable<any>{
        let headers;
        let bearertoken = sessionStorage.getItem('token');
        if (bearertoken){
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('bearertoken', bearertoken);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        }
        let options = {
            headers
        };
        return this._http.delete(`${this.urlAPI}obra/${id}`, options);
    }

}