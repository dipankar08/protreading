// pass code : 123456
keytool -genkey -v -keystore debug.keystore -alias grodok -keyalg RSA -sigalg SHA1withRSA -keysize 2048 -validity 100000

keytool -list -v -keystore debug.keystore -alias grodok  -storepass 123456 -keypass 123456
