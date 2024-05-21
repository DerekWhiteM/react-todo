import { Recurrence, Task, TaskUpdate } from "./task";
import { TaskList, TaskListUpdate } from "./task-list";

export const TaskManager = (() => {
    let tasks: Task[] = [];
    let taskLists: TaskList[] = [];

    function load() {
        tasks = JSON.parse(localStorage.getItem("tasks") || "[]") as Task[];
        taskLists = JSON.parse(localStorage.getItem("taskLists") || "[]") as TaskList[];
    }

    function save() {
        localStorage.setItem("tasks", JSON.stringify(tasks));
        localStorage.setItem("taskLists", JSON.stringify(taskLists));
    }

    function getTasks() {
        return tasks;
    }

    function getTaskLists() {
        return taskLists;
    }

    function createTaskList(title: string) {
        const id = taskLists.length > 0 ? taskLists[taskLists.length - 1].id + 1 : 1;
        const taskList = new TaskList(id, title);
        taskLists.push(taskList);
        save();
        return taskList;
    }

    function updateTaskList(taskListId: number, fields: TaskListUpdate) {
        const taskList = taskLists.find(e => e.id === taskListId);
        if (!taskList) {
            throw "Invalid taskListId";
        }
        Object.assign(taskList, fields);
        save();
    }

    function createTask(
        title: string,
        taskListId: number | null,
        description: string,
        dueDate: number | null,
        recurrence: Recurrence,
    ) {
        if (taskListId !== null) {
            const taskList = taskLists.find(e => e.id === taskListId);
            if (!taskList) throw "Invalid list id";
        }
        const id = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
        const task = new Task(id, taskListId, title, description, dueDate, recurrence, false);
        tasks.push(task);
        save();
        return task;
    }

    function updateTask(taskId: number, fields: TaskUpdate) {
        const task = tasks.find(e => e.id === taskId);
        if (!task) {
            throw "Invalid taskId";
        }
        Object.assign(task, fields);
        save();
    }

    return {
        getTasks,
        getTaskLists,
        createTaskList,
        updateTaskList,
        createTask,
        updateTask,
        load,
    };
})();
