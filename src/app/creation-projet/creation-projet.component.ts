import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Project } from '../models/project';
import { ProjectService } from '../services/project.service';
import { UserService } from '../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-creation-projet',
  imports: [FormsModule, CommonModule],
  templateUrl: './creation-projet.component.html',
  styleUrls: ['./creation-projet.component.css']
})
export class CreationProjetComponent implements OnInit {

  @Input() project: Project | null = null;

  @ViewChild("replyProjectFileInput", { static: false }) ReplyPictureInput?: ElementRef;
  @ViewChild('userDropdown') userDropdown?: ElementRef;
  @ViewChild('userInput') userInput?: ElementRef;

  constructor(
    public projectService: ProjectService,
    public userService: UserService
  ) { }

  newTitle: string = "";
  newDescription: string = "";
  projectType: string = 'static-simple'; // Default selection
  projectUrl: string = '';
  selectedUserId: number = 0;
  users: any[] = [];
  filteredUsers: any[] = [];
  userSearchTerm: string = '';
  selectedUser: any = null;
  showUserList: boolean = false;

  // Track if the dropdown was just opened to prevent immediate closing
  private justOpened: boolean = false;

  async ngOnInit() {
    try {
      this.users = await this.userService.getAllUser();
      this.filteredUsers = [...this.users]; // Initialize filtered users with all users
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  filterUsers() {
    if (!this.userSearchTerm.trim()) {
      this.filteredUsers = [...this.users];
    } else {
      const term = this.userSearchTerm.toLowerCase().trim();
      this.filteredUsers = this.users.filter(user =>
        (user.userName && user.userName.toLowerCase().includes(term)) ||
        (user.email && user.email.toLowerCase().includes(term))
      );
    }
    // Always show the list when filtering
    this.showUserList = true;
  }

  toggleUserList(event: Event) {
    // Stop the click event from bubbling up to document
    event.stopPropagation();

    // Toggle the dropdown state
    this.showUserList = !this.showUserList;

    // If opening, refresh the users list
    if (this.showUserList) {
      this.filteredUsers = [...this.users];
    }
  }

  // Host listener to detect clicks outside the dropdown
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // If dropdown is open and click is outside both the input and dropdown
    if (this.showUserList &&
      this.userInput &&
      this.userDropdown &&
      !this.userInput.nativeElement.contains(event.target) &&
      !this.userDropdown.nativeElement.contains(event.target)) {
      this.showUserList = false;
    }
  }

  selectUser(user: any) {
    this.selectedUser = user;
    this.selectedUserId = user.id;
    this.userSearchTerm = user.userName; // Update with correct property name
    this.showUserList = false; // Hide list after selection
  }

  // Add method to handle dropdown option clicks
  selectUserOption(event: Event, user: any) {
    // Stop propagation to prevent document click from firing
    event.stopPropagation();
    this.selectUser(user);
  }

  async createProject() {
    if (this.newTitle == "") {
      alert("Titre du projet vide !");
      return;
    }
    if (this.newDescription == "") {
      alert("Description du projet vide !");
      return;
    }
    if (this.selectedUserId === 0) {
      alert("Veuillez sélectionner un utilisateur !");
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

    formData.append("projectType", this.projectType);
    formData.append("projectUrl", this.projectUrl);
    formData.append("title", this.newTitle);
    formData.append("description", this.newDescription);
    formData.append("userId", this.selectedUserId.toString());

    await this.projectService.postProject(formData);

    this.newTitle = "";
    this.newDescription = "";
    this.projectType = 'static-simple'; // Reset to default selection
    this.projectUrl = '';
    this.selectedUserId = 0;
    if (this.ReplyPictureInput) {
      this.ReplyPictureInput.nativeElement.value = '';
    }
    this.selectedUser = null;
    this.userSearchTerm = '';
    this.filteredUsers = [...this.users];
  }
}
