import { css } from "@emotion/react";

export const container = css`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: auto;
    -ms-overflow-style: none;
    align-items: center;

    &::-webkit-scrollbar {
        display: none;
    }
`;
