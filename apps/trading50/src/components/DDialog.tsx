import React, { useState } from "react";
import { Modal, ScrollView, StyleSheet, View } from "react-native";
import { RadioButton } from "react-native-paper";
import { TProps } from "../screens/types";
import { DButtonIcon, DButtonPrimary } from "./DButton";
import { DTextInput } from "./DInput";
import { DLayoutCol, DLayoutRow, DSpace } from "./DLayout";
import { DTextSubTitle, DTextTitle } from "./DText";
import { colors } from "./res/colors";

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

export const DOptionDialog = ({ visible, title, subtitle, items, onChange, onCancel }: TProps) => {
  const [value, setValue] = useState(items?.[0].key);
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
            <DTextSubTitle style={{ textAlign: "center", marginBottom: 40 }}>{subtitle || ""}</DTextSubTitle>
            <RadioButton.Group
              onValueChange={(newValue) => {
                setValue(newValue);
                onChange?.(newValue);
              }}
              value={value}
            >
              {items?.map((x) => {
                return (
                  <DLayoutRow key={x.key}>
                    <RadioButton value={x.key} key={x.key}>
                      <DTextSubTitle>{x.text}</DTextSubTitle>
                    </RadioButton>
                    <DTextSubTitle>{x.text}</DTextSubTitle>
                  </DLayoutRow>
                );
              })}
            </RadioButton.Group>
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
    </View>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#00000000", // DONOT PUT ANY COLOR as this dilaog is getting part of the layout
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 35,
    shadowColor: "#000",
    maxHeight: "80%", // we need this else the dilog will explore
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
