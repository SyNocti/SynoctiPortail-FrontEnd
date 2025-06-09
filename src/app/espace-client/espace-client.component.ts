import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketComponent } from '../ticket/ticket.component';
import { Ticket } from '../models/ticket';
import { Project } from '../models/project';
import { ProjectService } from '../services/project.service';
import { ListeProjetComponent } from "../liste-projet/liste-projet.component";
import { FacturationComponent } from "../facturation/facturation.component";
import { Facture } from '../models/facture';

@Component({
  selector: 'app-espace-client',
  standalone: true,
  imports: [CommonModule, FormsModule, TicketComponent, ListeProjetComponent, FacturationComponent],
  templateUrl: './espace-client.component.html',
  styleUrl: './espace-client.component.css'
})
export class EspaceClientComponent implements OnInit {
  @ViewChild('projectDropdown') projectDropdown?: ElementRef;
  @ViewChild('projectInput') projectInput?: ElementRef;

  ticket: Ticket | null = null;
  facture: Facture | null = null;
  project: Project | null = null;
  // Change the default activeView to 'projet'
  activeView: string = 'project';

  // Project selection properties
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  projectSearchTerm: string = '';
  selectedProject: Project | null = null;
  selectedProjectId: string = '';
  showProjectList: boolean = false;

  constructor(
    public userService: UserService,
    public router: Router,
    private projectService: ProjectService
  ) { }

  async ngOnInit() {
    try {
      // Fetch projects
      this.projects = await this.projectService.getAllProjects();
      this.filteredProjects = [...this.projects];

      // Select the last project by default if projects exist
      if (this.projects.length > 0) {
        const lastProject = this.projects[this.projects.length - 1];
        this.selectDefaultProject(lastProject);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      this.projects = [];
      this.filteredProjects = [];
    }
  }

  // Method to select default project
  selectDefaultProject(project: Project) {
    this.selectedProject = project;
    this.selectedProjectId = project.id || '';
    this.projectSearchTerm = project.title || '';
    console.log(`Default project selected: ${project.title} with ID: ${project.id}`);
  }

  setActiveView(view: string): void {
    this.activeView = view;
  }

  // Project dropdown filtering
  filterProjects() {
    if (!this.projectSearchTerm || !this.projectSearchTerm.trim()) {
      this.filteredProjects = [...this.projects];
    } else {
      const term = this.projectSearchTerm.toLowerCase().trim();
      this.filteredProjects = this.projects.filter(project =>
        project.title && project.title.toLowerCase().includes(term)
      );
    }
    // Always show the list when filtering
    this.showProjectList = true;
  }

  // Toggle project dropdown
  toggleProjectList(event: Event) {
    if (event) {
      event.stopPropagation();
    }

    this.showProjectList = !this.showProjectList;

    if (this.showProjectList) {
      this.filteredProjects = [...this.projects];
    }
  }

  // Select a project
  selectProjectOption(event: Event, project: Project) {
    if (event) {
      event.stopPropagation();
    }

    if (project) {
      this.selectedProject = project;
      this.selectedProjectId = project.id || '';
      this.projectSearchTerm = project.title || '';
      this.showProjectList = false;

      console.log(`Selected project: ${project.title} with ID: ${project.id}`);
    }
  }

  // Host listener to detect clicks outside the dropdown
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.showProjectList &&
      this.projectInput &&
      this.projectDropdown &&
      !this.projectInput.nativeElement.contains(event.target) &&
      !this.projectDropdown.nativeElement.contains(event.target)) {
      this.showProjectList = false;
    }
  }
}
