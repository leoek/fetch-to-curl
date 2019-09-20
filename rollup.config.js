import minify from 'rollup-plugin-babel-minify';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'src/main.js',
  output: {
    file: 'lib/bundle.js',
    format: 'cjs',
  },
  plugins: [minify(), terser()],
};
