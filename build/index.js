import webpack from "webpack";

import { argv } from "yargs";

import listener from "webpack-listener";

import config from "../webpack.config.js";

const compiler = webpack(config);

if(argv.watch){
	compiler.watch({
		aggregateTimeout: 300,
		poll: true
	}, listener);
} else {
	compiler.run(listener);
}
