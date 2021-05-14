import { Picker } from "@react-native-community/picker";
import React, { useContext } from "react";
import { Button, Modal, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { AppStateContext } from "../appstate/AppStateStore";
import { DDialog } from "../components/DDialog";
import { DKeyValueList } from "../components/DList";
import { useNetwork } from "../hooks/useNetwork";

export const OrderCreateDialog = ({ visible, onClose }: any) => {
  const network = useNetwork();
  const appState = useContext(AppStateContext);

  const [stock, setStock] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [quantities, setQuantities] = React.useState("");

  console.log("OrderCreateDialog called");
  let xStockList = [<Picker.Item key="" value="" label="Select an item" />];
  for (let value of appState.state.stockMap.values()) {
    xStockList.push(<Picker.Item key={value._id} value={value._id} label={`${value.symbol}-${value.name}`} />);
  }

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
          <TextInput style={styles.TextInputStyle} placeholder="Please enter Stock Price" value={price} onChangeText={setPrice}></TextInput>
          <TextInput style={styles.TextInputStyle} placeholder="Write Stock quantities" value={quantities} onChangeText={setQuantities}></TextInput>
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

export const OrderViewDialog = ({ items, visible, onClose }: any) => {
  return (
    <DDialog visible={visible} onCancel={onClose} title="Order Details">
      <DKeyValueList object={items}></DKeyValueList>
    </DDialog>
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
    backgroundColor: "rgba(0,0,0,0.5)",
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
