import { Component, OnInit } from '@angular/core';
import { ApiService } from "./api.service";
import { Router, NavigationStart } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit
{
    showLoader: boolean;

    constructor(public api: ApiService, router: Router)
    {
        router.events
            .subscribe((event) => {
                if (event instanceof NavigationStart) {
                    this.api.display(false);
                }
            });
    }

    ngOnInit()
    {
        this.api.loaded.subscribe((val: boolean) => {
            this.showLoader = val;
        });
    }
}
