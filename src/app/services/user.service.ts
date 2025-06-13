import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

export const domain = "https://localhost:7257/";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private rolesSignal: WritableSignal<string[]> = signal([]);
    roles: Signal<string[]> = this.rolesSignal.asReadonly();

    // Add this line - creates an observable username source
    private usernameSubject = new BehaviorSubject<string>(localStorage.getItem("username") || '');

    // Public observable that components can subscribe to
    public username$ = this.usernameSubject.asObservable();

    constructor(public http: HttpClient) { }

    // S'inscrire
    async register(username: string, email: string, phonenumber: string, password: string, passwordConfirm: string, role: string = "User"): Promise<void> {

        let registerDTO = {
            username: username,
            email: email,
            phonenumber: phonenumber,
            password: password,
            passwordConfirm: passwordConfirm,
            role: role
        };

        let x = await lastValueFrom(this.http.post<any>(domain + "api/OurCompany/Users/Register", registerDTO));
        console.log(x);
    }

    // Se connecter
    async login(username: string, password: string): Promise<void> {

        let loginDTO = {
            username: username,
            password: password
        };

        let x = await lastValueFrom(this.http.post<any>(domain + "api/OurCompany/Users/Login", loginDTO));
        console.log(x);

        // N'hésitez pas à ajouter d'autres infos dans le stockage local... 
        // Cela pourrait vous aider pour la partie admin / modérateur
        localStorage.setItem("token", x.token);
        localStorage.setItem("username", x.username);

        // Add this line to update the username observable
        this.usernameSubject.next(x.username);

        this.rolesSignal.set(x.roles);
        localStorage.setItem("roles", JSON.stringify(x.roles));
    }

    setRoles(roles: string[]) {
        this.rolesSignal.set(roles);
    }

    async changePassword(oldPassword: string, newPassword: string): Promise<void> {

        const dto = {
            oldPassword: oldPassword,
            newPassword: newPassword
        };

        let x = await lastValueFrom(this.http.put<any>(domain + "api/OurCompany/Users/ChangePassword", dto));
        console.log(x);
        return
    }

    // Also update logout method if you have one
    logout() {
        localStorage.clear();
        this.usernameSubject.next('');
        this.rolesSignal.set([]);
    }

    async getUserById(id: number): Promise<any> {
        let x = await lastValueFrom(this.http.get<any>(domain + "api/OurCompany/Users/" + id));
        console.log(x);
        return x;
    }

    async getAllUser(): Promise<any> {
        let x = await lastValueFrom(this.http.get<any>(domain + "api/OurCompany/Users/getAllUsers"));
        console.log(x);
        return x;
    }
}