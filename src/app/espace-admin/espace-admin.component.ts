import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreationClientComponent } from '../creation-client/creation-client.component';
import { CreationProjetComponent } from '../creation-projet/creation-projet.component';
import { ListeClientComponent } from '../liste-client/liste-client.component';

@Component({
  selector: 'app-espace-admin',
  imports: [FormsModule, CommonModule, CreationClientComponent, ListeClientComponent, CreationProjetComponent],
  templateUrl: './espace-admin.component.html',
  styleUrls: ['./espace-admin.component.css']
})
export class EspaceAdminComponent {

  activeView: string = 'creation'; // Default view

  setActiveView(view: string): void {
    this.activeView = view;
  }
}
