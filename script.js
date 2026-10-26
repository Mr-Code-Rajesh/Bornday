/**
 * MAIN INTERACTION SCRIPT FOR ROMANTIC BIRTHDAY CELEBRATION
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- STATE & LOCAL STORAGE DEFAULTS ---
  const defaultState = {
    gfName: "Mine Sita",
    tagline: "Happy Born Day to my Thango, chlm, pattu & future wifey! Your 1st gift is ready for tomorrow, and an unforgettable 2nd gift is arriving in 10 days! ❤️",
    daysCount: "365+",
    senderName: "Yours Always ❤️",
    letterText: `From the moment you stepped into my life, everything turned into poetry. Your smile has this rare magic that makes even the heaviest days feel light, and your laughter is honestly my favorite song in the entire universe.

Watching you grow, dream, laugh, and shine is the greatest privilege. You are not just kind, hilarious, and breathtakingly gorgeous — you have this rare golden soul that makes everyone around you feel warm and safe.

On this birthday and for all the birthdays to come, I wish you peace, radiant health, wild adventures, and endless joy. I will always be your biggest cheerleader, your softest safe place, and your forever partner in crime.`,
    version: 8,
    memories: [
      {
        title: "The Day We Met ✨",
        date: "Chapter 1",
        image: "images/meeting.jpg",
        tag: "Destiny",
        rot: "-2.5deg",
        backNote: "I still remember the butterflies the exact minute I saw you! 🦋"
      },
      {
        title: "Endless Conversations 💬",
        date: "Special Times",
        image: "images/conversations.jpg",
        tag: "Magic",
        rot: "2.8deg",
        backNote: "We could talk and spend time together until 1 PM and it would still feel like 5 minutes. ✨"
      },
      {
        title: "Sacred Temple Date 🛕",
        date: "27-07-2026",
        image: "images/temple.jpg",
        tag: "Blessed Love",
        rot: "-1.8deg",
        backNote: "27-07-2026: We spent time together holding hands. Our first hug and first kiss are still so vivid and precious in my memories. 🛕❤️"
      },
      {
        title: "Our First Movie Date 🎬🍿",
        date: "Unforgettable Moment",
        image: "images/movie.jpg",
        tag: "Eye to Eye",
        rot: "2.2deg",
        backNote: "Our first movie experience that I will never forget — both of us holding hands, looking into each other's eyes eye-to-eye... such an unforgettable moment. 🎬✨"
      },
      {
        title: "Holding Hands Everywhere 🤝",
        date: "My Safe Place",
        image: "images/holdinghands.jpg",
        tag: "Warmth",
        rot: "-3deg",
        backNote: "Holding your soft hand makes every street feel like a romantic paradise. You are my safe home. 💕"
      },
      {
        title: "Smiles That Melt My Heart 🥰",
        date: "Smily Killer",
        image: "images/laughing.jpg",
        tag: "My Kiddo",
        rot: "3.5deg",
        backNote: "Your cute laughter is my absolute favorite sound in the whole universe, my sweet smile killer! 🧸✨"
      },
      {
        title: "Under The Starlit Sky 🌌",
        date: "Mine World",
        image: "images/stargazing.jpg",
        tag: "Norjahaan",
        rot: "-2deg",
        backNote: "You are the brightest star in my sky, Princess Norjahaan. With you, every single second is magical. 👑❤️"
      },
      {
        title: "Forever My Pondati & Wifey 💍",
        date: "Forever & Always",
        image: "images/gifts.jpg",
        tag: "Two Gifts",
        rot: "2.4deg",
        backNote: "Your 1st gift is ready for tomorrow, and an unforgettable 2nd gift arrives in 10 days! Forever yours. 🌹✨"
      }
    ],
    heartsCount: 0
  };

  // Load saved state or use defaults with version migration
  let savedData = JSON.parse(localStorage.getItem('romantic_bday_state'));
  let appState;
  if (!savedData || savedData.version !== 8) {
    appState = defaultState;
    localStorage.setItem('romantic_bday_state', JSON.stringify(appState));
  } else {
    appState = savedData;
  }

  function saveState() {
    localStorage.setItem('romantic_bday_state', JSON.stringify(appState));
  }

  // --- APPLY STATE TO UI ---
  function applyStateToUI() {
    const gfNameElem = document.getElementById('gf-name-display');
    const footerNameElem = document.getElementById('footer-gf-name');
    const letterNameElem = document.getElementById('letter-name');
    const taglineElem = document.getElementById('gf-custom-tagline');
    const daysCountElem = document.getElementById('days-together-count');
    const senderNameElem = document.getElementById('letter-sender-name');
    const letterBodyElem = document.getElementById('letter-body-content');
    const heartsCountElem = document.getElementById('sent-hearts-counter');

    if (gfNameElem) gfNameElem.textContent = appState.gfName;
    if (footerNameElem) footerNameElem.textContent = appState.gfName;
    if (letterNameElem) letterNameElem.textContent = appState.gfName;
    if (taglineElem) taglineElem.textContent = appState.tagline;
    if (daysCountElem) daysCountElem.textContent = appState.daysCount;
    if (senderNameElem) senderNameElem.textContent = appState.senderName;
    if (heartsCountElem) heartsCountElem.textContent = appState.heartsCount || 0;

    if (letterBodyElem && appState.letterText) {
      // Format paragraphs
      const paras = appState.letterText.split('\n\n').filter(p => p.trim());
      letterBodyElem.innerHTML = paras.map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('') +
        `<p class="letter-closing">Happy Birthday, my beautiful soulmate.<br><strong class="letter-signature">${appState.senderName}</strong></p>`;
    }

    renderMemories();
    loadAndRenderNicknames();
    initCountdown();
  }

  // --- ROMANTIC BIRTHDAY COUNTDOWN ---
  function initCountdown() {
    // Target: Tomorrow at midnight (00:00:00)
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

    const daysElem = document.getElementById('cd-days');
    const hoursElem = document.getElementById('cd-hours');
    const minsElem = document.getElementById('cd-minutes');
    const secsElem = document.getElementById('cd-seconds');
    const daysBox = document.getElementById('cd-box-days');
    const daysSep = document.getElementById('cd-sep-days');
    const celebrationMsg = document.getElementById('countdown-celebration-banner');

    let celebrationTriggered = false;

    function update() {
      const current = new Date();
      const diff = target - current;

      if (diff <= 0) {
        if (daysElem) daysElem.textContent = '00';
        if (hoursElem) hoursElem.textContent = '00';
        if (minsElem) minsElem.textContent = '00';
        if (secsElem) secsElem.textContent = '00';

        if (celebrationMsg) celebrationMsg.classList.remove('hidden');

        if (!celebrationTriggered) {
          celebrationTriggered = true;
          if (window.confetti) {
            window.confetti({ particleCount: 150, spread: 80, origin: { y: 0.4 } });
          }
          if (window.romanticAudio) {
            window.romanticAudio.playCelebrationFanfare();
          }
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (daysBox && daysSep) {
        if (days > 0) {
          daysBox.style.display = 'flex';
          daysSep.style.display = 'block';
          if (daysElem) daysElem.textContent = String(days).padStart(2, '0');
        } else {
          daysBox.style.display = 'none';
          daysSep.style.display = 'none';
        }
      }

      if (hoursElem) hoursElem.textContent = String(hours).padStart(2, '0');
      if (minsElem) minsElem.textContent = String(minutes).padStart(2, '0');
      if (secsElem) secsElem.textContent = String(seconds).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  // --- ROMANTIC NICKNAME CARDS ---
  const defaultNicknames = [
    {
      id: 1,
      nickname: "Mine Sita 👑",
      tag: "My Forever Sita",
      rot: "-4.5deg",
      image: "https://res.cloudinary.com/dl7h2uexp/image/upload/v1793036833/Screenshot_2026-10-26-23-12-08-03_99c04817c0de5652397fc8b56c3b3817_gcjn02.jpg",
      wish: "To my one and only Sita, happy born day! You make my entire life blessed and complete."
    },
    {
      id: 2,
      nickname: "Thango 💖",
      tag: "Pure Gold",
      rot: "3.8deg",
      image: "https://res.cloudinary.com/dl7h2uexp/image/upload/v1793036833/Screenshot_2026-10-26-23-12-37-10_99c04817c0de5652397fc8b56c3b3817_c3k3fn.jpg",
      wish: "En Thango, you are the most precious treasure I could ever ask for. Love you endlessly!"
    },
    {
      id: 3,
      nickname: "Princess Norjahaan 🌸",
      tag: "My Royal Queen",
      rot: "-2.5deg",
      image: "https://res.cloudinary.com/dl7h2uexp/image/upload/v1793036832/Screenshot_2026-10-26-23-12-50-74_99c04817c0de5652397fc8b56c3b3817_zclwok.jpg",
      wish: "Breathtaking, regal, and the queen who rules my heart forever and always!"
    },
    {
      id: 4,
      nickname: "Chlm 💕",
      tag: "My Chellam",
      rot: "5.2deg",
      image: "https://res.cloudinary.com/dl7h2uexp/image/upload/v1793036832/Screenshot_2026-10-26-23-13-25-43_99c04817c0de5652397fc8b56c3b3817_cyp6jo.jpg",
      wish: "Happy born day en chlm! Your smile is the sweetest thing in the entire world."
    },
    {
      id: 5,
      nickname: "Pattu 🍯",
      tag: "Soft & Precious",
      rot: "-3.8deg",
      image: "https://res.cloudinary.com/dl7h2uexp/image/upload/v1793036832/Screenshot_2026-10-26-23-13-01-92_99c04817c0de5652397fc8b56c3b3817_iap4kq.jpg",
      wish: "En pattu kutty, sending you a million hugs and sweet kisses on your born day!"
    },
    {
      id: 6,
      nickname: "Smily Killer ✨",
      tag: "Deadly Smile",
      rot: "4.5deg",
      image: "https://res.cloudinary.com/dl7h2uexp/image/upload/v1793036831/Screenshot_2026-10-26-23-13-13-34_99c04817c0de5652397fc8b56c3b3817_x1ufbx.jpg",
      wish: "One single smile from you and my whole heart melts. You truly are my smily killer!"
    },
    {
      id: 7,
      nickname: "Buji 🥰",
      tag: "Cutie Buji",
      rot: "-5.5deg",
      image: "https://res.cloudinary.com/dl7h2uexp/image/upload/v1793036832/Screenshot_2026-10-26-23-13-36-65_99c04817c0de5652397fc8b56c3b3817_lv4i7t.jpg",
      wish: "En buji, you bring pure sunshine and laughter into my life every single day."
    },
    {
      id: 8,
      nickname: "Sanda Karri 😜",
      tag: "Sweet Fighter",
      rot: "3.2deg",
      image: "https://res.cloudinary.com/dl7h2uexp/image/upload/v1793036831/Screenshot_2026-10-26-23-13-47-31_99c04817c0de5652397fc8b56c3b3817_f1cw7e.jpg",
      wish: "Even when you fight or get angry at me, you are still the cutest girl in the universe!"
    },
    {
      id: 9,
      nickname: "Mine Baby 🍼",
      tag: "My Little Baby",
      rot: "-4deg",
      image: "https://res.cloudinary.com/dl7h2uexp/image/upload/v1793036831/Screenshot_2026-10-26-23-14-01-38_99c04817c0de5652397fc8b56c3b3817_aqrxzq.jpg",
      wish: "I will forever pamper you, protect you, and cherish you like my little baby."
    },
    {
      id: 10,
      nickname: "Kutta 🧸",
      tag: "Lovable Kutta",
      rot: "4.2deg",
      image: "https://res.cloudinary.com/dl7h2uexp/image/upload/v1793036830/Screenshot_2026-10-26-23-14-45-85_99c04817c0de5652397fc8b56c3b3817_uehjdz.jpg",
      wish: "To my sweet kutta, always by your side holding your hand through every chapter."
    },
    {
      id: 11,
      nickname: "Mine World 🌍",
      tag: "My Everything",
      rot: "-3.2deg",
      image: "https://res.cloudinary.com/dl7h2uexp/image/upload/v1793036831/Screenshot_2026-10-26-23-14-27-43_99c04817c0de5652397fc8b56c3b3817_uybt62.jpg",
      wish: "Everything begins and ends with you. You are not just a part of my life, you are my world."
    },
    {
      id: 12,
      nickname: "Wifey & Pondati 💍👰",
      tag: "Future Wife",
      rot: "5deg",
      image: "https://res.cloudinary.com/dl7h2uexp/image/upload/v1793036830/Screenshot_2026-10-26-23-15-09-28_99c04817c0de5652397fc8b56c3b3817_smj9ms.jpg",
      wish: "Happy born day to my beautiful future wifey and pondati! Forever yours."
    },
    {
      id: 13,
      nickname: "Kiddo 🐥",
      tag: "Playful Angel",
      rot: "3.5deg",
      image: "https://res.cloudinary.com/dl7h2uexp/image/upload/v1793036830/Screenshot_2026-10-26-23-16-33-05_99c04817c0de5652397fc8b56c3b3817_ga34b0.jpg",
      wish: "Never lose that innocent, bubbly smile of yours, my cute kiddo!"
    },
    {
      id: 14,
      nickname: "Sweet Heart 🍬",
      tag: "Pure Love",
      rot: "-3deg",
      image: "https://res.cloudinary.com/dl7h2uexp/image/upload/v1793036830/Screenshot_2026-10-26-23-14-57-34_99c04817c0de5652397fc8b56c3b3817_sukzci.jpg",
      wish: "Wishing the sweetest girl on earth a day filled with boundless joy and chocolate treats!"
    },
    {
      id: 15,
      nickname: "My Everything 💫",
      tag: "My All",
      rot: "4deg",
      image: "https://res.cloudinary.com/dl7h2uexp/image/upload/v1793036830/Screenshot_2026-10-26-23-14-14-44_99c04817c0de5652397fc8b56c3b3817_jhdr1w.jpg",
      wish: "You are my dream come true, my today, my tomorrow, and my forever everything."
    }
  ];

  async function loadAndRenderNicknames() {
    const track = document.getElementById('nickname-cards-container');
    if (!track) return;

    let items = defaultNicknames;

    // 1. Check embedded data script first (works immediately with file:// protocol without CORS)
    const embeddedElem = document.getElementById('nicknames-embedded-data');
    if (embeddedElem && embeddedElem.textContent) {
      try {
        const parsed = JSON.parse(embeddedElem.textContent);
        if (Array.isArray(parsed) && parsed.length > 0) items = parsed;
      } catch (err) {}
    }

    // 2. Try fetching nicknames.json (for live web hosting / servers)
    try {
      const res = await fetch('nicknames.json');
      if (res.ok) {
        items = await res.json();
      }
    } catch (e) {
      // Ignored for local file:// mode
    }

    window.loadedNicknames = items;
    track.innerHTML = '';
    const rotationPool = ['-4.5deg', '3.8deg', '-2.5deg', '5.2deg', '-3.8deg', '4.5deg', '-5.5deg', '3.2deg'];

    items.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'hanging-polaroid-card';
      const rot = item.rot || rotationPool[idx % rotationPool.length];
      card.style.setProperty('--rot', rot);

      card.innerHTML = `
        <div class="wooden-peg-clip" title="Clipped with love">
          <div class="peg-spring-wire"></div>
        </div>
        <div class="polaroid-photo-frame">
          <img src="${item.image}" alt="${item.nickname}" loading="lazy">
          <span class="polaroid-tag-pill">${item.tag}</span>
        </div>
        <div class="polaroid-nickname-text">${item.nickname}</div>
        <div class="polaroid-tap-hint">Tap for wish ✨</div>
      `;

      card.addEventListener('click', (e) => {
        triggerBurst(e.clientX, e.clientY, 15);
        window.romanticAudio.playSparkle();

        const noteModal = document.getElementById('note-modal');
        const noteTitle = document.getElementById('note-modal-title');
        const noteContent = document.getElementById('note-modal-content');
        if (noteModal && noteTitle && noteContent) {
          noteTitle.textContent = item.nickname;
          noteContent.innerHTML = `"${item.wish}"<br><br><span style="font-size:0.9rem;color:var(--pink-soft);font-family:var(--font-body)">You will always be my ${item.nickname} ❤️</span>`;
          noteModal.classList.remove('hidden');
        }
      });

      track.appendChild(card);
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }

    initGarlandControls();
  }

  // --- MODERN GARLAND NAVIGATION & ARROWS ---
  let garlandControlsInitialized = false;
  function initGarlandControls() {
    const track = document.getElementById('nickname-cards-container');
    const prevBtn = document.getElementById('garland-prev-btn');
    const nextBtn = document.getElementById('garland-next-btn');
    const progressBar = document.getElementById('garland-progress-bar');

    if (!track) return;

    function updateProgressBar() {
      if (!progressBar) return;
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 0) {
        progressBar.style.width = '100%';
        progressBar.style.transform = 'none';
        return;
      }
      const scrollPercent = track.scrollLeft / maxScroll;
      const trackWidth = 160;
      const thumbWidth = 45;
      const maxTranslate = trackWidth - thumbWidth;
      progressBar.style.width = `${thumbWidth}px`;
      progressBar.style.transform = `translateX(${scrollPercent * maxTranslate}px)`;
    }

    if (!garlandControlsInitialized) {
      garlandControlsInitialized = true;

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          track.scrollBy({ left: -260, behavior: 'smooth' });
          if (window.romanticAudio) window.romanticAudio.playSparkle();
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          track.scrollBy({ left: 260, behavior: 'smooth' });
          if (window.romanticAudio) window.romanticAudio.playSparkle();
        });
      }

      track.addEventListener('scroll', updateProgressBar, { passive: true });
      window.addEventListener('resize', updateProgressBar);
    }

    setTimeout(updateProgressBar, 300);
  }

  // --- RENDER MEMORIES ---
  const memoryGrid = document.getElementById('memory-grid');
  function renderMemories() {
    if (!memoryGrid) return;
    memoryGrid.innerHTML = '';

    appState.memories.forEach((mem, idx) => {
      const card = document.createElement('div');
      card.className = 'polaroid-card';
      card.style.setProperty('--rot', mem.rot || (idx % 2 === 0 ? '-2deg' : '2deg'));

      const backNotes = [
        "I still remember the butterflies the exact minute I saw you! 🦋",
        "We could talk and spend time together until 1 PM and it would still feel like 5 minutes. ✨",
        "27-07-2026: We spent time together holding hands. Our first hug and first kiss are still so vivid and precious in my memories. 🛕❤️",
        "Our first movie experience that I will never forget — both of us holding hands, looking into each other's eyes eye-to-eye... such an unforgettable moment. 🎬✨"
      ];
      const backNote = mem.backNote || backNotes[idx % backNotes.length];

      card.innerHTML = `
        <div class="tape-strip"></div>
        <div class="polaroid-card-inner">
          <div class="polaroid-front">
            <div class="polaroid-image-frame">
              <img src="${mem.image}" alt="${mem.title}" loading="lazy">
              <span class="polaroid-badge">${mem.tag || 'Special'}</span>
            </div>
            <div class="polaroid-caption">
              <div class="polaroid-title">${mem.title}</div>
              <div class="polaroid-date">${mem.date} • Tap to flip ↺</div>
            </div>
          </div>
          <div class="polaroid-back">
            <div class="polaroid-back-note">"${backNote}"</div>
            <div class="polaroid-back-hint">❤️ Tap to flip back ❤️</div>
          </div>
        </div>
      `;

      card.addEventListener('click', (e) => {
        card.classList.toggle('is-flipped');
        triggerBurst(e.clientX, e.clientY, 8);
        window.romanticAudio.playSparkle();
      });

      memoryGrid.appendChild(card);
    });
  }

  // Add Custom Photo to Memory Lane
  const addPhotoBtn = document.getElementById('add-memory-photo-btn');
  const fileInput = document.getElementById('memory-file-input');

  if (addPhotoBtn && fileInput) {
    addPhotoBtn.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const titlePrompt = prompt("Give this memory a cute title:", "Our Sweet Date ❤️") || "Our Love Moment";
        const datePrompt = prompt("Add a date or note (e.g. Summer 2024):", "A day to remember") || "Always";

        appState.memories.push({
          title: titlePrompt,
          date: datePrompt,
          image: event.target.result,
          tag: "Unforgettable",
          rot: (Math.random() * 6 - 3).toFixed(1) + 'deg'
        });

        saveState();
        renderMemories();
        window.romanticAudio.playSparkle();
      };
      reader.readAsDataURL(file);
    });
  }

  // --- PETALS & SPARKS CANVAS ANIMATION ---
  const canvas = document.getElementById('petals-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const petalCount = 42;
    const petals = [];

    class Petal {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : -30;
        this.size = Math.random() * 14 + 10;
        this.speedY = Math.random() * 1.2 + 0.8;
        this.speedX = Math.random() * 1.5 - 0.75;
        this.rot = Math.random() * 360;
        this.rotSpeed = Math.random() * 1.8 - 0.9;
        this.flip = Math.random();
        this.flipSpeed = Math.random() * 0.02 + 0.01;
        // Soft romantic pink / rose hues
        const colors = [
          'rgba(255, 182, 193, 0.65)',
          'rgba(255, 143, 171, 0.7)',
          'rgba(255, 105, 180, 0.55)',
          'rgba(255, 228, 235, 0.6)'
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.01) + this.speedX;
        this.rot += this.rotSpeed;
        this.flip += this.flipSpeed;

        if (this.y > height + 30 || this.x < -40 || this.x > width + 40) {
          this.reset(false);
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rot * Math.PI) / 180);
        ctx.scale(1, Math.sin(this.flip));

        ctx.fillStyle = this.color;
        ctx.beginPath();
        // Rose petal curved shape
        ctx.moveTo(0, -this.size / 2);
        ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size);
        ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, -this.size / 2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < petalCount; i++) {
      petals.push(new Petal());
    }

    function animatePetals() {
      ctx.clearRect(0, 0, width, height);
      for (let p of petals) {
        p.update();
        p.draw();
      }
      requestAnimationFrame(animatePetals);
    }
    animatePetals();
  }

  // --- FLOATING HEARTS BURST UTILITY ---
  const heartEmojis = ['💖', '💕', '✨', '🌸', '❤️', '🌹', '🥰', '💫'];

  function triggerBurst(x, y, count = 12) {
    const container = document.getElementById('heart-burst-container');
    if (!container) return;

    for (let i = 0; i < count; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

      const offsetX = (Math.random() - 0.5) * 50;
      const offsetY = (Math.random() - 0.5) * 50;
      const tx = (Math.random() - 0.5) * 200;

      heart.style.left = `${x + offsetX}px`;
      heart.style.top = `${y + offsetY}px`;
      heart.style.setProperty('--tx', `${tx}px`);
      heart.style.animationDuration = `${1.2 + Math.random() * 1}s`;

      container.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 2200);
    }

    // Increment heart counter
    appState.heartsCount = (appState.heartsCount || 0) + 1;
    saveState();
    const counter = document.getElementById('sent-hearts-counter');
    if (counter) counter.textContent = appState.heartsCount;
  }

  // Screen click particle effect
  window.addEventListener('click', (e) => {
    // Avoid double burst if clicking button
    if (e.target.closest('button') || e.target.closest('.cake-container') || e.target.closest('.wax-seal')) return;
    triggerBurst(e.clientX, e.clientY, 4);
  });

  // Tap Shower Button
  const tapShowerBtn = document.getElementById('tap-shower-btn');
  if (tapShowerBtn) {
    tapShowerBtn.addEventListener('click', (e) => {
      const rect = tapShowerBtn.getBoundingClientRect();
      triggerBurst(rect.left + rect.width / 2, rect.top, 25);
      window.romanticAudio.playSparkle();
    });
  }

  // --- MUSIC BOX TOGGLE ---
  const musicBtn = document.getElementById('music-toggle-btn');
  const musicLabel = musicBtn ? musicBtn.querySelector('.music-label') : null;

  if (musicBtn) {
    musicBtn.addEventListener('click', () => {
      const isPlaying = window.romanticAudio.toggleMelody();
      if (isPlaying) {
        musicBtn.classList.add('playing');
        if (musicLabel) musicLabel.textContent = "Melody: Playing 🎵";
      } else {
        musicBtn.classList.remove('playing');
        if (musicLabel) musicLabel.textContent = "Melody: Off";
      }
    });
  }

  // --- INTERACTIVE BIRTHDAY CAKE & CANDLE BLOWOUT ---
  const cake = document.getElementById('birthday-cake');
  const blowBtn = document.getElementById('blow-candle-btn');
  const blowBtnText = document.getElementById('blow-btn-text');
  const wishCard = document.getElementById('wish-success-card');
  const flames = document.querySelectorAll('.flame');
  let candlesBlown = false;

  function blowOutCandles(e) {
    if (candlesBlown) {
      // Re-light option
      flames.forEach(f => f.classList.remove('extinguished'));
      candlesBlown = false;
      if (blowBtnText) blowBtnText.textContent = "Make a Wish & Blow Candles! 💨";
      if (wishCard) wishCard.classList.add('hidden');
      return;
    }

    // Blow flames
    flames.forEach(f => f.classList.add('extinguished'));
    candlesBlown = true;
    if (blowBtnText) blowBtnText.textContent = "Relight Candles 🕯️";

    // Play fanfare
    window.romanticAudio.playCelebrationFanfare();

    // Trigger massive celebratory confetti
    if (window.confetti) {
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      function fire(particleRatio, opts) {
        window.confetti(Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio)
        }));
      }

      fire(0.25, { spread: 26, startVelocity: 55, colors: ['#ff4b72', '#fcd34d', '#ff8fab'] });
      fire(0.2, { spread: 60, colors: ['#ffffff', '#ffcad4'] });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, colors: ['#ffd700'] });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }

    if (wishCard) {
      wishCard.classList.remove('hidden');
    }
  }

  if (cake) cake.addEventListener('click', blowOutCandles);
  if (blowBtn) blowBtn.addEventListener('click', blowOutCandles);

  // --- SEALED ROMANTIC LOVE LETTER ---
  const envelopeBox = document.getElementById('envelope-box');
  const waxSeal = document.getElementById('wax-seal');
  const closeLetterBtn = document.getElementById('close-letter-btn');
  const envelopeHint = document.getElementById('envelope-hint-text');

  function openEnvelope() {
    if (!envelopeBox) return;
    envelopeBox.classList.add('opened');
    if (envelopeHint) envelopeHint.style.display = 'none';
    window.romanticAudio.playEnvelopeOpen();

    // Spawn heart particles around envelope
    const rect = envelopeBox.getBoundingClientRect();
    triggerBurst(rect.left + rect.width / 2, rect.top + 80, 20);
  }

  function closeEnvelope(e) {
    e.stopPropagation();
    if (!envelopeBox) return;
    envelopeBox.classList.remove('opened');
    if (envelopeHint) envelopeHint.style.display = 'block';
  }

  if (waxSeal) waxSeal.addEventListener('click', openEnvelope);
  if (closeLetterBtn) closeLetterBtn.addEventListener('click', closeEnvelope);

  // --- QUOTE DISPENSER ---
  const quotesData = [
    {
      category: "romantic",
      text: "In a world of billions of people, my eyes will always search for you in every crowd.",
      author: "— My Heart, Every Single Day"
    },
    {
      category: "romantic",
      text: "You aren't just the love of my life, you're the peace I always longed for.",
      author: "— Forever & Always"
    },
    {
      category: "funny",
      text: "I love you even when you steal all the blankets and pretend you didn't.",
      author: "— Cold Feet Survivor"
    },
    {
      category: "funny",
      text: "You are the only person I would share my favorite snacks with... well, mostly share.",
      author: "— 100% Honest Boyfriend"
    },
    {
      category: "sweet",
      text: "The little scrunch you do with your nose when you laugh makes my entire day better.",
      author: "— My Favorite View"
    },
    {
      category: "sweet",
      text: "I fall in love with you all over again in the quiet, simple moments nobody else sees.",
      author: "— Pure Little Things"
    },
    {
      category: "future",
      text: "I can't wait for all the trips we haven't taken yet, all the sunrises we have yet to watch together.",
      author: "— To Our Beautiful Future"
    },
    {
      category: "future",
      text: "Whatever happens tomorrow, next year, or fifty years from now: my hand is yours to hold.",
      author: "— A Lifetime Promise"
    }
  ];

  let currentCategory = "all";
  const catPills = document.querySelectorAll('.cat-pill');
  const quoteTextElem = document.getElementById('active-quote-text');
  const quoteAuthorElem = document.getElementById('active-quote-author');
  const nextQuoteBtn = document.getElementById('next-quote-btn');
  const heartQuoteBtn = document.getElementById('heart-like-quote-btn');

  function getRandomQuote() {
    const filtered = currentCategory === "all" 
      ? quotesData 
      : quotesData.filter(q => q.category === currentCategory);
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  function updateQuote() {
    const item = getRandomQuote();
    if (!quoteTextElem || !quoteAuthorElem) return;

    quoteTextElem.style.opacity = '0';
    quoteAuthorElem.style.opacity = '0';

    setTimeout(() => {
      quoteTextElem.textContent = `"${item.text}"`;
      quoteAuthorElem.textContent = item.author;
      quoteTextElem.style.opacity = '1';
      quoteAuthorElem.style.opacity = '1';
    }, 200);

    window.romanticAudio.playSparkle();
  }

  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.dataset.category;
      updateQuote();
    });
  });

  if (nextQuoteBtn) nextQuoteBtn.addEventListener('click', updateQuote);
  if (heartQuoteBtn) {
    heartQuoteBtn.addEventListener('click', (e) => {
      triggerBurst(e.clientX, e.clientY, 15);
      window.romanticAudio.playSparkle();
    });
  }

  // --- "OPEN WHEN..." VIRTUAL NOTES MODAL ---
  const openWhenItems = document.querySelectorAll('.open-when-item');
  const noteModal = document.getElementById('note-modal');
  const noteTitle = document.getElementById('note-modal-title');
  const noteContent = document.getElementById('note-modal-content');
  const closeNoteBtn = document.getElementById('close-note-modal');
  const hugNoteBtn = document.getElementById('hug-note-btn');

  const notesDatabase = {
    sad: {
      title: "When You Miss Me 🥺",
      content: "Close your eyes right now and take a deep breath. Imagine my arms wrapped tightly around you, holding you close. No matter how many miles or hours stand between us, my heart is always sitting right next to yours. I am only one message or phone call away. You are never alone."
    },
    laugh: {
      title: "When You Need A Laugh 😂",
      content: "Reminder: You voluntarily chose to date me! That means you have exceptional taste, but also questionably high patience. Also, remember that goofy face I make? Picture it right now. Smile, beautiful — life is too short to be serious today!"
    },
    sleep: {
      title: "When You Can't Sleep 🌙",
      content: "Leave all today's worries outside your door. You did enough today, and you are more than enough. Rest your pretty head, let your thoughts drift into sweet daydreams, and know that someone is falling asleep thinking of how lucky they are to love you. Goodnight, my darling."
    },
    doubt: {
      title: "When You Feel Insecure 👑",
      content: "Look at yourself through my eyes for just ten seconds. You would see someone fiercely intelligent, breathtakingly stunning, relentlessly caring, and uniquely unforgettable. You don't need to be flawless to be magnificent. Straighten your crown, my queen."
    }
  };

  openWhenItems.forEach(item => {
    item.addEventListener('click', () => {
      const type = item.dataset.note;
      const data = notesDatabase[type];
      if (!data || !noteModal) return;

      noteTitle.textContent = data.title;
      noteContent.textContent = data.content;
      noteModal.classList.remove('hidden');
      window.romanticAudio.playTone(587.33, 0.5);
    });
  });

  if (closeNoteBtn && noteModal) {
    closeNoteBtn.addEventListener('click', () => {
      noteModal.classList.add('hidden');
    });
  }

  if (hugNoteBtn) {
    hugNoteBtn.addEventListener('click', (e) => {
      triggerBurst(window.innerWidth / 2, window.innerHeight / 2, 20);
      window.romanticAudio.playSparkle();
      if (noteModal) noteModal.classList.add('hidden');
    });
  }

  // --- HOW WELL DO YOU KNOW US? QUIZ ---
  const quizQuestions = [
    {
      question: "Who fell in love first?",
      options: [
        { text: "Me (no contest!)", correct: true, feedback: "You know it! I was captivated from the very first hello! 🥰" },
        { text: "You did, admit it!", correct: true, feedback: "Haha, maybe both of us fell into each other's orbit! 💕" },
        { text: "It was 100% mutual at the exact same second", correct: true, feedback: "A romantic fairytale answer! ✨" }
      ]
    },
    {
      question: "What is my absolute favorite thing about you?",
      options: [
        { text: "Your gorgeous eyes & radiant smile", correct: true, feedback: "They brighten up my entire galaxy! 🌟" },
        { text: "Your warm, caring heart", correct: true, feedback: "You have the kindest soul I have ever known. 💖" },
        { text: "All of the above + a million more reasons", correct: true, feedback: "Spot on! There's literally no picking just one. 👑" }
      ]
    },
    {
      question: "What's our ultimate couple superpower?",
      options: [
        { text: "Laughing until our stomachs hurt", correct: true, feedback: "Our laughter cures everything! 😂" },
        { text: "Knowing what the other thinks without talking", correct: true, feedback: "We have telepathic couple connection! 🧠✨" },
        { text: "Being each other's safest sanctuary", correct: true, feedback: "Always and forever your safe harbor. 🏡" }
      ]
    },
    {
      question: "What is my biggest wish for you on your birthday?",
      options: [
        { text: "Endless laughter, genuine peace, and happiness", correct: true, feedback: "You deserve all the sweetness this universe has to offer! 🎂" },
        { text: "Achieving every single one of your wildest dreams", correct: true, feedback: "And I will be right by your side cheering loudest! 🏆" },
        { text: "All of this, plus being loved endlessly by me", correct: true, feedback: "Ding ding ding! You win my whole heart forever! 💖🎉" }
      ]
    }
  ];

  let currentQuizStep = 0;
  const quizQuestionText = document.getElementById('quiz-question-text');
  const quizOptionsContainer = document.getElementById('quiz-options-container');
  const quizFeedbackBox = document.getElementById('quiz-feedback-box');
  const quizFeedbackText = document.getElementById('quiz-feedback-text');
  const quizNextBtn = document.getElementById('quiz-next-btn');
  const quizProgressFill = document.getElementById('quiz-progress-fill');
  const quizStepCounter = document.getElementById('quiz-step-counter');

  function renderQuizQuestion() {
    if (!quizQuestionText || !quizOptionsContainer) return;
    const q = quizQuestions[currentQuizStep];
    quizQuestionText.textContent = q.question;
    quizOptionsContainer.innerHTML = '';
    if (quizFeedbackBox) quizFeedbackBox.classList.add('hidden');

    if (quizStepCounter) {
      quizStepCounter.textContent = `Question ${currentQuizStep + 1} of ${quizQuestions.length}`;
    }
    if (quizProgressFill) {
      quizProgressFill.style.width = `${((currentQuizStep + 1) / quizQuestions.length) * 100}%`;
    }

    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `<span>${opt.text}</span> <i data-lucide="chevron-right"></i>`;
      btn.addEventListener('click', () => {
        // Disable other buttons
        quizOptionsContainer.querySelectorAll('.quiz-option-btn').forEach(b => b.disabled = true);
        btn.classList.add('selected-correct');

        if (quizFeedbackBox && quizFeedbackText) {
          quizFeedbackText.textContent = opt.feedback;
          quizFeedbackBox.classList.remove('hidden');
        }

        window.romanticAudio.playSparkle();
        if (window.lucide) window.lucide.createIcons();
      });
      quizOptionsContainer.appendChild(btn);
    });

    if (window.lucide) window.lucide.createIcons();
  }

  if (quizNextBtn) {
    quizNextBtn.addEventListener('click', () => {
      currentQuizStep = (currentQuizStep + 1) % quizQuestions.length;
      renderQuizQuestion();
    });
  }

  renderQuizQuestion();

  // --- MYSTERY BIRTHDAY GIFT WRAPPER ---
  const giftBox = document.getElementById('mystery-gift-box');
  const giftRevealModal = document.getElementById('gift-reveal-modal');

  if (giftBox && giftRevealModal) {
    giftBox.addEventListener('click', (e) => {
      giftBox.classList.toggle('opened');
      giftRevealModal.classList.toggle('hidden');
      
      const rect = giftBox.getBoundingClientRect();
      triggerBurst(rect.left + rect.width / 2, rect.top, 20);
      window.romanticAudio.playCelebrationFanfare();

      if (window.confetti) {
        window.confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    });
  }

  // --- PERSONALIZATION MODAL & CONTROLS ---
  const customizeBtn = document.getElementById('customize-btn');
  const customizeModal = document.getElementById('customize-modal');
  const closeCustomizeBtn = document.getElementById('close-customize-modal');
  const saveCustomizeBtn = document.getElementById('save-customize-btn');
  const resetDefaultsBtn = document.getElementById('reset-defaults-btn');

  const inputGfName = document.getElementById('input-gf-name');
  const inputTagline = document.getElementById('input-custom-tagline');
  const inputDaysCount = document.getElementById('input-days-count');
  const inputSenderName = document.getElementById('input-sender-name');
  const inputLoveLetter = document.getElementById('input-love-letter');

  if (customizeBtn && customizeModal) {
    customizeBtn.addEventListener('click', () => {
      if (inputGfName) inputGfName.value = appState.gfName;
      if (inputTagline) inputTagline.value = appState.tagline;
      if (inputDaysCount) inputDaysCount.value = appState.daysCount;
      if (inputSenderName) inputSenderName.value = appState.senderName;
      if (inputLoveLetter) inputLoveLetter.value = appState.letterText;
      customizeModal.classList.remove('hidden');
    });
  }

  if (closeCustomizeBtn && customizeModal) {
    closeCustomizeBtn.addEventListener('click', () => {
      customizeModal.classList.add('hidden');
    });
  }

  if (saveCustomizeBtn) {
    saveCustomizeBtn.addEventListener('click', () => {
      if (inputGfName) appState.gfName = inputGfName.value.trim() || defaultState.gfName;
      if (inputTagline) appState.tagline = inputTagline.value.trim() || defaultState.tagline;
      if (inputDaysCount) appState.daysCount = inputDaysCount.value.trim() || defaultState.daysCount;
      if (inputSenderName) appState.senderName = inputSenderName.value.trim() || defaultState.senderName;
      if (inputLoveLetter) appState.letterText = inputLoveLetter.value.trim() || defaultState.letterText;

      saveState();
      applyStateToUI();
      if (customizeModal) customizeModal.classList.add('hidden');
      window.romanticAudio.playSparkle();
    });
  }

  if (resetDefaultsBtn) {
    resetDefaultsBtn.addEventListener('click', () => {
      if (confirm("Reset everything back to romantic default settings?")) {
        appState = JSON.parse(JSON.stringify(defaultState));
        saveState();
        applyStateToUI();
        if (customizeModal) customizeModal.classList.add('hidden');
      }
    });
  }

  // Close modals on backdrop click
  window.addEventListener('click', (e) => {
    if (e.target === customizeModal) customizeModal.classList.add('hidden');
    if (e.target === noteModal) noteModal.classList.add('hidden');
    const passcodeModal = document.getElementById('passcode-modal');
    if (e.target === passcodeModal) passcodeModal.classList.add('hidden');
  });

  // --- GLOBAL ROMANTIC LOCK SCREEN & PASSCODE 2627 SYSTEM ---
  function initGlobalLockScreen() {
    const lockScreen = document.getElementById('global-lock-screen');
    if (!lockScreen) return;

    // Check if previously unlocked in this session
    if (sessionStorage.getItem('romantic_lock_bypassed') === 'true') {
      lockScreen.classList.add('unlocked');
    }

    // Logout / Lock Website Button (Returns back to Countdown Lock Screen)
    const lockScreenBtn = document.getElementById('lock-screen-btn');
    if (lockScreenBtn) {
      lockScreenBtn.addEventListener('click', () => {
        sessionStorage.removeItem('romantic_lock_bypassed');
        lockScreen.classList.remove('unlocked');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        if (window.romanticAudio) {
          window.romanticAudio.playChime();
        }
      });
    }

    // Target: Tomorrow at midnight
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);

    const lockDays = document.getElementById('lock-cd-days');
    const lockHours = document.getElementById('lock-cd-hours');
    const lockMins = document.getElementById('lock-cd-mins');
    const lockSecs = document.getElementById('lock-cd-secs');
    const lockDaysItem = document.getElementById('lock-cd-days-item');
    const lockDaysSep = document.getElementById('lock-cd-days-sep');

    function updateLockCountdown() {
      const current = new Date();
      const diff = target - current;

      if (diff <= 0) {
        // Auto-unlock when born day arrives!
        if (!lockScreen.classList.contains('unlocked')) {
          lockScreen.classList.add('unlocked');
          if (window.confetti) {
            window.confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
          }
          if (window.romanticAudio) {
            window.romanticAudio.playCelebrationFanfare();
          }
        }
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (lockDaysItem && lockDaysSep) {
        if (days > 0) {
          lockDaysItem.style.display = 'flex';
          lockDaysSep.style.display = 'block';
          if (lockDays) lockDays.textContent = String(days).padStart(2, '0');
        } else {
          lockDaysItem.style.display = 'none';
          lockDaysSep.style.display = 'none';
        }
      }

      if (lockHours) lockHours.textContent = String(hours).padStart(2, '0');
      if (lockMins) lockMins.textContent = String(minutes).padStart(2, '0');
      if (lockSecs) lockSecs.textContent = String(seconds).padStart(2, '0');
    }

    updateLockCountdown();
    setInterval(updateLockCountdown, 1000);

    // Make all floating nickname bubbles interactive with hearts and sound
    document.querySelectorAll('.cloud-bubble, .lock-mini-pill').forEach(el => {
      el.addEventListener('click', (e) => {
        triggerBurst(e.clientX, e.clientY, 15);
        window.romanticAudio.playSparkle();
      });
    });

    // Passcode Popup Modal & Validation (Code: 2627)
    const openPasscodeBtn = document.getElementById('open-passcode-modal-btn');
    const passcodeModal = document.getElementById('passcode-modal');
    const closePasscodeBtn = document.getElementById('close-passcode-modal');
    const cancelPasscodeBtn = document.getElementById('cancel-passcode-btn');
    const submitPasscodeBtn = document.getElementById('submit-passcode-btn');
    const passcodeInput = document.getElementById('passcode-input');
    const passcodeError = document.getElementById('passcode-error-msg');

    if (openPasscodeBtn && passcodeModal) {
      openPasscodeBtn.addEventListener('click', () => {
        passcodeModal.classList.remove('hidden');
        if (passcodeError) passcodeError.classList.add('hidden');
        if (passcodeInput) {
          passcodeInput.value = '';
          setTimeout(() => passcodeInput.focus(), 150);
        }
      });
    }

    function closePasscodeModal() {
      if (passcodeModal) passcodeModal.classList.add('hidden');
    }

    if (closePasscodeBtn) closePasscodeBtn.addEventListener('click', closePasscodeModal);
    if (cancelPasscodeBtn) cancelPasscodeBtn.addEventListener('click', closePasscodeModal);

    function attemptUnlock() {
      if (!passcodeInput) return;
      const code = passcodeInput.value.trim();

      // Hardcoded secret password: 2627
      if (code === '2627') {
        if (passcodeError) passcodeError.classList.add('hidden');
        closePasscodeModal();

        // Unlock global overlay
        lockScreen.classList.add('unlocked');
        sessionStorage.setItem('romantic_lock_bypassed', 'true');

        // Celebration explosion
        if (window.confetti) {
          window.confetti({ particleCount: 180, spread: 90, origin: { y: 0.5 } });
        }
        window.romanticAudio.playCelebrationFanfare();
        triggerBurst(window.innerWidth / 2, window.innerHeight / 2, 25);
      } else {
        if (passcodeError) {
          passcodeError.classList.remove('hidden');
          passcodeInput.value = '';
          passcodeInput.focus();
        }
      }
    }

    if (submitPasscodeBtn) submitPasscodeBtn.addEventListener('click', attemptUnlock);
    if (passcodeInput) {
      passcodeInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') attemptUnlock();
      });
    }

    // Lock screen background particles canvas
    const lockCanvas = document.getElementById('lock-petals-canvas');
    if (lockCanvas) {
      const ctx = lockCanvas.getContext('2d');
      let w = (lockCanvas.width = window.innerWidth);
      let h = (lockCanvas.height = window.innerHeight);

      window.addEventListener('resize', () => {
        w = lockCanvas.width = window.innerWidth;
        h = lockCanvas.height = window.innerHeight;
      });

      const lockParticles = [];
      for (let i = 0; i < 35; i++) {
        lockParticles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 12 + 8,
          speedY: Math.random() * 1.1 + 0.6,
          speedX: Math.random() * 1.2 - 0.6,
          color: ['rgba(255, 75, 114, 0.6)', 'rgba(255, 182, 193, 0.7)', 'rgba(252, 211, 77, 0.5)'][Math.floor(Math.random() * 3)],
          rot: Math.random() * 360,
          rotSpeed: Math.random() * 2 - 1
        });
      }

      function drawLockCanvas() {
        ctx.clearRect(0, 0, w, h);
        for (let p of lockParticles) {
          p.y += p.speedY;
          p.x += p.speedX;
          p.rot += p.rotSpeed;
          if (p.y > h + 20) p.y = -20;
          if (p.x > w + 20) p.x = -20;
          if (p.x < -20) p.x = w + 20;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rot * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
        if (!lockScreen.classList.contains('unlocked')) {
          requestAnimationFrame(drawLockCanvas);
        }
      }
      drawLockCanvas();
    }
  }

  // Apply saved values immediately on boot
  applyStateToUI();
  initGlobalLockScreen();
});
