import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from './services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular_portal';
  username: string = "";
  currentYear: number = new Date().getFullYear();
  private subscription: Subscription = new Subscription();

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    // Subscribe to username changes
    this.subscription = this.userService.username$.subscribe(username => {
      this.username = username;
    });
  }

  ngOnDestroy() {
    // Clean up subscription when component is destroyed
    this.subscription.unsubscribe();
  }

  logout() {
    this.userService.logout(); // Use the service method instead
    this.router.navigate(["/connexion"]);
  }
}
