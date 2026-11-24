// node scripts/build-pages.mjs : builds the static export in ./out for GitHub Pages while keeping Vercel server routes intact in Git.
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const STASH_ROOT = resolve("node_modules/.pages-stash");
const SERVER_ONLY = ["proxy.ts", "app/admin", "app/api", "app/studio"];
const CLEAN_DIRS = [".next/types", ".next/dev/types", "out"];
const REQUIRED_FILES = [
  "out/index.html",
  "out/freelance/index.html",
  "out/lab/index.html",
  "out/CNAME",
  "out/resume.pdf",
  "out/.nojekyll",
];

// Next.js 16 export uses path.relative() + replace(/\//g, '.'), leaving backslash-nested __next.*/*.txt folders on Windows.
function flattenSegmentDirs(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name === "_next") continue;
    const full = join(dir, entry.name);
    if (entry.name.startsWith("__next.")) {
      const stack = [full];
      while (stack.length) {
        const cur = stack.pop();
        for (const child of readdirSync(cur, { withFileTypes: true })) {
          const childFull = join(cur, child.name);
          if (child.isDirectory()) {
            stack.push(childFull);
          } else {
            const relParts = relative(full, childFull).split(/[\\/]/);
            const flatName = `${entry.name}.${relParts.join(".")}`;
            copyFileSync(childFull, join(dir, flatName));
          }
        }
      }
      rmSync(full, { recursive: true, force: true });
    } else {
      flattenSegmentDirs(full);
    }
  }
}

const moved = [];
let restored = false;

function restore() {
  if (restored) return;
  restored = true;
  for (const rel of moved.reverse()) {
    const src = resolve(STASH_ROOT, rel);
    const dst = resolve(rel);
    if (existsSync(src)) {
      mkdirSync(dirname(dst), { recursive: true });
      renameSync(src, dst);
    }
  }
  rmSync(STASH_ROOT, { recursive: true, force: true });
}

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => {
    restore();
    process.exit(130);
  });
}

let status = 1;
try {
  for (const dir of CLEAN_DIRS) rmSync(resolve(dir), { recursive: true, force: true });
  rmSync(STASH_ROOT, { recursive: true, force: true });

  for (const rel of SERVER_ONLY) {
    const src = resolve(rel);
    const dst = resolve(STASH_ROOT, rel);
    if (existsSync(src)) {
      mkdirSync(dirname(dst), { recursive: true });
      renameSync(src, dst);
      moved.push(rel);
    }
  }

  const res = spawnSync("npm", ["run", "build"], {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: { ...process.env, GITHUB_PAGES: "true" },
  });
  status = res.status ?? 1;
} finally {
  restore();
}

if (status !== 0) process.exit(status);

flattenSegmentDirs(resolve("out"));
writeFileSync(resolve("out/.nojekyll"), "");
for (const rel of REQUIRED_FILES) {
  if (!existsSync(resolve(rel))) {
    throw new Error(`Missing expected export output: ${rel}`);
  }
}
console.log("GitHub Pages static export verified in ./out");
