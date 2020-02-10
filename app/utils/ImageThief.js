import {ImageCache} from "react-native-img-cache/build/index";

/**
 * find related image and add cache then load cache performance improved nice things ...
 * ImageThief using to application loading.
 */

export class ImageThief {
	/**
	 * @param data
	 */
	constructor(data) {
		this._stealTargets = [];
		this.data = data;//deep copy of _mallDataRaw
	}

	objectKeyFinder = (obj) => {
		const result = [];
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				result.push(key);
			}
		}
		return result;
	};

	stealAll() {
		return this._stealAllImages();
	}

	_sniffPockets(data) {
		const imageUrlTester = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;
		const self = this;
		this.objectKeyFinder(data).forEach((key) => {

			// safety for Object.keys
			if (data[key] === null || data[key] === "" || typeof data[key] === "function" || typeof data[key] === "undefined") {
				return;
			}

			switch (data[key].constructor) {

				case Object:

					self._sniffPockets(data[key]);
					break;
				case Array :
					data[key].forEach((subData) => {
						self._sniffPockets(subData);
					});
					break;
				case String :
					if (imageUrlTester.test(data[key])) {
						self._stealTargets.push(
							//--------<Promise of an image steal>---------
							new Promise((resolve, reject) => {
								ImageCache.get().on({uri: data[key]}, (path) => {
									resolve();
								}, true);
							}));
					}
					break;
				default :
					break;
			}
		});
	}

	_stealAllImages() {

		const self = this;
		this._sniffPockets(this.data);// prepare stealTargets
		return Promise
			.all(self._stealTargets)// image caching promises
			.then(() => {
				return self.data;
			});
	}
}
