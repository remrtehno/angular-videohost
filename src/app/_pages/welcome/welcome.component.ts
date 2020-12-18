import { AfterContentInit, Component, Inject } from '@angular/core';
import { ApiService } from "../../api.service";
import { ActivatedRoute, Router } from '@angular/router';
import { Texts } from "../../_models/texts";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { environment } from "../../../environments/environment";
import { DOCUMENT } from "@angular/common";

@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html'
})
export class WelcomeComponent implements AfterContentInit {
    constructor(
        @Inject(DOCUMENT) private document: Document,
        private api: ApiService,
        private router: Router,
        private route: ActivatedRoute, private sanitizer: DomSanitizer
    ) {
    }

    text: SafeHtml;
    public texts: Texts;

    ngAfterContentInit() {
        const {texts} = this.route.snapshot.data;
        this.texts = texts;
        this.text = this.sanitizer.bypassSecurityTrustHtml(this.texts.welcome);

        const {r} = this.route.snapshot.data;
        const {status, authorized} = r;

        if (status != "2") {
            this.router.navigateByUrl("/");
        } else {
            if (!authorized) {
                this.document.location.href = environment.backUrl;
            } else {
                this.api.display(true);
            }
        }
    }
}
