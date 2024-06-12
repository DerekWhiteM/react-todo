import { AppContext } from "../App";
import { ChangeEvent, useContext } from "react";
import { Checkbox } from "./ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { CreateTask } from "./CreateTask";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { Task } from "../model/task";
import { useNavigate } from "react-router-dom";
import { useScreenDimensions } from "../hooks/use-screen-dimensions";
import { ViewTask } from "../routes/view-task";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "./ui/context-menu";

export const TaskList = ({
    path,
    taskId,
    taskListId,
    tasks,
    title,
}: {
    path: string;
    taskId: number | null;
    taskListId?: number;
    tasks: Task[];
    title?: string;
}) => {
    const { taskLists, updateTask, deleteTask, updateTaskList } = useContext(AppContext);
    const { width } = useScreenDimensions();
    const taskList = taskLists.find(l => l.id === Number(taskListId)) || null;
    const task = tasks.find(e => e.id === Number(taskId)) || null;
    const hideList = task && width < 768;
    const navigate = useNavigate();

    function onNameChange(e: ChangeEvent<HTMLInputElement>) {
        updateTaskList(Number(taskListId), { title: e.target.value });
    }

    function onCheckedChange(taskId: number, checked: CheckedState) {
        if (checked === "indeterminate") return;
        updateTask(taskId, { isComplete: checked });
    }

    const listItems = tasks.map(task => (
        <li key={task.id} className="flex gap-2 cursor-pointer hover:bg-muted px-3 rounded-sm">
            <Checkbox
                className="mt-[.75rem]"
                checked={task.isComplete}
                onCheckedChange={(checked: CheckedState) => onCheckedChange(task.id, checked)}
            />
            <ContextMenu>
                <ContextMenuTrigger className="w-full border-b border-solid border-border">
                    <div
                        className="flex space-between w-full pb-2 px-1 pt-2"
                        onClick={() => navigate(`${path}/task/${task.id}`)}
                    >
                        <p className="w-full">{task.title}</p>
                        <p className="text-nowrap">
                            {task.dueDate ? new Date(task.dueDate).toDateString() : ""}
                        </p>
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onClick={() => deleteTask(task.id)}>Delete</ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </li>
    ));

    return (
        <ResizablePanelGroup autoSaveId="persistence" direction="horizontal" className="flex grow">
            {!hideList && (
                <ResizablePanel className="w-full p-4">
                    {taskList ? (
                        <input
                            className="pt-1 font-semibold text-xl mb-4 outline-none w-full bg-background"
                            name="title"
                            onChange={onNameChange}
                            value={taskList.title}
                        />
                    ) : (
                        <h1 className="pt-1 font-semibold text-xl mb-4">{title}</h1>
                    )}
                    {path !== "/completed" && <CreateTask taskList={taskList} />}
                    <ul className="mt-4">{listItems}</ul>
                </ResizablePanel>
            )}
            <ResizableHandle />
            {task && <ViewTask task={task} onClose={() => navigate(path)} />}
        </ResizablePanelGroup>
    );
};
