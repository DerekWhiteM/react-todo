import { AllTasks } from "./routes/all-tasks";
import { createContext, useEffect, useState } from "react";
import { Inbox } from "./routes/inbox";
import { Index } from "./routes/index";
import { Layout } from "./components/Layout";
import { Route, Routes } from "react-router-dom";
import { Task, TaskUpdate } from "./model/task";
import { TaskList, TaskListUpdate } from "./model/task-list";
import { TaskManager } from "./model/task-manager";
import { useScreenDimensions } from "./hooks/use-screen-dimensions";
import { ViewTaskList } from "./routes/view-task-list";

export const AppContext = createContext({
    tasks: [] as Task[],
    taskLists: [] as TaskList[],
    createTask: (() => {}) as (title: string, taskListId: number | null) => void,
    updateTask: (() => {}) as (taskId: number, fields: TaskUpdate) => void,
    createTaskList: (() => {}) as (title: string) => void,
    updateTaskList: (() => {}) as (taskId: number, fields: TaskListUpdate) => void,
    isSidebarOpen: true,
    toggleSidebar: () => {},
});

function App() {
    const [tasks, setTasks] = useState([] as Task[]);
    const [taskLists, setTaskLists] = useState([] as TaskList[]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const screenDimensions = useScreenDimensions();

    function createTask(title: string, taskListId: number | null) {
        TaskManager.createTask(title, taskListId, "", null, "none");
        setTasks([...TaskManager.getTasks()]);
    }

    function updateTask(taskId: number, fields: TaskUpdate) {
        TaskManager.updateTask(taskId, fields);
        setTasks([...TaskManager.getTasks()]);
    }

    function createTaskList(title: string) {
        TaskManager.createTaskList(title);
        setTaskLists([...TaskManager.getTaskLists()]);
    }

    function updateTaskList(taskListId: number, fields: TaskListUpdate) {
        TaskManager.updateTaskList(taskListId, fields);
        setTaskLists([...TaskManager.getTaskLists()]);
    }

    function toggleSidebar() {
        setIsSidebarOpen(!isSidebarOpen);
    }

    useEffect(() => {
        setIsSidebarOpen(window.innerWidth >= 768);
        TaskManager.load();
        setTasks(TaskManager.getTasks());
        setTaskLists(TaskManager.getTaskLists());
    }, []);

    useEffect(() => {
        setIsSidebarOpen(screenDimensions.width >= 768);
    }, [screenDimensions]);

    return (
        <AppContext.Provider
            value={{
                tasks,
                taskLists,
                createTask,
                updateTask,
                createTaskList,
                updateTaskList,
                isSidebarOpen,
                toggleSidebar,
            }}
        >
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Index />} />
                    <Route path="/all-tasks" element={<AllTasks />} />
                    <Route path="/inbox" element={<Inbox />} />
                    <Route path="/list/:taskListId/task?/:taskId?" element={<ViewTaskList />} />
                </Route>
            </Routes>
        </AppContext.Provider>
    );
}

export default App;
