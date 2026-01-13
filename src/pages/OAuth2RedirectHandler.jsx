// import React, { useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { oAuth2SigninRequest } from '../../apis/auth/oAuth2Api'; // API 파일 import 확인 필요
// import { Box, CircularProgress, Typography } from '@mui/material';
// import { usePrincipalState } from '../store/usePrincipalState';

// const OAuth2RedirectHandler = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { login } = usePrincipalState(); // AuthContext의 login 함수 (상태 업데이트용)

//   useEffect(() => {
//     // 1. URL 파라미터에서 provider와 providerUserId 추출
//     const searchParams = new URLSearchParams(location.search);
//     const provider = searchParams.get('provider');
//     const providerUserId = searchParams.get('providerUserId');

//     // 파라미터가 없으면 로그인 화면으로 돌려보냄
//     if (!provider || !providerUserId) {
//       alert("로그인 정보가 없습니다.");
//       navigate('/oauth2/signin');
//       return;
//     }

//     // 2. 보내주신 로그인 요청 코드 적용
//     oAuth2SigninRequest({
//         provider: provider,
//         providerUserId: providerUserId
//     })
//     .then((response) => {
//         // [성공] 회원이 존재하여 로그인이 된 경우
//         if (response.data.status === "success") {
//             const accessToken = response.data.data;
            
//             // Context를 통해 로그인 상태 업데이트 및 토큰 저장
//             login(accessToken); 
//             // (만약 Context 안 쓰고 직접 저장하신다면 아래 코드 사용)
//             // localStorage.setItem("AccessToken", accessToken);
            
//             window.location.href = "/"; // 메인 페이지로 이동
//         } 
//         // [실패] 회원이 없어서 가입이 필요한 경우 (중요!)
//         else if (response.data.status === "failed") {
//             // 단순히 alert만 띄우지 않고, 회원가입 페이지로 정보를 넘겨줍니다.
//             // alert(response.data.message); // "회원가입이 필요합니다" 등의 메시지일 것임
            
//             if (confirm("가입되지 않은 회원입니다. 회원가입 페이지로 이동하시겠습니까?")) {
//                 navigate('/oauth2/signup', {
//                     state: {
//                         provider: provider,
//                         providerUserId: providerUserId
//                     }
//                 });
//             } else {
//                 navigate('/oauth2/signin');
//             }
//         }
//     })
//     .catch((error) => {
//         console.error(error);
//         alert("문제가 발생했습니다. 다시 시도해주세요.");
//         navigate('/oauth2/signin');
//     });

//   }, [location, navigate, login]);

//   return (
//     <Box 
//       sx={{ 
//         display: 'flex', 
//         flexDirection: 'column', 
//         alignItems: 'center', 
//         justifyContent: 'center', 
//         height: '100vh' 
//       }}
//     >
//       <CircularProgress />
//       <Typography sx={{ mt: 2 }}>로그인 정보를 확인 중입니다...</Typography>
//     </Box>
//   );
// };

// export default OAuth2RedirectHandler;