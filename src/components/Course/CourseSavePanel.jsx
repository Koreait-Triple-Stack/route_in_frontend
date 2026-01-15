import { Button, Stack, TextField, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

export default function CourseSavePanel({
    courseName,
    setCourseName,
    onSave,
    disabled,
}) {
    return (
        <Stack spacing={1.5}>
            <Typography variant="subtitle2" fontWeight={800}>
                코스 저장
            </Typography>

            <TextField
                size="small"
                label="코스명"
                placeholder="예: 한강 5km"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                fullWidth
            />

            <Button
                variant="contained"
                color="warning"
                onClick={onSave}
                disabled={disabled}
                startIcon={<SaveIcon />}
                fullWidth>
            </Button>
        </Stack>
    );
}
