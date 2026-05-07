/* ═══════════════════════════════════════════
   슈퍼차일드 메인 스크립트
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initFab();
  initScrollReveal();
  initModal();
  initTimetable();
  initForm();
  initLightbox();
});


/* ─── NAV ─── */
function initNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  const navLinksContainer = document.getElementById('navLinks');
  const navWrap = document.getElementById('navLinksWrap');
  let lastActiveId = '';
  let isClicking = false;
  let scrollEndTimer = null;

  // Click: instant highlight, lock during scroll
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      isClicking = true;
      navLinks.forEach(a => a.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // Unlock on manual scroll
  ['wheel', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, () => { isClicking = false; }, { passive: true });
  });

  window.addEventListener('scroll', () => {
    if (isClicking) {
      clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(() => { isClicking = false; }, 50);
      return;
    }

    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 60) current = s.getAttribute('id');
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });

    // Auto-scroll nav to show active tab
    if (current !== lastActiveId) {
      lastActiveId = current;
      const activeLink = document.querySelector('.nav-links a.active');
      if (activeLink && navLinksContainer) {
        const linkLeft = activeLink.offsetLeft;
        const linkWidth = activeLink.offsetWidth;
        const containerWidth = navLinksContainer.clientWidth;
        const containerScroll = navLinksContainer.scrollLeft;
        if (linkLeft < containerScroll || linkLeft + linkWidth > containerScroll + containerWidth) {
          navLinksContainer.scrollTo({
            left: linkLeft - (containerWidth / 2) + (linkWidth / 2),
            behavior: 'instant',
          });
        }
      }
    }
  });

  // Nav scroll arrows
  if (navLinksContainer && navWrap) {
    const checkNavScroll = () => {
      const sl = navLinksContainer.scrollLeft;
      navWrap.classList.toggle('scrolled-start', sl > 5);
      navWrap.classList.toggle('scrolled-end', sl + navLinksContainer.clientWidth >= navLinksContainer.scrollWidth - 5);
    };
    navLinksContainer.addEventListener('scroll', checkNavScroll);
    window.addEventListener('resize', checkNavScroll);
    checkNavScroll();
  }
}


/* ─── FAB (Floating Action Button) ─── */
function initFab() {
  const fab = document.getElementById('fab');
  if (!fab) return;

  document.addEventListener('click', (e) => {
    if (!fab.contains(e.target) && fab.classList.contains('open')) {
      fab.classList.remove('open');
    }
  });
}

function toggleFab() {
  document.getElementById('fab').classList.toggle('open');
}


/* ─── SCROLL REVEAL ─── */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.05 });

  document.querySelectorAll('.reveal, .story-empathy-v2, .story-problem, .section3-guide, .section4-why, .section5-steps').forEach(el => observer.observe(el));

  // worry strip 슬라이드 인
  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('slide-in');
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.worry-text-row').forEach(el => slideObserver.observe(el));
}


