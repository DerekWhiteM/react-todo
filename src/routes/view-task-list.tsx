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

export const ViewTaskList = () => {
    const { taskListId, taskId } = useParams();
    const { tasks, taskLists, deleteTask, updateTaskList } = useContext(AppContext);
    const taskList = taskLists.find(l => l.id === Number(taskListId)) || null;
    const listTasks = tasks.filter(e => e.taskListId === Number(taskListId));
    const task = listTasks.find(e => e.id === Number(taskId)) || null;
    const navigate = useNavigate();
    const { width } = useScreenDimensions();
    const hideList = (task && width < 768) || !taskList;

    function onNameChange(e: ChangeEvent<HTMLInputElement>) {
        updateTaskList(Number(taskListId), { title: e.target.value });
    }

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
                    <ul className="mt-4">
                        {listTasks.map(task => (
                            <li key={task.id} className="flex items-center gap-2 cursor-pointer">
                                <Checkbox className="mt-[.33rem]" />
                                <ContextMenu>
                                    <ContextMenuTrigger className="w-full border-b border-solid border-gray-200">
                                        <div
                                            className="flex space-between w-full pb-2 hover:bg-gray-100 rounded-sm px-1 pt-2"
                                            onClick={() =>
                                                navigate(`/list/${taskListId}/task/${task.id}`)
                                            }
                                        >
                                            <p className="w-full">{task.title}</p>
                                            <p className="text-nowrap">
                                                {task.dueDate
                                                    ? new Date(task.dueDate).toDateString()
                                                    : ""}
                                            </p>
                                        </div>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent>
                                        <ContextMenuItem onClick={() => deleteTask(task.id)}>Delete</ContextMenuItem>
                                    </ContextMenuContent>
                                </ContextMenu>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {task && <ViewTask task={task} onClose={() => navigate(`/list/${taskListId}`)} />}
        </div>
    );
};
