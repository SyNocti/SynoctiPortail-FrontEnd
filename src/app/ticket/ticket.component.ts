import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { TicketService } from '../services/ticket.service';
import { Ticket } from '../models/ticket';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ticket',
  imports: [CommonModule, FormsModule],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent {

  @Input() ticket: Ticket | null = null;
  @Input() projectId: string = "";

  @ViewChild("replyTicketFileInput", { static: false }) ReplyPictureInput?: ElementRef;

  constructor(public ticketService: TicketService) { }

  newTitle: string = "";
  newContent: string = "";

  async createTicket() {
    if (this.newTitle == "") {
      alert("Titre du ticket vide !");
      return;
    }
    if (this.newContent == "") {
      alert("Contenu du ticket vide !");
      return;
    }
    if (this.projectId == "") {
      alert("Veuillez sélectionner un projet !");
      return;
    }

    let formData = new FormData();

    if (this.ReplyPictureInput != undefined) {
      let files = this.ReplyPictureInput.nativeElement.files;

      if (files != null) {
        let i = 1;
        for (let f of files) {
          formData.append("image" + i, f, f.name);
          i++;
        }
      }
    }

    formData.append("title", this.newTitle);
    formData.append("content", this.newContent);
    formData.append("projectId", this.projectId.toString()); // Add the projectId to the form data

    try {
      await this.ticketService.postTicket(formData);
      this.newTitle = "";
      this.newContent = "";
      alert("Ticket créé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la création du ticket:", error);
      alert("Erreur lors de la création du ticket. Veuillez réessayer.");
    }
  }
}
