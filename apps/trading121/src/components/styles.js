"use strict";
exports.__esModule = true;
exports.STYLES = exports.globalStyle = void 0;
var react_native_1 = require("react-native");
exports.globalStyle = react_native_1.StyleSheet.create({
    PrimaryText: {
        fontSize: 20,
        lineHeight: 30
    },
    SecondaryText: {
        fontSize: 20
    },
    PrimaryButton: {
        fontSize: 20,
        //color: rgba(0, 0, 0, 0.9),
        width: "100%",
        marginVertical: 10
    },
    SecondaryButton: {
        fontSize: 20
    }
});
// Please move this to colors.ts
exports.STYLES = {
    APP_COLOR_PRIMARY: "#5424b3",
    APP_COLOR_SECONDARY: "#ffd400",
    APP_SCREEN_BACKGROUND: "#ffffff",
    RED: "red",
    GREEN: "green",
    BLUE: "blue",
    YELLOW: "yellow",
    WHITE: "#ffffff",
    BLACK: "#111111"
};
