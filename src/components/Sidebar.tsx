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

export const Sidebar = () => {
    const { theme, toggleTheme, isSidebarOpen, toggleSidebar, taskLists, deleteTaskList } = useContext(AppContext);
    const nav = useNavigate();
    function navigate(path: string) {
        nav(path);
        if (window.innerWidth < 768) {
            toggleSidebar();
        }
    }
    return (
        <>
            {isSidebarOpen && (
                <div className="h-full w-full border-solid border-gray-200 border-r text-center fixed md:static md:block md:w-[23.6rem] text-gray-700 text-[.95rem] bg-white">
                    <div className="flex flex-col justify-between h-full w-full">
                        <button
                            className="md:hidden hover:bg-gray-100 w-full flex justify-center p-2 rounded-sm border-b border-gray-200"
                            onClick={toggleSidebar}
                        >
                            <ChevronsRight />
                        </button>
                        <div className="p-4">
                            <div className="pb-4 border-b border-gray-200 border-solid">
                                <button
                                    className="flex items-center w-full p-2 gap-2 rounded-sm hover:bg-gray-100 cursor-pointer"
                                    onClick={() => navigate("/all-tasks")}
                                >
                                    <Archive size={18} />
                                    <p>All Tasks</p>
                                </button>
                                <button
                                    className="flex items-center w-full p-2 gap-2 rounded-sm hover:bg-gray-100 cursor-pointer"
                                    onClick={() => navigate("/inbox")}
                                >
                                    <Inbox size={18} />
                                    <p>Inbox</p>
                                </button>
                            </div>
                            <div className="py-4 text-left">
                                <div className="flex items-center px-2 mb-4 justify-between">
                                    <p className="text-[.95rem]">Lists</p>
                                    <CreateTaskList />
                                </div>
                                <ul>
                                    {taskLists.map(list => (
                                        <li key={list.title}>
                                            <ContextMenu>
                                                <ContextMenuTrigger>
                                                    <button
                                                        className="flex gap-2 items-center hover:bg-gray-100 p-2 rounded-sm w-full text-left text-[.95rem]"
                                                        onClick={() => navigate(`/list/${list.id}`)}
                                                    >
                                                        <List size={18} />
                                                        <p>{list.title}</p>
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
                            <div className="py-4 border-t border-solid border-gray-200">
                                <button
                                    className="flex items-center w-full p-2 gap-2 rounded-sm hover:bg-gray-100 cursor-pointer"
                                    onClick={() => navigate("/completed")}
                                >
                                    <SquareCheck size={18} />
                                    <p>Completed</p>
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            {theme === "light" ? <Sun onClick={toggleTheme} /> : <Moon onClick={toggleTheme} />}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
