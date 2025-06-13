import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { TicketService } from '../services/ticket.service';
import { Ticket } from '../models/ticket';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

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

  constructor(
    public ticketService: TicketService,
    private sanitizer: DomSanitizer
  ) { }

  newTitle: string = "";
  newContent: string = "";
  isSubmitting: boolean = false;
  submitSuccess: boolean = false;
  errorMessage: string = "";
  imagePreviews: SafeUrl[] = [];
  selectedFiles: File[] = [];

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    // Clear previous previews
    this.imagePreviews = [];
    this.selectedFiles = [];

    // Create previews for each file
    Array.from(input.files).forEach(file => {
      if (file.type.startsWith('image/')) {
        this.selectedFiles.push(file);
        const url = URL.createObjectURL(file);
        this.imagePreviews.push(this.sanitizer.bypassSecurityTrustUrl(url));
      }
    });
  }

  removeImage(index: number) {
    this.imagePreviews.splice(index, 1);
    this.selectedFiles.splice(index, 1);

    // Update the file input to reflect changes
    if (this.ReplyPictureInput) {
      // Unfortunately we can't directly modify the files property, so we need to reset
      // the input and manually set the remaining files through a DataTransfer object
      if (this.selectedFiles.length === 0) {
        this.ReplyPictureInput.nativeElement.value = '';
      }
    }
  }

  async createTicket() {
    this.errorMessage = "";

    if (this.newTitle == "") {
      this.errorMessage = "Titre du ticket vide !";
      return;
    }
    if (this.newContent == "") {
      this.errorMessage = "Contenu du ticket vide !";
      return;
    }
    if (this.projectId == "") {
      this.errorMessage = "Veuillez sélectionner un projet !";
      return;
    }

    let formData = new FormData();

    // Add selected files
    if (this.selectedFiles.length > 0) {
      let i = 1;
      for (let file of this.selectedFiles) {
        formData.append("image" + i, file, file.name);
        i++;
      }
    }

    formData.append("title", this.newTitle);
    formData.append("content", this.newContent);
    formData.append("projectId", this.projectId.toString());

    this.isSubmitting = true;
    this.submitSuccess = false;

    try {
      await this.ticketService.postTicket(formData);

      // Reset form
      this.newTitle = "";
      this.newContent = "";
      this.selectedFiles = [];
      this.imagePreviews = [];

      // Reset file input
      if (this.ReplyPictureInput) {
        this.ReplyPictureInput.nativeElement.value = '';
      }

      this.submitSuccess = true;

      // Hide success message after 5 seconds
      setTimeout(() => {
        this.submitSuccess = false;
      }, 5000);
    } catch (error) {
      console.error("Erreur lors de la création du ticket:", error);
      this.errorMessage = "Erreur lors de la création du ticket. Veuillez réessayer.";
    } finally {
      this.isSubmitting = false;
    }
  }
}
