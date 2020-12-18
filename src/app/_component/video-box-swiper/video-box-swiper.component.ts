import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from "../../api.service";
import { VgAPI } from 'videogular2/core';
import { Observable } from 'rxjs';
import { Content } from "../../_models/RootQuery";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Component({
    selector: 'app-video-box-swiper',
    templateUrl: './video-box-swiper.component.html',
    styleUrls: ['./video-box-swiper.component.less']
})
export class VideoBoxSwiperComponent
{
    @Output() playEvent = new EventEmitter<number>();
    @Input() content: Content;
    @Input() i: number;

    constructor(public api: ApiService)
    {
    }

    onPlayerReady(api: VgAPI)
    {
        const playEvent: Observable<any> = api.subscriptions['play'];

        playEvent.subscribe((e: Event) => {
            if (this.api.isAuthorized()) {
                this.api.play(this.content.id)
                    .pipe(
                        map(() => this.playEvent.emit(this.content.id)),
                    )
                    .subscribe()
            } else {
                window.location.href = environment.backUrl;
            }
        })
    }

    get getFullYear(): number
    {
        return (new Date()).getFullYear()
    }

    get getMonth(): number
    {
        return (new Date()).getMonth() - this.i
    }

    toUp(x)
    {
        return x.charAt(0).toUpperCase() + x.substr(1).toLowerCase();
    }

}
