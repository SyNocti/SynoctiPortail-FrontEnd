import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ticket } from '../models/ticket';
import { TicketService } from '../services/ticket.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-liste-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './liste-ticket.component.html',
  styleUrl: './liste-ticket.component.css'
})
export class ListeTicketComponent implements OnInit {
  @Input() projectId: string = "";

  @Input() tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  selectedTicket: Ticket | null = null;
  searchTerm: string = '';
  loading: boolean = false;

  constructor(private ticketService: TicketService) { }

  ngOnInit() {
    this.fetchTickets();
  }

  fetchTickets() {
    this.loading = true;
    this.ticketService.getUserTickets()
      .then(tickets => {
        this.tickets = tickets;
        this.filteredTickets = tickets;
      })
      .catch(error => {
        console.error('Failed to fetch tickets:', error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  async selectTicket(ticket: Ticket) {
    if (!ticket.id) return;

    try {
      this.loading = true;
      // Note: Using the GUID string ID directly - don't parse as integer
      const detailedTicket = await this.ticketService.getUserTicketById(ticket.id);
      this.selectedTicket = detailedTicket;
    } catch (error) {
      console.error('Failed to fetch ticket details:', error);
      // Fallback to the basic ticket info if detailed fetch fails
      this.selectedTicket = ticket;
    } finally {
      this.loading = false;
    }
  }

  searchTickets(): void {
    if (!this.searchTerm.trim()) {
      this.filteredTickets = [...this.tickets];
      return;
    }

    const term = this.searchTerm.toLowerCase().trim();
    this.filteredTickets = this.tickets.filter(ticket =>
      (ticket.title?.toLowerCase().includes(term) || false) ||
      (ticket.content?.toLowerCase().includes(term) || false) ||
      (ticket.username?.toLowerCase().includes(term) || false) ||
      (ticket.status?.toLowerCase().includes(term) || false)
    );
  }
}
