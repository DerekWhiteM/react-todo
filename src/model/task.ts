export type Recurrence = "none" | "daily" | "weekly" | "monthly" | "yearly"; 

export class Task {
    id: number;
    taskListId: number | null;
    title: string;
    description: string;
    dueDate: Date | null;
    recurrence: Recurrence;
    isComplete: boolean;

    constructor(
        id: number,
        taskListId: number | null,
        title: string,
        description: string,
        dueDate: Date | null,
        recurrence: Recurrence,
        isComplete: boolean,
    ) {
        this.id = id;
        this.taskListId = taskListId;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.recurrence = recurrence;
        this.isComplete = isComplete;
    }
}

export type TaskUpdate = {
    taskListId?: number | null;
    title?: string;
    description?: string;
    dueDate?: Date | null;
    recurrence?: Recurrence;
    isComplete?: boolean;
}