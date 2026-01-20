import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import MainPage from "../pages/MainPage/MainPage";
import OAuth2Router from "./OAuth2Router";
import LandingPage from "../pages/LandingPage/LandingPage";
import { usePrincipalState } from "../store/usePrincipalState";
import NotificationPage from "../pages/NotificationPage/NotificationPage";
import BoardRouter from "./BoardRouter";
import MapView from "../pages/MapView";
import MyPageRouter from "./MyPageRouter";
import CourseRouter from "./CourseRouter";
import ProtectedRouter from "./ProtectedRouter";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import WsTestPage from "../pages/WsTestPage";
import { useQuery } from "@tanstack/react-query";

const RootRoute = () => {
    const { isLoggedIn } = usePrincipalState();
    return isLoggedIn ? <MainPage /> : <LandingPage />;
};

function MainRouter() {

    return (
        <>
            <Layout>
                <Routes>
                    <Route path="/" element={<RootRoute />} />
                    <Route path="/oauth2/*" element={<OAuth2Router />} />

                    <Route
                        path="/board/*"
                        element={
                            <ProtectedRouter>
                                <BoardRouter />
                            </ProtectedRouter>
                        }
                    />
                    <Route
                        path="/notification"
                        element={
                            <ProtectedRouter>
                                <NotificationPage />
                            </ProtectedRouter>
                        }
                    />
                    <Route
                        path="/mypage/*"
                        element={
                            <ProtectedRouter>
                                <MyPageRouter />
                            </ProtectedRouter>
                        }
                    />

                    <Route path="/map" element={<MapView />} />
                    <Route path="/course/*" element={<CourseRouter />} />
                    <Route path="*" element={<NotFoundPage />} />
                    <Route path="/noti" element={<WsTestPage />} />
                </Routes>
            </Layout>
        </>
    );
}

export default MainRouter;
