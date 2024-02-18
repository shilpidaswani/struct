import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NGXLogger } from 'ngx-logger';
import { InjectorResolver } from '../injector/injector.service';
import { AppError } from '../error/error.model';
import { AppLocalStorage } from 'src/app/utility/local-storage.util';
import { Session } from '../session/session.model';
import EndPoints from 'src/common/constants/EndPoints';


// tslint:disable-next-line: no-namespace
export namespace Store {

    export type Path = (() => string) | string;

    export type APIConfig = {
        base?: Path;
        endpoint?: Path;
        defaultBase?: Path;
    };

    export type APIConfigGroup = { [key: string]: Store.APIConfig };

    export interface Config {
        api?: APIConfig;
    }

    export interface State {
        loading: boolean;
        error: AppError;
    }

    export abstract class AbstractState<T> implements State {
        data: null | T;
        loading: boolean;
        error: AppError;
        constructor(data?: T) {
            this.loading = false;
            this.error = null;
            this.data = data || null;
        }
    }

    export abstract class AbstractIdealState<T> extends AbstractState<T> {
        constructor(data?: T) {
            super(data);
        }
    }

    export abstract class AbstractErrorState<T> extends AbstractState<T> {
        constructor(error: AppError, data?: T) {
            super(data);
            this.error = error;
        }
    }
    export abstract class AbstractLoadingState<T> extends AbstractState<T> {
        constructor(data?: T) {
            super(data);
            this.loading = true;
            this.error = null;
        }
    }

    export interface Service {
        config: Config;
    }

    export abstract class AbstractService implements Service {

        config: Store.Config;
        protected controller: Store.Controller;
        protected logger: NGXLogger;

        constructor() {
            this.logger = InjectorResolver.get(NGXLogger);
            this.controller = new Store.Controller(this);
        }

    }

    export class Controller {
        private http: HttpClient;

        constructor(
            protected service: Store.Service
        ) {
            this.http = InjectorResolver.get(HttpClient);
        }

        public get<T>(path: Path, data?: any, base?: Path, options?: {}): Observable<T> {
            if (this.http) {

                if (options) {
                    options['params'] = data;
                    options = this.prepareOptions(options);
                }

                return this.http.get<T>(this.urlWithBase(path, base), options);
            }
            return new Subject<T>();
        }

        public getWithoutHeaders<T>(path: Path, data?: any, base?: Path, options?: {}): Observable<T> {
            if (this.http) {

                if (options) {
                    options['params'] = data;
                    // options = this.prepareOptions(options);
                }

                return this.http.get<T>(this.urlWithBase(path, base), options);
            }
            return new Subject<T>();
        }

        public put<T>(path: Path, data: any, base?: Path, options?: {}): Observable<T> {
            if (this.http) {
                if (options) {
                    options = this.prepareOptions(options);
                }
                return this.http.put<T>(this.urlWithBase(path, base), data, options);
            }
            return new Subject<T>();
        }

        public post<T>(path: Path, data?: any, base?: Path, options?: {}): Observable<T> {
            if (this.http) {
                if (options) {
                    options = this.prepareOptions(options);
                }
                return this.http.post<T>(this.urlWithBase(path, base), data, options);
            }
            return new Subject<T>();
        }

        public patch<T>(path: Path, data?: any, base?: Path, options?: {}): Observable<T> {
            if (this.http) {
                if (options) {
                    options = this.prepareOptions(options);
                }
                return this.http.patch<T>(this.urlWithBase(path, base), data, options);
            }
            return new Subject<T>();
        }

        public postWithoutHeaders<T>(path: Path, data?: any, base?: Path, options?: {}): Observable<T> {
            if (this.http) {
                if (options) {
                    // options = this.prepareOptions(options);
                }
                return this.http.post<T>(this.urlWithBase(path, base), data, options);
            }
            return new Subject<T>();
        }

        public delete<T>(path: Path, base?: Path, options?: {}): Observable<T> {
            if (this.http) {
                if (options) {
                    options = this.prepareOptions(options);
                }
                return this.http.delete<T>(this.urlWithBase(path, base), options);
            }
            return new Subject<T>();
        }

