import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoaderService
{
    public isLoad = false;

    constructor()
    {
    }
}
