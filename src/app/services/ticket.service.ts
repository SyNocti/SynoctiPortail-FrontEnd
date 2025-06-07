import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Ticket } from '../models/ticket';

const domain = "https://localhost:7257/";

@Injectable({
    providedIn: 'root'
})
export class TicketService {

    constructor(public http: HttpClient) { }

    async postTicket(formData: any): Promise<Ticket> {

        let x = await lastValueFrom(this.http.post<any>(domain + "api/OurCompany/Tickets/PostTicket", formData));
        console.log(x);
        return x;

    }
}