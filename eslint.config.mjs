import next from "eslint-config-next";

const config = [
  { ignores: [".next/**", "out/**", "node_modules/**", ".claude/**", "design/**", "dist/**", "v2-data-science/**", "lib/iso/**", "figures/**/out/**", "components/defenseosint/figure-art.ts"] },
  ...next,
];

export default config;
