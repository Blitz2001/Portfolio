import next from "eslint-config-next";

const config = [
  { ignores: [".next/**", "node_modules/**", ".claude/**", "design/**"] },
  ...next,
];

export default config;
