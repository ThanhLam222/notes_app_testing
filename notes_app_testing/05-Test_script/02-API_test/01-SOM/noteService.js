"use strict";

import { BaseService } from "./baseService.js";

export class NoteService extends BaseService {
    async getNewNoteForm() {
        const res = await this.get("/notes/add");
        return res;
    }

    async submitNewNoteForm(body) {
        const res = await this.post("/notes/new-note", body);
        return res;
    }

    async getAllNotesPage() {
        const res = await this.get("/notes");
        return res;
    }

    async getEditNoteForm(noteID) {
        const res = await this.get(`/notes/edit/${noteID}`);
        return res;
    }

    async submitEditNoteForm(noteID, body) {
        const res = await this.put(`/notes/edit-note/${noteID}`, body);
        return res;
    }

    async deleteNote(noteID) {
        const res = await this.delete(`/notes/delete/${noteID}`);
        return res;
    }
}