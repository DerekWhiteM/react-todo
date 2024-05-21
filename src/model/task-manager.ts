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

    function deleteTask(taskId: number) {
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].id === taskId) {
                tasks.splice(i, 1);
                save();
                return;
            }
        }
        throw "Invalid taskId";
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

    function deleteTaskList(taskListId: number) {
        // First get the index of the list
        let idx: number | null = null;
        for (let i = 0; i < taskLists.length; i++) {
            if (taskLists[i].id === taskListId) {
                idx = i;
            }
        }
        if (idx == null) {
            throw "Invalid taskListId";
        }
        // Then delete all the tasks
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].taskListId === taskListId) {
                tasks.splice(i, 1);
            }
        }
        // Finally delete the list
        taskLists.splice(idx, 1);
        save();
    }

    return {
        getTasks,
        createTask,
        updateTask,
        deleteTask,
        getTaskLists,
        createTaskList,
        updateTaskList,
        deleteTaskList,
        load,
    };
})();
