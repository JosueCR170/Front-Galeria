import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global";
import { User } from "../models/user";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class UserService{
    private urlAPI:string;

    constructor(
        private _http:HttpClient
    ){
        this.urlAPI = server.url;
    }

    login(user:User):Observable<any>{
        let userJson = JSON.stringify(user);
        let params = 'data='+userJson;
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        let options = {
            headers
        };
        return this._http.post(this.urlAPI+'user/login', params, options);
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
        return this._http.get(this.urlAPI+'user/getidentity', options);
    }
}