import { Route, Routes } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import PublicLayout from "../components/PublicLayout";

import MainPage from "../pages/MainPage/MainPage";
import OAuth2Router from "./OAuth2Router";
import LandingPage from "../pages/LandingPage/LandingPage";
import NotificationPage from "../pages/NotificationPage/NotificationPage";
import BoardRouter from "./BoardRouter";
import MyPageRouter from "./MyPageRouter";
import CourseRouter from "./CourseRouter";
import ProtectedRouter from "./ProtectedRouter";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import UserDetailPage from "../pages/UserDetailPage/UserDetailPage";
import FollowingListPage from "../pages/FollowUserListPage/FollowingListPage";
import FollowerListPage from "../pages/FollowUserListPage/FollowerListPage";
import ChatRouter from "./ChatRouter";

export default function MainRouter() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <PublicLayout>
                        <LandingPage />
                    </PublicLayout>
                }
            />

            <Route
                path="/main"
                element={
                    <ProtectedRouter>
                        <AppLayout>
                            <MainPage />
                        </AppLayout>
                    </ProtectedRouter>
                }
            />
            <Route
                path="/oauth2/*"
                element={
                    <PublicLayout>
                        <OAuth2Router />
                    </PublicLayout>
                }
            />

            <Route
                path="/board/*"
                element={
                    <ProtectedRouter>
                        <AppLayout>
                            <BoardRouter />
                        </AppLayout>
                    </ProtectedRouter>
                }
            />

            <Route
                path="/notification"
                element={
                    <ProtectedRouter>
                        <AppLayout>
                            <NotificationPage />
                        </AppLayout>
                    </ProtectedRouter>
                }
            />

            <Route
                path="/mypage/*"
                element={
                    <ProtectedRouter>
                        <AppLayout>
                            <MyPageRouter />
                        </AppLayout>
                    </ProtectedRouter>
                }
            />

            <Route
                path="/user/:userId"
                element={
                    <ProtectedRouter>
                        <AppLayout>
                            <UserDetailPage />
                        </AppLayout>
                    </ProtectedRouter>
                }
            />
            <Route
                path="/user/:userId/followers"
                element={
                    <ProtectedRouter>
                        <AppLayout>
                            <FollowerListPage />
                        </AppLayout>
                    </ProtectedRouter>
                }
            />
            <Route
                path="/user/:userId/followings"
                element={
                    <ProtectedRouter>
                        <AppLayout>
                            <FollowingListPage />
                        </AppLayout>
                    </ProtectedRouter>
                }
            />

            <Route
                path="/chat/*"
                element={
                    <ProtectedRouter>
                        <AppLayout>
                            <ChatRouter />
                        </AppLayout>
                    </ProtectedRouter>
                }
            />

            <Route
                path="*"
                element={
                    <PublicLayout>
                        <NotFoundPage />
                    </PublicLayout>
                }
            />
        </Routes>
    );
}
