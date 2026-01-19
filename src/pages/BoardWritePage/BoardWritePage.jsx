import React, { useMemo, useState } from "react";
// React를 쓰고 useState: 입력값/선택값 같은 "화면 상태" 저장
// useMemo: "선택된 태그 라벨 목록"처럼 계산 결과를 캐시해서 불필요한 재계산을 줄이려는 용도
import {
    Box,
    Button,
    Divider,
    Stack,
    TextField,
    ToggleButton,
    Typography,
} from "@mui/material"; // MUI컴포넌트 import

import { useNavigate, useParams } from "react-router-dom";
// 1. useParams: URL의 :type값을 읽어 "루틴/러닝"으로 분기
// 2. useNavigate: 저장 성공 후 /board로 이동

import { usePrincipalState } from "../../store/usePrincipalState";
// 1. 로그인 사용자 정보를 가져오기 위해 사용
import { EXERCISE_TAGS } from "../../constants/exerciseTags";
// 1. 루틴 작성에 "운동 부위" 태그 목록을 화면에 뿌리고, 선택 상태를 관리하기 위해 필요
import { useMutation } from "@tanstack/react-query";
// 1. 서버에 등록 요청을 보낼 때 react-query mutation을 사용(로딩/성공/실패상태 관리가 쉬움)
import { addBoardRequest } from "../../apis/board/boardApi";

const DAYS = [
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
    "일요일",
];
// 요일 목록을 상수로 빼는 이유는 요일을 여러 군데에서 반복하면 수정이 어렵고 한곳에서만
// 관리하면 유지보수가 쉬워진다.

// BoardWritePage
export default function BoardWritePage() {
    // 대표 컴포넌트 라우터가 이 컴포넌트를 렌더링 한다.
    const { type } = useParams();
    // BoardRouter.jsx에서 write/:type로 라우팅하기 때문에

    // /board/write/routine이면
    if (type === "routine") return <RoutineWritePage />;
    // /board/write/running 이면
    if (type === "running") return <RunningWritePage />;

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h6">잘못된 접근입니다.</Typography>
        </Box>
    );
}

