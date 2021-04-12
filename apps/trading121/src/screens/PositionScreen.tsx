import axios from "axios";
import { Button, FlatList, Text, View, StyleSheet, TextInput, Modal, Alert, Pressable } from "react-native";
import { ScreenContainer } from "react-native-screens";
import { DContainer, DLayoutCol, DLayoutRow, DCard, DText, DButton } from "../components/basic";
import { TProps } from "./types";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Input } from "react-native-elements";
import { userOrder } from "../libs/order_helper";
import { TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";

export const PositionScreen = ({ navigation }: TProps) => {
  // state
  const [modalVisible, setModalVisible] = React.useState(false);
  const { orderList, loading, reloadOrder, newStock, createOrder, setNewStock, orderSummary, closeOrder, latestData } = userOrder();

  return (
    <DContainer>
      <DCard overrideStyle={{ height: 150, backgroundColor: "#bbbbbb" }}>
        <DLayoutRow>
          <DLayoutCol>
            <DText>Invested </DText>
            <DText>{orderSummary?.invested_amount} INR</DText>
          </DLayoutCol>
          <DLayoutCol>
            <DText>Current </DText>
            <DText>{orderSummary?.current_amount} INR</DText>
          </DLayoutCol>
        </DLayoutRow>
        <DLayoutRow>
          <DLayoutCol>
            <DText>Profit</DText>
            <DText>{orderSummary?.change_amount} INR</DText>
          </DLayoutCol>
          <DLayoutCol>
            <DText>Profit</DText>
            <DText>{orderSummary?.change_per} %</DText>
          </DLayoutCol>
        </DLayoutRow>
      </DCard>

      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          onRefresh={() => reloadOrder()}
          refreshing={loading}
          data={orderList}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            let color = item.change_per > 0 ? "green" : "red";
            return (
              <TouchableWithoutFeedback
                onLongPress={() => {
                  if (item.is_open) {
                    closeOrder(item._id, "0");
                  }
                }}
              >
                <DLayoutCol overrideStyle={{ padding: 10, opacity: item.is_open ? 1 : 0.3 }}>
                  <DLayoutRow>
                    <DLayoutCol>
                      <Text style={{ color: "#000000", fontSize: 14, marginVertical: 2, textTransform: "uppercase" }}>{item.symbol}</Text>
                      <DText style={{ color: "#00000077", fontSize: 12, marginVertical: 2 }}>
                        {item.quantities} X {item.buy_price} = {item.invested_sum}
                      </DText>
                      <Text style={{ color: "#000000dd", fontSize: 12, marginVertical: 2 }}>Invested for {item.open_for}</Text>
                    </DLayoutCol>
                    <DLayoutCol style={{ alignItems: "flex-end" }}>
                      <DText style={{ color: color, fontSize: 14 }}>
                        PL:{item.change}({item.change_per} %)
                      </DText>
                      <DText style={{ color: color, fontSize: 14 }}>LTP:{item.last_price}</DText>
                      <DText style={{ color: "#00000050", fontSize: 14 }}>Quantity</DText>
                    </DLayoutCol>
                  </DLayoutRow>
                </DLayoutCol>
              </TouchableWithoutFeedback>
            );
          }}
        ></FlatList>
      </View>

      <DButton onPress={() => setModalVisible(true)}>Add new Buy</DButton>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          //Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{}}>Add new position for tracking</Text>
            <TextInput
              style={styles.TextInputStyle}
              placeholder="Select Stock Name"
              value={newStock.symbol}
              onChangeText={(text) => setNewStock({ buy_price: newStock.buy_price, quantities: newStock.quantities, symbol: text, sell_price: null })}
            ></TextInput>
            <TextInput
              style={styles.TextInputStyle}
              placeholder="White Stock Price"
              value={newStock.buy_price + ""}
              onChangeText={(text) => setNewStock({ buy_price: text, quantities: newStock.quantities, symbol: newStock.symbol, sell_price: null })}
            ></TextInput>
            <TextInput
              style={styles.TextInputStyle}
              placeholder="Write Stock Qn"
              value={newStock.quantities + ""}
              onChangeText={(text) => setNewStock({ buy_price: newStock.buy_price, quantities: text, symbol: newStock.symbol, sell_price: null })}
            ></TextInput>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
              <Button
                onPress={() => {
                  createOrder();
                  setModalVisible(false);
                }}
                title="add New"
              />
              <Button onPress={() => setModalVisible(false)} title="Cancel" />
            </View>
          </View>
        </View>
      </Modal>
    </DContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  input: {
    backgroundColor: "#00000010",
    fontSize: 12,
    borderColor: "#00000020",
    borderRadius: 5,
    padding: 8,
    borderBottomColor: "yellow",
    borderBottomWidth: 0,
    marginBottom: 20,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 10,
    width: "90%",
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    display: "flex",
    flexDirection: "column",
    elevation: 5,
  },
  TextInputStyle: {
    marginVertical: 10,
    backgroundColor: "#00000010",
    fontSize: 12,
    padding: 10,
  },
});
