import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-liste-client',
  imports: [CommonModule, FormsModule],
  templateUrl: './liste-client.component.html',
  styleUrl: './liste-client.component.css'
})
export class ListeClientComponent {

  allUsers: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';

  constructor(public userService: UserService, public router: Router) { }

  ngOnInit() {
    this.fetchAllUsers();
  }

  fetchAllUsers() {
    this.userService.getAllUser().then(users => {
      this.allUsers = users;
      this.filteredUsers = users;
    }).catch(error => {
      console.error('Failed to fetch users:', error);
    });
  }

  searchUsers() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.allUsers.filter(u =>
      u.userName.toLowerCase().includes(term)
    );
  }
}
