## SETUP
first run npm or yarn.

```
npm install && react-native link
or
yarn && react-native link
```
1. Fix to Facebook sdk path in "Build Settings > Search Path > Frameworks Search Path" to XCode.

2.	Select your build target in the **`Project navigator`**. Click **`General`** and then in the **`Embedded Binaries`** section, click the **`+`** button.

	- Click **`[Add Other...]`**.
	- Navigate to **`node_modules/react-native-mall-frame-client/ios`**.
	- Add **`KontaktSDK.framework`**.

	It should now appear in the **`Linked Frameworks and Libraries`** section right below.

3. Add Framework Search paths so that Xcode can find the added framework

    - Go to the **Build Settings** tab and search for **"framework search paths"**.
    - Add the following path (select **recursive [v]**):

    	```
    	$(PROJECT_DIR)/../node_modules/react-native-mall-frame-client/ios
    	```

5. Add run script

	- In the **`Build Phases`** tab, click the **`+`** button at the top and select **`New Run Script Phase`**. Enter the following code into the script text field:

	```
	bash "${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}/KontaktSDK.framework/strip-frameworks.sh"
	```

6. Add permissions

	Go to the **Info** tab and add in the section **`Custom iOS Target Properties`** add the following the following item:

	| Key | Value | Description |
	|---|---|---|
	| NSLocationAlwaysUsageDescription | This app requires background tracking | The value here will be presented to the user when the plugin requests **Background Location** permission |
