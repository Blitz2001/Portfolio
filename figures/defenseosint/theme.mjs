// Cobalt on sand for the anatomy kit: every tone is the site's one cobalt ink at a different
// strength over sand, so the figure prints like the rest of the page.
function night(selector) {
  return `${selector}{
  --anatomy-page:#081133;--anatomy-card:#0f1c4b;--anatomy-text:#ebe1cc;--anatomy-strong:#ebe1cc;--anatomy-muted:#a3b0d8;
  --anatomy-paper:#16265c;--anatomy-face:#2a3d86;--anatomy-top:#1d2f6b;
  --anatomy-shade-0:#0b1640;--anatomy-shade-1:#0f1b4a;--anatomy-shade-2:#132155;--anatomy-shade-3:#172760;
  --anatomy-lit-top:#3a4f9e;--anatomy-lit-shade:#2c3f87;
  --anatomy-hi:#ebe1cc;--anatomy-mid:#9fabd4;--anatomy-lo:#5c6ba3;--anatomy-faint:#33437f;--anatomy-lit:#ebe1cc;
  --anatomy-halo:#000000;--anatomy-halo-opacity:.6;--anatomy-dot:#ebe1cc;
}`;
}

export const COBALT_CSS = `
.iso.cobalt{
  --anatomy-page:#e6dbc7;--anatomy-card:#ddd0b9;--anatomy-text:#062b8a;--anatomy-strong:#062b8a;--anatomy-muted:#3a5aa8;
  --anatomy-paper:#efe7d6;--anatomy-face:#dfe5f5;--anatomy-top:#f5efe3;
  --anatomy-shade-0:#cbbb9c;--anatomy-shade-1:#d7c9ae;--anatomy-shade-2:#e1d5be;--anatomy-shade-3:#eae0cc;
  --anatomy-lit-top:#d3dbf2;--anatomy-lit-shade:#bac6ea;
  --anatomy-hi:#062b8a;--anatomy-mid:#4f65a6;--anatomy-lo:#929bbd;--anatomy-faint:#c3bdb6;--anatomy-lit:#062b8a;
  --anatomy-halo:#6f5c38;--anatomy-halo-opacity:.28;--anatomy-dot:#062b8a;
  --anatomy-mono:var(--font-schibsted,"Schibsted Grotesk"),ui-sans-serif,system-ui,sans-serif;
}
/* Cobalt night: the same figure in sand ink on blue-black, for the site's dark theme. */
${night(':root[data-theme="dark"] .iso.cobalt')}
@media (prefers-color-scheme: dark){${night(':root:not([data-theme="light"]) .iso.cobalt')}}
.iso.cobalt .iso-face-text{font-weight:800;letter-spacing:.03em}
.iso.cobalt .station{cursor:pointer;outline:none}
.iso.cobalt .station .iso-edge{transition:stroke-width .2s}
.iso.cobalt .station:hover .iso-edge,.iso.cobalt .station:focus-visible .iso-edge,.iso.cobalt .station[data-selected] .iso-edge{stroke:var(--anatomy-hi);stroke-width:1.15px}
`;