/* ─── MODAL (입회 신청) ─── */
function initModal() {
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

function openModal() {
  document.getElementById('modalOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('modalForm').style.display = '';
  document.getElementById('modalSuccess').classList.remove('show');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
}


/* ─── POPUP (할인/준비물) ─── */
function openDiscount() {
  document.getElementById('discountPopup').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeDiscount() {
  document.getElementById('discountPopup').classList.remove('show');
  document.body.style.overflow = '';
}

function openPrep() {
  document.getElementById('prepPopup').classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closePrep() {
  document.getElementById('prepPopup').classList.remove('show');
  document.body.style.overflow = '';
}


/* ─── SHARE ─── */
function shareSection(sectionId, title) {
  const url = window.location.origin + window.location.pathname + '#' + sectionId;
  const text = title + ' - 청주 슈퍼차일드 수영교실';

  if (navigator.share) {
    navigator.share({ title: text, url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => {
      alert('링크가 복사되었습니다!\n' + url);
    }).catch(() => {
      prompt('아래 링크를 복사해 주세요:', url);
    });
  }
}


/* ─── LIGHTBOX (이미지 확대 팝업) ─── */
let _lbImages = [];
let _lbIndex = 0;

function initLightbox() {
  // 앨범 카드 이미지 클릭
  document.addEventListener('click', (e) => {
    const albumImg = e.target.closest('.album-img img');
    if (albumImg) {
      const panel = albumImg.closest('.album-panel');
      if (panel) {
        _lbImages = [...panel.querySelectorAll('.album-img img')].map(img => ({
          src: img.src,
          alt: img.alt,
        }));
        _lbIndex = _lbImages.findIndex(i => i.src === albumImg.src);
        openLightbox();
      }
      return;
    }

    // 변화 갤러리 이미지 클릭
    const changeImg = e.target.closest('.change-gallery img');
    if (changeImg) {
      _lbImages = [...document.querySelectorAll('.change-gallery img')].map(img => ({
        src: img.src,
        alt: img.alt,
      }));
      _lbIndex = _lbImages.findIndex(i => i.src === changeImg.src);
      openLightbox();
    }
  });

  // ESC로 닫기
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navLightbox(-1);
    if (e.key === 'ArrowRight') navLightbox(1);
  });
}

function openLightbox() {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  if (!_lbImages[_lbIndex]) return;

  img.src = _lbImages[_lbIndex].src;
  cap.textContent = _lbImages[_lbIndex].alt;
  lb.classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('show');
  document.body.style.overflow = '';
}

function navLightbox(dir) {
  _lbIndex = (_lbIndex + dir + _lbImages.length) % _lbImages.length;
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  img.src = _lbImages[_lbIndex].src;
  cap.textContent = _lbImages[_lbIndex].alt;
}


/* ─── ALBUM (지점별 시설) ─── */
function switchAlbum(branch, btn) {
  // 상단 사진 탭
  const tabGroup = btn.closest('.album-tabs');
  tabGroup.querySelectorAll('.album-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.album-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('album-' + branch).classList.add('active');

  // 하단 오시는 길 탭도 연동
  syncInfoTabs(branch);
}

function switchInfo(branch, btn) {
  // 하단 오시는 길 탭
  const tabGroup = btn.closest('.album-tabs');
  tabGroup.querySelectorAll('.album-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.info-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('info-' + branch).classList.add('active');

  // 상단 사진 탭도 연동
  syncAlbumTabs(branch);
}

function syncInfoTabs(branch) {
  const infoTabs = document.getElementById('infoTabs');
  if (!infoTabs) return;
  infoTabs.querySelectorAll('.album-tab').forEach(t => t.classList.remove('active'));
  infoTabs.querySelector(`[onclick*="'${branch}'"]`)?.classList.add('active');
  document.querySelectorAll('.info-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('info-' + branch)?.classList.add('active');
}

function syncAlbumTabs(branch) {
  const albumTabGroup = document.querySelector('#facility .album-tabs:not(#infoTabs)');
  if (!albumTabGroup) return;
  albumTabGroup.querySelectorAll('.album-tab').forEach(t => t.classList.remove('active'));
  albumTabGroup.querySelector(`[onclick*="'${branch}'"]`)?.classList.add('active');
  document.querySelectorAll('.album-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('album-' + branch)?.classList.add('active');
}


/* ─── TIMETABLE IMAGE SHARE ─── */
async function shareTimeTable() {
  const el = document.querySelector('.timetable-unified');
  if (!el || typeof html2canvas === 'undefined') return;

  // 캡쳐 중 표시
  const btn = event.target.closest('a');
  const origText = btn.textContent;
  btn.textContent = '⏳ 이미지 생성 중...';
  btn.style.pointerEvents = 'none';

  try {
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
    });

    canvas.toBlob(async (blob) => {
      const file = new File([blob], '슈퍼차일드_시간표.png', { type: 'image/png' });

      // Web Share API (모바일 공유)
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: '슈퍼차일드 수업 시간표',
            files: [file],
          });
        } catch (e) { /* 사용자 취소 */ }
      } else {
        // 폴백: 이미지 다운로드
        const link = document.createElement('a');
        link.download = '슈퍼차일드_시간표.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }

      btn.textContent = origText;
      btn.style.pointerEvents = '';
    }, 'image/png');
  } catch (e) {
    alert('이미지 생성에 실패했습니다.');
    btn.textContent = origText;
    btn.style.pointerEvents = '';
  }
}


/* ─── PRICING IMAGE SHARE ─── */
async function sharePricing() {
  const el = document.querySelector('.pricing-wrapper');
  if (!el || typeof html2canvas === 'undefined') return;

  const btn = event.target.closest('a');
  const origText = btn.textContent;
  btn.textContent = '⏳ 이미지 생성 중...';
  btn.style.pointerEvents = 'none';

  try {
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
    });

    canvas.toBlob(async (blob) => {
      const file = new File([blob], '슈퍼차일드_수강료.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ title: '슈퍼차일드 수강료 안내', files: [file] });
        } catch (e) { /* 사용자 취소 */ }
      } else {
        const link = document.createElement('a');
        link.download = '슈퍼차일드_수강료.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }

      btn.textContent = origText;
      btn.style.pointerEvents = '';
    }, 'image/png');
  } catch (e) {
    alert('이미지 생성에 실패했습니다.');
    btn.textContent = origText;
    btn.style.pointerEvents = '';
  }
}


