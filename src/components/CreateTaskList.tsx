import { AppContext } from "../App";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Plus } from "lucide-react";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
    name: z.string(),
});

export function CreateTaskList() {
    const FORM_ID = "addTask";
    const { createTaskList } = useContext(AppContext);
    const [open, setOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        createTaskList(values.name);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button
                    className="flex items-center text-sm border border-gray-200 p-1 gap-1 hover:bg-gray-100"
                    onClick={() => setOpen(true)}
                >
                    <Plus size={16} />
                    <p>New List</p>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add List</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form id={FORM_ID} onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="float-right">Add</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
