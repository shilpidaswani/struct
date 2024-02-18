import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map, retry, takeWhile } from "rxjs/operators";
import constants from "src/common/constants/constants";
import EndPoints from "src/common/constants/EndPoints";
import { environment } from "src/environments/environment";
import { AuthenticationService } from "src/providers/authentication/authentication.service";
import { NetworkService } from "src/services/network.service";

export interface Request {
    path: string;
    data?: any;
    isAuth?: boolean;
}

export type Path = (() => string) | string;
@Injectable({
    providedIn: "root",
})
export class DataService {
    BASE_URL = environment.base_url;
    response: any[] = [];

    constructor(private _networkService: NetworkService, private http: HttpClient, private authService: AuthenticationService) { }

    get isConnected(): boolean {
        return this._networkService.isOnline;
    }
    private _isOffline(val: any): boolean {
        return !val || !this._networkService.isOnline;
    }


    get(requestUrl: string, isByPass = false) {
        return this.http.get<any>(`${this.BASE_URL + "" + requestUrl}`, {
            headers: this.getHeaderForLogout(requestUrl)
        })
            .pipe(takeWhile((): boolean => this._isOnline()),
                catchError(err => {
                    if (err.status == 400) {
                        return [{ status: err.error.status, message: err.error.message }]
                    }
                    else {
                        return err
                    }

                }),
                map((res: any) => {

                    return res;
                }),
                retry(1),
                catchError(this.handleError.bind(this))
            );
    }

    getHeaderForLogout(requestUrl, isByPass = false) {
        if (requestUrl == EndPoints.LOGOUT) {
            const token = localStorage.getItem('fcmToken');
            if (token) {
                return this.getHeaderFcmToken(isByPass);
            } else {
                return this.getHeader(isByPass)
            }
        }
        else {
            return this.getHeader(isByPass)
        }
    }
    getWithParam(requestUrl: string, isByPass = false, ...params: any[]) {
        return this.http.get<any>(`${requestUrl}/${params}`, {
            headers: this.getHeader(isByPass),
        })
            .pipe(takeWhile((): boolean => this._isOnline()),
                catchError(err => {
                    if (err.status == 400) {
                        return [{ status: err.error.status, message: err.error.message }]
                    }
                    else {
                        return err
                    }
                }),
                map((res: any) => {
                    if (res.data != undefined) {
                        if (res.data["appToken"]) {
                            let data = this.authService.getAuthDetail();
                            data = {
                                ...data,
                                token: res.data["appToken"],
                                isLoggedIn: true,
                            };
                            this.authService.setAuth(data);
                            return res
                        }
                        else {
                            return res
                        }
                    }
                    else {
                        // console.log(res);
                        return res
                    }
                }),
                retry(1),
                catchError(this.handleError.bind(this))
            );
    }
    delete(requestUrl: string, isByPass = false): Observable<any> {
        // console.log(requestUrl);
        return this.http
            .delete(this.BASE_URL + requestUrl, {
                headers: this.getHeader(isByPass),
            })
            .pipe(takeWhile((): boolean => this._isOnline()),
                catchError(err => {
                    if (err.status == 400) {
                        return [{ status: err.error.status, message: err.error.message }]
                    }
                    else {
                        return err
                    }
                }),
                map((res: any) => {
                    if (res["token"]) {
                        localStorage.setItem(constants.ACCESS_TOKEN, res.token);
                    }
                    return res;
                }),
            );
    }

    post(requestUrl: string, isByPass = false, params) {
        // console.log(isByPass)
        return this.http.post<any>(`${this.BASE_URL + "" + requestUrl}`, params, {
            headers: this.getHeader(false),
        })
            .pipe(takeWhile((): boolean => this._isOnline()),
                catchError(err => {
                    if (err.status == 400) {
                        return [{ status: err.error.status, message: err.error.message }]
                    }
                    else {
                        return err
                    }
                }),
                map((res: any) => {
                    if (res.data != undefined) {
                        if (res.data["appToken"]) {
                            let data = this.authService.getAuthDetail();
                            data = {
                                ...data,
                                token: res.data["appToken"],
                                isLoggedIn: true,
                            };
                            this.authService.setAuth(data);
                            return res
                        }
                        else {
                            return res
                        }
                    }
                    else {
                        // console.log(res);
                        return res
                    }


                }),
                retry(1),
                catchError(this.handleError.bind(this))
            );
    }

    postwithoutheaders(requestUrl: string, params) {
        // console.log(isByPass)
        return this.http.post<any>(`${this.BASE_URL + "" + requestUrl}`, params, {
            headers: this.getHeader(true),
        })
            .pipe(takeWhile((): boolean => this._isOnline()),
                catchError(err => {
                    if (err.status == 400) {
                        return [{ status: err.error.status, message: err.error.message }]
                    }
                    else {
                        return err
                    }
                }),
                map((res: any) => {
                    if (res.data != undefined) {
                        if (res.data["appToken"]) {
                            let data = this.authService.getAuthDetail();
                            data = {
                                ...data,
                                token: res.data["appToken"],
                                isLoggedIn: true,
                            };
                            this.authService.setAuth(data);
                            return res
                        }
                        else {
                            return res
                        }
                    }
                    else {
                        // console.log(res);
                        return res
                    }


                }),
                retry(1),
                catchError(this.handleError.bind(this))
            );
    }

