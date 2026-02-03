import { Box, Container } from "@mui/material";

export default function PublicLayout({ children }) {
    return (
        <Box
            sx={{
                minHeight: "100svh",
                background:
                    "radial-gradient(900px 500px at 10% 10%, rgba(32, 34, 37, 0.14), transparent 55%)," +
                    "radial-gradient(900px 500px at 90% 15%, rgba(34,197,94,0.12), transparent 55%)," +
                    "linear-gradient(180deg, #ffffff 0%, #f8fafc 55%, #ffffff 100%)",
            }}>
            {/* 랜딩은 굳이 sm 고정 안 해도 되는데, 모바일 감성 유지하려면 sm도 OK */}
            <Container maxWidth="md" sx={{ py: 6 }}>
                {children}
            </Container>
        </Box>
    );
}
