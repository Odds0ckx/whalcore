/* ==========================================================================
   Whal3Core v2 - interaction layer
   GSAP drives the reveals; every effect degrades to plain static content
   if GSAP fails to load or the visitor prefers reduced motion.
   ========================================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  var hasGsap = typeof window.gsap !== "undefined";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var animate = hasGsap && !reduced;

  /* If we cannot animate, drop the initial hidden states immediately. */
  if (!animate) root.classList.remove("js");

  /* ---------------------------------------------------------------- tabs */
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".app-tab"));
  var appUrl = document.getElementById("appUrl");

  function selectTab(tab) {
    tabs.forEach(function (t) {
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      if (panel) panel.hidden = !on;
    });
    if (appUrl && tab.dataset.url) appUrl.textContent = tab.dataset.url;
  }

  tabs.forEach(function (tab, i) {
    tab.tabIndex = tab.getAttribute("aria-selected") === "true" ? 0 : -1;
    tab.addEventListener("click", function () {
      selectTab(tab);
    });
    tab.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
      if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
      if (e.key === "Home") next = tabs[0];
      if (e.key === "End") next = tabs[tabs.length - 1];
      if (next) {
        e.preventDefault();
        selectTab(next);
        next.focus();
      }
    });
  });

  /* ------------------------------------------------------------ mobile nav */
  var toggle = document.getElementById("navToggle");
  if (toggle) {
    var header = toggle.closest(".header");
    toggle.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    header.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ------------------------------------------------------------ score dials */
  function drawDials() {
    document.querySelectorAll(".score-dial .fill").forEach(function (c) {
      var r = parseFloat(c.getAttribute("r"));
      var len = 2 * Math.PI * r;
      var pct = parseFloat(c.dataset.dash || "0") / 100;
      c.style.strokeDasharray = len;
      c.style.strokeDashoffset = animate ? len : len * (1 - pct);
      if (animate) {
        window.ScrollTrigger.create({
          trigger: c,
          start: "top 88%",
          once: true,
          onEnter: function () {
            window.gsap.to(c, {
              strokeDashoffset: len * (1 - pct),
              duration: 1.8,
              ease: "expo.out"
            });
          }
        });
      }
    });
  }

  /* -------------------------------------------------------- number counters */
  /* The real figure lives in the markup, so the page is correct before any
     script runs. We only rewind a counter to zero if it is currently BELOW the
     fold, i.e. it cannot have been read yet. That removes the failure where a
     visitor arrives on, or stops scrolling at, a row mid-tween and simply sees
     "0 chains". */
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    var prefix = el.dataset.prefix || "";
    var suffix = el.dataset.suffix || "";
    var obj = { v: 0 };
    window.gsap.to(obj, {
      v: target,
      duration: 1.3,
      ease: "power2.out",
      onUpdate: function () {
        el.textContent = prefix + Math.round(obj.v) + suffix;
      },
      onComplete: function () {
        el.textContent = prefix + target + suffix;
      }
    });
  }

  /* ------------------------------------------------------ word-split reveal */
  function splitWords(el) {
    var out = "";
    Array.prototype.forEach.call(el.childNodes, function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (w) {
          if (!w.trim()) {
            out += w;
            return;
          }
          out +=
            '<span class="w" style="display:inline-block;overflow:hidden;padding-bottom:.12em;vertical-align:top">' +
            '<span class="wi" style="display:inline-block;transform:translateY(110%);will-change:transform">' +
            w +
            "</span></span>";
        });
      } else if (node.nodeType === 1) {
        // keep inline elements (like .accent) intact, animate them as one unit
        out +=
          '<span class="w" style="display:inline-block;overflow:hidden;padding-bottom:.12em;vertical-align:top">' +
          '<span class="wi" style="display:inline-block;transform:translateY(110%);will-change:transform">' +
          node.outerHTML +
          "</span></span>";
      }
    });
    el.innerHTML = out;
  }

  /* ------------------------------------------------------------- main setup */
  if (animate) window.gsap.registerPlugin(window.ScrollTrigger);

  drawDials();

  if (!animate) return; // static path: content is already in its final state

  var gsap = window.gsap;
  var ScrollTrigger = window.ScrollTrigger;

  /* SVG connector lengths */
  document.querySelectorAll(".links path").forEach(function (p) {
    var len = p.getTotalLength();
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
  });

  /* ---- hero entrance ---- */
  var tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  tl.to(".header", { opacity: 1, duration: 0.8 }, 0)
    .to(".hero-title .line > span", { y: 0, duration: 1.5, stagger: 0.11, ease: "expo.out" }, 0.15)
    .to(".hero-copy .eyebrow", { opacity: 1, duration: 0.7 }, 0.1)
    .from(".hero-copy .eyebrow", { y: 14, duration: 0.7 }, 0.1)
    .to(".hero-lede", { opacity: 1, duration: 0.8 }, 0.85)
    .from(".hero-lede", { y: 18, duration: 0.8 }, 0.85)
    .to(".hero-actions", { opacity: 1, duration: 0.7 }, 0.98)
    .from(".hero-actions", { y: 18, duration: 0.7 }, 0.98)
    .to(".hero-note", { opacity: 1, duration: 0.7 }, 1.1)
    .to(
      ".node",
      {
        opacity: 1,
        duration: 1.1,
        stagger: { each: 0.08, from: "center" },
        ease: "power2.out"
      },
      0.45
    )
    /* The pop lives on .node-face because .node itself carries the CSS float
       keyframes, which would win over any transform GSAP writes there.
       clearProps hands the transform back so :hover still works afterwards. */
    .from(
      ".node-face",
      {
        scale: 0.9,
        duration: 1.4,
        stagger: { each: 0.08, from: "center" },
        ease: "expo.out",
        clearProps: "transform"
      },
      0.45
    )
    .to(".links path", { strokeDashoffset: 0, duration: 1.7, stagger: 0.06, ease: "power1.inOut" }, 0.75)
    .to(".chains-inner", { opacity: 1, duration: 0.8 }, 1.5)
    .from(".chains-inner", { y: 20, duration: 0.8 }, 1.5);

  /* ---- constellation 3D tilt ---- */
  var stage = document.getElementById("constellation");
  var inner = document.getElementById("constellationInner");
  if (stage && inner && window.matchMedia("(pointer:fine)").matches) {
    stage.addEventListener("mousemove", function (e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(inner, {
        rotationY: x * 11,
        rotationX: -y * 7,
        duration: 1.1,
        transformPerspective: 1500,
        ease: "power3.out"
      });
    });
    stage.addEventListener("mouseleave", function () {
      gsap.to(inner, { rotationY: 0, rotationX: 0, duration: 1.4, ease: "expo.out" });
    });
  }

  /* ---- hero parallax ---- */
  gsap.to(".constellation", {
    y: 90,
    scale: 0.94,
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }
  });
  gsap.to(".hero-copy", {
    y: 50,
    opacity: 0.45,
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 }
  });

  /* ---- section heading reveals ---- */
  document.querySelectorAll(".reveal").forEach(function (h) {
    splitWords(h);
    gsap.to(h.querySelectorAll(".wi"), {
      y: 0,
      duration: 1.35,
      stagger: 0.045,
      ease: "expo.out",
      scrollTrigger: { trigger: h, start: "top 85%", once: true }
    });
  });

  /* ---- generic block reveals ----
     Anything inside a staggered row below is deliberately absent from this
     list: two gsap.from tweens on one element make the second record the
     already-hidden state as its end value, and the element never reappears. */
  var blocks = [
    ".eyebrow",
    ".split-copy .lede",
    ".split-copy .ticks li",
    ".scores .score",
    ".wallet-card",
    ".airead",
    ".action",
    ".app",
    ".table-scroll",
    ".cost-card",
    ".cost-note",
    ".group-flow",
    ".coverage-note",
    ".integration-facts",
    ".founding",
    ".includes",
    ".commit",
    ".faq-group",
    ".section-meta",
    ".footer-top",
    ".footer-bottom"
  ].join(",");

  /* Reveal helper.
     Deliberately gsap.set + gsap.to rather than gsap.from: a `from` tween owned
     by a ScrollTrigger is reverted to its start values on every refresh (which
     the load event and any height change trigger), which leaves elements
     stranded at their start transform. A plain `to` cannot be reverted. */
  function rise(targets, opts) {
    opts = opts || {};
    gsap.set(targets, { y: opts.y || 56, scale: opts.scale || 0.985, opacity: 0 });
    gsap.to(targets, {
      y: 0,
      scale: 1,
      opacity: 1,
      duration: opts.duration || 1.25,
      stagger: opts.stagger || 0,
      ease: "expo.out",
      clearProps: "transform",
      /* Fires once the element is properly on screen rather than at the very
         bottom edge, so the travel is actually watched instead of finishing
         off-screen. */
      scrollTrigger: { trigger: opts.trigger || targets, start: opts.start || "top 86%", once: true }
    });
  }

  document.querySelectorAll(blocks).forEach(function (el) {
    if (el.closest(".hero")) return;
    /* Skip anything that starts with no layout box: a closed <details> or an
       inactive tab panel gives ScrollTrigger nothing to measure, so the
       element would be faded out and never faded back in. */
    if (el.closest(".faq-a") || el.closest(".app-panel")) return;
    rise(el);
  });

  /* stagger cards that sit in a row rather than firing each on its own */
  [".cases", ".stance", ".steps", ".plans", ".group-grid", ".coverage"].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (row) {
      rise(row.children, { y: 84, scale: 0.97, duration: 1.35, stagger: 0.14, trigger: row, start: "top 80%" });
    });
  });

  /* ---- stat counters ---- */
  document.querySelectorAll(".stat-num .n[data-count]").forEach(function (el) {
    var box = el.getBoundingClientRect();
    if (box.top < window.innerHeight) return; // already visible: leave it correct
    var prefix = el.dataset.prefix || "";
    var suffix = el.dataset.suffix || "";
    el.textContent = prefix + "0" + suffix;
    ScrollTrigger.create({
      trigger: el,
      start: "top 82%",
      once: true,
      onEnter: function () {
        countUp(el);
      }
    });
  });

  /* ---- share-of-wallet bar grows into place ---- */
  document.querySelectorAll(".sow-bar").forEach(function (bar) {
    var parts = Array.prototype.slice.call(bar.children);
    var targets = parts.map(function (p) {
      return parseFloat(p.style.flex) || 1;
    });
    parts.forEach(function (p) {
      p.style.flex = 0.001;
    });
    ScrollTrigger.create({
      trigger: bar,
      start: "top 90%",
      once: true,
      onEnter: function () {
        parts.forEach(function (p, i) {
          gsap.to(p, {
            flexGrow: targets[i],
            duration: 1.5,
            delay: i * 0.1,
            ease: "expo.out"
          });
        });
      }
    });
  });

  /* ---- cursor-tracked spotlight on the use-case grid ----
     One listener per grid, not per card. Coordinates are written as CSS custom
     properties and read by the two gradients in style.css, so the sweep is
     pure paint. Reads are batched into a rAF so a fast pointer cannot queue
     more style writes than the compositor can flush. */
  document.querySelectorAll(".cases").forEach(function (grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll("[data-spotlight]"));
    if (!cards.length) return;
    var pending = null;

    grid.addEventListener("pointermove", function (e) {
      if (pending) return;
      pending = requestAnimationFrame(function () {
        pending = null;
        for (var i = 0; i < cards.length; i++) {
          var r = cards[i].getBoundingClientRect();
          cards[i].style.setProperty("--mouse-x", e.clientX - r.left + "px");
          cards[i].style.setProperty("--mouse-y", e.clientY - r.top + "px");
        }
      });
    });

    grid.addEventListener("pointerleave", function () {
      if (pending) {
        cancelAnimationFrame(pending);
        pending = null;
      }
    });
  });

  /* ---- header shadow on scroll ---- */
  var header = document.querySelector(".header");
  if (header) {
    ScrollTrigger.create({
      start: "top -80",
      onUpdate: function (self) {
        header.classList.toggle("scrolled", self.scroll() > 80);
      }
    });
  }

  window.addEventListener("load", function () {
    ScrollTrigger.refresh();
  });
})();
