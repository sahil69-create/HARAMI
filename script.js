const loader = document.getElementById('loader');
const pageWrap = document.getElementById('pageWrap');
const typingText = document.getElementById('typingText');
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');

const phrases = [
  'KEYMAP MASTERCLASS',
  'GRIND MODE ACTIVATED',
  'TOP 1 PUSH STREAMS',
  'TOURNAMENT LEVEL ENERGY'
];
let phraseIndex = 0;
let letterIndex = 0;
let isDeleting = false;

function typeWriter() {
  const current = phrases[phraseIndex];
  typingText.textContent = current.slice(0, letterIndex);

  if (!isDeleting) {
    if (letterIndex < current.length) {
      letterIndex++;
    } else {
      isDeleting = true;
      setTimeout(typeWriter, 1400);
      return;
    }
  } else {
    if (letterIndex > 0) {
      letterIndex--;
    } else {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }

  setTimeout(typeWriter, isDeleting ? 60 : 110);
}

typeWriter();

const stats = document.querySelectorAll('.stat-number');
const statOptions = {
  root: null,
  threshold: 0.4,
};

const statObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const endValue = parseInt(target.dataset.target, 10);
      const duration = 2000;
      let start = 0;
      const startTime = performance.now();

      const animate = now => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        target.textContent = Math.floor(progress * endValue).toLocaleString();
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
      observer.unobserve(target);
    }
  });
}, statOptions);

stats.forEach(stat => statObserver.observe(stat));

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let musicOn = false;

function playButtonSound() {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.value = 240;
  gain.gain.value = 0.08;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.07);
}

function toggleMusic() {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  if (musicOn) {
    bgMusic.pause();
    musicToggle.textContent = 'MUSIC ON';
  } else {
    bgMusic.play().catch(e => console.error("Error playing audio:", e));
    musicToggle.textContent = 'MUSIC OFF';
  }
  musicOn = !musicOn;
  playButtonSound();
}

musicToggle.addEventListener('click', toggleMusic);

const interactiveButtons = document.querySelectorAll('.btn, .icon-btn');
interactiveButtons.forEach(button => {
  button.addEventListener('click', playButtonSound);
});

window.addEventListener('load', () => {
  setTimeout(() => {
    loader.style.opacity = '0';
    loader.style.pointerEvents = 'none';
    pageWrap.style.filter = 'none';
    setTimeout(() => loader.remove(), 700);
  }, 1200);
});

const scrollRevealElements = document.querySelectorAll('.section, .video-card, .live-card, .service-card, .contact-card');

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.25 });

scrollRevealElements.forEach(element => revealObserver.observe(element));
