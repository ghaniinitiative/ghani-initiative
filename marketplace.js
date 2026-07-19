/* ═══════════════════════════════════════════════════════════════
   Ghani Initiative — Bazaar Marketplace Renderer
   ---------------------------------------------------------------
   Reads /data/products.json (written by Decap CMS) and renders a
   mobile-first, responsive product grid in the site's design
   system: Deep Teal structure, Electric Gold accents, pearl canvas.

   Usage — add to any page:
     <div id="marketplace-grid"></div>
     <script src="/marketplace.js" defer></script>

   Requires the site's shared Tailwind CDN config (the custom
   ink / teal / gold / pearl tokens and font-display family
   already defined on every Ghani page).
   ═══════════════════════════════════════════════════════════════ */

(() => {
  "use strict";

  /* ── Configuration ─────────────────────────────────────────── */
  const CONFIG = {
    dataUrl: "/data/products.json",
    mountId: "marketplace-grid",
    // Logistics desk number, digits only, country code first.
    // ⚠ Replace with the live desk number before launch.
    whatsappNumber: "923000000000",
    // Tailwind classes applied to the mount so pasting one <div> is enough.
    gridClasses:
      "grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3",
  };

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ── Helpers ───────────────────────────────────────────────── */

  /** Escape CMS-supplied text before it touches innerHTML. */
  const esc = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        }[ch])
    );

  /** "Amna Bibi" → "AB" for the maker badge. */
  const initialsOf = (name) =>
    String(name ?? "")
      .trim()
      .split(/\s+/)
      .map((part) => part[0] ?? "")
      .join("")
      .slice(0, 2)
      .toUpperCase() || "GW";

  /** Pre-filled dispatch request for the human logistics desk. */
  const dispatchLink = (title, artisan) => {
    const message =
      "Assalam-o-Alaikum! Dispatch request from The Bazaar - " +
      `Item: ${title} | Maker: ${artisan}. ` +
      "Please share availability and delivery details.";
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
  };

  /* ── Card template ─────────────────────────────────────────── */

  const cardHTML = (product) => {
    const title = esc(product.title);
    const artisan = esc(product.artisan);
    const price = esc(product.price);
    const image = esc(product.image);
    const initials = esc(initialsOf(product.artisan));
    const wa = esc(dispatchLink(product.title ?? "", product.artisan ?? ""));

    return `
      <article class="group ${
        prefersReducedMotion
          ? ""
          : "opacity-0 translate-y-4 transition-all duration-700 ease-out"
      }">
        <div class="overflow-hidden rounded-2xl bg-teal-50 shadow-sm transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-lift">
          <div class="aspect-[4/5] overflow-hidden">
            <img
              src="${image}"
              alt="${title} — handmade by ${artisan}"
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div class="mt-5 flex items-center gap-3">
          <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gold-100 font-display text-sm font-bold text-gold-700">${initials}</span>
          <p class="text-[15px] font-display font-bold text-ink">${artisan}</p>
        </div>

        <div class="mt-3 flex items-baseline justify-between gap-4">
          <h3 class="font-display text-lg font-bold text-ink">${title}</h3>
          <p class="shrink-0 font-display font-bold text-teal-700">${price}</p>
        </div>

        <a
          href="${wa}"
          target="_blank"
          rel="noopener"
          class="mt-4 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-teal-800 py-3.5 font-semibold text-white transition-colors hover:bg-ink"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.2.7-1.3 1.3-1.9 1.3-.5.1-1.1.1-1.8-.1-.4-.1-.9-.3-1.6-.6-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.4l.9 2.2c.1.2.1.4 0 .6l-.4.6c-.1.2-.3.4-.1.7.1.3.7 1.2 1.6 1.9 1.1.9 2 1.2 2.3 1.4.3.1.5.1.6-.1l.7-.9c.2-.2.4-.2.6-.1l2 1c.2.1.4.2.4.3.1.1.1.6-.1 1.2z"/></svg>
          Dispatch via WhatsApp
        </a>
      </article>
    `;
  };

  /* ── UI states ─────────────────────────────────────────────── */

  const skeletonHTML = () =>
    Array.from({ length: 3 })
      .map(
        () => `
        <div aria-hidden="true">
          <div class="aspect-[4/5] animate-pulse rounded-2xl bg-teal-100/70"></div>
          <div class="mt-5 h-4 w-2/5 animate-pulse rounded-full bg-teal-100/70"></div>
          <div class="mt-3 h-5 w-4/5 animate-pulse rounded-full bg-teal-100/70"></div>
          <div class="mt-4 h-12 animate-pulse rounded-2xl bg-teal-100/70"></div>
        </div>`
      )
      .join("");

  const emptyHTML = () => `
    <div class="col-span-full rounded-3xl border border-teal-100 bg-white p-10 text-center">
      <p class="font-display text-xl font-bold text-ink">The shelves are being restocked.</p>
      <p class="mt-2 text-slate-500">New pieces from the makers are on their way — check back shortly.</p>
    </div>
  `;

  const errorHTML = () => `
    <div class="col-span-full rounded-3xl border border-gold-200 bg-gold-50 p-10 text-center">
      <p class="font-display text-xl font-bold text-ink">The catalog couldn't load.</p>
      <p class="mt-2 text-slate-500">Please refresh the page — if it keeps happening, the logistics desk would love to know.</p>
    </div>
  `;

  /* ── Render ────────────────────────────────────────────────── */

  const revealCards = (mount) => {
    if (prefersReducedMotion) return;
    const cards = mount.querySelectorAll("article");
    cards.forEach((card, index) => {
      window.setTimeout(() => {
        card.classList.remove("opacity-0", "translate-y-4");
      }, 80 * index);
    });
  };

  const init = async () => {
    const mount = document.getElementById(CONFIG.mountId);
    if (!mount) return; // Page doesn't include the marketplace — exit quietly.

    mount.className = `${CONFIG.gridClasses} ${mount.className}`.trim();
    mount.setAttribute("aria-busy", "true");
    mount.innerHTML = skeletonHTML();

    try {
      const response = await fetch(CONFIG.dataUrl, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} while fetching products`);
      }

      const data = await response.json();

      // Decap's list widget writes { "products": [...] } — but accept a
      // bare array too, in case the file is ever hand-edited.
      const products = Array.isArray(data) ? data : data.products;

      if (!Array.isArray(products) || products.length === 0) {
        mount.innerHTML = emptyHTML();
        return;
      }

      // Build off-DOM, insert once — a single layout pass on mobile.
      mount.innerHTML = products.map(cardHTML).join("");
      requestAnimationFrame(() => revealCards(mount));
    } catch (error) {
      console.error("[marketplace] Failed to render products:", error);
      mount.innerHTML = errorHTML();
    } finally {
      mount.removeAttribute("aria-busy");
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
