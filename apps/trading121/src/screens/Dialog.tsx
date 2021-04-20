import React, { useContext } from "react";
import { Modal, View, Button, Text, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { AppStateContext } from "../appstate/AppStateStore";
import { useNetwork } from "../hooks/useNetwork";
import { Picker } from "@react-native-community/picker";
import { Item } from "react-native-paper/lib/typescript/components/Drawer/Drawer";

export const OrderCreateDialog = ({ visible, onClose }: any) => {
  const network = useNetwork();
  const appState = useContext(AppStateContext);

  const [stock, setStock] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [quantities, setQuantities] = React.useState("");

  let xStockList =
    appState.state.market && appState.state.market.stocks
      ? appState.state.market.stocks.map((item) => {
          return <Picker.Item key={item.symbol} value={item.symbol} label={item.symbol} />;
        })
      : [<Picker.Item key="" value="" label="Wait..." />];
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        //Alert.alert("Modal has been closed.");
        onClose();
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>Add new position for tracking</Text>
          <Picker selectedValue={stock} style={styles.pickerStyle} onValueChange={(itemValue, itemIndex) => setStock(itemValue)}>
            {xStockList}
          </Picker>
          <TextInput style={styles.TextInputStyle} placeholder="White Stock Price" value={price} onChangeText={setPrice}></TextInput>
          <TextInput style={styles.TextInputStyle} placeholder="Write Stock Qn" value={quantities} onChangeText={setQuantities}></TextInput>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
            <Button
              onPress={() => {
                network.createOrder(stock, price, quantities, () => {
                  onClose();
                });
              }}
              title="add New"
            />
            <Button onPress={() => onClose()} title="Cancel" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const OrderCloseDialog = ({ item, visible, onClose }: any) => {
  const network = useNetwork();
  const [price, setPrice] = React.useState("");
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>CLose the oder of {item?.stock}</Text>
          <TextInput style={styles.TextInputStyle} placeholder="Sell Price" value={price} onChangeText={setPrice}></TextInput>
          <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
            <Button
              onPress={() => {
                network.closeOrder(item._id, price, () => {
                  onClose();
                });
              }}
              title="Close Order"
            />
            <Button onPress={() => onClose()} title="Cancel" />
          </View>
        </View>
      </View>
    </Modal>
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
  pickerStyle: {
    backgroundColor: "#00000010",
  },
  textHeader: {
    flex: 1,
    color: "#00000088",
    fontSize: 12,
    margin: 0,
  },
  textValue: {
    flex: 1,
    color: "#000000ee",
    fontSize: 15,
  },
});
