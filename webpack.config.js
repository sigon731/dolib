import path from "path";

export default {
	context: path.join(__dirname, "./src"),
	entry: "./index",
	output: {
		path: path.join(__dirname, "./dist"),
		filename: "bundle.js",
		library: "dolib",
		libraryTarget: "var"
	},
	devtool: "source-map",
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: "babel",
				exclude: /node_modules/
			}
		],
		preLoaders: [
			{
				test: /\.js$/,
				loader: "source-map-loader"
			}
		]
	}
};
