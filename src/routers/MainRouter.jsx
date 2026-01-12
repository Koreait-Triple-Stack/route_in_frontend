import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import MainPage from "../pages/MainPage/MainPage";

function MainRouter() {
    return (
        <>
            <Routes>
                <Route
                    path="/main"
                    element={
                        <Layout>
                            <MainPage />
                        </Layout>
                    }
                />
            </Routes>
        </>
    );
}

export default MainRouter;