/* ─── TIMETABLE (통합 시간표) ─── */
let curBranch = 'ga';
let curDay = 'wd';

function initTimetable() {
  renderTT();
}

function renderTT() {
  const data = SITE_DATA.timetable[curBranch][curDay];
  const grid = document.getElementById('ttGrid');
  const poolInfo = document.getElementById('ttPoolInfo');
  if (!grid || !poolInfo) return;

  poolInfo.textContent = SITE_DATA.timetable[curBranch].pool;

  let html = '';
  data.forEach(r => {
    html += `<div class="tt-grid-row">
      <span class="tt-grid-time">${r.h}</span>
      <div class="tt-grid-bars">`;
    if (r.gen) html += '<span class="tt-grid-tag gen">일반부</span>';
    if (r.inf) html += '<span class="tt-grid-tag inf">유아부</span>';
    if (!r.gen && !r.inf) html += '<span class="tt-grid-empty">—</span>';
    html += '</div></div>';
  });
  grid.innerHTML = html;
}

function switchUnified(branch, day, btn) {
  if (branch) {
    curBranch = branch;
    const grp = btn.parentElement;
    grp.querySelectorAll('.tt-filter-btn').forEach(b => b.classList.remove('active-branch'));
    btn.classList.add('active-branch');
  }
  if (day) {
    curDay = day;
    const grp = btn.parentElement;
    grp.querySelectorAll('.tt-day-btn, .tt-filter-btn').forEach(b => b.classList.remove('active-day'));
    btn.classList.add('active-day');
  }
  renderTT();

  // Flash feedback
  const grid = document.getElementById('ttGrid');
  const poolInfo = document.getElementById('ttPoolInfo');
  grid.classList.remove('flash');
  poolInfo.classList.remove('flash');
  void grid.offsetWidth; // force reflow
  grid.classList.add('flash');
  poolInfo.classList.add('flash');
  setTimeout(() => poolInfo.classList.remove('flash'), 500);
}


/* ─── FORM ─── */
function initForm() {
  // 신규/재등원 라벨 변경
  document.querySelectorAll('input[name="regType"]').forEach(radio => {
    radio.addEventListener('change', function () {
      const label = document.getElementById('timeSlotLabel');
      label.innerHTML = this.value === '재등원'
        ? '등원 원하시는 시간대 <span class="required">*</span>'
        : '샘플수업 원하시는 시간대 <span style="font-size:0.8rem;color:#888;font-weight:400;">(복수 선택 가능)</span> <span class="required">*</span>';
    });
  });

  // 초기 시간대 슬롯 렌더링
  renderTimeSlots();
}

function handleAgeChange() {
  const age = parseInt(document.getElementById('childAge').value);
  const badge = document.getElementById('infantBadge');

  if (age >= 5 && age <= 7) {
    badge.classList.add('show');
  } else {
    badge.classList.remove('show');
  }
  renderTimeSlots();
}

function handleBranchChange() {
  renderTimeSlots();
}


