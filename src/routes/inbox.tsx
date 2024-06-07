import { AppContext } from "../App";
import { Checkbox } from "../components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { CreateTask } from "../components/CreateTask";
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

export const Inbox = () => {
    const { taskId } = useParams();
    const { tasks, deleteTask, updateTask } = useContext(AppContext);
    const unassignedTasks = tasks.filter(task => !task.taskListId);
    unassignedTasks.sort(TaskManager.sortByDueDate);
    const task = unassignedTasks.find(task => task.id === Number(taskId)) || null;
    const navigate = useNavigate();
    const { width } = useScreenDimensions();
    const hideList = task && width < 768;

    function onCheckedChange(taskId: number, checked: CheckedState) {
        if (checked === "indeterminate") return;
        updateTask(taskId, { isComplete: checked });
    }

    const listItems = (() => {
        const items: JSX.Element[] = [];
        for (const task of unassignedTasks) {
            if (task.isComplete) continue;
            items.push(
                <li key={task.id} className="flex gap-2 cursor-pointer">
                    <Checkbox
                        className="mt-[.75rem]"
                        checked={task.isComplete}
                        onCheckedChange={(checked: CheckedState) =>
                            onCheckedChange(task.id, checked)
                        }
                    />
                    <ContextMenu>
                        <ContextMenuTrigger className="w-full border-b border-solid border-border">
                            <div
                                className="flex space-between w-full pb-2 hover:bg-muted rounded-sm px-1 pt-2"
                                onClick={() => navigate(`/inbox/task/${task.id}`)}
                            >
                                <p className="w-full">{task.title}</p>
                                <p className="text-nowrap">
                                    {task.dueDate ? new Date(task.dueDate).toDateString() : ""}
                                </p>
                            </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent>
                            <ContextMenuItem onClick={() => deleteTask(task.id)}>
                                Delete
                            </ContextMenuItem>
                        </ContextMenuContent>
                    </ContextMenu>
                </li>
            );
        }
        return items;
    })();

    return (
        <div className="flex h-full">
            {!hideList && (
                <div className="w-full p-4">
                    <h1 className="pt-1 font-semibold text-xl mb-4">Inbox</h1>
                    <CreateTask taskList={null} />
                    <ul className="mt-4">{listItems}</ul>
                </div>
            )}
            {task && <ViewTask task={task} onClose={() => navigate(`/inbox`)} />}
        </div>
    );
};
