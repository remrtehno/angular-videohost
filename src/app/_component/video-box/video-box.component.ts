import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from "../../api.service";
import { VgAPI } from 'videogular2/core';
import { Observable } from 'rxjs';
import { Content } from "../../_models/RootQuery";
import { map } from "rxjs/operators";
import { environment } from "../../../environments/environment";

@Component({
    selector: 'app-video-box',
    templateUrl: './video-box.component.html',
    styleUrls: ['./video-box.component.less']
})
export class VideoBoxComponent
{
    @Output() playEvent = new EventEmitter<number>();
    @Output() likeEvent = new EventEmitter<number>();

    @Input() content: Content;

    like()
    {
        this.api.like(this.content.id)
            .pipe(
                map(() => this.likeEvent.emit(this.content.id)),
            )
            .subscribe()
    }

    constructor(public api: ApiService)
    {
    }

    onPlayerReady(api: VgAPI)
    {
        const playEvent: Observable<Event> = api.subscriptions['play'];

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
}
