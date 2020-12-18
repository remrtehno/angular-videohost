import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from "../../api.service";
import { Category, Content } from "../../_models/RootQuery";
import { Texts } from "../../_models/texts";
import { environment } from "../../../environments/environment";
import { DOCUMENT } from "@angular/common";

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.less']
})
export class CategoryComponent implements OnInit
{
    public alias;
    public title;
    public texts: Texts;

    public newVideos: Content[];
    public unwatchedVideos: Content[];
    public popularVideos: Content[];

    public active: Content[];
    public activeLink: string;

    constructor(
        private route: ActivatedRoute,
        @Inject(DOCUMENT) private document: Document,
        private api: ApiService,
        private router: Router,
    )
    {
    }

    public step = 3;

    ngOnInit()
    {
        const {alias} = this.route.snapshot.params;
        this.alias = alias;
        const {r, texts} = this.route.snapshot.data;
        const {authorized} = r;

        if (!authorized) {
            this.document.location.href = environment.backUrl;
        }

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

        const category = categories
            .find(value => value.alias === alias);

        let contents: Content[] = category
            .contents
            .filter(value => value.previews.length > 0);

        this.popularVideos = contents.sort((a, b) => {
            if (a.views < b.views) {
                return 1;
            }
            if (a.views > b.views) {
                return -1;
            }
            return 0;
        });
        this.newVideos = contents;
        this.unwatchedVideos = contents.sort((a, b) => {
            if (a.viewed > b.viewed) {
                return 1;
            }
            if (a.viewed < b.viewed) {
                return -1;
            }
            return 0;
        });

        this.title = category.name;

        this.groupNew();

        this.api.display(true);
    }

    public groupNew()
    {
        this.step = 3;
        this.activeLink = 'new';
        this.active = this.newVideos.slice(0, this.step);
    }

    public groupUnwatched()
    {
        this.step = 3;
        this.activeLink = 'unwatched';
        this.active = this.unwatchedVideos.slice(0, this.step);
    }

    public groupPopular()
    {
        this.step = 3;
        this.activeLink = 'popular';
        this.active = this.popularVideos.slice(0, this.step);
    }

    public maxSize()
    {
        switch (this.activeLink) {
            case 'new':
                return this.newVideos.length;
            case 'unwatched':
                return this.unwatchedVideos.length;
            case 'popular':
                return this.popularVideos.length;
        }
    }

    public prev()
    {
        this.step -= 3;

        switch (this.activeLink) {
            case 'new':
                this.active = this.newVideos.slice(this.step - 3, this.step);
                break;
            case 'unwatched':
                this.active = this.unwatchedVideos.slice(this.step - 3, this.step);
                break;
            case 'popular':
                this.active = this.popularVideos.slice(this.step - 3, this.step);
                break;
        }
    }

    public next()
    {
        switch (this.activeLink) {
            case 'new':
                this.active = this.newVideos.slice(this.step, this.step + 3);
                break;
            case 'unwatched':
                this.active = this.unwatchedVideos.slice(this.step, this.step + 3);
                break;
            case 'popular':
                this.active = this.popularVideos.slice(this.step, this.step + 3);
                break;
        }

        this.step += 3;
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
}
