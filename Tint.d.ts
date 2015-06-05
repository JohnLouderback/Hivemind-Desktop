declare var process,
	require,
	exports,
	module,
	ImageWell,
	Container;

interface Window {
	native: Object;
}

interface ImageWell {
	image: string;
}

interface Container {
	appendChild(any);
}