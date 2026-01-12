import React from "react";
/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import MainBottom from "../MainBottom/MainBottom";

function Layout({ children }) {
    return (
        <div css={s.container}>
            <div>{children}</div>
            <MainBottom />
        </div>
    );
}

export default Layout;
