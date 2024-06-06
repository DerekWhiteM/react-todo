import { AppContext } from "../App";
import { Checkbox } from "../components/ui/checkbox";
import { CreateTask } from "../components/CreateTask";
import { ChangeEvent, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useScreenDimensions } from "../hooks/use-screen-dimensions";
import { ViewTask } from "./view-task";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "../components/ui/context-menu";
import { CheckedState } from "@radix-ui/react-checkbox";
import { TaskManager } from "../model/task-manager";

export const ViewTaskList = () => {
    const { taskListId, taskId } = useParams();
    const { tasks, taskLists, deleteTask, updateTaskList, updateTask } = useContext(AppContext);
    const taskList = taskLists.find(l => l.id === Number(taskListId)) || null;
    const listTasks = tasks.filter(e => e.taskListId === Number(taskListId) && !e.isComplete);
    listTasks.sort(TaskManager.sortByDueDate);
    const task = listTasks.find(e => e.id === Number(taskId)) || null;
    const navigate = useNavigate();
    const { width } = useScreenDimensions();
    const hideList = (task && width < 768) || !taskList;

    function onNameChange(e: ChangeEvent<HTMLInputElement>) {
        updateTaskList(Number(taskListId), { title: e.target.value });
    }

    function onCheckedChange(taskId: number, checked: CheckedState) {
        if (checked === "indeterminate") return;
        updateTask(taskId, { isComplete: checked });
    }

    const listItems = (() => {
        const items: JSX.Element[] = [];
        for (const task of listTasks) {
            if (task.isComplete) continue;
            items.push(
                <li key={task.id} className="flex gap-2 cursor-pointer">
                    <Checkbox className="mt-[.75rem]" checked={task.isComplete} onCheckedChange={(checked: CheckedState) => onCheckedChange(task.id, checked)} />
                    <ContextMenu>
                        <ContextMenuTrigger className="w-full border-b border-solid border-gray-200">
                            <div
                                className="flex space-between w-full pb-2 hover:bg-gray-100 rounded-sm px-1 pt-2"
                                onClick={() => navigate(`/list/${taskListId}/task/${task.id}`)}
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
                    <input
                        className="pt-1 font-semibold text-xl text-gray-700 mb-4 outline-none w-full"
                        name="title"
                        onChange={onNameChange}
                        value={taskList.title}
                    />
                    <CreateTask taskList={taskList} />
                    <ul className="mt-4">{listItems}</ul>
                </div>
            )}
            {task && <ViewTask task={task} onClose={() => navigate(`/list/${taskListId}`)} />}
        </div>
    );
};
