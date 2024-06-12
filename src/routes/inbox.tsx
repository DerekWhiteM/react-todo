import { AppContext } from "../App";
import { TaskList } from "../components/TaskList";
import { TaskManager } from "../model/task-manager";
import { useContext } from "react";
import { useParams } from "react-router-dom";

export const Inbox = () => {
    const { taskId } = useParams();
    const { tasks } = useContext(AppContext);
    const unassignedTasks = tasks.filter(task => !task.taskListId);
    unassignedTasks.sort(TaskManager.sortByDueDate);
    return (
        <TaskList
            path={"/inbox"}
            taskId={taskId ? parseInt(taskId) : null}
            tasks={unassignedTasks}
            title={"Inbox"}
        />
    );
};
