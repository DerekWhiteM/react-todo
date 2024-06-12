import { AppContext } from "../App";
import { TaskManager } from "../model/task-manager";
import { useContext } from "react";
import { TaskList } from "../components/TaskList";
import { useParams } from "react-router-dom";

export const AllTasks = () => {
    const { taskId } = useParams();
    const { tasks } = useContext(AppContext);
    const incompleteTasks = tasks.filter(task => !task.isComplete);
    incompleteTasks.sort(TaskManager.sortByDueDate);
    return (
        <TaskList
            path={"/all-tasks"}
            taskId={taskId ? parseInt(taskId) : null}
            tasks={incompleteTasks}
            title={"All Tasks"}
        />
    );
};
