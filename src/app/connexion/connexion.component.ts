import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {

  loginUsername: string = "";
  loginPassword: string = "";
  isAdmin: boolean = false;

  constructor(public userService: UserService, public router: Router) { }

  isLoading: boolean = false;
  errorMessage: string = '';
  async login(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      await this.userService.login(this.loginUsername, this.loginPassword);
      this.checkAdminRole();

      if (this.isAdmin) {
        this.router.navigate(["/espace-admin"]);
      } else {
        this.router.navigate(["/espace-client"]);
      }
    } catch (error: any) {
      console.error('Login error:', error);

      if (error?.status === 0) {
        this.errorMessage = 'Les serveurs ne sont pas disponibles. Veuillez contacter l\'assistance à : help@synocti.ca';
      } else {
        this.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
      }
    } finally {
      this.isLoading = false;
    }
  }

  checkAdminRole() {
    const rolesString = localStorage.getItem('roles');
    if (rolesString) {
      try {
        const roles = JSON.parse(rolesString);
        this.isAdmin = roles.includes('Admin');
      } catch (error) {
        console.error('Error parsing roles:', error);
        this.isAdmin = false;
      }
    }
  }

}
