// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [searchdata, setsearchdata] = useState("");
//   const [searchtype, setsearchtype] = useState("");
//   const [Terminaldata, setTerminaldata] = useState([]);
//   const [loading, setloading] = useState(true);
//   const [editformer, seteditformer] = useState("");

//   useEffect(() => {
//     async function load() {
//       try {
//         const res = await fetch("http://localhost:3002/devices");
//         if (!res.ok) throw new Error("Failed to load devices");
//         setTerminaldata(await res.json());
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setloading(false);
//       }
//     }
//     load();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         searchdata,
//         setsearchdata,
//         searchtype,
//         setsearchtype,
//         Terminaldata,
//         setTerminaldata,
//         loading,
//         setloading,
//         editformer,
//         seteditformer,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // custom hook so components don't import the context directly
// export function useAuth() {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
//   return ctx;
// }



import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [searchdata, setsearchdata] = useState("");
  const [searchtype, setsearchtype] = useState("");
  const [Terminaldata, setTerminaldata] = useState([]);
  const [loading, setloading] = useState(true);
  const [editformer, seteditformer] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/db.json");
        if (!res.ok) throw new Error("Failed to load devices");
        const data = await res.json();
        setTerminaldata(data.devices);
      } catch (err) {
        console.error(err);
      } finally {
        setloading(false);
      }
    }
    load();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        searchdata,
        setsearchdata,
        searchtype,
        setsearchtype,
        Terminaldata,
        setTerminaldata,
        loading,
        setloading,
        editformer,
        seteditformer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// custom hook so components don't import the context directly
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}