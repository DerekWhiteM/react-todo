import { AppContext } from "../App";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { CalendarIcon, X } from "lucide-react";
import { ChangeEvent, FocusEvent, useContext } from "react";
import { Checkbox } from "../components/ui/checkbox";
import { cn } from "../lib/utils";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { SelectSingleEventHandler } from "react-day-picker";
import { Task } from "../model/task";

export const ViewTask = ({ task, onClose }: { task: Task; onClose: () => void }) => {
    const { updateTask } = useContext(AppContext);

    function onNameChange(e: ChangeEvent<HTMLInputElement>) {
        updateTask(task.id, { title: e.target.value });
    }

    function onDescriptionChange(e: FocusEvent<HTMLTextAreaElement>) {
        updateTask(task.id, { description: e.target.value });
    }

    function onDateSelect(value: Date) {
        updateTask(task.id, { dueDate: value.getTime() });
    }

    return (
        <div className="border-l border-solid border-gray-200 w-[38.2rem] flex flex-col text-gray-700">
            <div className="pt-4 px-4 pb-2 border-b border-solid border-gray-200 flex items-center">
                <div className="pr-4 mr-2 border-r border-solid border-gray-200 flex">
                    <Checkbox />
                </div>
                <DatePicker date={task.dueDate} onSelect={onDateSelect} />
                <div className="ml-auto border-l border-solid border-gray-200 pl-2">
                    <button
                        className="p-1 text-gray-500 hover:bg-gray-100 rounded-sm"
                        onClick={onClose}
                    >
                        <X />
                    </button>
                </div>
            </div>
            <div className="p-4">
                <input
                    className="w-full font-semibold text-lg outline-none mb-2"
                    value={task.title}
                    name="title"
                    onChange={onNameChange}
                />
                <textarea
                    className="w-full h-full resize-none outline-none"
                    value={task.description}
                    name="description"
                    onChange={onDescriptionChange}
                />
            </div>
        </div>
    );
};

export function DatePicker({
    date,
    onSelect,
}: {
    date: number | null;
    onSelect: (value: Date) => void;
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"ghost"}
                    className={cn(
                        "justify-start text-left font-normal p-2",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Due Date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={date ? new Date(date) : undefined}
                    onSelect={onSelect as SelectSingleEventHandler}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}
