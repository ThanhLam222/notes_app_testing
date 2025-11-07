"use strict";

import { BaseService } from "./baseService.js";

export class IndexService extends BaseService {
    async getIndexPage() {
        const res = await this.get("/");
        return res;
    }

    async getAboutPage() {
        const res = await this.get("/about");
        return res;
    }
}