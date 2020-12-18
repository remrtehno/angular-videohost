import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, concatMap, map, mergeAll, reduce, switchMap } from 'rxjs/operators';
import { Category, Content, Likes, RootQuery, Views } from "./_models/RootQuery";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Texts } from "./_models/texts";
import { environment } from "../environments/environment";

export const href = '/api/';
export const enableCache = false;

@Injectable({
    providedIn: 'root'
})
export class ApiService
{
    public loaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    display(value: boolean)
    {
        this.loaded.next(value);
    }

    isAuthorized(): boolean
    {
        return this._authorized;
    }

    getRootWeb(): Observable<RootQuery>
    {
        return this.getIndex()
            .pipe(
                switchMap((value: RootQuery) => {
                    return this.getLikes(value)
                }),
                switchMap((value: RootQuery) => {
                    return (value.authorized) ?
                        this.getLikesAuth(value) : of(value)
                }),
                switchMap((value: RootQuery) => {
                    return this.getViews(value)
                }),
                switchMap((value: RootQuery) => {
                    return (value.authorized) ?
                        this.getViewsAuth(value) : of(value)
                }),
                map(value => {
                    if (enableCache) {
                        localStorage.setItem("root", JSON.stringify(value));
                        localStorage.setItem("root-update", Date.now().toString());
                    }

                    return value
                }),
            );
    }

    cachePlay(contentId: number)
    {
        if (!enableCache) {
            return
        }

        let root = localStorage.getItem("root");
        if (root) {
            let parsed: RootQuery = JSON.parse(root);

            const categories: Category[] = parsed.categories;
            parsed.categories = categories
                .map(category => {
                        category
                            .contents = category
                            .contents
                            .map(content => {
                                if (content.id == contentId) {
                                    if (!content.viewed) {
                                        content.views += 1;
                                        content.viewed = true;
                                    }
                                }
                                return content
                            });
                        return category
                    }
                );
            localStorage.setItem("root", JSON.stringify(parsed));
        }
    }

    cacheToggleLike(contentId: number)
    {
        if (!enableCache) {
            return
        }

        let root = localStorage.getItem("root");
        if (root) {
            let parsed: RootQuery = JSON.parse(root);

            const categories: Category[] = parsed.categories;
            parsed.categories = categories
                .map(category => {
                        category
                            .contents = category
                            .contents
                            .map(content => {
                                if (content.id == contentId) {
                                    if (content.liked) {
                                        content.likes -= 1;
                                        content.liked = false;
                                    }
                                    else {
                                        content.likes += 1;
                                        content.liked = true;
                                    }
                                }
                                return content
                            });
                        return category
                    }
                );
            localStorage.setItem("root", JSON.stringify(parsed));
        }
    }

    getRoot(): Observable<RootQuery>
    {
        if (!enableCache) {
            return this.getRootWeb();
        }

        let root = localStorage.getItem("root");
        let updateStr = localStorage.getItem("root-update");
        if (root) {
            let update = Date.parse(updateStr);
            if (update + 3600 > Date.now()) {
                localStorage.removeItem("root");
                localStorage.removeItem("root-update");
                return this.getRootWeb();
            }
            return of(JSON.parse(root))
        }
        else {
            return this.getRootWeb();
        }
    }

    getViewsAuth(compact: RootQuery): Observable<RootQuery>
    {
        return this.http.get<Views[]>(`/naked/bapi/auth/views`)
            .pipe(
                map(v => this._extendContent(compact, v, c => {
                    const vc = v
                        .find(like => like.content_idx == c.id);
                    c.viewed = !!(vc);
                    return c
                })),
            )
    }

    getViews(compact: RootQuery): Observable<RootQuery>
    {
        return this.http.get<Views[]>(`/naked/bapi/views`)
            .pipe(
                map(v => this._extendContent(compact, v, c => {
                    const vc = v
                        .find(like => like.content_idx == c.id);
                    c.views = (vc) ? vc.count : 0;
                    return c
                })),
            )
    }

    private _extendContent(compact: RootQuery, v: Views[] | Likes[], mapFunc: (c: Content) => Content)
        : RootQuery
    {
        compact.categories = compact.categories
            .map(category => {
                    category.contents = category
                        .contents
                        .map(c => mapFunc(c));
                    return category
                }
            );
        return compact
    }

    getLikesAuth(compact: RootQuery): Observable<RootQuery>
    {
        return this.http.get<Likes[]>(`/naked/bapi/auth/likes`)
            .pipe(
                map(v => this._extendContent(compact, v, c => {
                    const vc = v
                        .find(like => like.content_idx == c.id);
                    c.liked = !!(vc);
                    return c
                })),
            );
    }

    getLikes(compact: RootQuery): Observable<RootQuery>
    {
        return this.http.get<Likes[]>(`/naked/bapi/likes`)
            .pipe(
                map(v => this._extendContent(compact, v, c => {
                    const vc = v
                        .find(like => like.content_idx == c.id);
                    c.likes = (vc) ? vc.count : 0;
                    return c
                })),
            );
    }

    play(idx: number): Observable<void>
    {
        return this.http.put<void>(`/naked/bapi/auth/play/${idx}`, null)
    }

    like(idx: number): Observable<void>
    {
        return this.http.put<void>(`/naked/bapi/auth/like/${idx}`, null)
    }

    constructor(private http: HttpClient)
    {
    }

    private _authorized = false;

    getHead(): Observable<{a:boolean, s:string}>
    {
        const verify = this.http
            .head(`/naked/auth/verify`, { observe: 'response' })
            .pipe(
                catchError(() => of(false)),
                map(a => {
                    this._authorized = a !== false;
                    return this._authorized
                }),
                map(e => ({a: e})),
            );
        const status = this.http
            .get(`/naked/auth/status`, {responseType: "text"})
            .pipe(
                map(e => ({s: e})),
            );

        return of(verify, status)
            .pipe(
                mergeAll(),
                reduce<{a:boolean, s:string}>((acc, value, index) => {
                    return Object.assign(acc, value)
                }, {a: false, s: ""})
            );
    }

    getIndex(): Observable<RootQuery>
    {
        return this.http
            .get<RootQuery>(environment.compact)
            .pipe(
                map((value: RootQuery) => {
                    this._authorized = value.authorized;
                    return value
                }),
            );
    }

    getTexts(): Observable<Texts>
    {
        const footer = this.http
            .get(`/naked/text/ua-ks-naked-and-funny/footer/1`, {responseType: "text"})
            .pipe(
                map(e => ({footer: e})),
            );
        const oferta = this.http
            .get(`/naked/text/ua-ks-naked-and-funny/oferta/1`, {responseType: "text"})
            .pipe(
                map(e => ({oferta: e})),
            );
        const subscriptioncosts = this.http
            .get(`/naked/text/ua-ks-naked-and-funny/subscriptioncosts/1`, {responseType: "text"})
            .pipe(
                map(e => ({subscriptioncosts: e})),
            );
        const conditions = this.http
            .get(`/naked/text/ua-ks-naked-and-funny/conditions/1`, {responseType: "text"})
            .pipe(
                map(e => ({conditions: e})),
            );
        const welcome = this.http
            .get(`/naked/text/ua-ks-naked-and-funny/welcome/1`, {responseType: "text"})
            .pipe(
                map(e => ({welcome: e})),
            );

        return of(footer, oferta, subscriptioncosts, conditions, welcome)
            .pipe(
                mergeAll(),
                reduce<Texts>((acc, value, index) => {
                    return Object.assign(acc, value)
                }, new Texts())
            );
    }
}
