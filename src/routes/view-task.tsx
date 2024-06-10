import { AppContext } from "../App";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { CalendarIcon, Check, ChevronsUpDown, X } from "lucide-react";
import { ChangeEvent, FocusEvent, useContext, useState } from "react";
import { Checkbox } from "../components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { cn } from "../lib/utils";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { SelectSingleEventHandler } from "react-day-picker";
import { Task } from "../model/task";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "../components/ui/command";

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

    function onCheckedChange(taskId: number, checked: CheckedState) {
        if (checked === "indeterminate") return;
        updateTask(taskId, { isComplete: checked });
    }

    return (
        <div className="border-l border-solid border-border w-[38.2rem] flex flex-col">
            <div className="pt-4 px-4 pb-2 border-b border-solid border-border flex items-center">
                <div className="pr-4 mr-2 border-r border-solid border-border flex">
                    <Checkbox checked={task.isComplete} onCheckedChange={(checked: CheckedState) => onCheckedChange(task.id, checked)} />
                </div>
                <DatePicker date={task.dueDate} onSelect={onDateSelect} />
                <div className="ml-auto border-l border-solid border-border pl-2">
                    <button
                        className="p-1 hover:bg-muted rounded-sm"
                        onClick={onClose}
                    >
                        <X />
                    </button>
                </div>
            </div>
            <div className="p-4 flex flex-col grow">
                <input
                    className="w-full font-semibold text-lg outline-none mb-2 bg-background"
                    value={task.title}
                    name="title"
                    onChange={onNameChange}
                />
                <textarea
                    className="w-full resize-none outline-none bg-background grow"
                    value={task.description}
                    name="description"
                    onChange={onDescriptionChange}
                />
            </div>
            <div className="w-full flex justify-center p-4">
                <ListSelector taskId={task.id} taskListId={task.taskListId} />
            </div>
        </div>
    );
};

function DatePicker({ date, onSelect }: { date: number | null; onSelect: (value: Date) => void }) {
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
            <PopoverContent className="w-auto p-0 border-solid border-border">
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

function ListSelector({ taskId, taskListId }: { taskId: number; taskListId: number | null }) {
    const [open, setOpen] = useState(false);
    const { taskLists, updateTask } = useContext(AppContext);

    function onSelect(currentValue: string) {
        const currentValueInt = parseInt(currentValue);
        updateTask(taskId, { taskListId: currentValueInt });
    }

    const options = taskLists.map(taskList => ({
        value: taskList.id,
        label: taskList.title,
    }));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {taskListId
                        ? options.find(option => option.value === taskListId)?.label
                        : "Select list..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0 border-solid border-border">
                <Command>
                    <CommandInput placeholder="Search list..." />
                    <CommandEmpty>No list found.</CommandEmpty>
                    <CommandGroup>
                        {options.map(option => (
                            <CommandItem
                                key={option.value}
                                value={option.value + ""}
                                onSelect={onSelect}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        taskListId === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
