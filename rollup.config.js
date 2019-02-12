import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import minify from 'rollup-plugin-babel-minify';
import uglify from 'rollup-plugin-uglify';
export default {
  input: 'src/main.js',
  output: {
    file: 'lib/bundle.js',
    format: 'cjs',
  },
  plugins: [uglify(), minify()],
};
