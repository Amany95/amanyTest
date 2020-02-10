package com.kns.citystars;

import android.content.Intent;

import com.facebook.react.ReactActivity;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import static com.kns.citystars.MainApplication.getCallbackManager;

public class MainActivity extends ReactActivity {
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "citystars";
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }

}
