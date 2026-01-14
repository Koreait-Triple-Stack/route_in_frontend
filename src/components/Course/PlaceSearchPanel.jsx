import {
    Box,
    Button,
    Chip,
    Divider,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function PlaceSearchPanel({
    query,
    setQuery,
    results,
    loading,
    error,
    onSearch,
    onSelectResult,
}) {
    return (
        <Stack spacing={1.5}>
            <Typography variant="subtitle2" fontWeight={800}>
                장소 검색
            </Typography>

            <Stack
                direction="row"
                spacing={1}
                sx={{ flexWrap: "nowrap", alignItems: "center" }}>
                <TextField
                    size="small"
                    placeholder="예: 서울역, 여의도한강공원"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onSearch();
                    }}
                    fullWidth
                />
                <Button
                    variant="contained"
                    onClick={onSearch}
                    disabled={loading}
                    startIcon={<SearchIcon />}
                    sx={{
                        flexShrink: 0, // ✅ 버튼이 눌려서 작아지지 않게
                        whiteSpace: "nowrap",
                        minWidth: 88, // ✅ 최소 너비 고정(원하는 값으로 조절)
                    }}>
                    {loading ? "중..." : "검색"}
                </Button>
            </Stack>

            {error && (
                <Typography variant="body2" color="error">
                    {error}
                </Typography>
            )}

            {results.length > 0 && (
                <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                    <List dense disablePadding>
                        {results.map((r, idx) => (
                            <Box key={`${r.id ?? idx}-${r.x}-${r.y}`}>
                                <ListItemButton
                                    onClick={() => onSelectResult(r)}>
                                    <ListItemText
                                        primary={
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                alignItems="center">
                                                <Chip
                                                    size="small"
                                                    label={idx + 1}
                                                />
                                                <Typography
                                                    variant="body2"
                                                    fontWeight={700}
                                                    noWrap>
                                                    {r.place_name}
                                                </Typography>
                                            </Stack>
                                        }
                                        secondary={
                                            r.road_address_name ||
                                            r.address_name ||
                                            ""
                                        }
                                    />
                                </ListItemButton>
                                {idx !== results.length - 1 && <Divider />}
                            </Box>
                        ))}
                    </List>
                </Paper>
            )}
        </Stack>
    );
}
