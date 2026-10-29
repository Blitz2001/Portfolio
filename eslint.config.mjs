import next from "eslint-config-next";

const config = [
  { ignores: [".next/**", "node_modules/**", ".claude/**", "design/**", "lib/iso/**", "figures/**/out/**", "components/defenseosint/figure-art.ts"] },
  ...next,
];

export default config;
