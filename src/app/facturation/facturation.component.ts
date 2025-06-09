import { Component, Input } from '@angular/core';
import { Facture } from '../models/facture';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-facturation',
  imports: [CommonModule, FormsModule],
  templateUrl: './facturation.component.html',
  styleUrl: './facturation.component.css'
})
export class FacturationComponent {

  @Input() facture: Facture | null = null;
  @Input() projectId: string = "";

}
