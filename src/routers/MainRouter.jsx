// import { Route, Routes } from "react-router-dom";
// import Layout from "../components/Layout";
// import MainPage from "../pages/MainPage/MainPage";
// import OAuth2Router from "./OAuth2Router";
// import LandingPage from "../pages/LandingPage/LandingPage";
// import { usePrincipalState } from "../store/usePrincipalState";
// import NotificationPage from "../pages/NotificationPage/NotificationPage";
// import BoardRouter from "./BoardRouter";
// import MyPageRouter from "./MyPageRouter";
// import CourseRouter from "./CourseRouter";
// import ProtectedRouter from "./ProtectedRouter";
// import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
// import UserDetailPage from "../pages/UserDetailPage/UserDetailPage";
// import FollowingListPage from "../pages/FollowUserListPage/FollowingListPage";
// import FollowerListPage from "../pages/FollowUserListPage/FollowerListPage";
// import ChatRouter from "./ChatRouter";

// const RootRoute = () => {
//     const { isLoggedIn } = usePrincipalState();
//     return isLoggedIn ? <MainPage /> : <LandingPage />;
// };

// function MainRouter() {
//     return (
//         <>
//             <Layout>
//                 <Routes>
//                     <Route path="/" element={<RootRoute />} />
//                     <Route path="/oauth2/*" element={<OAuth2Router />} />

//                     <Route
//                         path="/board/*"
//                         element={
//                             <ProtectedRouter>
//                                 <BoardRouter />
//                             </ProtectedRouter>
//                         }
//                     />
//                     <Route
//                         path="/notification"
//                         element={
//                             <ProtectedRouter>
//                                 <NotificationPage />
//                             </ProtectedRouter>
//                         }
//                     />
//                     <Route
//                         path="/mypage/*"
//                         element={
//                             <ProtectedRouter>
//                                 <MyPageRouter />
//                             </ProtectedRouter>
//                         }
//                     />
//                     <Route
//                         path="/user/:userId"
//                         element={
//                             <ProtectedRouter>
//                                 <UserDetailPage />
//                             </ProtectedRouter>
//                         }
//                     />
//                     <Route
//                         path="/user/:userId/followers"
//                         element={
//                             <ProtectedRouter>
//                                 <FollowerListPage />
//                             </ProtectedRouter>
//                         }
//                     />
//                     <Route
//                         path="/user/:userId/followings"
//                         element={
//                             <ProtectedRouter>
//                                 <FollowingListPage />
//                             </ProtectedRouter>
//                         }
//                     />
//                     <Route
//                         path="/chat/*"
//                         element={
//                             <ProtectedRouter>
//                                 <ChatRouter />
//                             </ProtectedRouter>
//                         }
//                     />
//                     <Route path="/course/*" element={<CourseRouter />} />
//                     <Route path="*" element={<NotFoundPage />} />
//                 </Routes>
//             </Layout>
//         </>
//     );
// }

// export default MainRouter;


import { Route, Routes } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import PublicLayout from "../components/PublicLayout";

import MainPage from "../pages/MainPage/MainPage";
import OAuth2Router from "./OAuth2Router";
import LandingPage from "../pages/LandingPage/LandingPage";
import { usePrincipalState } from "../store/usePrincipalState";
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
            {/* ✅ Public 영역 */}
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
                    <AppLayout>
                        <MainPage />
                    </AppLayout>
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

            {/* ✅ App 영역 (로그인 필요 라우트들) */}
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

            {/* course가 공개인지 로그인 필요인지에 따라 Public/App로 선택 */}
            <Route
                path="/course/*"
                element={
                    <AppLayout>
                        <CourseRouter />
                    </AppLayout>
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
