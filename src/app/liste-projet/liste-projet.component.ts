import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../models/project';
import { ProjectService } from '../services/project.service';

@Component({
  selector: 'app-liste-projet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './liste-projet.component.html',
  styleUrl: './liste-projet.component.css'
})
export class ListeProjetComponent implements OnInit, OnChanges {
  @Input() project: Project | null = null;
  @Input() projectId: string = "";

  fullProject: Project | null = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(private projectService: ProjectService) { }

  async ngOnInit() {

  }

  async ngOnChanges(changes: SimpleChanges) {
    // If projectId changes, reload the project data
    if (changes['projectId'] && changes['projectId'].currentValue) {
      await this.loadProjectDetails();
    }
  }

  async loadProjectDetails() {
    if (!this.projectId) {
      this.error = "Aucun projet sélectionné";
      return;
    }

    try {
      this.loading = true;
      this.error = null;

      // Get the single project by ID
      this.fullProject = await this.projectService.getProjectById(this.projectId);

      if (!this.fullProject) {
        this.error = "Aucune information disponible pour ce projet.";
      }

    } catch (error) {
      console.error("Error loading project details:", error);
      this.error = "Erreur lors du chargement des détails du projet.";
      this.fullProject = null;
    } finally {
      this.loading = false;
    }
  }
}
