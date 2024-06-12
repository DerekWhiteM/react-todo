import { AppContext } from "../App";
import { TaskList } from "../components/TaskList";
import { TaskManager } from "../model/task-manager";
import { useContext } from "react";
import { useParams } from "react-router-dom";

export const Completed = () => {
    const { taskId } = useParams();
    const { tasks } = useContext(AppContext);
    const completedTasks = tasks.filter(task => task.isComplete);
    completedTasks.sort(TaskManager.sortByDueDate);
    return (
        <TaskList
            path={"/completed"}
            taskId={taskId ? parseInt(taskId) : null}
            tasks={completedTasks}
            title={"Completed"}
        />
    );
};
