import React from "react";
import {PermissionsAndroid, Platform, StyleSheet, View} from "react-native";

import {Player, Recorder} from "react-native-audio-toolkit";
import {translateText} from "../../translation/translate";
import {connect} from "react-redux";
import config from "../../../config/config";
import RNSiriWaveView from "react-native-siri-wave-view";
import {BorderedButton} from "../../components/buttons";

class AudioRecord extends React.Component {
	static navigationOptions = () => {
		return {
			title: translateText("Record/Listen").toUpperCase()
		};
	};

	filename = "test.mp4";

	constructor() {
		super();
		this.state = {
			PauseButton: "Preparing...",
			recordButton: "Preparing..."
		};
	}

	componentWillMount() {
		this.player = null;
		this.recorder = null;

		this._reloadPlayer();
		this._reloadRecorder();

	}

	_updateState() {
		this.setState({
			playPauseButton: this.player && this.player.isPlaying ? translateText("Pause") : translateText("Play"),
			recordButton: this.recorder && this.recorder.isRecording ? translateText("Stop") : translateText("Record")
		});
	}

	_playPause() {
		this.player.playPause((err, playing) => {
			if (playing) {
				this._reloadPlayer();
			}
			this._updateState();
		});
	}

	_reloadPlayer() {
		if (this.player) {
			this.player.destroy();
		}

		this.player = new Player(this.filename, {
			autoDestroy: false
		}).prepare(() => {
			this._updateState();
		});

		this._updateState();

		this.player.on("ended", () => {
			this._updateState();
		});
		this.player.on("pause", () => {
			this._updateState();
		});
	}

	_reloadRecorder() {
		if (this.recorder) {
			this.recorder.destroy();
		}

		this.recorder = new Recorder(this.filename);

		this._updateState();
	}

	_toggleRecord() {
		if (this.player) {
			this.player.destroy();
		}

		this.recorder.toggleRecord((err, stopped) => {
			if (err) {
				this.setState({
					error: err.message
				});
			}
			if (stopped) {
				this._reloadPlayer();
				this._reloadRecorder();
			}

			this._updateState();
		});
	}

	requestCameraPermission = () => {
		try {
			PermissionsAndroid.requestMultiple([
				PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
				PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
			]).then((data) => {
				if (data["android.permission.WRITE_EXTERNAL_STORAGE"] === PermissionsAndroid.RESULTS.GRANTED && data["android.permission.RECORD_AUDIO"] === PermissionsAndroid.RESULTS.GRANTED) {

					this._toggleRecord();
				}
			});
		}
		catch (err) {
			console.warn(err);
		}
	};

	render() {
		return (
			<View style={styles.container}>
				<View style={{width: "70%"}}>
					<View style={styles.wave}>
						<RNSiriWaveView
							type={1}
							width={200}
							height={200}
							startAnimation={this.player.isPlaying}
							stopAnimation={!this.player.isPlaying}
						/>
					</View>
					<View style={styles.buttonContainer}>
						<BorderedButton style={styles.button}
						                title={this.state.playPauseButton}
						                titleStyle={{color: "#fff", fontSize: 18}}
						                onPress={() => {
							                this._playPause();
						                }}/>
					</View>

					<View style={styles.buttonContainer}>
						<BorderedButton style={styles.button}
						                titleStyle={{color: "#fff", fontSize: 18}}
						                title={this.state.recordButton}
						                onPress={() => {
							                if (Platform.OS === "android") {
								                this.requestCameraPermission();
							                }
							                else {
								                this._toggleRecord();
							                }
						                }}/>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: config().BASE_COLOR,
		width: "100%",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 20
	},
	buttonContainer: {
		marginTop: 20
	},
	image: {
		width: 150,
		height: 150,
		resizeMode: "contain",
		alignSelf: "center",
		marginBottom: 50
	},
	wave: {
		alignSelf: "center"
	},
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#fff"
	}
});

const mapStateToProps = (state) => {
	return state;
};

const AudioRecordRedux = connect(mapStateToProps)(AudioRecord);
export {AudioRecordRedux as AudioRecord};


