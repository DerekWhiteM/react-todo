import { AppContext } from "../App";
import { ChevronsLeft } from "lucide-react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { useContext } from "react";

export const Layout = () => {
    const { toggleSidebar } = useContext(AppContext);
    return (
        <div className="flex h-full bg-background">
            <Sidebar />
            <div className="w-full h-full flex flex-col md:flex-row">
                <button
                    className="md:hidden hover:bg-muted w-full flex justify-center p-2 rounded-sm border-b border-border"
                    onClick={toggleSidebar}
                >
                    <ChevronsLeft />
                </button>
                <Outlet />
            </div>
        </div>
    );
};
