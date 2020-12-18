import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { ApiService } from "../api.service";
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { RootQuery } from "../_models/RootQuery";

@Injectable()
export class Root implements Resolve<RootQuery>
{
    constructor(private backend: ApiService)
    {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<RootQuery>
    {
        return this.backend.getRoot();
    }
}

@Injectable()
export class Index implements Resolve<RootQuery>
{
    constructor(private backend: ApiService)
    {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<RootQuery>
    {
        return this.backend.getIndex();
    }
}