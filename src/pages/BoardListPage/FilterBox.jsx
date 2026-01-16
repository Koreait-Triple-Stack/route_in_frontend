import {
    Button,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
} from "@mui/material";
import { Box, Grid } from "@mui/system";
import { EXERCISE_TAGS } from "../../constants/exerciseTags";

function FilterBox({
    type,
    region,
    setRegion,
    distance,
    setDistance,
    selectedTagIds,
    toggleTag,
    resetTags,
}) {
    const resetOnClickHandler = () => {
        setRegion("");
        setDistance("");
        resetTags();
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                border: "1px solid #dbdbdb",
                padding: "20px",
                boxSizing: "border-box",
                borderRadius: "12px",
                mb: 1,
            }}>
            {type !== "전체" &&
                (type === "러닝코스" ? (
                    <>
                        <TextField
                            label="지역"
                            variant="standard"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                        />
                        <TextField
                            label="최대 거리(km)"
                            type="number"
                            variant="standard"
                            value={distance}
                            inputProps={{
                                min: 0,
                                step: 1,
                            }}
                            onChange={(e) => setDistance(e.target.value)}
                        />
                    </>
                ) : (
                    <ToggleButtonGroup
                        value={selectedTagIds}
                        exclusive
                        onChange={(e, value) => toggleTag(value)}>
                        <Grid container spacing={1}>
                            {EXERCISE_TAGS.map((tag) => (
                                <ToggleButton
                                    key={tag.id}
                                    value={tag.id}
                                    selected={selectedTagIds.includes(tag.id)}
                                    sx={{
                                        borderRadius: 999,
                                        px: 2,
                                        boxSizing: "border-box",
                                    }}>
                                    {tag.label}
                                </ToggleButton>
                            ))}
                        </Grid>
                    </ToggleButtonGroup>
                ))}
            <Button variant="outlined" onClick={resetOnClickHandler}>
                필터 초기화
            </Button>
        </Box>
    );
}

export default FilterBox;
