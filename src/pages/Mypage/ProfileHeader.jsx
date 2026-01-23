import {
    Avatar,
    Backdrop,
    CircularProgress,
    Box,
    Dialog,
    IconButton,
    Modal,
    Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "../../store/useToastStore";
import { useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { changeProfileImg } from "../../apis/account/accountService";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import DialogComponent from "../../components/DialogComponent";
import { storage } from "../../apis/config/firebaseConfig";
import { v4 as uuid } from "uuid";

export default function ProfileHeader({ user }) {
    const { show } = useToastStore();
    const imgInputRef = useRef();
    const base = user?.address?.baseAddress ?? "";
    const queryClient = useQueryClient();
    const [city, district] = base.split(" ");
    const [openChange, setOpenChange] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [pendingFile, setPendingFile] = useState(false);

    const changeProfileImgMutation = useMutation({
        mutationFn: (data) => changeProfileImg(data),
        onSuccess: (response) => {
            show(response.message, "success");
            queryClient.invalidateQueries({
                queryKey: ["getUserByUserId", user.userId],
            });
        },
        onError: (error) => {
            show(error.message, "error");
        },
    });

    const onChangeFileHandler = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        document.activeElement?.blur?.();
        setPendingFile(file);
        setOpenChange(true);

        e.target.value = "";
    };

    const onClickFileHandler = () => {
        setIsUploading(true);

        const imageRef = ref(
            storage,
            `profile-img/${uuid()}_${pendingFile.name.split(".").pop()}`,
        );
        const uploadTask = uploadBytesResumable(imageRef, pendingFile);

        // 업로드 상태 변화를 감지하는 이벤트 리스너를 등록
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // const progressPercent = Math.round(
                //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                // );
                // setProgress(progressPercent);
            },
            (error) => {
                show(error.message);
                setIsUploading(false);
            },
            async () => {
                try {
                    const downloadUrl = await getDownloadURL(
                        uploadTask.snapshot.ref,
                    );
                    console.log(downloadUrl);
                    changeProfileImgMutation.mutate({
                        userId: user.userId,
                        profileImg: downloadUrl,
                    });
                    setIsUploading(false);
                } catch (error) {
                    console.log(error);
                    show(error.message, "error");
                    setIsUploading(false);
                }
            },
        );
    };

    return (
        <Box
            sx={{
                px: 2,
                py: 2,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
            }}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
                <IconButton
                    component="label"
                    sx={{
                        p: 0,
                        borderRadius: "50%",
                    }}>
                    <Avatar
                        src={user?.profileImg}
                        alt="profileImg"
                        sx={{
                            width: 72,
                            height: 72,
                            bgcolor: "grey.200", // ✅ 로딩 중 배경
                            "& img": { objectFit: "cover" },
                        }}
                    />

                    {/* 숨김 파일 input */}
                    <input
                        hidden
                        type="file"
                        accept="image/*"
                        ref={imgInputRef}
                        onChange={onChangeFileHandler}
                    />
                </IconButton>

                {/* 카메라 아이콘 뱃지(옵션) */}
                <Box
                    sx={{
                        position: "absolute",
                        right: 0,
                        bottom: 0,
                        width: 24,
                        height: 24,
                        bgcolor: "grey.200",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #ddd",
                        pointerEvents: "none", // 클릭은 Avatar쪽에서
                    }}>
                    <CameraAltOutlinedIcon
                        sx={{ fontSize: 16, color: "grey.700" }}
                    />
                </Box>
            </Box>

            <Box
                sx={{
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.3,
                }}>
                <Typography
                    sx={{ fontSize: 22, fontWeight: 800, lineHeight: 1.1 }}>
                    {user?.username}
                </Typography>

                <Typography
                    sx={{
                        fontSize: 13,
                        color: "text.secondary",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}>
                    {user?.gender} • {city} {district}
                </Typography>

                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    {user?.height}cm / {user?.weight}kg
                </Typography>
            </Box>

            <DialogComponent
                open={openChange}
                setOpen={setOpenChange}
                title={"프로필 이미지 변경"}
                content={"프로필 이미지를 변경하시겠습니까?"}
                onClick={onClickFileHandler}
            />

            <Backdrop open={isUploading} sx={{ zIndex: 2000 }}>
                <CircularProgress />
            </Backdrop>
        </Box>
    );
}
