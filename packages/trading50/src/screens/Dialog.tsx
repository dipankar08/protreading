import { Picker } from "@react-native-community/picker";
import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { DButtonPrimary } from "../components/DButton";
import { DDialog } from "../components/DDialog";
import { DLayoutCol } from "../components/DLayout";
import { DKeyValueList } from "../components/DList";
import { DTextFooter } from "../components/DText";
import { AppStateContext } from "./AppStateProvider";
import { useNetwork } from "./useNetwork";

export const OrderCreateDialog = ({ visible, onClose }: any) => {
  const network = useNetwork();
  const appState = useContext(AppStateContext);

  const [stock, setStock] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [quantities, setQuantities] = React.useState("");
  const [stockListUI, setStockListUI ] = React.useState<JSX.Element[]>([]);

  React.useEffect(()=>{
    console.log("recomputing....")
    let xStockList = [<Picker.Item key="" value="" label="Select an item" />];
      for (let value of appState.state.stockMap.values()) {
        xStockList.push(<Picker.Item key={value._id} value={value._id} label={`${value.symbol}-${value.name}`} />);
      }
      setStockListUI(xStockList)
  },[])

 

  return (
    <DDialog
      visible={visible}
      onCancel={() => {
        onClose();
      }}
      title={"Create Position"}
    >
      <DLayoutCol>
        <Picker selectedValue={stock} style={styles.pickerStyle} onValueChange={(itemValue, itemIndex) => setStock(itemValue)}>
          {stockListUI}
        </Picker>
        <TextInput style={styles.TextInputStyle} placeholder="Please enter Stock Price" value={price} onChangeText={setPrice}></TextInput>
        <TextInput style={styles.TextInputStyle} placeholder="Write Stock quantities" value={quantities} onChangeText={setQuantities}></TextInput>
        <DButtonPrimary
          onPress={() => {
            network.createOrder(stock, price, quantities, () => {
              onClose();
            });
          }}
          title="add New"
        />
      </DLayoutCol>
    </DDialog>
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
    <DDialog
      onCancel={() => {
        onClose();
      }}
      title={"Close Order"}
    >
      <DLayoutCol>
        <DTextFooter> You are going to close the order {item?.stock}</DTextFooter>
        <TextInput style={styles.TextInputStyle} placeholder="Sell Price" value={price} onChangeText={setPrice}></TextInput>
        <DButtonPrimary
          onPress={() => {
            network.closeOrder(item._id, price, () => {
              onClose();
            });
          }}
        >
          Close Order
        </DButtonPrimary>
      </DLayoutCol>
    </DDialog>
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
    backgroundColor: "#00000020",
    position: "absolute",
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
