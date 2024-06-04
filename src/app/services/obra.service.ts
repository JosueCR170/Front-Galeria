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
    
    update(obra: Obra, imageFile?:File): Observable<any> {
        let obraJson=JSON.stringify(obra);
        let formData = new FormData();
        let params='data='+obraJson;
        let headers;
        let bearertoken = sessionStorage.getItem('token');
        
        formData.append('_method', 'PUT');
        formData.append('data', JSON.stringify(obra));
        

        if (imageFile) {
            formData.append('file', imageFile);
        }
        if (bearertoken){
            headers = new HttpHeaders().set('Content-Type', 'application/form-data').set('bearertoken', bearertoken);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/form-data');
        }
        let options = {
            headers
        };
        return this._http.put(this.urlAPI+`obra/${obra.id}`,formData,options);
    }
    

    create(obra:Obra):Observable<any>{
        console.log(obra);
        let headers;
        let obraJson=JSON.stringify(obra);
        let params='data='+obraJson;

        let bearertoken = sessionStorage.getItem('token');
        if (bearertoken){
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded').set('bearertoken', bearertoken);
        } else {
            headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        }
        let options={
            headers
        }
        return this._http.post(this.urlAPI+'obra/store',params,options);
    }

    upLoadImage(image: File): Observable<any> {
        const formData: FormData = new FormData(); 
        formData.append('file', image, image.name);
        const bearerToken = sessionStorage.getItem('token');
        let headers = new HttpHeaders();
        if (bearerToken) {
        headers = headers.set('bearertoken', `${bearerToken}`);
        }
        return this._http.post(this.urlAPI+'obra/uploadimage', formData, { headers });
    }

    getImage(filename: string): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
        let options = {
            headers
        };
        return this._http.get(`${this.urlAPI}obra/getimage/${filename}`, options);
    }
}