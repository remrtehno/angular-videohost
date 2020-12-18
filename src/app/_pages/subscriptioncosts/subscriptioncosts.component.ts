import { Component, AfterContentInit } from '@angular/core';
import { ApiService } from "../../api.service";
import { ActivatedRoute } from '@angular/router';
import { Texts } from "../../_models/texts";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-subscriptioncosts',
    templateUrl: './subscriptioncosts.component.html'
})
export class SubscriptioncostsComponent
{
    constructor(private api: ApiService, private route: ActivatedRoute, private sanitizer: DomSanitizer)
    {
    }

    text: SafeHtml;
    public texts: Texts;

    ngAfterContentInit()
    {
        this.texts = this.route.snapshot.data.r;
        this.text = this.sanitizer.bypassSecurityTrustHtml(this.texts.subscriptioncosts);

        this.api.display(true);
    }
}
