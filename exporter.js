const express = require('express');
const promClient = require('prom-client');
const axios = require('axios');

// --- 1. 설정 부분 ---
const app = express();
const PORT = 8000;
const POLLING_INTERVAL_SECONDS = 10;

// API 주소들을 배열로 관리합니다.
const AMR_API_URLS = [
  "http://172.16.222.191:15000/api/Amr", // 첫 번째 배터리 API
  "http://172.16.222.192:15000/api/Amr", // 두 번째 배터리 API
  "http://172.16.222.193:15000/api/Amr"  // 세 번째 배터리 API
];

// --- 2. 프로메테우스 메트릭 정의 ---
// 'amr_id'를 라벨로 사용하여 각 로봇의 배터리 전압을 구분합니다.
const batteryLevel = new promClient.Gauge({
  name: 'amr_battery_voltage_percent', // 메트릭 이름 변경 (더 명확하게)
  help: 'Current AMR battery voltage in percent',
  labelNames: ['amr_id'] // 라벨을 'amr_id'로 지정
});

// --- 3. API 데이터 호출 및 메트릭 업데이트 함수 ---
const fetchAllAmrData = async () => {
  console.log('Fetching data from all AMR API endpoints...');
  
  // forEach를 사용하여 각 URL을 순회하며 데이터를 가져옵니다.
  AMR_API_URLS.forEach(async (url) => {
    try {
      const response = await axios.get(url);
      
      // API 응답이 배열이므로 첫 번째 요소를 사용합니다.
      const data = response.data[0]; 

      // 필요한 데이터 추출
      const amrId = data.amrId;
      const level = data.amrInfo.status.battery.voltage;
      
      // 값이 유효한 경우에만 메트릭 업데이트
      if (amrId && level !== undefined) {
        // 'amr_id' 라벨에 추출한 amrId 값을 넣어 메트릭을 업데이트합니다.
        batteryLevel.labels(amrId).set(level);
        console.log(`Successfully updated metrics for ${amrId}: Voltage=${level}%`);
      } else {
        console.warn(`Warning: Could not find amrId or battery level from ${url}`);
      }

    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error.message);
    }
  });
};

// --- 4. 프로메테우스 /metrics 엔드포인트 (변경 없음) ---
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

// --- 5. 주기적 호출 및 서버 시작 ---
fetchAllAmrData();
setInterval(fetchAllAmrData, POLLING_INTERVAL_SECONDS * 1000);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`AMR Battery Exporter is running on http://localhost:${PORT}`);
  console.log(`Metrics available at http://localhost:${PORT}/metrics`);
});