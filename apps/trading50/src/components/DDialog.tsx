import React, { useState } from "react";
import { Dimensions, Modal, ScrollView, StyleSheet, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { TProps } from "../screens/types";
import { DButtonIcon, DButtonPrimary } from "./DButton";
import { DTextInput } from "./DInput";
import { DLayoutCol, DLayoutRow, DSpace } from "./DLayout";
import { DTextSubTitle, DTextTitle } from "./DText";
import { colors } from "./res/colors";
const windowHeight = Dimensions.get("window").height;

export const DPrompt = ({ visible, title, body, onOk, onCancel }: TProps) => {
  const [text, setText] = useState("");
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onCancel?.();
      }}
      style={{
        justifyContent: "flex-end",
        margin: 0,
        position: "absolute",
        flex: 1,
      }}
      //avoidKeyboard={false}
    >
      <View style={styles.flexKeyboardLayout}>
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
  );
};

export const DOptionDialog = ({ visible, title, subtitle, items, onChange, onCancel }: TProps) => {
  const [value, setValue] = useState(items?.[0].key);
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onCancel?.();
      }}
    >
      <View style={styles.flexKeyboardLayout}>
        <DLayoutCol style={styles.modalView}>
          <DTextTitle style={{ textAlign: "center" }}>{title}</DTextTitle>
          <DTextSubTitle style={{ textAlign: "center", marginBottom: 40 }}>{subtitle || ""}</DTextSubTitle>
          <RadioButton.Group
            onValueChange={(newValue) => {
              setValue(newValue);
              onChange?.(newValue);
            }}
            value={value}
          >
            {items?.map((x) => {
              return <RadioButton.Item label={x.key} value={x.key} key={x.key} />;
            })}
          </RadioButton.Group>
        </DLayoutCol>
      </View>
    </Modal>
  );
};

export const DDialog = ({ visible, title, children, onOk, onCancel }: TProps) => {
  const [text, setText] = useState("");
  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onCancel?.();
      }}
    >
      <View style={styles.flexKeyboardLayout}>
        <DLayoutCol style={[styles.modalView, { padding: 20 }]}>
          <DLayoutRow>
            {title && (
              <DTextTitle style={{ textAlign: "center", borderBottomColor: colors.grey100, borderBottomWidth: 1, marginBottom: 10, padding: 10 }}>
                {title}
              </DTextTitle>
            )}
            <DSpace />
            <DButtonIcon icon="close" onPress={onCancel}></DButtonIcon>
          </DLayoutRow>

          <ScrollView>{children}</ScrollView>
          {onOk && (
            <DButtonPrimary style={{ marginTop: 10 }} onPress={() => onOk?.(text)}>
              OK
            </DButtonPrimary>
          )}
        </DLayoutCol>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  flexKeyboardLayout: {
    width: "100%",
    height: windowHeight,
    flex: 1,
    marginTop: 40,
    alignItems: "center",
    // justifyContent: "center", <<< This will keyboard overlow dialog
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 8,
    shadowColor: "#000",
    //maxHeight: "80%", // we need this else the dilog will explore
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    display: "flex",
    flexDirection: "column",
    width: "90%",
  },
});
