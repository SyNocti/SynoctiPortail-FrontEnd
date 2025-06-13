export class Ticket {
    id: string | null = null;
    title: string;
    content: string;
    date: Date;
    status: string;
    username: string;
    userId: string;
    pictures: string[];

    constructor(
        id: string | null = null,
        title: string = '',
        content: string = '',
        date: Date = new Date(),
        status: string = '',
        username: string = '',
        userId: string = '',
        pictures: string[] = []
    ) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.date = date;
        this.status = status;
        this.username = username;
        this.userId = userId;
        this.pictures = pictures;
    }
}