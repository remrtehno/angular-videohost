import { Inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from "./api.service";
import { environment } from "../environments/environment";
import { DOCUMENT } from "@angular/common";
import { map, tap } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class BaseGuard implements CanActivate
{
    constructor(
        @Inject(DOCUMENT) private document: Document,
        private api: ApiService,
        private router: Router,
    )
    {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean>
    {
        return this.api
            .getHead()
            .pipe(
                tap(({a, s}) => {
                    if (s != "2") {
                        this.router.navigateByUrl("/");
                    }
                    else {
                        if (!a) {
                            this.document.location.href = environment.backUrl;
                        }
                    }
                }),
                map(({a}) => a)
            );
    }
}
