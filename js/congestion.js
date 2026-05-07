/* ═══════════════════════════════════════════
   혼잡도 시스템
   ─────────────────────────────────────────
   Firebase에서 실시간 학생 데이터를 읽어
   시간대별 혼잡도를 계산합니다.

   ★ 수정 가이드:
     - CAPACITY: 시간대당 최대 학생 수 (레인수 × 레인당 학생수)
     - LEVELS: 혼잡도 단계별 임계값
     - FIREBASE_CONFIG: Firebase 프로젝트 설정
     - SCHEDULE_KEY: Firebase에 저장된 학생 데이터 키
   ═══════════════════════════════════════════ */

const CONGESTION = (() => {

  /* ─── 설정 ─── */
  const CONFIG = {
    // Firebase 설정 (가경점 스케줄 시스템과 동일)
    firebase: {
      apiKey: "AIzaSyArHQQfHnVreH8gVamyl1e5IqUDfXUJ5F8",
      authDomain: "scswimming-schedule.firebaseapp.com",
      databaseURL: "https://scswimming-schedule-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "scswimming-schedule",
      storageBucket: "scswimming-schedule.firebasestorage.app",
      messagingSenderId: "45509278949",
      appId: "1:45509278949:web:f16989a9c416f06e25e80c",
    },

    // Firebase 내 학생 데이터 키
    scheduleKeys: {
      ga: 'swim_students',   // 가경점
      // yo: 'swim_students_yo',  // 용암점 (추후 연동 시 추가)
    },

    // 시간대당 최대 정원 (5레인 × 5명)
    capacity: 25,

    // 혼잡도 단계 (비율 기준)
    levels: [
      { max: 0,    label: '',     cls: ''              },  // 0명 = 표시 안함
      { max: 0.5,  label: '여유', cls: 'congestion-low'  },  // ~50%
      { max: 0.75, label: '보통', cls: 'congestion-mid'  },  // ~75%
      { max: 1.0,  label: '혼잡', cls: 'congestion-high' },  // ~100%
      { max: 999,  label: '마감', cls: 'congestion-full' },  // 100%+
    ],

    // 스케줄 시스템 → 랜딩페이지 시간 매핑
    // 스케줄 시스템은 내부적으로 1시~8시를 사용
    // 평일: 그대로 (2시=2시)
    // 토요일: 1시→9시, 2시→10시, ...
    satMap: { '1시': '9시', '2시': '10시', '3시': '11시', '4시': '12시', '5시': '1시', '6시': '2시' },

    // 평일 요일 목록
    weekdays: ['월', '화', '수', '목', '금'],
  };


  /* ─── 상태 ─── */
  let _fb = null;
  let _connected = false;
  let _counts = {};  // { 'ga': { 'wd': { '2시': 15, '3시': 20, ... }, 'we': { '9시': 10, ... } } }


  /* ─── Firebase 초기화 ─── */
  function init() {
    if (typeof firebase === 'undefined') {
      console.warn('[혼잡도] Firebase SDK 미로드');
      return;
    }

    try {
      // 랜딩 페이지용 별도 앱 인스턴스 (스케줄 앱과 충돌 방지)
      const app = firebase.initializeApp(CONFIG.firebase, 'landing-congestion');
      _fb = app.database().ref('schedule');
      _connected = true;

      // 가경점 데이터 실시간 구독
      listenBranch('ga');
    } catch (e) {
      console.warn('[혼잡도] Firebase 초기화 실패:', e.message);
    }
  }


  /* ─── 데이터 구독 ─── */
  function listenBranch(branch) {
    const key = CONFIG.scheduleKeys[branch];
    if (!key || !_fb) return;

    // Firebase의 swim_students 키를 구독
    const safeKey = key.replace(/[.#$/\[\]]/g, '_');
    _fb.child(safeKey).on('value', snapshot => {
      const raw = snapshot.val();
      if (!raw) return;

      try {
        const students = JSON.parse(raw);
        if (Array.isArray(students)) {
          _counts[branch] = countBySlot(students);
          // 시간표 + 모달 시간 선택 혼잡도 업데이트
          if (typeof renderTT === 'function') renderTT();
          if (typeof renderTimeSlots === 'function') renderTimeSlots();
        }
      } catch (e) {
        console.warn('[혼잡도] 데이터 파싱 실패:', e.message);
      }
    });
  }


  /* ─── 학생 수 집계 ─── */
  function countBySlot(students) {
    const wd = {};  // 평일: { '2시': count, ... }
    const we = {};  // 토요일: { '9시': count, ... }

    students.forEach(s => {
      if (!s || !s.t || !s.d) return;

      if (s.d === '토') {
        // 토요일: 내부시간 → 표시시간 변환
        const displayTime = CONFIG.satMap[s.t] || s.t;
        we[displayTime] = (we[displayTime] || 0) + 1;
      } else if (CONFIG.weekdays.includes(s.d)) {
        // 평일: 요일별로 따로 집계 후 평균
        const dayKey = s.d + '_' + s.t;
        wd[dayKey] = (wd[dayKey] || 0) + 1;
      }
    });

    // 평일 평균 계산 (각 시간대에 대해 요일별 인원의 평균)
    const wdAvg = {};
    const timeSet = new Set();
    Object.keys(wd).forEach(k => {
      const time = k.split('_')[1];
      timeSet.add(time);
    });
    timeSet.forEach(time => {
      let total = 0;
      let dayCount = 0;
      CONFIG.weekdays.forEach(day => {
        const cnt = wd[day + '_' + time] || 0;
        if (cnt > 0) { total += cnt; dayCount++; }
      });
      // 평일 중 학생이 있는 요일의 평균
      wdAvg[time] = dayCount > 0 ? Math.round(total / dayCount) : 0;
    });

    return { wd: wdAvg, we };
  }


  /* ─── 혼잡도 레벨 판단 ─── */
  function getLevel(count) {
    if (!count || count <= 0) return CONFIG.levels[0];
    const ratio = count / CONFIG.capacity;
    for (let i = 1; i < CONFIG.levels.length; i++) {
      if (ratio <= CONFIG.levels[i].max) return CONFIG.levels[i];
    }
    return CONFIG.levels[CONFIG.levels.length - 1];
  }


  /* ─── 외부 API ─── */
  return {
    init,

    /**
     * 특정 지점/요일/시간의 혼잡도 정보를 반환
     * @param {string} branch - 'ga' 또는 'yo'
     * @param {string} dayType - 'wd' (평일) 또는 'we' (토요일)
     * @param {string} time - 표시 시간 (예: '2시', '9시')
     * @returns {{ count, label, cls, ratio }} 혼잡도 정보
     */
    get(branch, dayType, time) {
      const data = _counts[branch];
      if (!data) return { count: 0, label: '', cls: '', ratio: 0 };

      const slots = data[dayType] || {};
      const count = slots[time] || 0;
      const level = getLevel(count);
      const ratio = Math.min(Math.round((count / CONFIG.capacity) * 100), 100);

      return {
        count,
        label: level.label,
        cls: level.cls,
        ratio,
      };
    },

    /** 데이터가 로드되었는지 여부 */
    isReady(branch) {
      return !!_counts[branch];
    },

    /** 연결 상태 */
    isConnected() {
      return _connected;
    },
  };
})();
