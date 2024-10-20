import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { server } from "./global";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { BackupRestoreBD } from "../models/BackupRestoreBD";

@Injectable({
    providedIn: 'root'
})

export class backupRestoreService{
    private urlAPI:string;
    private backupRestoreSubject = new BehaviorSubject<any>(null);
    public backupRestore$ = this.backupRestoreSubject.asObservable();
    constructor(
        private _http:HttpClient
    ){
        this.urlAPI = server.url;
    }


    restoreBD(backupRestore:BackupRestoreBD): Observable<any> {
        console.log(backupRestore);
        let backupRestoreJson=JSON.stringify(backupRestore);
        let params='data='+backupRestoreJson;
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
        return this._http.put(`${this.urlAPI}adminBD/restore`, params, options);
    }


    backupBD(): Observable<Blob> {
        let bearertoken = sessionStorage.getItem('token');
        let headers = new HttpHeaders().set('bearertoken', bearertoken ? bearertoken : '');
    
        return this._http.post(`${this.urlAPI}adminBD/backup`, {}, {
            headers: headers,
            responseType: 'blob'
        });
    }
    


}