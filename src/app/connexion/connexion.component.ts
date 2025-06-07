import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {

  loginUsername: string = "";
  loginPassword: string = "";
  isAdmin: boolean = false;

  constructor(public userService: UserService, public router: Router) { }

  async login(): Promise<void> {
    await this.userService.login(this.loginUsername, this.loginPassword);

    this.checkAdminRole();
    if (this.isAdmin) {
      this.router.navigate(["/espace-admin"]);
    } else {
      this.router.navigate(["/espace-client"]);
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
