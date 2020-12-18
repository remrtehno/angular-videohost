import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CategoryContent } from "../../_models/CategoryContent";
import { Content } from "../../_models/RootQuery";
import { VgAPI } from "videogular2/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiService } from "../../api.service";
import { environment } from "../../../environments/environment";

@Component({
    selector: 'app-video-box-category',
    templateUrl: './video-box-category.component.html',
    styleUrls: ['./video-box-category.component.less']
})
export class VideoBoxCategoryComponent
{
    @Output() playEvent = new EventEmitter<number>();

    @Input() content: Content;

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
