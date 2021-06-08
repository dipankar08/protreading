
-- This is how generted --
keytool -genkey -v -keystore debug.keystore -alias grodok -keyalg RSA -sigalg SHA1withRSA -keysize 2048 -validity 100000

keytool -list -v -keystore debug.keystore -alias grodok  -storepass 123456 -keypass 123456

// Android skyetore for sigin in application.

-- debug ---
file: android.keystore
passworkd: android
alias 'androiddebugkey'

-- This is used for debug apk---


-- release ---
MYAPP_RELEASE_STORE_FILE=AndroidRelease.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=123456
MYAPP_RELEASE_KEY_PASSWORD=123456
--- end of release 
