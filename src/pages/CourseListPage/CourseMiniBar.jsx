import { Box, Chip, IconButton, Stack } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function CourseMiniBar({
    pointsCount,
    distanceM,
    onUndo,
    onClear,
    panelOpen,
    onTogglePanel,
}) {
    return (
        <Box sx={{ p: 1.25 }}>
            <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                justifyContent="space-between">
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ minWidth: 0 }}>
                    <Chip
                        size="small"
                        label={`경유지 ${pointsCount}`}
                        color={pointsCount >= 2 ? "primary" : "default"}
                        variant={pointsCount >= 2 ? "filled" : "outlined"}
                    />
                    <Chip
                        size="small"
                        label={`거리 ${(distanceM / 1000).toFixed(2)} km`}
                        color={pointsCount >= 2 ? "warning" : "default"}
                        variant={pointsCount >= 2 ? "filled" : "outlined"}
                    />
                </Stack>

                <Stack direction="row" spacing={0.5} alignItems="center">
                    <IconButton
                        size="small"
                        onClick={onUndo}
                        disabled={pointsCount === 0}>
                        <UndoIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                        size="small"
                        onClick={onClear}
                        disabled={pointsCount === 0}>
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={onTogglePanel}>
                        {panelOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </Stack>
            </Stack>
        </Box>
    );
}
