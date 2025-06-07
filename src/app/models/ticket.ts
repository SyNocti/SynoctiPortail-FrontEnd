export class Ticket {
    constructor(
        public id: number,
        public text: string,
        public pictureIds: number[] = []
    ) { }
}