/* ═══════════════════════════════════════════
   슈퍼차일드 사이트 데이터
   ─────────────────────────────────────────
   이 파일만 수정하면 사이트 콘텐츠가 변경됩니다.
   ═══════════════════════════════════════════ */

const SITE_DATA = {

  /* ─── 기본 정보 ─── */
  siteName: '슈퍼차일드',
  phone: {
    ga: '043-715-2019',  // 가경점
    yo: '043-288-2016',  // 용암점
  },

  /* ─── 시간표 데이터 ─── */
  // gen: 일반부, inf: 유아부
  timetable: {
    ga: {
      pool: '🏊 가경점 수심 : 80cm, 110cm',
      wd: [
        { h: '2시', gen: true,  inf: false },
        { h: '3시', gen: true,  inf: false },
        { h: '4시', gen: true,  inf: true  },
        { h: '5시', gen: true,  inf: true  },
        { h: '6시', gen: true,  inf: false },
        { h: '7시', gen: true,  inf: false },
        { h: '8시', gen: true,  inf: false },
      ],
      we: [
        { h: '9시',  gen: true, inf: false },
        { h: '10시', gen: true, inf: false },
        { h: '11시', gen: true, inf: true  },
        { h: '12시', gen: true, inf: true  },
        { h: '1시',  gen: true, inf: true  },
        { h: '2시',  gen: true, inf: true  },
      ],
    },
    yo: {
      pool: '🏊 용암점 수심 : 110cm',
      wd: [
        { h: '2시', gen: true,  inf: false },
        { h: '3시', gen: true,  inf: false },
        { h: '4시', gen: true,  inf: true  },
        { h: '5시', gen: true,  inf: true  },
        { h: '6시', gen: true,  inf: false },
        { h: '7시', gen: true,  inf: false },
        { h: '8시', gen: true,  inf: false },
      ],
      we: [
        { h: '9시',  gen: true,  inf: false },
        { h: '10시', gen: true,  inf: false },
        { h: '11시', gen: true,  inf: false },
        { h: '12시', gen: true,  inf: false },
        { h: '1시',  gen: true,  inf: true  },
        { h: '2시',  gen: true,  inf: true  },
      ],
    },
  },

  /* ─── 수강료 ─── */
  pricing: {
    regular: {
      label: '☺️👶 일반부 · 유치부 (1:5 정규반)',
      color: 'blue',
      rows: [
        { freq: '주 1회', price: '150,000원', badge: '' },
        { freq: '주 2회', price: '260,000원', badge: '🔥 추천' },
        { freq: '주 3회', price: '380,000원', badge: '🔥 추천' },
        { freq: '주 4회', price: '460,000원', badge: '' },
        { freq: '주 5회', price: '550,000원', badge: '' },
      ],
    },
    elite: {
      label: '🏊‍♂️ 엘리트 / 마스터즈부',
      color: 'teal',
      rows: [
        { freq: '주 1회', price: '100,000원', badge: '' },
        { freq: '주 2회', price: '160,000원', badge: '' },
        { freq: '주 3회', price: '230,000원', badge: '' },
      ],
    },
  },

  /* ─── 셔틀 구역 ─── */
  shuttle: {
    ga: {
      name: '가경점',
      dotClass: 'dot-ga',
      ok: ['가경동', '복대동', '개신동', '성화동', '비하동', '강서동'],
      no: ['봉명동', '모충동', '테크노폴리스'],
      warn: '⚠️ 가능 구역 내에서도 아파트 단지 내, 좁은 골목길은 운행이 불가합니다.',
    },
    yo: {
      name: '용암점',
      dotClass: 'dot-yo',
      ok: ['분평동 (일부 제외)', '방서동', '동남지구', '용암동', '금천동 (일부 제외)'],
      no: ['모충동', '수곡동', '영운동', '석교동', '탑동', '수동', '남일면'],
      warn: '⚠️ 분평 1단지 운행 불가 / 금천동 일부 지역 불가 — 문의 부탁드립니다.<br>⚠️ 아파트 단지 내, 좁은 골목길 운행 불가',
    },
  },

  /* ─── 시설 ─── */
  facilities: [
    { icon: '🏊', title: '전용 수영장',   desc: '아이들에게 최적화된 수심과 수온 관리' },
    { icon: '🚿', title: '샤워 & 탈의실', desc: '깨끗하고 안전한 개별 샤워·탈의 공간' },
    { icon: '👀', title: '관람석',         desc: '보호자가 수업을 참관할 수 있는 관람 공간' },
    { icon: '🧼', title: '위생 관리',     desc: '철저한 수질 관리와 위생 시설 운영' },
    { icon: '📹', title: 'CCTV 안전',     desc: '전 구역 CCTV 설치 운영' },
    { icon: '🛡️', title: '안전 장비',     desc: '응급 장비 및 안전 용품 완비' },
  ],

  /* ─── 지점 위치 ─── */
  locations: {
    ga: {
      name: '가경점',
      dotClass: 'dot-ga',
      address: '충청북도 청주시 흥덕구 가경동 (상세주소 입력)',
      phone: '전화번호 입력',
      hours: '평일 14:00 ~ 21:00 · 토요일 09:00 ~ 15:00',
      mapLink: '#',
    },
    yo: {
      name: '용암점',
      dotClass: 'dot-yo',
      address: '충청북도 청주시 상당구 용암동 (상세주소 입력)',
      phone: '전화번호 입력',
      hours: '평일 14:00 ~ 21:00 · 토요일 13:00 ~ 15:00',
      mapLink: '#',
    },
  },

  /* ─── 주차 ─── */
  parking: {
    ga: {
      name: '가경점',
      dotClass: 'dot-ga',
      details: [
        { icon: '🚗', text: '건물 내 <strong>무료 주차</strong> 가능' },
        { icon: '⏱️', text: '수업 시간 동안 주차 가능' },
        { icon: '📍', text: '건물 지하 주차장 이용' },
      ],
    },
    yo: {
      name: '용암점',
      dotClass: 'dot-yo',
      details: [
        { icon: '🚗', text: '건물 내 <strong>무료 주차</strong> 가능' },
        { icon: '⏱️', text: '수업 시간 동안 주차 가능' },
        { icon: '📍', text: '건물 주차장 이용' },
      ],
    },
  },

  /* ─── 할인 ─── */
  discounts: [
    {
      icon: '🧑‍🤝‍🧑',
      title: '친구 동반 추천 할인',
      desc: '추천한 회원 &amp; 새 친구 모두',
      highlight: '첫 등록비의 등록 횟수 × 1만원씩 할인',
    },
    {
      icon: '👪',
      title: '형제 / 자매 할인',
      desc: '형제·자매가 함께 등록 시 모두',
      highlight: '매달 1만원씩 할인',
    },
    {
      icon: '👥',
      title: 'TEAM 할인 (5인 이상)',
      desc: '팀 모든 인원이 신규 등록 시 모두',
      highlight: '첫 등록비의 20% 할인',
    },
  ],

  /* ─── 추천 누적 이벤트 티어 ─── */
  referralTiers: [
    { stars: '⭐ × 1~4', reward: '수강료<br><strong>1만원 할인</strong>', highlight: false, crown: '' },
    { stars: '⭐ × 5',    reward: '<strong>1개월<br>수업 무료</strong>',   highlight: true,  crown: '🎉' },
    { stars: '⭐ × 6~9', reward: '수강료<br><strong>2만원 할인</strong>', highlight: false, crown: '' },
    { stars: '⭐ × 10',   reward: '<strong>2개월<br>수업 무료</strong>',   highlight: true,  crown: '🏆' },
  ],
};
