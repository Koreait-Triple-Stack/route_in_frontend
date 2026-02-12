import { Box, Container } from "@mui/material";

export default function PublicLayout({ children }) {
    return (
        <Box
            sx={{
                height: "100dvh",
                minHeight: "100svh",
                overflow: "hidden",
                background:
                    "radial-gradient(900px 500px at 10% 10%, rgba(32, 34, 37, 0.14), transparent 55%)," +
                    "radial-gradient(900px 500px at 90% 15%, rgba(34,197,94,0.12), transparent 55%)," +
                    "linear-gradient(180deg, #ffffff 0%, #f8fafc 55%, #ffffff 100%)",
            }}>
            <Container
                maxWidth="md"
                sx={{
                    py: 2,
                    height: "100%",
                    minHeight: 0,

                    overflowY: "auto",
                    overflowX: "hidden",

                    msOverflowStyle: "none",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                }}>
                {children}
            </Container>
        </Box>
    );
}
