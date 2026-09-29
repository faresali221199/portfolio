/* ═══════════════════════════════════════════════════════════
   FARES.OS — Portfolio JavaScript
   ═══════════════════════════════════════════════════════════ */

// ─── Live Clock ───
function updateClock() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const ms = String(now.getMilliseconds()).padStart(3, '0');
  const el = document.getElementById('live-clock');
  if (el) el.textContent = `${h}:${m}:${s}:${ms}`;
  requestAnimationFrame(updateClock);
}
updateClock();

// ═══════════════════════════════════════
// MATRIX RAIN behind profile image
// ═══════════════════════════════════════
(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const wrapper = canvas.parentElement;

  function resize() {
    canvas.width = wrapper.offsetWidth;
    canvas.height = wrapper.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const chars = '01';
  const fontSize = 12;
  let columns = Math.floor(canvas.width / fontSize);
  let drops = new Array(columns).fill(1);

  function draw() {
    ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#00ff8855';
    ctx.font = fontSize + 'px JetBrains Mono, monospace';

    columns = Math.floor(canvas.width / fontSize);
    while (drops.length < columns) drops.push(1);

    for (let i = 0; i < columns; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      // Vary brightness
      const brightness = Math.random();
      if (brightness > 0.7) {
        ctx.fillStyle = '#00ff88aa';
      } else if (brightness > 0.4) {
        ctx.fillStyle = '#00ff8855';
      } else {
        ctx.fillStyle = '#00ff8822';
      }

      ctx.fillText(char, x, y);

      if (y > canvas.height && Math.random() > 0.97) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  setInterval(draw, 60);
})();

// ═══════════════════════════════════════
// 3D TILT on Profile Image (mouse follow)
// ═══════════════════════════════════════
(function init3DTilt() {
  const wrapper = document.querySelector('.profile-img-wrapper');
  if (!wrapper) return;
  const img = wrapper.querySelector('.profile-img');

  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 12;
    const rotateX = ((centerY - y) / centerY) * 12;

    img.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    img.style.filter = 'grayscale(30%) contrast(1.05)';
  });

  wrapper.addEventListener('mouseleave', () => {
    img.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)';
    img.style.filter = 'grayscale(100%) contrast(1.1)';
  });
})();

// ─── Active Nav Link on Scroll ───
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active');
        }
      });
    }
  });
}
window.addEventListener('scroll', highlightNav, { passive: true });

// ─── Intersection Observer for Scroll Animations ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.full-width-card, .two-col-row .card, .contact-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(card);
});

// ─── Skill Bar Animation on Scroll ───
const skillBars = document.querySelectorAll('.skill-bar-fill');
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const width = target.style.width;
      target.style.width = '0%';
      setTimeout(() => { target.style.width = width; }, 200);
      skillObserver.unobserve(target);
    }
  });
}, { threshold: 0.5 });

skillBars.forEach(bar => skillObserver.observe(bar));

// ─── Smooth scroll for nav links ───
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ─── Typing effect for bio headline ───
const headline = document.querySelector('.bio-headline');
if (headline) {
  const text = headline.textContent;
  headline.textContent = '';
  headline.style.borderRight = '2px solid var(--accent)';
  let i = 0;
  function typeChar() {
    if (i < text.length) {
      headline.textContent += text.charAt(i);
      i++;
      setTimeout(typeChar, 25);
    } else {
      setTimeout(() => { headline.style.borderRight = 'none'; }, 1000);
    }
  }
  const headlineObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      typeChar();
      headlineObserver.unobserve(headline);
    }
  }, { threshold: 0.5 });
  headlineObserver.observe(headline);
}

// ═══════════════════════════════════════
// CONTACT FORM HANDLER (Direct Background Send via Web3Forms)
// ═══════════════════════════════════════
function handleSubmit(e) {
  e.preventDefault();
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');
  const submitText = submitBtn.querySelector('.submit-text');
  const submitLoading = submitBtn.querySelector('.submit-loading');

  // إظهار شكل التحميل
  submitText.style.display = 'none';
  submitLoading.style.display = 'inline';
  submitBtn.disabled = true;

  // جمع بيانات الفورم
  const formData = new FormData(form);
  formData.append("access_key","c62de512-8373-4c02-84ec-85098a60d5e2"); // حط الكود اللي وصلك على الإيميل هنا

  // إرسال البيانات في الخلفية
  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    body: formData
  })
  .then(async (response) => {
    const json = await response.json();
    if (response.status === 200) {
      statusEl.textContent = '✓ MESSAGE SENT SUCCESSFULLY. I WILL REPLY SOON!';
      statusEl.className = 'form-status success';
      form.reset();
    } else {
      statusEl.textContent = json.message || '✗ FAILED TO SEND. PLEASE TRY AGAIN.';
      statusEl.className = 'form-status error';
    }
  })
  .catch(error => {
    statusEl.textContent = '✗ FAILED TO SEND. PLEASE CHECK YOUR CONNECTION.';
    statusEl.className = 'form-status error';
  })
  .finally(() => {
    submitText.style.display = 'inline';
    submitLoading.style.display = 'none';
    submitBtn.disabled = false;

    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className = 'form-status';
    }, 5000);
  });

  return false;
}

