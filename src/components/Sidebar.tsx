import { AppContext } from "../App";
import { Archive, ChevronsRight, Inbox, List, Moon, SquareCheck, Sun } from "lucide-react";
import { CreateTaskList } from "./CreateTaskList";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "./ui/context-menu";
import { GoogleDriveIntegration } from "./GoogleDriveIntegration";

export const Sidebar = () => {
    const {
        tasks,
        theme,
        toggleTheme,
        isSidebarOpen,
        toggleSidebar,
        taskLists,
        deleteTaskList,
    } = useContext(AppContext);
    const nav = useNavigate();
    function navigate(path: string) {
        nav(path);
        if (window.innerWidth < 768) {
            toggleSidebar();
        }
    }
    let numAll = 0;
    let numInbox = 0;
    let numCompleted = 0;
    const listTotals: Array<{ taskListId: number; numTasks: number }> = taskLists.map(taskList => ({
        taskListId: taskList.id,
        numTasks: 0,
    }));
    for (const task of tasks) {
        if (task.isComplete) {
            numCompleted++;
            continue;
        } else {
            numAll++;
        }
        if (!task.taskListId) {
            numInbox++;
        } else {
            const lTotal = listTotals.find(listTotal => listTotal.taskListId === task.taskListId);
            if (lTotal) lTotal.numTasks++;
        }
    }
    return (
        <>
            {isSidebarOpen && (
                <div className="h-full w-full border-solid border-border border-r text-center fixed md:static md:block md:w-[23.6rem] text-foreground text-[.95rem] bg-background z-10">
                    <div className="w-full h-full flex flex-col">
                        <button
                            className="md:hidden hover:bg-muted w-full flex justify-center p-2 rounded-sm border-b border-border"
                            onClick={toggleSidebar}
                        >
                            <ChevronsRight />
                        </button>
                        <div className="p-4 h-full flex flex-col justify-between">
                            <div>
                                <div className="pb-4 border-b border-border border-solid">
                                    <button
                                        className="flex items-center w-full p-2 gap-2 rounded-sm hover:bg-muted cursor-pointer"
                                        onClick={() => navigate("/all-tasks")}
                                    >
                                        <Archive size={18} />
                                        <div className="w-full flex justify-between">
                                            <p>All Tasks</p>
                                            <p className="text-muted-foreground">{numAll || ""}</p>
                                        </div>
                                    </button>
                                    <button
                                        className="flex items-center w-full p-2 gap-2 rounded-sm hover:bg-muted cursor-pointer"
                                        onClick={() => navigate("/inbox")}
                                    >
                                        <Inbox size={18} />
                                        <div className="w-full flex justify-between">
                                            <p>Inbox</p>
                                            <p className="text-muted-foreground">
                                                {numInbox || ""}
                                            </p>
                                        </div>
                                    </button>
                                </div>
                                <div className="py-4 text-left">
                                    <div className="flex items-center pl-2 mb-4 justify-between">
                                        <p className="text-[.95rem]">Lists</p>
                                        <CreateTaskList />
                                    </div>
                                    <ul>
                                        {taskLists.map(list => (
                                            <li key={list.title}>
                                                <ContextMenu>
                                                    <ContextMenuTrigger>
                                                        <button
                                                            className="flex gap-2 items-center hover:bg-muted p-2 rounded-sm w-full text-left text-[.95rem]"
                                                            onClick={() =>
                                                                navigate(`/list/${list.id}`)
                                                            }
                                                        >
                                                            <List size={18} />
                                                            <div className="w-full flex justify-between">
                                                                <p>{list.title}</p>
                                                                <p className="text-muted-foreground">
                                                                    {listTotals.find(
                                                                        listTotal =>
                                                                            listTotal.taskListId ===
                                                                            list.id
                                                                    )?.numTasks || ""}
                                                                </p>
                                                            </div>
                                                        </button>
                                                    </ContextMenuTrigger>
                                                    <ContextMenuContent>
                                                        <ContextMenuItem
                                                            onClick={() => deleteTaskList(list.id)}
                                                        >
                                                            Delete
                                                        </ContextMenuItem>
                                                    </ContextMenuContent>
                                                </ContextMenu>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="py-4 border-t border-solid border-border">
                                    <button
                                        className="flex items-center w-full p-2 gap-2 rounded-sm hover:bg-muted cursor-pointer"
                                        onClick={() => navigate("/completed")}
                                    >
                                        <SquareCheck size={18} />
                                        <div className="w-full flex justify-between">
                                            <p>Completed</p>
                                            <p className="text-muted-foreground">
                                                {numCompleted || ""}
                                            </p>
                                        </div>
                                    </button>
                                </div>
                                <div className="py-4 border-t border-solid border-border">
                                    <GoogleDriveIntegration />
                                </div>
                            </div>
                            <div>
                                {theme === "light" ? (
                                    <Sun onClick={toggleTheme} className="cursor-pointer" />
                                ) : (
                                    <Moon onClick={toggleTheme} className="cursor-pointer" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
