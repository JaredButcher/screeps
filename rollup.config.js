import typescript from "rollup-plugin-typescript2";
import progress from "rollup-plugin-progress";
import commonjs from "@rollup/plugin-commonjs";

export default{
    input: "src/main.ts",
    plugins:[
        typescript({tsconfig: "./tsconfig.json"}),
        progress({clearLine: true}),
        commonjs({})
    ],
    treeshake: false,
    output: {
        file: "dist/main.js",
        format: "cjs",
        sourcemap: false,
        banner: '//JAB Screeps I Guess'
    },
}