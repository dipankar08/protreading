import React, { useState } from "react";
import { View, Text, TextInput, TouchableWithoutFeedback, ScrollView, Modal, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TProps } from "../screens/types";
import { TouchableOpacity } from "react-native-gesture-handler";
import { STYLES } from "./styles";
import { Inter_200ExtraLight } from "@expo-google-fonts/inter";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { blue200 } from "react-native-paper/lib/typescript/styles/colors";
import _ from "underscore";
import { DButtonIcon, DButtonPrimary } from "./DButton";
import { DScreenTitle, DTextSubTitle, DTextTitle } from "./DText";
import { DLayoutCol, DLayoutRow } from "./basic";
import { DTextInput } from "./DInput";
import { DSpace } from "./DLayout";
import { DIMENS } from "../res/dimens";
import { colors } from "../styles/colors";

export const DPrompt = ({ visible, title, body, onOk, onCancel }: TProps) => {
  const [text, setText] = useState("");
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          onCancel?.();
        }}
      >
        <View style={styles.centeredView}>
          <DLayoutCol style={styles.modalView}>
            <DTextTitle style={{ textAlign: "center" }}>{title}</DTextTitle>
            <DTextSubTitle style={{ textAlign: "center", marginBottom: 20 }}>{body}</DTextSubTitle>
            <DTextInput style={{ textAlign: "center" }} onChangeText={(x) => setText(x)}></DTextInput>
            <DLayoutRow>
              <DButtonPrimary style={{ marginRight: 10, width: 100 }} onPress={() => onOk(text)}>
                OK
              </DButtonPrimary>
              <DSpace />
              <DButtonPrimary style={{ flex: 1, width: 100 }} onPress={onCancel}>
                Cancel
              </DButtonPrimary>
            </DLayoutRow>
          </DLayoutCol>
        </View>
      </Modal>
    </View>
  );
};

export const DDialog = ({ visible, title, children, onOk, onCancel }: TProps) => {
  const [text, setText] = useState("");
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="none"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          onCancel?.();
        }}
      >
        <View style={styles.centeredView}>
          <DLayoutCol style={[styles.modalView, { padding: 0, height: "90%" }]}>
            {title && (
              <DTextTitle style={{ textAlign: "center", borderBottomColor: colors.grey100, borderBottomWidth: 1, marginBottom: 10, padding: 10 }}>
                {title}
              </DTextTitle>
            )}
            <ScrollView>{children}</ScrollView>
            {onOk && (
              <DButtonPrimary style={{ marginTop: 10 }} onPress={() => onOk?.(text)}>
                OK
              </DButtonPrimary>
            )}
            {onCancel && (
              <DButtonPrimary style={{ marginTop: 10, borderRadius: 0 }} onPress={() => onCancel?.()}>
                Close
              </DButtonPrimary>
            )}
          </DLayoutCol>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    display: "flex",
    flexDirection: "column",
    width: "80%",
  },
});
