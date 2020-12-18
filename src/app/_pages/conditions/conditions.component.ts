import { AfterContentInit, Component } from '@angular/core';
import { ApiService } from "../../api.service";
import { ActivatedRoute } from '@angular/router';
import { Texts } from "../../_models/texts";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-conditions',
    templateUrl: './conditions.component.html',
    styleUrls: ['./conditions.component.less']
})
export class ConditionsComponent implements AfterContentInit
{
    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
    )
    {
    }

    conditions: SafeHtml;
    public texts: Texts;

    ngAfterContentInit()
    {
        this.texts = this.route.snapshot.data.r;

        this.conditions = this.sanitizer.bypassSecurityTrustHtml(this.texts.oferta);

        this.api.display(true);
    }
}
