// Cobalt on sand for the anatomy kit: every tone is the site's one cobalt ink at a different
// strength over sand, so the figure prints like the rest of the page.
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
.iso.cobalt .iso-face-text{font-weight:800;letter-spacing:.03em}
.iso.cobalt .station{cursor:pointer;outline:none}
.iso.cobalt .station .iso-edge{transition:stroke-width .2s}
.iso.cobalt .station:hover .iso-edge,.iso.cobalt .station:focus-visible .iso-edge,.iso.cobalt .station[data-selected] .iso-edge{stroke:var(--anatomy-hi);stroke-width:1.15px}
`;
