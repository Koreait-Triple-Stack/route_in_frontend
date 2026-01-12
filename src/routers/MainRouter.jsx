import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import MainPage from "../pages/MainPage/MainPage";
import MyPage from "../pages/Mypage/MyPage";
import OAuth2Router from "./OAuth2Router";
import LandingPage from "../pages/LandingPage/LandingPage";
import { usePrincipalState } from "../store/usePrincipalState";
import BoardListPage from "../pages/BoardListPage/BoardListPage";
import NotificationPage from "../pages/NotificationPage/NotificationPage";

const RootRoute = () => {
  const { isLoggedIn } = usePrincipalState();
  return isLoggedIn ? <MainPage /> : <LandingPage />;
};

function MainRouter() {
    const { login } = usePrincipalState();

  // ★ [중요] 새로고침 해도 로그인 유지되게 하는 코드
  // 앱이 처음 켜질 때 localStorage를 확인해서 토큰이 있으면 로그인 상태로 바꿈
  useEffect(() => {
    const token = localStorage.getItem("AccessToken");
    if (token) {
      login({ token: token }); // Zustand 상태를 true로 변경
        }
    }, [login]);
    return (
        <>
            <Layout>
                <Routes>
                    <Route path="/" element={<RootRoute />} />
                    <Route path="/board" element={<BoardListPage />} />
                    <Route path="/notification" element={<NotificationPage />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/oauth2/*" element={<OAuth2Router />} />
                    <Route path="/aaa" element={<MainPage />} />
                </Routes>
            </Layout>
        </>
    );
}

export default MainRouter;
