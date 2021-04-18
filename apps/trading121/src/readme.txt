

## Settup up code push
appcenter login
appcenter apps create -d trading50-Android -o Android -p React-Native
appcenter apps create -d trading50-iOS -o iOS -p  React-Native

appcenter codepush deployment add -a dipankar08/trading50-Android Staging
appcenter codepush deployment add -a dipankar08/trading50-Android Production


# Deploytemnet
appcenter codepush release-react -a dipankar08/trading50-Android -d Staging
appcenter codepush release-react -a dipankar08/trading50-Android -d Production