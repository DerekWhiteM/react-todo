import { AppContext } from "../App";
import { Checkbox } from "../components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { TaskManager } from "../model/task-manager";
import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useScreenDimensions } from "../hooks/use-screen-dimensions";
import { ViewTask } from "./view-task";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "../components/ui/context-menu";

export const AllTasks = () => {
    const { taskId } = useParams();
    const { tasks, updateTask, deleteTask } = useContext(AppContext);
    const incompleteTasks = tasks.filter(task => !task.isComplete);
    incompleteTasks.sort(TaskManager.sortByDueDate);
    const navigate = useNavigate();
    const { width } = useScreenDimensions();
    const task = incompleteTasks.find(e => e.id === Number(taskId)) || null;
    const hideList = task && width < 768;

    function onCheckedChange(taskId: number, checked: CheckedState) {
        if (checked === "indeterminate") return;
        updateTask(taskId, { isComplete: checked });
    }

    const listItems = incompleteTasks.map(task => (
        <li key={task.id} className="flex gap-2 cursor-pointer">
            <Checkbox
                className="mt-[.75rem]"
                checked={task.isComplete}
                onCheckedChange={(checked: CheckedState) => onCheckedChange(task.id, checked)}
            />
            <ContextMenu>
                <ContextMenuTrigger className="w-full border-b border-solid border-border">
                    <div
                        className="flex space-between w-full pb-2 hover:bg-muted rounded-sm px-1 pt-2"
                        onClick={() => navigate(`/all-tasks/task/${task.id}`)}
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
        <div className="flex grow">
            {!hideList && (
                <div className="w-full p-4">
                    <h1 className="pt-1 font-semibold text-xl mb-4">All Tasks</h1>
                    <ul className="mt-4">{listItems}</ul>
                </div>
            )}
            {task && <ViewTask task={task} onClose={() => navigate(`/all-tasks`)} />}
        </div>
    );
};
