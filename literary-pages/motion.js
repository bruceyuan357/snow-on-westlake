(() => {
  'use strict';
  const root = document.documentElement;
  const passage = document.getElementById('passage');
  const mist = document.getElementById('mist');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const printMedia = matchMedia('print');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const elements = [...document.querySelectorAll('.scene')];
  const distances = elements.map(element => Number(element.dataset.distance));
  const camera = elements.map(element => element.dataset.camera.split(',').map(Number));
  const scenes = elements.map((element, index) => ({
    element, index, frame: element.querySelector('.scene-frame'), photo: element.querySelector('.scene-image'),
    prose: element.querySelector('.prose'), paragraphs: [...element.querySelectorAll('.prose > p')],
    portal: element.querySelector('.portal'), start: 0, span: 0, width: 0, height: 0, point: null,
    pose: { scale: 1, x: 0, y: 0 }
  }));
  const byId = new Map(scenes.map(scene => [scene.element.id, scene]));
  const clamp = value => Math.max(0, Math.min(1, value));
  const smooth = value => { const x = clamp(value); return x * x * (3 - 2 * x); };
  const set = (element, property, value) => { if (element.style[property] !== value) element.style[property] = value; };
  let enabled = false;
  let initialized = false;
  let screenHeight = innerHeight;
  let virtualY = scrollY;
  let frameRequest = 0;
  let lastTick = 0;
  let introAt = 0;
  let flight = null;
  let dominant = 0;
  let paintings = null;
  let paintingRequested = false;
  let preparedIndex = -1;
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

  function getLocation(y = virtualY) {
    let index = 0;
    for (const scene of scenes) if (y >= scene.start) index = scene.index;
    const scene = scenes[index];
    return { index, ratio: (y - scene.start) / Math.max(scene.span, 1) };
  }
  function measure() {
    screenHeight = innerHeight;
    root.style.setProperty('--screen', screenHeight + 'px');
    for (const scene of scenes) {
      scene.start = scene.element.offsetTop;
      scene.span = scene.element.offsetHeight;
      scene.width = scene.frame.clientWidth;
      scene.height = scene.frame.clientHeight;
      const photo = scene.photo;
      if (photo.naturalWidth && scene.width && scene.height) {
        const scale = Math.max(scene.width / photo.naturalWidth, scene.height / photo.naturalHeight);
        const position = getComputedStyle(photo).objectPosition.split(' ').map(value => parseFloat(value) / 100);
        scene.crop = {
          x: (1 - photo.naturalWidth * scale / scene.width) * position[0],
          y: (1 - photo.naturalHeight * scale / scene.height) * position[1],
          width: photo.naturalWidth * scale / scene.width,
          height: photo.naturalHeight * scale / scene.height
        };
        if (scene.portal) scene.point = {
          x: scene.crop.x * scene.width + photo.naturalWidth * scale * Number(scene.portal.dataset.x),
          y: scene.crop.y * scene.height + photo.naturalHeight * scale * Number(scene.portal.dataset.y)
        };
      }
      placePortal(scene);
    }
    paintings?.resize();
  }
  function placePortal(scene) {
    if (!scene.portal || !scene.point) return;
    const pose = enabled ? scene.pose : { scale: 1, x: 0, y: 0 };
    const x = scene.width / 2 + (scene.point.x - scene.width / 2) * pose.scale + pose.x;
    const y = scene.height / 2 + (scene.point.y - scene.height / 2) * pose.scale + pose.y;
    set(scene.portal, 'left', x.toFixed(2) + 'px');
    set(scene.portal, 'top', y.toFixed(2) + 'px');
    scene.portal.hidden = x < 0 || y < 0 || x > scene.width || y > scene.height;
  }
  function paintScene(scene, y, entry, blend, now, landing = false) {
    const local = (y - scene.start) / Math.max(scene.span, 1);
    const hold = smooth(local / .76);
    const exit = smooth((local - .62) / .24);
    const [from, to] = camera[scene.index];
    const pointerX = landing ? 0 : pointer.x;
    const pointerY = landing ? 0 : pointer.y;
    const scale = from + (to - from) * hold + Math.max(0, blend) * .035;
    const pan = (value, size) => {
      const margin = Math.max(0, (scale - 1) * size / 2 - 3);
      return Math.max(-margin, Math.min(margin, value));
    };
    scene.pose = {
      scale,
      x: pan(pointerX * 12 + (hold - .5) * (scene.index % 2 ? 6 : -6), scene.width),
      y: pan(pointerY * 8 + (hold - .5) * -10, scene.height)
    };
    const { x, y: panY } = scene.pose;
    set(scene.photo, 'transform', `translate3d(${x.toFixed(3)}px,${panY.toFixed(3)}px,0) scale(${scale.toFixed(5)})`);
    const blur = ((1 - entry) * 2 + blend * 1.5) * (innerWidth < 700 ? .55 : 1);
    set(scene.photo, 'filter', blur > .02 ? `blur(${blur.toFixed(2)}px)` : 'none');
    let phase = (y - scene.start) / screenHeight;
    if (scene.index === 0 && introAt && !landing) phase += -.10 + smooth((now - introAt) / 1300) * .32;
    scene.paragraphs.forEach((paragraph, index) => {
      const appearance = smooth((phase + .10 - index * .07) / .22);
      const opacity = appearance * (1 - exit);
      set(paragraph, 'opacity', opacity.toFixed(4));
      set(paragraph, 'transform', `translate3d(0,${((1 - appearance) * 14 - exit * 6).toFixed(2)}px,0)`);
      const fuzz = (1 - appearance) * 1.8 + exit;
      set(paragraph, 'filter', fuzz > .04 ? `blur(${fuzz.toFixed(2)}px)` : 'none');
    });
    if (scene.portal) {
      placePortal(scene);
      const interactive = entry > .96 && exit < .15;
      set(scene.portal, 'opacity', interactive ? '1' : '0');
      set(scene.portal, 'pointerEvents', interactive ? 'auto' : 'none');
      scene.portal.tabIndex = interactive ? 0 : -1;
    }
  }
  function render(now = performance.now(), force = false) {
    if (!enabled || (flight?.staging && !flight.landed)) return;
    const { index, ratio } = getLocation();
    if (index !== preparedIndex) {
      preparedIndex = index;
      // Decode the next paintings during the reading pause, before their dissolve starts.
      Promise.allSettled(scenes.slice(Math.max(0, index - 1), index + 3).map(scene => scene.photo.decode())).then(schedule);
    }
    const blend = index < scenes.length - 1 ? smooth((ratio - .76) / .24) : 0;
    dominant = blend > .6 ? index + 1 : index;
    for (const scene of scenes) {
      const current = scene.index === index;
      const incoming = scene.index === index + 1 && blend > .0001;
      const visible = current || incoming;
      set(scene.frame, 'visibility', visible ? 'visible' : 'hidden');
      set(scene.frame, 'opacity', current ? '1' : incoming ? blend.toFixed(5) : '0');
      scene.frame.classList.toggle('is-present', visible);
      scene.frame.inert = scene.index !== dominant;
      if (visible) paintScene(scene, virtualY, current ? 1 : blend, current ? blend : 0, now);
    }
    paintings?.draw(index, blend, now, force);
    const haze = Math.sin(blend * Math.PI) * (scenes[index].element.classList.contains('night') ? .018 : .05);
    set(mist, 'opacity', haze.toFixed(4));
  }
  function tick(now) {
    frameRequest = 0;
    if (!enabled || (flight?.staging && !flight.landed)) return;
    const delta = Math.min(100, lastTick ? now - lastTick : 16);
    lastTick = now;
    virtualY += (scrollY - virtualY) * (1 - Math.exp(-delta / 78));
    pointer.x += (pointer.targetX - pointer.x) * (1 - Math.exp(-delta / 120));
    pointer.y += (pointer.targetY - pointer.y) * (1 - Math.exp(-delta / 120));
    if (Math.abs(scrollY - virtualY) < .08) virtualY = scrollY;
    render(now);
    if (paintings?.healthy || Math.abs(scrollY - virtualY) > .08 || Math.abs(pointer.x - pointer.targetX) > .001 || Math.abs(pointer.y - pointer.targetY) > .001 || (introAt && now - introAt < 1400)) schedule();
  }
  function schedule() {
    if (enabled && !frameRequest && !document.hidden) frameRequest = requestAnimationFrame(tick);
  }
  function synchronize() { virtualY = scrollY; lastTick = 0; render(performance.now(), true); schedule(); }
  function goTo(scene, updateHistory = false, focus = false) {
    const top = enabled ? scene.start + screenHeight * .38 : scene.element.offsetTop;
    if (updateHistory && location.hash !== '#' + scene.element.id) history.pushState(null, '', '#' + scene.element.id);
    window.scrollTo({ top, behavior: 'instant' });
    if (enabled) synchronize();
    if (focus) scene.prose.focus({ preventScroll: true });
  }
  function resetScene(scene) {
    scene.frame.removeAttribute('style');
    scene.frame.classList.remove('is-present');
    scene.frame.inert = false;
    scene.photo.style.removeProperty('transform');
    scene.photo.style.removeProperty('filter');
    scene.paragraphs.forEach(paragraph => paragraph.removeAttribute('style'));
    if (scene.portal) {
      scene.portal.style.removeProperty('opacity');
      scene.portal.style.removeProperty('pointer-events');
      scene.portal.tabIndex = 0;
    }
  }
  function shouldAnimate() { return !reducedMotion.matches && !printMedia.matches && innerHeight >= 600; }
  function preparePaintings(delay) {
    if (paintings || paintingRequested) return;
    paintingRequested = true;
    // Let the first image and its prose appear before compiling the graphics effect.
    setTimeout(() => {
      if (!enabled || document.hidden) { paintingRequested = false; return; }
      paintings = createLivingPaintings(scenes);
      paintings?.resize();
      synchronize();
    }, delay);
  }
  function updateMode(initial = false) {
    const next = shouldAnimate();
    const restore = enabled ? scenes[dominant] : scenes.reduce((last, scene) => scene.element.getBoundingClientRect().top <= innerHeight * .45 ? scene : last, scenes[0]);
    cancelFlight();
    enabled = next;
    root.classList.toggle('motion', enabled);
    root.classList.remove('motion-candidate');
    if (!enabled) {
      cancelAnimationFrame(frameRequest);
      frameRequest = 0;
      scenes.forEach(resetScene);
      set(mist, 'opacity', '0');
    }
    measure();
    if (initial) introAt = performance.now();
    const requested = byId.get(location.hash.slice(1));
    if (initial && requested) goTo(requested);
    else if (!initial && !printMedia.matches) goTo(restore);
    else synchronize();
    if (enabled) preparePaintings(initial && !requested ? 1500 : 100);
  }
  function clearPassage() {
    passage.hidden = true;
    passage.replaceChildren();
    passage.getAnimations().forEach(animation => animation.cancel());
    document.body.removeAttribute('data-transitioning');
  }
  function cancelFlight() {
    if (!flight) return;
    const token = flight;
    flight = null;
    token.animations.forEach(animation => animation.cancel());
    clearPassage();
    token.source.portal.focus({ preventScroll: true });
    synchronize();
  }
  function stagePhoto(photo) {
    const box = photo.getBoundingClientRect();
    const image = document.createElement('img');
    image.src = photo.currentSrc || photo.src;
    image.alt = '';
    Object.assign(image.style, {
      left: box.left + 'px', top: box.top + 'px', width: box.width + 'px', height: box.height + 'px',
      objectPosition: getComputedStyle(photo).objectPosition
    });
    return { image, box };
  }
  function stageText(scene) {
    const layer = document.createElement('div');
    layer.className = scene.element.className.replace('scene', 'passage-text');
    const prose = scene.prose.cloneNode(true);
    [...prose.children].forEach((paragraph, index) => {
      const current = getComputedStyle(scene.paragraphs[index]);
      Object.assign(paragraph.style, { opacity: current.opacity, transform: current.transform, filter: current.filter });
    });
    const box = scene.prose.getBoundingClientRect();
    Object.assign(prose.style, {
      left: box.left + 'px', top: box.top + 'px', right: 'auto', bottom: 'auto',
      width: box.width + 'px', height: box.height + 'px'
    });
    prose.removeAttribute('tabindex');
    layer.append(prose);
    return layer;
  }
  async function enter(source) {
    if (flight) return;
    const destination = byId.get(source.portal.hash.slice(1));
    if (!destination) return;
    const token = { source, destination, animations: [], staging: false, landed: false };
    flight = token;
    try {
      destination.photo.loading = 'eager';
      await destination.photo.decode();
      if (flight !== token) return;
      if (reducedMotion.matches || !Element.prototype.animate) {
        goTo(destination, true, true);
        flight = null;
        return;
      }
      const hotspot = source.portal.getBoundingClientRect();
      const x = hotspot.left + hotspot.width / 2;
      const y = hotspot.top + hotspot.height / 2;
      const leaving = stagePhoto(source.photo);
      const words = stageText(source);
      if (enabled) paintScene(destination, destination.start + screenHeight * .38, 1, 0, performance.now(), true);
      const entering = stagePhoto(destination.photo);
      if (!enabled) entering.image.style.top = '0px';
      leaving.image.style.transformOrigin = `${x - leaving.box.left}px ${y - leaving.box.top}px`;
      entering.image.style.opacity = '0';
      passage.replaceChildren(leaving.image, entering.image, words);
      passage.hidden = false;
      token.staging = true;
      document.body.dataset.transitioning = 'true';
      const translate = `translate(${innerWidth / 2 - x}px, ${innerHeight / 2 - y}px)`;
      token.animations.push(words.animate([
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(-7px)' }
      ], { duration: 260, easing: 'ease-out', fill: 'forwards' }));
      token.animations.push(leaving.image.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1, filter: 'blur(0px)' },
        { transform: translate + ' scale(4.4)', opacity: 0, filter: 'blur(3px)' }
      ], { duration: 1250, easing: 'cubic-bezier(.4,0,.1,1)', fill: 'forwards' }));
      token.animations.push(entering.image.animate([
        { transform: 'scale(1.15)', opacity: 0, filter: 'blur(3px)' },
        { transform: 'scale(1)', opacity: 1, filter: 'blur(0px)' }
      ], { duration: 900, delay: 350, easing: 'cubic-bezier(.2,.6,.2,1)', fill: 'forwards' }));
      await Promise.allSettled(token.animations.map(animation => animation.finished));
      if (flight !== token) return;
      token.landed = true;
      pointer.x = pointer.y = pointer.targetX = pointer.targetY = 0;
      goTo(destination, true, true);
      if (enabled) destination.paragraphs.forEach((paragraph, index) => {
        token.animations.push(paragraph.animate([
          { opacity: 0, transform: 'translateY(12px)', filter: 'blur(1.8px)' },
          { opacity: 1, transform: 'translateY(0)', filter: 'blur(0px)' }
        ], { duration: 520, delay: index * 90, easing: 'cubic-bezier(.2,.6,.2,1)', fill: 'backwards' }));
      });
      const reveal = passage.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, fill: 'forwards' });
      token.animations.push(reveal);
      await reveal.finished.catch(() => {});
      if (flight !== token) return;
      flight = null;
      clearPassage();
      schedule();
    } catch {
      if (flight !== token) return;
      flight = null;
      clearPassage();
      goTo(destination, true, true);
    }
  }

  scenes.forEach(scene => {
    scene.element.style.setProperty('--distance', distances[scene.index]);
    scene.photo.loading = 'eager';
    scene.photo.addEventListener('load', () => { measure(); schedule(); });
    if (scene.portal) scene.portal.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      enter(scene);
    });
  });
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('pointermove', event => {
    if (!enabled || !finePointer.matches || event.pointerType === 'touch' || flight) return;
    pointer.targetX = (event.clientX / innerWidth - .5) * 2;
    pointer.targetY = (event.clientY / innerHeight - .5) * 2;
    schedule();
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => {
    pointer.targetX = pointer.targetY = 0;
    schedule();
  });
  window.addEventListener('resize', () => {
    if (!initialized) return;
    const locationBefore = getLocation();
    cancelFlight();
    if (enabled !== shouldAnimate()) { updateMode(); return; }
    measure();
    if (enabled) window.scrollTo({ top: scenes[locationBefore.index].start + scenes[locationBefore.index].span * locationBefore.ratio, behavior: 'instant' });
    synchronize();
  }, { passive: true });
  reducedMotion.addEventListener('change', () => updateMode());
  printMedia.addEventListener('change', () => updateMode());
  document.addEventListener('keydown', event => {
    if (!flight) return;
    if (event.key === 'Escape') { event.preventDefault(); cancelFlight(); }
    else if (['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(event.key)) event.preventDefault();
  });
  const holdScroll = event => { if (flight?.staging) event.preventDefault(); };
  document.addEventListener('wheel', holdScroll, { passive: false });
  document.addEventListener('touchmove', holdScroll, { passive: false });
  window.addEventListener('popstate', () => {
    cancelFlight();
    const target = byId.get(location.hash.slice(1));
    if (target) goTo(target, false, true);
  });
  window.addEventListener('hashchange', () => {
    if (!initialized || flight) return;
    const target = byId.get(location.hash.slice(1));
    if (target) goTo(target);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(frameRequest); frameRequest = 0; }
    else { lastTick = 0; if (enabled) preparePaintings(100); schedule(); }
  });
  const initialScene = byId.get(location.hash.slice(1)) || scenes[0];
  const initialPhotos = new Set([...scenes.slice(0,2), ...scenes.slice(initialScene.index, initialScene.index + 2)]);
  Promise.allSettled([...initialPhotos].map(scene => scene.photo.decode())).then(() => {
    initialized = true;
    updateMode(true);
  }).catch(() => {
    root.classList.remove('motion-candidate', 'motion');
    enabled = false;
    scenes.forEach(resetScene);
    measure();
  });
})();
