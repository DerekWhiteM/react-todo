import { AppContext } from "../App";
import { TaskList } from "../components/TaskList";
import { TaskManager } from "../model/task-manager";
import { useContext } from "react";
import { useParams } from "react-router-dom";

export const ViewTaskList = () => {
    const { taskListId, taskId } = useParams();
    const { tasks, taskLists } = useContext(AppContext);
    const taskList = taskLists.find(l => l.id === Number(taskListId)) || null;
    const listTasks = tasks.filter(e => e.taskListId === Number(taskListId) && !e.isComplete);
    listTasks.sort(TaskManager.sortByDueDate);
    return (
        <TaskList
            path={`/list/${taskListId}`}
            taskId={taskId ? parseInt(taskId) : null}
            taskListId={taskList?.id}
            tasks={listTasks}
        />
    );
};