        public urlWithBase(path: Path, base?: Path): string {
            return this.url(path, base);
        }

        public urlWithoutBase(path: Path, base?: Path): string {
            const me = this;

            // return me.sanitiesURL(me.resolvePath(path));
            return me.resolvePath(path);
        }

        public url(path: Path, base?: Path): string {
            const me = this;

            if (base) {
                base = me.resolvePath(base);
            } else if (me.service.config && me.service.config.api && me.service.config.api.base) {
                base = me.resolvePath(me.service.config.api.base);
            } else if (EndPoints.api.core.base) {
                base = me.resolvePath(EndPoints.api.core.base);
            }

            return base + me.sanitiesURL(me.resolvePath(path));
        }

        public getDefaultGetRequestHttpOptions() {
            return {
            };
        }

        public getDefaultPostRequestHttpOptions() {
            return {
            };
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

        private sanitiesURL(url: string): string {
            console.log(url)
            return url.replace(/\/+/gi, '/');
        }

        public getUrlWithoutBase<T>(path: Path, data?: any, base?: Path, options?: {}): Observable<T> {
            if (this.http) {

                if (options) {
                    options['params'] = data;
                    // options = this.prepareOptions(options);
                }

                return this.http.get<T>(this.urlWithoutBase(path), options);
            }
            return new Subject<T>();
        }

        public postUrlWithoutBase<T>(path: Path, data?: any, base?: Path, options?: {}): Observable<T> {
            if (this.http) {
                if (options) {
                    options = this.prepareOptions(options);
                }
                return this.http.post<T>(this.urlWithoutBase(path), data, options);
            }
            return new Subject<T>();
        }

        public postUrlWithoutBasePaypal<T>(path: Path, data?: any, base?: Path, options?: {}): Observable<T> {
            if (this.http) {
                if (options) {
                    options = this.prepareOptionsPaypal(options);
                }

                const body = new URLSearchParams();
                body.set('grant_type', 'client_credentials');

                return this.http.post<T>(this.urlWithoutBase(path), body, options);
            }
            return new Subject<T>();
        }

        private prepareOptionsPaypal(options?: {}): {} {

            if (options['Authorization']) {
                // Loaded from AppLocal storage to avoid circular dependency on SessionService

                let client_id = "AbCCdbXy47ZmpvNK2pRifjcdTsVmd71tyiWotE0k3PqWyLLxHlbPXiFMLUTAzUteJrqTKBfv9WSCu_mO";
                let secret = "EEJ7CjaCBSaXN_lOZnDHKHnyyIVMxfmstCSddprphBQn39U9IiM2ji37c5NcRafYuJD7xaqIyPMobrkI";

                options['headers'] = options['headers'] || {} as HttpHeaders;
                options['headers']['Authorization'] = 'Basic ' + btoa(`${client_id}:${secret}`);
                options['headers']['Accept'] = 'application/json';
                options['headers']['Content-Type'] = 'application/x-www-form-urlencoded';

                delete options['Authorization'];
            }

            return options;
        }

        private prepareOptions(options?: {}): {} {

            // Add Auth Header



            if (options['Authorization']) {
                // Loaded from AppLocal storage to avoid circular dependency on SessionService

                const session = localStorage.getItem('token');
                console.log(session);
                if (session) {
                    options['headers'] = options['headers'] || {} as HttpHeaders;
                    options['headers']['Authorization'] = 'Bearer ' + session;
                }

                // options['headers']['Content-Type'] = 'application/json';
                // const session = AppLocalStorage.get('SESSION', 'SESSION') as Session;
                // if (session && session.token) {
                //     options['headers'] = options['headers'] || {} as HttpHeaders;
                //     options['headers']['Authorization'] = 'Bearer ' + session.token;
                // }
                delete options['Authorization'];
            }

            // for push notification delet fcm token.
            if (options['fcmToken']) {
                options['headers']['fcmToken'] = options['fcmToken'];
                delete options['fcmToken'];
            }

            // for without login we add token manually.
            if (options['Token']) {
                options['headers'] = options['headers'] || {} as HttpHeaders;
                options['headers']['Authorization'] = options['Token'];
                delete options['Token'];
            }
            return options;
        }
    }
}
