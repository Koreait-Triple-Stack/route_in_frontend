import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import AppInner from "./AppInner";
import ToastProvider from "./components/ToastProvider";

const queryClient = new QueryClient();

function App() {
    return (
        <>
            <CssBaseline />
            <ToastProvider />
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <AppInner />
                </BrowserRouter>
            </QueryClientProvider>
        </>
    );
}

export default App;
