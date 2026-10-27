const ICONS = {
  golf: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.75" r="4" fill="currentColor"/><path fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" d="M9.25 12.25h5.5M12 12.25V20"/></svg>`,
  career: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M12 12v3M9 12h6"/></svg>`,
};

/** Card accent: sage | blue | rose */
const ACCENT_BY_ICON = {
  golf: "sage",
  career: "blue",
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
  return `<div class="card-icon">${icon}</div>`;
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
