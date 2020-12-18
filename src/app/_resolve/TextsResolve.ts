import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { ApiService } from "../api.service";
import { Observable } from 'rxjs';
import { Texts } from "../_models/texts";

@Injectable()
export class TextsResolve implements Resolve<Texts>
{
    constructor(private backend: ApiService)
    {
    }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<Texts>
    {
        return this.backend
            .getTexts()
    }
}