import I18n from "react-native-i18n";

export function translateText(text, params) {
	I18n.fallbacks = true;

	if (params) {
		return I18n.t(text, params);
	}
	return I18n.t(text);
}


export function getDefaultLanguageText(data) {

	if (data.hasOwnProperty("en") && data.hasOwnProperty("ar")) {
		if (data["en"] === "") {
			return data["ar"];
		}
		if (data["ar"] === "") {
			return data["en"];
		}
		return I18n.currentLocale().includes("ar") ? data["ar"] : data["en"];
	}
	else if (data.hasOwnProperty("en") && !data.hasOwnProperty("ar")) {
		return data["en"];
	}
	else if (!data.hasOwnProperty("en") && data.hasOwnProperty("ar")) {
		return data["ar"];
	}
	return data;
}