// RoutineWritePage---------------------------------------------------------------------------------------
function RoutineWritePage() {
    const navigate = useNavigate();
    // 1. 저장 성공 후 이동에 사용
    const { principal } = usePrincipalState();
    // 1. * zustand store에서 로그인 사용자 정보를 가져온다.
    const userId = principal?.userId;
    // 1. 제출 시 누가 작성했는지를 서버에 보내기 위해 필요, 제출 직전에 한번더 막는 게 안전

    const [title, setTitle] = useState("");
    // 1. 제목 입력값 저장하기
    const [write, setWrite] = useState("");
    // 1. 본문 입력값 저장하기
    const [selectedTagIds, setSelectedTagIds] = useState([]);
    // 1. 선택된 운동 부위 태그의 id목록 저장   * 배열이기 때문에[]넣음
    const [routine, setRoutine] = useState(
        DAYS.reduce((acc, day) => {
            acc[day] = [];
            return acc;
        }, {})
    );
    // 1.*

    // 서버 저장mutation
    const mutation = useMutation({
        // 1. 등록 요청을 react-query mutation으로 관리
        mutationKey: ["addBoard", "routine", userId],
        // 1. *
        mutationFn: addBoardRequest,
        // 1. 실제 요청 함수: POST /board/add

        // * 성공 시
        onSuccess: (res) => {
            alert(res?.data?.message ?? "등록 완료");
            navigate("/board");
        },
        // * 실패 시
        onError: (err) => {
            alert(err?.response?.data?.message ?? err?.message ?? "요청 실패");
        },
    });

    // *태그 토글 로직
    const toggleTag = (tagId) => {
        // 1. 태그를 틀릭하면 선택/해제를 전환
        setSelectedTagIds(
            (prev) =>
                // 이전 값을 기반으로 새 배열을 만드는 패턴
                prev.includes(tagId)
                    ? // 이미 선택된 태그인지 확인
                      prev.filter((id) => id !== tagId)
                    : // 선택되어 있으면 제거
                      [...prev, tagId]
            // 선택 안되어 있으면 추가.
        );
    };
    // 여러 태그를 동시에 선택 가능하게 해야하므로 다중 선택 상태를 배열로 두는게 자연스럽다.

    // *
    const selectedTagLabels = useMemo(() => {
        return EXERCISE_TAGS.filter((t) => selectedTagIds.includes(t.id)).map(
            (t) => t.label
        );
    }, [selectedTagIds]);

    // 특정 요일에 운동 하나를 추가하는 함수
    const handleOpenForm = (day) => {
        const name = window.prompt("운동 이름");
        if (name === null) return;

        const trimmedName = name.trim();
        if (!trimmedName) return;

        const exercise = window.prompt("세트 x 횟수 (예: 3 x 10)");
        if (exercise === null) return;

        const trimmedExercise = exercise.trim();
        if (!trimmedExercise) return;

        const addRoutine = {
            id: Date.now(),
            name: trimmedName,
            exercise: trimmedExercise,
        };

        setRoutine((prev) => ({
            ...prev,
            [day]: [...prev[day], addRoutine],
        }));
    };

    // 루틴을 삭제하는 함수
    const handleDeleteExercise = (day, id) => {
        setRoutine((prev) => ({
            ...prev,
            [day]: prev[day].filter((item) => item.id !== id),
        }));
    };

    // "확인" 버튼 클릭 시 실행되는 로직
    const submitOnClickHandler = () => {
        if (userId == null) return alert("로그인이 필요합니다.");

        if (!title.trim()) return alert("제목을 작성해 주세요.");

        // 최소 1개 이상의 운동이 등록됐는지 검사하는 로직
        const hasAnyRoutine = Object.values(routine).some(
            (arr) => arr.length > 0
        );
        if (!hasAnyRoutine) return alert("하나 이상의 루틴을 추가해주세요");

        if (!window.confirm("게시글을 등록하시겠습니까?")) return;

        // 루틴은 요일별로 나뉜 구조라서 서버로 보내기 좋은 send배열 생성
        const send = Object.entries(routine).flatMap(([day, arr]) =>
            arr.map((item) => ({
                day,
                name: item.name,
                exercise: item.exercise,
            }))
        );

        // *
        const payload = {
            userId,
            type: "routine",
            title: title.trim(),
            content: write.trim(),
            tags: selectedTagLabels,
            send,
        };

        // 실제 서버 요청 실행
        mutation.mutate(payload);
    };

    // 1. 로그인 사용자를 가져오고
    // 2. 입력값을 state로 관리하고
    // 3. 제출 시 payload를 만들어 POST /board/add로 전송하고
    // 4. 성공하면 /board로 이동

    // MainRouter.jsx에서 /board/*는 ProtectedRouter로 감싸져 있어 로그인 확인 후만 진입됩니다.
    return (
        <Box>
            <Stack spacing={2} sx={{ width: "100%", maxWidth: 500 }}>
                {/* 제목 입력 필드 */}
                <TextField
                    id="title"
                    name="title"
                    label="제목"
                    placeholder="제목을 입력하세요."
                    fullWidth
                    value={title} // * state 값을 화면에 보여줌
                    onChange={(e) => setTitle(e.target.value)}
                    // * 입력할 때마다 state업데이트
                />

                <Typography sx={{ fontWeight: "bold" }}>운동 부위</Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {EXERCISE_TAGS.map((tag) => (
                        <ToggleButton
                            key={tag.id}
                            value={tag.id}
                            selected={selectedTagIds.includes(tag.id)}
                            // * 선택 여부 반영
                            onChange={() => toggleTag(tag.id)}
                            sx={{ borderRadius: 999, px: 2 }}>
                            {tag.label}
                        </ToggleButton>
                    ))}
                </Box>

                <Divider />

                <Typography sx={{ fontWeight: "bold" }}>운동 루틴</Typography>

                <Stack spacing={2}>
                    {DAYS.map((day) => (
                        // *
                        <Box key={day}>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                }}>
                                <Typography sx={{ fontWeight: "bold" }}>
                                    {day}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    onClick={() => handleOpenForm(day)}>
                                    운동 추가
                                </Button>
                            </Box>

                            {routine[day].length === 0 ? (
                                <Typography
                                    sx={{ mt: 1 }}
                                    color="text.secondary">
                                    운동을 추가해주세요
                                </Typography>
                            ) : (
                                <Stack spacing={1} sx={{ mt: 1 }}>
                                    {routine[day].map((item) => (
                                        <Box
                                            key={item.id}
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                gap: 1,
                                            }}>
                                            <Typography>
                                                {item.name} / {item.exercise}
                                            </Typography>
                                            <Button
                                                variant="text"
                                                color="error"
                                                onClick={() =>
                                                    handleDeleteExercise(
                                                        day,
                                                        item.id
                                                    )
                                                }>
                                                삭제
                                            </Button>
                                        </Box>
                                    ))}
                                </Stack>
                            )}
                        </Box>
                    ))}
                </Stack>

                <TextField
                    id="write"
                    name="write"
                    label="글쓰기"
                    placeholder="내용입력"
                    fullWidth
                    multiline
                    minRows={4}
                    value={write}
                    onChange={(e) => setWrite(e.target.value)}
                />

                <Button variant="contained" onClick={submitOnClickHandler}>
                    {mutation.isPending ? "저장 중.." : "확인"}
                </Button>
            </Stack>
        </Box>
    );
}

// RunningWritePage--------------------------------------------------------------------------------------
function RunningWritePage() {
    const navigate = useNavigate();
    const { principal } = usePrincipalState();
    const userId = principal?.userId;

    const [title, setTitle] = useState("");
    const [write, setWrite] = useState("");

    const mutation = useMutation({
        mutationKey: ["addBoard", "running", userId],
        mutationFn: addBoardRequest,
        onSuccess: (response) => {
            alert(response.message);
            navigate("/board");
        },
        onError: (error) => {
            alert(error.message);
        },
    });

    const submitOnClickHandler = () => {
        if (userId == null) return alert("로그인이 필요합니다.");

        if (!title.trim() || !write.trim())
            return alert("모든 항목을 입력해주세요.");

        const payload = {
            userId,
            type: "running",
            title: title.trim(),
            content: write.trim(),
            tags: [],
        };

        mutation.mutate(payload);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                bgcolor: "white",
            }}>
            <Stack spacing={2} sx={{ width: "100%", maxWidth: 500 }}>
                <TextField
                    id="title"
                    name="title"
                    label="제목"
                    type="text"
                    placeholder="제목을 입력하세요."
                    fullWidth
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </Stack>

            <Typography>코스 지도</Typography>
            <Box
                sx={{
                    width: "100%",
                    height: 180,
                    bgcolor: "#e9ecef",
                    mb: 2,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                지도 미리보기 영역
            </Box>

            <Divider />

            <Box sx={{}}>
                코스정보
                <TextField
                    id="write"
                    name="write"
                    label="글쓰기"
                    type="text"
                    placeholder="내용입력"
                    fullWidth
                    variant="outlined"
                    value={write}
                    onChange={(e) => setWrite(e.target.value)}
                />
            </Box>

            <Button onClick={submitOnClickHandler}>확인</Button>
        </Box>
    );
}
