package com.kns.citystars;

import android.app.Application;
import android.content.Context;
import android.support.multidex.MultiDex;
import android.webkit.WebView;

import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.airbnb.android.react.maps.MapsPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.crashlytics.android.Crashlytics;
import com.facebook.CallbackManager;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.soloader.SoLoader;
import com.futurice.rctaudiotoolkit.AudioPackage;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.imagepicker.ImagePickerPackage;
import com.kns.RNMallFrameClientPackage;
import com.kontakt.sdk.android.common.KontaktSDK;
import com.kontakt.sdk.android.common.log.LogLevel;
import com.makeasy.reactlibrary.RNBluetoothListenerPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import org.reactnative.camera.RNCameraPackage;

import java.util.Arrays;
import java.util.List;

import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import io.fabric.sdk.android.Fabric;
import ui.siriwave.RNSiriWaveViewPackage;

public class MainApplication extends Application implements ShareApplication, ReactApplication {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();
    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            mCallbackManager = new CallbackManager.Factory().create();

            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new ReactNativeOneSignalPackage(),
                    new GoogleAnalyticsBridgePackage(),
                    new RNSiriWaveViewPackage(),
                    new RNCameraPackage(),
                    new RNBluetoothListenerPackage(),
                    new RNMallFrameClientPackage(),
                    new LinearGradientPackage(),
                    new OrientationPackage(),
                    new VectorIconsPackage(),
                    new KCKeepAwakePackage(),
                    new ReactVideoPackage(),
                    new RNSharePackage(),
                    new MapsPackage(),
                    new ImagePickerPackage(),
                    new RNI18nPackage(),
                    new RNFetchBlobPackage(),
                    new FBSDKPackage(mCallbackManager),
                    new AudioPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }

    };

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();

        Fabric.with(this, new Crashlytics());
        SoLoader.init(this, /* native exopackage */ false);

        // Kontakt.io sdk initialize
        KontaktSDK.initialize("ATTCbJIgCBjSuwJAoTQHizFYVDjhJIQA")
                .setDebugLoggingEnabled(BuildConfig.DEBUG)
                .setLogLevelEnabled(LogLevel.DEBUG, true)
                .setCrashlyticsLoggingEnabled(true);
    }

    @Override
    public String getFileProviderAuthority() {
        return "com.kns.citystars.provider";
    }
}
