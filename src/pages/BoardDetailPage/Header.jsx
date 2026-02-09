import { IconButton, Menu, MenuItem, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usePrincipalState } from "../../store/usePrincipalState";
import {
    changeRecommend,
    getRecommendListByBoardId,
    removeBoard,
} from "../../apis/board/boardService";
import { useNavigate } from "react-router-dom";
import { useToastStore } from "../../store/useToastStore";
import UserAvatarLink from "../../components/UserAvatarLink";
import HeaderRecommend from "./HeaderRecommend";
import DialogComponent from "../../components/DialogComponent";

function Header({ boardData, setOpenCopy, boardId }) {
    const { show } = useToastStore();
    const { principal } = usePrincipalState();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [anchorEl, setAnchorEl] = useState(null);
    const [recommended, setRecommended] = useState(false);
    const [openRemove, setOpenRemove] = useState(false);
    const closeMenu = () => setAnchorEl(null);
    const { data: recommendList } = useQuery({
        queryFn: () => getRecommendListByBoardId(boardId),
        queryKey: ["getRecommendListByBoardId", boardId],
    });

    useEffect(() => {
        if (recommendList) {
            setRecommended(
                recommendList.data.filter(
                    (recommend) => recommend.userId === principal.userId,
                ).length === 1,
            );
        }
    }, [recommendList]);

    const changeRecommendMutation = useMutation({
        mutationFn: () =>
            changeRecommend({
                userId: principal?.userId,
                boardId: boardId,
                isRecommended: !!recommended,
            }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["getRecommendListByBoardId", boardId],
            });
        },
        onError: (error) => {
            show(error?.message ?? "실패", "error");
        },
    });

    const isOwner = useMemo(() => {
        return (
            principal.userId != null &&
            boardData?.userId != null &&
            Number(principal.userId) === Number(boardData.userId)
        );
    }, [principal, boardData]);

    const removeMutation = useMutation({
        mutationKey: ["removeBoard", boardId],
        mutationFn: removeBoard,
        onSuccess: (response) => {
            show(response.message, "success");

            queryClient.invalidateQueries({
                queryKey: ["getBoardListInfinite"],
            });
            queryClient.invalidateQueries({
                queryKey: ["getBoardListByUserId", principal.userId],
            });
            queryClient.removeQueries({
                queryKey: ["getBoardByBoardId", boardId],
            });
            navigate(-1);
        },
        onError: (error) => {
            show(error?.message ?? "삭제 실패", "error");
        },
    });

    const removeOnClickHandler = () => {
        closeMenu();
        if (!principal.userId) {
            show("로그인이 필요합니다.", error);
            return;
        }
        if (!isOwner) {
            show("삭제 권한이 없습니다.", error);
            return;
        }

        removeMutation.mutate({
            userId: principal.userId,
            boardId: boardId,
            tags: [],
        });
    };

    const editOnClickHandler = () => {
        closeMenu();
        if (!principal.userId){
            show("로그인이 필요합니다.", error);
            return;
        }
        if (!isOwner){
            show("수정 권한이 없습니다.", error);
            return;
        }
        
        navigate(`/board/edit`, { state: { boardData: boardData } });
    };

    return (
        <Box sx={{ pb: 2, pl: 1 }}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={1.5}>
                <Typography
                    sx={{
                        fontWeight: 900,
                        fontSize: 20,
                        lineHeight: 1.25,
                    }}>
                    {boardData?.title ?? form.title ?? "-"}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={0.8}>
                    <HeaderRecommend
                        recommended={recommended}
                        changeRecommendMutation={changeRecommendMutation}
                        recommendList={recommendList}
                    />

                    <IconButton
                        sx={{ pr: 0 }}
                        disableRipple
                        onClick={(e) => setAnchorEl(e.currentTarget)}>
                        <MoreVertIcon />
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={anchorEl}
                        onClose={closeMenu}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        PaperProps={{
                            sx: {
                                mt: 1,
                                borderRadius: 2,
                                minWidth: 180,
                                border: "1px solid",
                                borderColor: "divider",
                                boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
                            },
                        }}>
                        {boardData.type === "COURSE" ? (
                            <MenuItem
                                onClick={() => setOpenCopy(true)}
                                sx={{ fontWeight: 800 }}>
                                러닝 코스 리스트에 저장
                            </MenuItem>
                        ) : (
                            <MenuItem
                                onClick={() => setOpenCopy(true)}
                                sx={{ fontWeight: 800 }}>
                                운동 루틴에 복사
                            </MenuItem>
                        )}

                        <MenuItem
                            disabled={!isOwner}
                            onClick={editOnClickHandler}
                            sx={{ fontWeight: 800 }}>
                            수정
                        </MenuItem>
                        <MenuItem
                            disabled={!isOwner}
                            onClick={() => setOpenRemove(true)}
                            sx={{
                                fontWeight: 900,
                                color: "error.main",
                            }}>
                            삭제
                        </MenuItem>
                    </Menu>
                </Stack>
            </Stack>

            <Stack
                direction="row"
                alignItems="center"
                spacing={1.2}
                sx={{ mt: 1.2 }}>
                <UserAvatarLink
                    userId={boardData?.userId}
                    src={boardData?.profileImg}
                    size={36}
                />

                <Stack spacing={0}>
                    <Typography sx={{ fontWeight: 900, fontSize: 14 }}>
                        {boardData?.username ?? "-"}
                    </Typography>
                    <Typography
                        sx={{
                            color: "text.secondary",
                            fontSize: 12,
                        }}>
                        {boardData?.createDt
                            ?.split("T")[0]
                            .replaceAll("-", ".")}
                        {". "}
                        {boardData?.createDt?.split("T")[1].slice(0, 5)}
                    </Typography>
                </Stack>
            </Stack>

            <DialogComponent
                open={openRemove}
                setOpen={setOpenRemove}
                title={"게시글 삭제"}
                content={"삭제한 게시글은 복원할 수 없습니다"}
                onClick={removeOnClickHandler}
                color="error"
                ment="삭제"
            />
        </Box>
    );
}

export default Header;
