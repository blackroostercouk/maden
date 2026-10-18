/**
 * Breakpoints live in src/styles/tokens/media.css as @custom-media rules.
 * global-data makes them visible to every CSS file (including CSS Modules),
 * and postcss-custom-media compiles them into plain media queries.
 */
const config = {
  plugins: {
    "@csstools/postcss-global-data": {
      files: ["src/styles/tokens/media.css"],
    },
    "postcss-custom-media": {},
  },
};

export default config;
