import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePrincipalState } from "../../store/usePrincipalState";

import AddressForm from "./AddressForm";
import UsernameForm from "./UsernameForm";
import BodyInfoForm from "./BodyInfoForm";
import OverlayWrapper from "./OverlayWrapper";
import { Container, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getUserByUserId } from "../../apis/account/accountService";
import Loading from "../../components/Loading";
import ProfileCard from "./ProfileCard";
import WithdrawForm from "./WithdrawForm";

function MyPage() {
    const navigate = useNavigate();
    const { logout, principal } = usePrincipalState();
    const { data: response, isLoading } = useQuery({
        queryKey: ["getUserByUserId", principal?.userId],
        queryFn: () => getUserByUserId(principal?.userId),
        staleTime: 30000,
    });

    const user = response?.data;

    const [activeView, setActiveView] = useState(null);
    const [open, setOpen] = useState(false);

    const handleClick = () => setOpen(!open);
    const handleCloseOverlay = () => setActiveView(null);

    const renderOverlayContent = () => {
        if (!activeView) return null;

        const commonProps = {
            userId: user?.userId,
            onClose: handleCloseOverlay,
            onLogout: logout
        };

        switch (activeView) {
            case "username":
                return <UsernameForm {...commonProps} />;
            case "address":
                return <AddressForm {...commonProps} />;
            case "bodyInfo":
                return <BodyInfoForm {...commonProps} />;
            case "withdraw":
                return <WithdrawForm {...commonProps} />
            default:
                return null;
        }
    };

    if (isLoading) return <Loading />;

    return (
        <Container>
            {renderOverlayContent()}
            <ProfileCard
                user={user}
                open={open}
                onToggleOpen={handleClick}
                onNavigate={navigate}
                onSetActiveView={setActiveView}
                onLogout={logout}
            />
        </Container>
    );
}

export default MyPage;
