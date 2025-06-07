export class Project {
    id: string | null = null;
    title: string;
    type: string;
    description: string;
    siteUrl: string;
    nbVisite: number;
    date: Date;
    username: string[];
    userId: string[];
    pictures: string[];

    constructor(
        id: string | null = null,
        title: string = '',
        type: string = '',
        description: string = '',
        siteUrl: string = '',
        nbVisite: number = 0,
        date: Date = new Date(),
        username: string[] = [],
        userId: string[] = [],
        pictures: string[] = []
    ) {
        this.id = id;
        this.title = title;
        this.type = type;
        this.description = description;
        this.siteUrl = siteUrl;
        this.nbVisite = nbVisite;
        this.date = date;
        this.username = username;
        this.userId = userId;
        this.pictures = pictures;
    }
}
