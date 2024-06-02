import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global";
import { Artista } from "../models/Artista";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ArtistService{
    private urlAPI:string;

    constructor(
        private _http:HttpClient
    ){
        this.urlAPI = server.url;
    }

    loginArtist(artist:Artista):Observable<any>{
        let artistJSON = JSON.stringify(artist);
        let params = 'data='+artistJSON;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        let options = {
            headers
        };
        return this._http.post(this.urlAPI+'artist/login', params, options);
    }

    getIdentityFromAPI():Observable<any>{
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
        return this._http.get(this.urlAPI+'artista/getidentity', options);
    }

}