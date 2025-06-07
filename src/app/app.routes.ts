import { Routes } from '@angular/router';
import { ConnexionComponent } from './connexion/connexion.component';
import { EspaceClientComponent } from './espace-client/espace-client.component';
import { authGuard } from './guards/auth.guard';
import { EspaceAdminComponent } from './espace-admin/espace-admin.component';

export const routes: Routes = [
    { path: 'connexion', component: ConnexionComponent },
    {
        path: 'espace-client',
        component: EspaceClientComponent,
        canActivate: [authGuard]
    },
    {
        path: 'espace-admin',
        component: EspaceAdminComponent,
        canActivate: [() => {
            const rolesString = localStorage.getItem('roles');
            if (rolesString) {
                try {
                    const roles = JSON.parse(rolesString);
                    return Array.isArray(roles) && roles.includes('Admin');
                } catch (error) {
                    console.error('Error parsing roles:', error);
                    return false;
                }
            }
            return false;
        }]
    },
    { path: '', redirectTo: '/connexion', pathMatch: 'full' },
    { path: '**', redirectTo: '/connexion' }
];
