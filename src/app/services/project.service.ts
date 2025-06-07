import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Project } from '../models/project';

const domain = "https://localhost:7257/";

@Injectable({
    providedIn: 'root'
})
export class ProjectService {

    constructor(public http: HttpClient) { }

    async postProject(formData: any): Promise<Project> {
        let x = await lastValueFrom(this.http.post<any>(domain + "api/OurCompany/Projects/PostProject", formData));
        console.log(x);
        return x;
    }

    async getAllProjects(): Promise<Project[]> {
        let x = await lastValueFrom(this.http.get<any>(domain + "api/OurCompany/Projects/GetUserProjects"));
        console.log(x);
        return x;
    }

    // Updated to return a single Project object instead of an array
    async getProjectById(id: string): Promise<Project> {
        let x = await lastValueFrom(this.http.get<Project>(domain + "api/OurCompany/Projects/GetUserProjectById/" + id));
        console.log(x);
        return x;
    }
}