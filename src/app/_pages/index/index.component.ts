import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from "../../api.service";
import { ActivatedRoute } from '@angular/router';
import { Category, Content } from "../../_models/RootQuery";
import { Texts } from "../../_models/texts";

declare var Swiper: any;

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.less']
})
export class IndexComponent implements OnInit, AfterViewInit
{
    public newVideos: Content[];
    public unwatchedVideos: Content[];
    public popularVideos: Content[];

    public active: Content[];
    public activeLink: string = 'new';

    public categories: Category[][];
    public top: Content[];

    @ViewChild('swiper') swiper_ref: ElementRef;

    constructor(private api: ApiService, private route: ActivatedRoute)
    {
    }

    onPlay(contentId: number)
    {
        this.api.cachePlay(contentId);
        let idx = this.active.find(value => value.id == contentId);
        if (idx && !idx.viewed) {
            idx.views += 1;
            idx.viewed = true;
        }
    }

    onLike(contentId: number)
    {
        this.api.cacheToggleLike(contentId);
        let idx = this.active.find(value => value.id == contentId);
        if (idx) {
            if (idx.liked) {
                idx.likes -= 1;
                idx.liked = false;
            }
            else {
                idx.likes += 1;
                idx.liked = true;
            }
        }
    }

    public texts: Texts;

    ngOnInit()
    {
        const {r, texts} = this.route.snapshot.data;
        this.texts = texts;

        const categories: Category[] = r.categories
            .map((e: Category) => {
                e.contents = e.contents.map(c => {
                    c.file = c.file.slice(1);
                    c.previews = c.previews.map(p => {
                        p.file = p.file.slice(1);
                        return p
                    });
                    return c
                });
                return e
            });
        let contents: Content[] = categories
            .map(category => category.contents)
            .reduce((p: Content[], c) => p.concat(c), [])
            .filter(value => value.previews.length > 0);

        this.popularVideos = contents
            .sort((a, b) => {
                if (a.views < b.views) {
                    return 1;
                }
                if (a.views > b.views) {
                    return -1;
                }
                return 0;
            })
            .slice(0, 3);

        this.newVideos = contents.slice(3, 6);

        this.unwatchedVideos = contents
            .sort((a, b) => {
                if (a.viewed > b.viewed) {
                    return 1;
                }
                if (a.viewed < b.viewed) {
                    return -1;
                }
                return 0;
            })
            .slice(0, 3);

        const sortCategories = categories.sort((a, b) => {
            if (a.contents.length < b.contents.length) {
                return 1;
            }
            if (a.contents.length > b.contents.length) {
                return -1;
            }
            return 0;
        });
        const fGet = sortCategories
            .slice(0, 4)
            .map(e => e.contents);
        const sGet = sortCategories
            .slice(4)
            .map(e => e.contents);
        // 2019
        const shortCurrentAge = (new Date()).getFullYear();
        // 4
        const countAges = Math.floor(
            categories
                .map(e => e.contents.length)
                .sort()
                .reduce((acc, c) => acc = c, 0) / 2
        );
        const currentAgePos
            = shortCurrentAge - (Math.floor(shortCurrentAge / countAges) * countAges);

        const croup = (e, p) => {
            if (p > e.length) {
                return e[(p - p % e.length) / e.length]
            }
            return e[p]
        };

        // 12

        this.top = []
            .concat(
                fGet
                    .map(e => [croup(e, currentAgePos), croup(e, currentAgePos + 1)])
                    .reduce((acc, c) => acc.concat(c), []),
                sGet
                    .map(e => [croup(e, currentAgePos)])
                    .reduce((acc, c) => acc.concat(c), []),
            )
            .slice(0, (new Date()).getMonth() + 1)
            .reverse();

        debugger

        let half = Math.floor(categories.length / 2);
        this.categories = categories
            .reduce(
                (p, c, i, a) => {
                    p.push([categories[i], categories[a.length - i - 1]]);
                    return p
                }, [])
            .slice(0, half);

        this.updateActive();
        this.api.display(true);
    }

    ngAfterViewInit()
    {
        const sw = new Swiper(this.swiper_ref.nativeElement, {
            navigation: {
                prevEl: '.swiper-button-prev',
                nextEl: '.swiper-button-next'
            }
        });
    }

    public updateActive()
    {
        switch (this.activeLink) {
            case 'new':
                this.active = this.newVideos;
                break;
            case 'unwatched':
                this.active = this.unwatchedVideos;
                break;
            case 'popular':
                this.active = this.popularVideos;
                break;
        }
    }

    public groupNew()
    {
        this.activeLink = 'new';
        this.active = this.newVideos;
    }

    public groupUnwatched()
    {
        this.activeLink = 'unwatched';
        this.active = this.unwatchedVideos;
    }

    public groupPopular()
    {
        this.activeLink = 'popular';
        this.active = this.popularVideos;
    }
}
