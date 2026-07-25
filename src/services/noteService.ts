import axios from "axios";
import type { Note, NoteToPost } from "../types/note";

const notehubApi = axios.create({
    baseURL: 'https://notehub-public.goit.study/api',
    headers: {
        Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    }
})

interface NotesHttpResponse {
    notes: Note[];
    totalPages: number;
}


export async function fetchNotes(page: number, userInput: string): Promise<NotesHttpResponse> {
    const response = await notehubApi.get<NotesHttpResponse>('/notes', {
        params: {
            search: userInput,
            page,
            perPage: 12
        },
    })
    // console.log(response.data)
    return response.data

}

export async function postNote(note: NoteToPost): Promise<Note> {

    const response = await notehubApi.post<Note>("/notes", note)
    // console.log(response.data);
    return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
    const response = await notehubApi.delete<Note>(`/notes/${id}`)
    return response.data
}