// ═══════════════════════════════════════
// FLAT-DESIGN EARTH GLOBE (Green land, transparent ocean, rotating)
// ═══════════════════════════════════════
(function initGlobe() {
  const canvas = document.getElementById('globe-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let rotation = 0;
  let landFeatures = [];
  let ready = false;

  // ── ألوان جديدة: قارات خضرا + شبكة بيضاء، من غير تلوين للمحيط ──
  const COLORS = {
    land: '#3D8B4F',
    grid: 'rgba(255,255,255,0.45)',
    shadow: 'rgba(0,0,0,0.25)'
  };

  function resize() {
    const parent = canvas.parentElement;
    if (parent) {
      canvas.width = parent.clientWidth || 300;
      canvas.height = parent.clientHeight || 300;
    }
  }
  resize();
  window.addEventListener('resize', resize);

  // ── تحميل بيانات الخريطة الحقيقية ──
  fetch('https://cdn.jsdelivr.net/gh/holtzy/D3-graph-gallery/DATA/world.geojson')
    .then(res => res.json())
    .then(geojson => {
      landFeatures = geojson.features;
      ready = true;
    })
    .catch(err => {
      console.error('Failed to load world map data:', err);
      ready = true;
    });

  function toVec3(lonDeg, latDeg) {
    const theta = ((90 - latDeg) / 180) * Math.PI;
    const phi = (lonDeg / 180) * Math.PI;
    return {
      x: Math.sin(theta) * Math.cos(phi),
      y: Math.cos(theta),
      z: Math.sin(theta) * Math.sin(phi)
    };
  }

  function project(v, centerX, centerY, radius) {
    const xRot = v.x * Math.cos(rotation) - v.z * Math.sin(rotation);
    const zRot = v.x * Math.sin(rotation) + v.z * Math.cos(rotation);
    return {
      x: centerX + xRot * radius,
      y: centerY - v.y * radius,
      z: zRot
    };
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.75;

    rotation += 0.004;

    // 1. الظل تحت الكرة
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(centerX, centerY + radius * 1.08, radius * 0.75, radius * 0.15, 0, 0, Math.PI * 2);
    ctx.fillStyle = COLORS.shadow;
    ctx.filter = 'blur(4px)';
    ctx.fill();
    ctx.restore();

    // ── تم حذف خطوة تلوين دائرة المحيط بالكامل ──
    // المحيط بقى شفاف، هيبين من وراه خلفية الصفحة (البنية)

    // 2. قص أي حاجة زيادة برة حدود الكرة
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.clip();

    // 3. القارات (خضرا)
    if (ready) {
      ctx.fillStyle = COLORS.land;
      landFeatures.forEach(feature => {
        const geom = feature.geometry;
        const polygons = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
        polygons.forEach(rings => {
          const sample = toVec3(rings[0][0][0], rings[0][0][1]);
          const sampleZ = sample.x * Math.sin(rotation) + sample.z * Math.cos(rotation);
          if (sampleZ < -0.5) return;

          ctx.beginPath();
          rings.forEach(ring => {
            ring.forEach(([lon, lat], idx) => {
              const v = toVec3(lon, lat);
              const s = project(v, centerX, centerY, radius);
              if (idx === 0) ctx.moveTo(s.x, s.y);
              else ctx.lineTo(s.x, s.y);
            });
            ctx.closePath();
          });
          ctx.fill('evenodd');
        });
      });
    }

    // 4. خطوط الشبكة فوق القارات
    ctx.strokeStyle = COLORS.grid;
    ctx.lineWidth = 0.8;

    const meridianLons = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];
    meridianLons.forEach(lon => {
      ctx.beginPath();
      let started = false;
      for (let latDeg = -90; latDeg <= 90; latDeg += 3) {
        const v = toVec3(lon, latDeg);
        const s = project(v, centerX, centerY, radius);
        if (s.z > -0.05) {
          if (!started) { ctx.moveTo(s.x, s.y); started = true; }
          else ctx.lineTo(s.x, s.y);
        } else started = false;
      }
      ctx.stroke();
    });

    const parallelLats = [-60, -30, 0, 30, 60];
    parallelLats.forEach(lat => {
      ctx.beginPath();
      let started = false;
      for (let lonDeg = -180; lonDeg <= 180; lonDeg += 3) {
        const v = toVec3(lonDeg, lat);
        const s = project(v, centerX, centerY, radius);
        if (s.z > -0.05) {
          if (!started) { ctx.moveTo(s.x, s.y); started = true; }
          else ctx.lineTo(s.x, s.y);
        } else started = false;
      }
      ctx.stroke();
    });

    // 5. حافة الكرة (تفصل عن الخلفية)
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore(); // فك القص

    requestAnimationFrame(animate);
  }

  animate();
})();
