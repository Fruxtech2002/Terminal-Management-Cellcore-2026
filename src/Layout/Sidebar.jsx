import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const Sidebar = () => {
    const [activePage, setactivePage] = useState("");
    const {pathname} = useLocation();
    const page = pathname.split('/')[1]
    console.log()

    useEffect(()=>{
        if (page === 'overview') {
            setactivePage("overview")
        }
        if (page === 'activedevices' || page === 'selecteddevice') {
            setactivePage("activedevice")
        }
    },[])

  return (
    <div className="fixed bg-slate-800 w-[180px] p-3 top-0 left-0 bottom-0 overflow-hidden before:content-[''] before:absolute before:inset-0 before:-z-10 before:bg-[url('public/Cellcore-Logo.png')] before:bg-no-repeat before:bg-center before:bg-contain before:opacity-20 before:pointer-events-none">
      <p className="text-green-500 font-semibold text-[15px]">Cellcore</p>
      <NavLink to={'/'} className="text-white text-gray-300 font-bold text-[16px]">Terminal Monitor</NavLink>
      <div className="flex flex-col gap-1 mt-4">
     <NavLink
        to="/overview"
        className={({ isActive }) =>
            `flex items-center gap-2 p-1 rounded text-slate-100 ${
            isActive ? "bg-green-800 font-semibold" : "hover:bg-gray-600"
            }`
        }
        >
      
            {
                <>
                <span className={`h-2 w-2 text-gray-300 rounded-full ${activePage === 'overview' ? "bg-green-300  animate-pulse" : "bg-gray-500"}`}></span>
                Overview
                </>
            }
      </NavLink>

     <NavLink
        to="/activedevices"
        className={({ isActive }) =>
            `flex items-center gap-2 p-1 rounded text-slate-100 ${
            isActive ? "bg-green-800 font-semibold" : "hover:bg-gray-600"
            }`
        }
        >
            {
                <>
                <span className={`h-2 w-2 rounded-full ${activePage === 'activedevice' ? "bg-green-300  animate-pulse" : "bg-gray-500"}`}></span>
                Devices
                </>
            }
      </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;