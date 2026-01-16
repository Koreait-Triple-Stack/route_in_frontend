import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { BrowserRouter } from "react-router-dom";
import MainRouter from "./routers/MainRouter";
import { CssBaseline } from "@mui/material";

const queryClient = new QueryClient();

function App() {
    return (
        <>
            <CssBaseline/>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <MainRouter />
                </BrowserRouter>
            </QueryClientProvider>
        </>
    );
}

export default App;
