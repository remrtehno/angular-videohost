import { Component, AfterContentInit, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Text } from "@angular/compiler";
import { Texts } from "../../_models/texts";

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent implements AfterContentInit
{
    @Input() raw :Texts;
    footer: SafeHtml;

    constructor(private sanitizer: DomSanitizer)
    {
    }

    ngAfterContentInit()
    {
        this.footer = this.sanitizer.bypassSecurityTrustHtml(this.raw.footer);
    }
}
