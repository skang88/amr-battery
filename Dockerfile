# 1. 베이스 이미지 선택
# 현재 Active LTS 버전인 Node.js 22를 기반으로 한 가벼운 Alpine Linux 이미지를 사용합니다.
FROM node:22-alpine

# 2. 작업 디렉토리 설정
# 컨테이너 내에서 작업할 공간을 지정합니다.
WORKDIR /usr/src/app

# 3. 의존성 설치
# package.json과 package-lock.json을 먼저 복사하여 빌드 캐시를 활용합니다.
COPY package*.json ./
RUN npm install

# 4. 소스 코드 복사
# .dockerignore에 명시된 파일을 제외하고 모든 파일을 작업 디렉토리로 복사합니다.
COPY . .

# 5. 컨테이너 실행 명령어
# 컨테이너가 시작될 때 실행할 명령어를 지정합니다.
CMD [ "node", "exporter.js" ]