    postwithURL(requestUrl: string, isByPass = false, params) {
        return this.http.post<any>(`${this.BASE_URL + "" + requestUrl}`, params, {
            headers: this.getHeader(isByPass),
        })
            .pipe(takeWhile((): boolean => this._isOnline()),
                catchError(err => {
                    if (err.status == 400) {
                        return [{ status: err.error.status, message: err.error.message }]
                    }
                    else {
                        return err
                    }
                }),
                map((res: any) => {
                    if (res.data != undefined) {
                        if (res.data["appToken"]) {
                            let data = this.authService.getAuthDetail();
                            data = {
                                ...data,
                                token: res.data["appToken"],
                                isLoggedIn: true,
                            };
                            this.authService.setAuth(data);
                            return res
                        }
                        else {
                            return res
                        }
                    }
                    else {
                        // console.log(res);
                        return res
                    }
                }),
                retry(1),
                catchError(this.handleError.bind(this))
            );
    }
    
    postwithoutParams(requestUrl: string, isByPass = false) {
        return this.http.post<any>(`${this.BASE_URL + "" + requestUrl}`, {
            headers: this.getHeader(isByPass),
        })
            .pipe(takeWhile((): boolean => this._isOnline()),
                catchError(err => {
                    if (err.status == 400) {
                        return [{ status: err.error.status, message: err.error.message }]
                    }
                    else {
                        return err
                    }
                }),
                map((res: any) => {
                    if (res.data != undefined) {
                        if (res.data["appToken"]) {
                            let data = this.authService.getAuthDetail();
                            data = {
                                ...data,
                                token: res.data["appToken"],
                                isLoggedIn: true,
                            };
                            this.authService.setAuth(data);
                            return res
                        }
                        else {
                            return res
                        }
                    }
                    else {
                        // console.log(res);
                        return res
                    }
                }),
                retry(1),
                catchError(this.handleError.bind(this))
            );
    }

    put(requestUrl: string, isByPass = false, params): Observable<any> {
        return this.http
            .put(this.BASE_URL + requestUrl, params, {
                headers: this.getHeader(isByPass),
            })
            .pipe(takeWhile((): boolean => this._isOnline()),
                catchError(err => {
                    if (err.status == 400) {
                        return [{ status: err.error.status, message: err.error.message }]
                    }
                    else {
                        return err
                    }
                }),
                map((res: any) => {
                    if (res["token"]) {
                        localStorage.setItem(constants.ACCESS_TOKEN, res.token);
                    }
                    return res;
                }),
            );
    }

    putwithUrl(request: Request, isByPass = false, params): Observable<any> {
        return this.http
            .put(this.BASE_URL + request.path, request.data, {
                headers: this.getHeader(isByPass),
            })
            .pipe(takeWhile((): boolean => this._isOnline()),
                catchError(err => {
                    return err
                }),
                map((res: any) => {
                    if (res["token"]) {
                        localStorage.setItem(constants.ACCESS_TOKEN, res.token);
                    }
                    return res;
                }),
            );
    }


    private _isOnline(): boolean {
        return this._networkService.isOnline;
    }

    getHeader(byPass) {
        let header: HttpHeaders = new HttpHeaders
        if (!byPass) {
            // Loaded from AppLocal storage to avoid circular dependency on SessionService
            const session = localStorage.getItem(constants.ACCESS_TOKEN);

            if (session) {

                header = header.append("Authorization", session);
            }

        }
        else {

        }
        return header;
    }

    getHeaderFcmToken(byPass) {
        let header: HttpHeaders = new HttpHeaders
        if (!byPass) {
            const session = localStorage.getItem(constants.ACCESS_TOKEN);
            const token = localStorage.getItem('fcmToken')
            if (session) {

                header = header.append("Authorization", session);
                // header = header.append("fcmToken", token);
            }

        }
        else {

        }



        return header;
    }
    handleError(error) {

        if (error["error"] != undefined) {
            
        }
        let errorMessage = "";
        if (error.error instanceof ErrorEvent) {
            errorMessage = error; 
        } else {
            errorMessage = error;
        }
        return throwError(errorMessage);
    }

    login(request): Observable<any[]> {
        return this.http.post<any[]>(
            environment.base_url + request.path,
            request.data,
            {}
        );
    }

    downLoadFile(data: any, type: string, filename: string, fileExe: string) {
        var a = document.createElement("a");
        document.body.appendChild(a);
        let blob = new Blob([data], { type: type });
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = filename + fileExe;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    postImage(requestUrl: string, isByPass = false, params) {
        return this.http.post<any>(`${this.BASE_URL + "" + requestUrl}`, params, {
            headers: this.getHeaderImage(isByPass),
        })
            .pipe(takeWhile((): boolean => this._isOnline()),
                catchError(err => {
                    return err
                }),
                map((res: any) => {
                    if (res["token"]) {
                        let data = this.authService.getAuthDetail();
                        data = {
                            ...data,
                            token: res["token"],
                            isLoggedIn: true,
                        };
                        this.authService.setAuth(data);
                    }
                    return res

                }),
                retry(1),
                catchError(this.handleError.bind(this))
            );
    }

    getHeaderImage(isByPass = false): HttpHeaders {

        let token = '';
        if (!isByPass) {
            token = localStorage.getItem(constants.ACCESS_TOKEN); //this.authService.getToken();
        } else {

        }

        let header: HttpHeaders = new HttpHeaders({
            "Content-Type": "multipart/form-data",
            Accept: "multipart/form-data",
        });

        if (!isByPass) {
            header = header.append("Authentication", token);
        }
        return header;
    }
    public replaceVariables(path: Path, variables: { [key: string]: string }): string {
        const me = this;

        let newPath: string;
        newPath = me.resolvePath(path);

        Object.keys(variables).forEach((variable: string) => {
            newPath = newPath.replace('{' + variable + '}', variables[variable]);
        });

        return newPath;
    }

    private resolvePath(path: Path): string {

        const me = this;
        if (!path) {
            return undefined;
        }

        if (typeof path === 'function') {
            path = path.call(me);
        }
        return path as string;
    }
}
