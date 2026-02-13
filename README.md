# 🚀 Route In

> 운동 루트 공유 & 실시간 소통 커뮤니티 플랫폼  
> 러닝 코스 등록, AI 추천, 실시간 채팅 기능을 제공하는 운동 특화 웹 서비스

---

## 📌 프로젝트 소개

Route In은 사용자들이 운동 루트를 공유하고  
실시간 채팅을 통해 소통하며  
AI 기반 추천 기능을 통해 맞춤형 코스를 추천받을 수 있는 커뮤니티 플랫폼입니다.

---

# 🎯 주요 기능 상세 설명

---

## 🏃 1. 러닝 코스 등록 및 공유

### ✔ 기능
- 지도 기반 러닝 코스 등록 (Kakao Map API)
- 출발지/경유지/도착지 설정
- 거리 자동 계산
- 게시글 형태로 코스 공유
- 다른 사용자 코스 복사 기능

### ✔ 기술 구현 포인트
- Kakao Map API 연동
- 코스 좌표 JSON 형태 저장
- board_tb + course_tb 테이블 분리 설계
- FK 기반 데이터 무결성 관리

---

## 💬 2. 실시간 채팅 시스템

### ✔ 기능
- WebSocket 기반 실시간 메시지 송수신
- 채팅방 생성 및 참여
- 안 읽은 메시지 수 표시 (unread)
- 무한 스크롤 메시지 페이징

### ✔ 기술 구현 포인트
- WebSocket + STOMP 구조
- room_read_tb를 활용한 마지막 읽은 메시지 관리
- last_read_message_id 기반 unread 계산
- message_id + create_dt 복합 커서 페이징
- Presence(접속 상태) 실시간 처리

---

## 🤖 3. AI 기반 코스 추천

### ✔ 기능
- 사용자 활동 기반 코스 추천
- 인기 코스 기반 추천
- 추천 결과 별도 테이블 관리

### ✔ 기술 구현 포인트
- recommend_course_tb 분리 설계
- AI API 호출 후 결과 DB 저장
- 사용자 기반 필터링 로직 구현

---

# 🧱 기술 스택

## 🖥 Frontend
- React
- MUI
- React Query
- Axios
- WebSocket (STOMP)

## ⚙ Backend
- Spring Boot
- Spring Security (JWT + OAuth2)
- MyBatis
- WebSocket (STOMP)

## 🗄 Database
- MySQL

## ☁ Infra
- Docker
- Nginx
- GCP
- GitHub Actions (CI/CD)

---

# 🗂 ERD (Database 설계)

![DB ERD](./images/DB-ERD.png)

---

# 🔍 트러블슈팅 사례

### ❗ unread 개수 오류
- 원인: 단순 count 기반 unread 계산
- 해결: last_read_message_id + 복합 커서 구조 적용

### ❗ Presence 동기화 오류
- 원인: 세션 관리 미흡
- 해결: WebSocket 세션 기반 사용자 상태 관리 로직 개선

### ❗ FK 제약조건 오류
- 원인: 기존 데이터 무결성 문제
- 해결: orphan 데이터 정리 후 FK 재설정

---

## Git Hub 주소 && 배포 주소
백엔드: https://github.com/Koreait-Triple-Stack/route_in_backend.git
프론트엔드: https://github.com/Koreait-Triple-Stack/route_in_frontend.git

배포 주소:
https://routein.store
https://routein1.store
https://ourtein.shop



