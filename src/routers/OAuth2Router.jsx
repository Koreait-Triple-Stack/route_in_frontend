import React from 'react'
import { Route, Routes } from 'react-router-dom'
import OAuth2SignupPage from "../pages/OAuth2SignupPage"
import OAuth2SigninPage from "../pages/OAuth2SigninPage"

function OAuth2Router() {
  return (
    <>
        <Routes>
            <Route path="/signup" element={<OAuth2SignupPage />} />
            <Route path="/signin" element={<OAuth2SigninPage />} />
        </Routes>
    </>
  )
}

export default OAuth2Router