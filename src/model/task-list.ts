export class TaskList {
    id: number;
    title: string;

    constructor(id: number, title: string) {
        this.id = id;
        this.title = title;
    }
}

export type TaskListUpdate = {
    title: string;
};
