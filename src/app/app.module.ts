import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, registerLocaleData } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import localeRu from '@angular/common/locales/ru';

import { JwtModule } from '@auth0/angular-jwt';
import { ApiService } from './api.service';
import { VgCoreModule } from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';

import { AppComponent } from './app.component';
import { LoaderService } from './loader.service';
import { IndexComponent } from './_pages/index/index.component';
import { VideoBoxComponent } from './_component/video-box/video-box.component';
import { CategoryComponent } from './_pages/category/category.component';
import { VideoBoxCategoryComponent } from './_component/video-box-category/video-box-category.component';
import { IndexResolve } from './_resolve/IndexResolve';
import { VideoBoxSwiperComponent } from './_component/video-box-swiper/video-box-swiper.component';
import { FetchComponent } from './_pages/fetch/fetch.component';
import { DataPipe } from './data.pipe';
import { BaseGuard } from './base.guard';
import { getJwtToken } from './healper';
import { SubscriptioncostsComponent } from './_pages/subscriptioncosts/subscriptioncosts.component';
import { ConditionsComponent } from './_pages/conditions/conditions.component';
import { FooterComponent } from './_component/footer/footer.component';
import { HeaderComponent } from './_component/header/header.component';
import { WelcomeComponent } from './_pages/welcome/welcome.component';
import { TextsResolve } from "./_resolve/TextsResolve";
import { Index, Root } from "./_resolve/Root";

const routes: Routes = [
    {
        path: 'subscriptioncosts', component: SubscriptioncostsComponent, resolve: {
            r: TextsResolve
        }
    },
    {
        path: 'conditions', component: ConditionsComponent, resolve: {
            r: TextsResolve
        }
    },
    {
        path: 'welcome', component: WelcomeComponent, resolve: {
            r: Root,
            texts: TextsResolve
        }
    },
    {
        path: '', component: IndexComponent, resolve: {
            r: Root,
            texts: TextsResolve
        }
    },
    {
        path: 'category/:alias', component: CategoryComponent, resolve: {
            r: Root,
            texts: TextsResolve
        }
    }
];

registerLocaleData(localeRu, 'ru');

@NgModule({
    declarations: [
        AppComponent,
        IndexComponent,
        VideoBoxComponent,
        CategoryComponent,
        VideoBoxCategoryComponent,
        VideoBoxSwiperComponent,
        FetchComponent,
        DataPipe,
        SubscriptioncostsComponent,
        ConditionsComponent,
        FooterComponent,
        HeaderComponent,
        WelcomeComponent
    ],
    imports: [
        BrowserModule,
        CommonModule,
        HttpClientModule,
        JwtModule.forRoot({
            config: {
                tokenGetter: getJwtToken,
                whitelistedDomains: ['/'],
                blacklistedRoutes: ['/next/']
            }
        }),
        RouterModule.forRoot(routes),
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule
    ],
    providers: [
        {provide: LOCALE_ID, useValue: "ru"},
        ApiService,
        LoaderService,
        IndexResolve,
        TextsResolve,
        Root,
        Index,
    ],
    bootstrap: [AppComponent]
})
export class AppModule
{
}
