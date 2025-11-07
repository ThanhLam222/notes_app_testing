"use strict";

import { BaseService } from "./baseService.js";

export class AuthService extends BaseService {
    async getSignUpForm() {
        const res = await this.get("/auth/signup");
        return res;
    }

    async submitSignUpForm(body) {
        const res = await this.post("/auth/signup", body);
        return res;
    }

    async getSignInForm() {
        const res = await this.get("/auth/signin");
        return res;
    }

    async submitSignInForm(body) {
        const res = await this.post("/auth/signin", body);
        return res;
    }

    async logout() {
        const res = await this.get("/auth/logout");
        return res;
    }
}