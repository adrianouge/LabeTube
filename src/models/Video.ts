export class Video {

    constructor(
        public id: string,
        public title: string,
        public duration: string) { }

    public getId() {
        return this.id
    }

    public getTitle() {
        return this.title
    }

    public getDuration() {
        return this.duration
    }

    public setId(newId: string) {
        this.id = newId
    }

    public setTitle(newTitle: string) {
        this.title = newTitle
    }

    public setDuration(newDuration: string) {
        this.duration = newDuration
    }

}