/* ─── 시간대 선택 동적 렌더링 (혼잡도 포함) ─── */
function renderTimeSlots() {
  const container = document.getElementById('timeSlotsContainer');
  if (!container) return;

  // 기존 선택 상태 보존 (혼잡도 업데이트 시 초기화 방지)
  const prevChecked = new Set();
  container.querySelectorAll('input[name="timeSlot"]:checked').forEach(el => {
    prevChecked.add(el.value);
  });

  const age = parseInt(document.getElementById('childAge').value) || 0;
  const branchRadio = document.querySelector('input[name="branch"]:checked');
  const branchVal = branchRadio ? branchRadio.value : null;
  const branchKey = branchVal === '가경점' ? 'ga' : branchVal === '용암점' ? 'yo' : null;

  const isInfant = age >= 5 && age <= 7;

  // 지점 미선택 + 유아부인 경우
  if (isInfant && !branchKey) {
    container.innerHTML = '<div class="ts-notice">⚠️ 위에서 지점을 먼저 선택해 주세요.</div>';
    return;
  }

  // 시간표 데이터에서 시간대 목록 추출
  const ttBranch = branchKey ? SITE_DATA.timetable[branchKey] : SITE_DATA.timetable.ga;

  // 유아부: inf===true 인 슬롯만, 일반부: gen===true 인 슬롯
  const filterKey = isInfant ? 'inf' : 'gen';

  const wdSlots = ttBranch.wd.filter(s => s[filterKey]);
  const weSlots = ttBranch.we.filter(s => s[filterKey]);

  // 값 prefix (제출 시 식별용)
  const prefix = isInfant && branchKey
    ? (branchKey === 'ga' ? '가경' : '용암')
    : '';

  let html = '';

  // 평일
  if (wdSlots.length) {
    html += '<div class="ts-group">';
    html += '<div class="ts-group-title">📅 평일</div>';
    html += '<div class="ts-grid">';
    wdSlots.forEach((s, i) => {
      const id = 'ts_wd_' + i;
      const val = prefix ? (prefix + ' 평일 ' + s.h) : ('평일 ' + s.h);
      html += buildSlotCard(id, val, s.h);
    });
    html += '</div></div>';
  }

  // 토요일
  if (weSlots.length) {
    html += '<div class="ts-group">';
    html += '<div class="ts-group-title">📅 토요일</div>';
    html += '<div class="ts-grid">';
    weSlots.forEach((s, i) => {
      const id = 'ts_we_' + i;
      const val = prefix ? (prefix + ' 토 ' + s.h) : ('토 ' + s.h);
      html += buildSlotCard(id, val, s.h);
    });
    html += '</div></div>';
  }

  if (!wdSlots.length && !weSlots.length) {
    html = '<div class="ts-notice">해당하는 수업 시간이 없습니다.</div>';
  }

  container.innerHTML = html;

  // 이전 선택 상태 복원
  if (prevChecked.size > 0) {
    container.querySelectorAll('input[name="timeSlot"]').forEach(el => {
      if (prevChecked.has(el.value)) el.checked = true;
    });
  }
}

function buildSlotCard(id, value, time) {
  return `
    <div class="ts-card">
      <input type="checkbox" name="timeSlot" id="${id}" value="${value}">
      <label for="${id}">
        <span class="ts-card-time">${time}</span>
      </label>
    </div>`;
}

function formatPhone(input) {
  let val = input.value.replace(/\D/g, '');
  if (val.length > 11) val = val.slice(0, 11);
  if (val.length > 7) {
    input.value = val.slice(0, 3) + '-' + val.slice(3, 7) + '-' + val.slice(7);
  } else if (val.length > 3) {
    input.value = val.slice(0, 3) + '-' + val.slice(3);
  } else {
    input.value = val;
  }
}

function togglePrep() {
  document.getElementById('prepToggle').classList.toggle('open');
  document.getElementById('prepContent').classList.toggle('open');
}

function submitForm() {
  const branch = document.querySelector('input[name="branch"]:checked');
  const name = document.getElementById('childName').value.trim();
  const gender = document.querySelector('input[name="gender"]:checked');
  const age = document.getElementById('childAge').value;
  const phone = document.getElementById('parentPhone').value.trim();
  const time = document.querySelector('input[name="timeSlot"]:checked');

  if (!branch) return alert('지점을 선택해 주세요.');
  if (!name)   return alert('아이 이름을 입력해 주세요.');
  if (!gender) return alert('성별을 선택해 주세요.');
  if (!age)    return alert('나이를 선택해 주세요.');
  if (!phone || phone.replace(/\D/g, '').length < 10) return alert('보호자 핸드폰 번호를 정확히 입력해 주세요.');
  if (!time)   return alert('샘플수업 시간대를 선택해 주세요.');

  // Show success
  document.getElementById('modalForm').style.display = 'none';
  document.getElementById('modalSuccess').classList.add('show');
}
