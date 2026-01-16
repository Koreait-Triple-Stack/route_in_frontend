import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MyPage from '../pages/Mypage/MyPage'
import InBodyPage from '../pages/InBody/InBodyPage'

function MyPageRouter() {
  return (
    <>
        <Routes>
            <Route path="/:userId" element={<MyPage />} />
            <Route path="/inBody" element={<InBodyPage />} />
        </Routes>
    </>
  )
}

export default MyPageRouter