import request from "supertest";
import app from "../../../../notes_app/src/app.js";

export class BaseService {
    constructor(agent) {
        this._agent = agent || request.agent(app);
    }

    get agent() {
        return this._agent;
    }

    async get(url) {
        const res = await this._agent.get(url);
        return res;
    }

    async post(url, body) {
        const res = await this._agent.post(url)
                                     .type("form")
                                     .send(body);
                                  
        return res;
    }

    async put(url, body) {
        const res = await this._agent.put(url)
                                     .type("form")
                                     .send(body);
                                  
        return res;
    }

    async delete(url) {
        const res = await this._agent.delete(url);
        return res;
    }
}

