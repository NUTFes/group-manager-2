module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-extra-parens": 1,
    "no-multi-spaces": 2,
    "no-multiple-empty-lines": [2, { max: 1 }],
    "func-call-spacing": [2, "never"],
    quotes: [2, "double"],
    "no-var": 2,
    indent: [2, 2],
    "space-in-parens": [2, "never"],
    "computed-property-spacing": 2,
    "key-spacing": 2,
    "keyword-spacing": 2,
  },
};
