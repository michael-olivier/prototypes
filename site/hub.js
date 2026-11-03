const ICONS = {
  golf: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.75" r="4" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" d="M9.25 12.25h5.5M12 12.25V20"/></svg>`,
  nexus: `<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path fill="currentColor" d="M9 8h9v14.5L30 8h9v32h-9V25.5L18 40H9V8z"/></svg>`,
};

/** Card accent: sage | blue | rose */
const ACCENT_BY_ICON = {
  golf: "sage",
  nexus: "blue",
  "design-system": "rose",
};

function formatUpdated(iso) {
  if (!iso) return "Unknown";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Unknown";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function isExternal(href) {
  return /^https?:\/\//i.test(href);
}

function renderCardIcon(item) {
  if (item.logoUrl) {
    const bg = (item.logoBackground || "transparent").replace(/"/g, "");
    const src = item.logoUrl.replace(/"/g, "");
    return `<div class="card-icon card-icon--logo" style="background-color: ${bg}"><img src="${src}" alt="" width="120" height="120" decoding="async" /></div>`;
  }
  const icon = ICONS[item.icon] ?? ICONS.golf;
  const nexusClass =
    item.icon === "nexus" || item.icon === "design-system" ? " card-icon--nexus" : "";
  return `<div class="card-icon${nexusClass}">${icon}</div>`;
}

function renderCard(item) {
  const external = isExternal(item.href);
  const rel = external ? ' rel="noopener noreferrer"' : "";
  const target = external ? ' target="_blank"' : "";
  const accent = ACCENT_BY_ICON[item.icon] ?? "sage";
  const title = item.title.replace(/</g, "&lt;");
  const description = item.description.replace(/</g, "&lt;");

  return `
    <a class="card card--${accent}" href="${item.href}"${target}${rel}>
      ${renderCardIcon(item)}
      <div class="card-body">
        <h2>${title}</h2>
        <p>${description}</p>
      </div>
      <div class="card-meta">
        Updated<br /><time datetime="${item.updatedAt}">${formatUpdated(item.updatedAt)}</time>
      </div>
    </a>
  `;
}

async function init() {
  const container = document.getElementById("cards");
  const titleEl = document.getElementById("site-title");
  container.innerHTML = `<p class="loading">Loading prototypes…</p>`;

  try {
    const metaRes = await fetch(new URL("prototypes.json", window.location.href));
    const data = await metaRes.json();
    if (data.siteTitle && titleEl) titleEl.textContent = data.siteTitle;
    const items = data.prototypes ?? [];
    if (items.length === 0) {
      container.innerHTML = `<p class="loading">No prototypes listed yet.</p>`;
      return;
    }
    container.innerHTML = items.map(renderCard).join("");
  } catch {
    container.innerHTML = `<p class="loading">Could not load prototype list.</p>`;
  }
}

init();
