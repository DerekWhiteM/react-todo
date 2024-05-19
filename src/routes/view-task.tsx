import { Task } from "../model/task";

export const ViewTask = ({ task }: { task: Task }) => {
    return (
        <div className="border-l border-solid border-gray-200 p-4 w-[38.2rem]">
            <h2>{task.title}</h2>
        </div>
    );
};
