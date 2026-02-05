import React, { useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    List,
    ListItem,
    ListItemText,
    IconButton,
    Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { usePrincipalState } from "../../store/usePrincipalState";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Container } from "@mui/system";
import {
    addInBody,
    deleteInBody,
    getInBodyListByUserId,
} from "../../apis/inBody/inBodyService";
import Loading from "../../components/Loading";
import { useToastStore } from "../../store/useToastStore";

const CustomizedLabel = (props) => {
    const { x, y, stroke, value } = props;
    return (
        <text
            x={x}
            y={y}
            dy={20}
            fill={stroke}
            fontSize={12}
            textAnchor="middle"
            fontWeight="bold">
            {value}
        </text>
    );
};

export default function InbodyChartWithActions() {
    const { show } = useToastStore();
    const { principal } = usePrincipalState();
    const [addOpen, setAddOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const queryClient = useQueryClient();

    const [inputValues, setInputValues] = useState({
        bodyWeight: "",
        skeletalMuscleMass: "",
        bodyFatMass: "",
        monthDt: "",
    });

    const { data: response, isLoading } = useQuery({
        queryFn: () => getInBodyListByUserId(principal.userId),
        queryKey: ["getInBodyListByUserId", principal.userId],
        staleTime: 30000,
    });

    const addMutation = useMutation({
        mutationFn: addInBody,
        onSuccess: (resp) => {
            queryClient.invalidateQueries([
                "getInBodyListByUserId",
                principal.userId,
            ]);
            show(resp.message, "success");
            handleAddClose();
        },
        onError: (error) => {
            show(error.message, "error");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: deleteInBody,
        onSuccess: (resp) => {
            queryClient.invalidateQueries([
                "getInBodyListByUserId",
                principal.userId,
            ]);
            show(resp.message, "success");
            handleAddClose();
            handleDeleteClose();
        },
        onError: (error) => {
            show(error.message, "error");
        },
    });

    const handleAddOpen = () => setAddOpen(true);

    const handleAddClose = () => {
        setAddOpen(false);
        setInputValues({
            bodyWeight: "",
            skeletalMuscleMass: "",
            bodyFatMass: "",
            monthDt: "",
        });
    };

    const handleDeleteOpen = () => setDeleteOpen(true);
    const handleDeleteClose = () => setDeleteOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddData = () => {
        if (
            !inputValues.bodyWeight ||
            !inputValues.skeletalMuscleMass ||
            !inputValues.bodyFatMass
        ) {
            show("모든 정보를 입력해주세요.", "error");
            return;
        }

        const data = {
            userId: principal?.userId,
            bodyWeight: inputValues.bodyWeight,
            skeletalMuscleMass: inputValues.skeletalMuscleMass,
            bodyFatMass: inputValues.bodyFatMass,
            monthDt: inputValues.monthDt,
        };

        addMutation.mutate(data);
    };

    const handleDeleteData = (inBodyId) => {
        const data = {
            inBodyId: inBodyId,
            userId: principal?.userId,
        };

        deleteMutation.mutate(data);
    };

    if (isLoading) return <Loading />;

    const inBodyList = response?.data || [];

    const recentData = [...inBodyList]
        .sort((a, b) => new Date(a.monthDt) - new Date(b.monthDt))
        .slice(-4);

    return (
        <Container>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ my: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    인바디 변화 기록
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={handleDeleteOpen}
                        size="small">
                        삭제
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddOpen}
                        size="small">
                        추가
                    </Button>
                </Stack>
            </Stack>

            <Box>
                <ResponsiveContainer width="100%" height="350">
                    <LineChart
                        data={recentData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 10,
                            bottom: 20,
                        }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="monthDt"
                            padding={{ left: 30, right: 30 }}
                            interval={0}
                            dy={20}
                            fontSize={13}
                        />
                        <YAxis hide domain={["auto", "auto"]} />
                        <Tooltip />
                        <Legend verticalAlign="top" height={36} />
                        <Line
                            type="linear"
                            dataKey="bodyWeight"
                            name="체중"
                            stroke="#2196f3"
                            strokeWidth={2}
                            activeDot={{ r: 6 }}
                            label={<CustomizedLabel />}
                        />
                        <Line
                            type="linear"
                            dataKey="skeletalMuscleMass"
                            name="골격근량"
                            stroke="#00c853"
                            strokeWidth={2}
                            activeDot={{ r: 6 }}
                            label={<CustomizedLabel />}
                        />
                        <Line
                            type="linear"
                            dataKey="bodyFatMass"
                            name="체지방량"
                            stroke="#f44336"
                            strokeWidth={2}
                            activeDot={{ r: 6 }}
                            label={<CustomizedLabel />}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </Box>
            <Dialog
                open={deleteOpen}
                onClose={handleDeleteClose}
                fullWidth
                maxWidth="xs">
                <DialogTitle>인바디 정보 삭제</DialogTitle>
                <DialogContent dividers>
                    {response.length === 0 ? (
                        <Typography align="center" color="text.secondary">
                            기록된 데이터가 없습니다.
                        </Typography>
                    ) : (
                        <List>
                            {inBodyList.map((ib) => (
                                <React.Fragment key={ib.inBodyId}>
                                    <ListItem
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() =>
                                                    handleDeleteData(
                                                        ib.inBodyId,
                                                    )
                                                }>
                                                <DeleteIcon color="error" />
                                            </IconButton>
                                        }>
                                        <ListItemText
                                            primary={ib.monthDt}
                                            secondary={`체중: ${ib.bodyWeight}kg / 근육: ${ib.skeletalMuscleMass}kg / 지방: ${ib.bodyFatMass}kg`}
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose}>닫기</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={addOpen} onClose={handleAddClose}>
                <DialogTitle>새로운 기록 추가</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1, minWidth: 300 }}>
                        <TextField
                            label="날짜"
                            name="monthDt"
                            type="date"
                            value={inputValues.monthDt}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <TextField
                            label="체중 (kg)"
                            name="bodyWeight"
                            type="number"
                            value={inputValues.bodyWeight}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="골격근량 (kg)"
                            name="skeletalMuscleMass"
                            type="number"
                            value={inputValues.skeletalMuscleMass}
                            onChange={handleChange}
                            fullWidth
                        />
                        <TextField
                            label="체지방량 (kg)"
                            name="bodyFatMass"
                            type="number"
                            value={inputValues.bodyFatMass}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={handleAddClose} variant="outlined">
                        취소
                    </Button>
                    <Button onClick={handleAddData} variant="contained">
                        추가
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
