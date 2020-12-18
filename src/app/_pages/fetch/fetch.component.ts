import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { getJwtToken, removeToken, saveToken } from '../../healper';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from "../../../environments/environment";

@Component({
    selector: 'app-fetch',
    template: ''
})
export class FetchComponent implements OnInit
{

    constructor(private route: ActivatedRoute, private router: Router)
    {
    }

    ngOnInit()
    {
        let token = this.route.snapshot.queryParams.q;
        const helper = new JwtHelperService();

        if (token && !helper.isTokenExpired(token)) {
            saveToken(token);

            let status = this.route.snapshot.queryParams.status;
            const to = (status == "7") ? ['/'] : ['/welcome'];
            this.router.navigate(to);
        }
        else {
            window.location.href = environment.backUrl;
        }
    }

}
