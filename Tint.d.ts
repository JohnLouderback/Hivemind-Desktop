declare var process,
	require,
	exports,
	module,
	ImageWell,
	Container,
	TextInput,
	Font,
	Screens;

interface Window {
	native: Object;
}

interface ImageWell {
	image: string;
}

interface Container {
	appendChild(any);
}

interface ActiveScreen {
	scaleFactor: number;
	bitsPerPixel: number;
	bounds: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	visibleBounds: {
		x: number;
		y: number;
		width: number;
		height: number;
	}
}

interface Screens {
	active: ActiveScreen;
	all: Array<ActiveScreen>;
}