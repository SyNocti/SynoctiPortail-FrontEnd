import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

export const authGuard = () => {
    const userService = inject(UserService);
    const router = inject(Router);

    // Check if user is logged in (has username in localStorage)
    const isLoggedIn = localStorage.getItem('username') !== null;

    if (isLoggedIn) {
        return true;
    }

    // Redirect to login page
    return router.parseUrl('/connexion');
};