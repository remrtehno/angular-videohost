import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { ApiService } from "../api.service";
import { Observable } from 'rxjs';
import { RootQuery } from "../_models/RootQuery";

@Injectable()
export class IndexResolve implements Resolve<RootQuery>
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