import { Button, FlatList, Text, View, StyleSheet, TextInput, Modal } from "react-native";
import { DContainer, DLayoutCol, DLayoutRow, DCard, DText, DButton, FlatListItemSeparator } from "../components/basic";
import { TProps } from "./types";
import React from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Picker } from "@react-native-community/picker";
import { useContext } from "react";
import { AppStateContext } from "../appstate/AppStateStore";
import { CACHE_KEY_POSITION } from "../appstate/CONST";
import { processPositionData } from "../models/processor";
import { verifyOrCrash } from "../libs/assert";
import { getRequest, postRequest } from "../libs/network";
import { showNotification } from "../libs/uihelper";
import { TOrder } from "../models/model";
import { Alert } from "react-native";

export const PositionScreen = ({ navigation }: TProps) => {
  const appState = useContext(AppStateContext);
  // state
  const [modalVisible, setModalVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  // new order
  const [stockList, setStockList] = React.useState([<Picker.Item key="" value="" label="Wait..." />]);
  const [stock, setStock] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [quantities, setQuantities] = React.useState("");

  async function reload(useCache = true) {
    console.log("[NETWORK] fetching from network ");
    setLoading(true);
    try {
      let position = await getRequest(
        `https://simplestore.dipankar.co.in/api/grodok_position?user_id=${appState.state.userInfo.user_id}`,
        CACHE_KEY_POSITION,
        useCache
      );

      verifyOrCrash(appState.state.market != null);
      appState.dispatch({ type: "UPDATE_POSITION", payload: processPositionData(position, appState.state.market) });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setError("Not able to get Data");
    }
  }

  React.useEffect((): any => {
    let isSubscribed = true;
    reload(false);
    return () => (isSubscribed = false);
  }, []);

  async function createNewOrder() {
    try {
      let response = await postRequest("https://simplestore.dipankar.co.in/api/grodok_position/create", {
        user_id: appState.state.userInfo.user_id,
        symbol: stock,
        buy_price: parseFloat(price),
        quantities: parseFloat(quantities),
      });

      // no cache.
      reload(false);
      showNotification("Created a new order");
    } catch (err) {
      console.log(err);
      showNotification("Not able to create a order");
    }
  }

  async function closeOrder(order: TOrder, sell_price: string) {
    Alert.alert("Close this order?", "After closing your position summary will be updated!", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: async () => {
          console.log("OK Pressed");
          try {
            let response = postRequest("https://simplestore.dipankar.co.in/api/grodok_position/update", {
              _id: order._id,
              sell_price: parseFloat("10"),
            });

            //console.log(response);
            // no cache.
            reload(false);
            showNotification("Closed the order");
          } catch (err) {
            console.log(err);
            showNotification("Not able to close the order");
          }
        },
      },
    ]);
  }

  let xStockList = appState.state.market
    ? appState.state.market.stocks.map((item) => {
        return <Picker.Item key={item.symbol} value={item.symbol} label={item.symbol} />;
      })
    : [<Picker.Item key="" value="" label="Wait..." />];

  return (
    <DContainer>
      <View
        style={{
          flex: 1,
        }}
      >
        <FlatList
          onRefresh={() => reload(false)}
          refreshing={loading}
          data={appState.state.position?.orderList}
          keyExtractor={(item) => item._id}
          ItemSeparatorComponent={FlatListItemSeparator}
          renderItem={({ item }) => {
            let color = item.change_per > 0 ? "green" : "red";
            return (
              <TouchableWithoutFeedback
                onLongPress={() => {
                  if (item.is_open) {
                    closeOrder(item, "0");
                  }
                }}
              >
                <DLayoutCol style={{ padding: 20, opacity: item.is_open ? 1 : 0.3 }}>
                  <DLayoutRow>
                    <DLayoutCol style={{ flex: 1 }}>
                      <Text style={{ color: "#000000", fontSize: 14, marginVertical: 2, textTransform: "uppercase" }}>{item.symbol}</Text>
                      <Text style={{ color: color, fontSize: 12 }}>
                        ltp : {item.last_price} - ({item.ltp_change})
                      </Text>
                      <Text style={{ color: "#00000077", fontSize: 12, marginVertical: 2 }}>
                        {item.quantities} X {item.buy_price} = {item.invested_sum}
                      </Text>
                      <Text style={{ color: "#000000dd", fontSize: 12, marginVertical: 2 }}>Invested for {item.open_for}</Text>
                    </DLayoutCol>
                    <DLayoutCol style={{ alignItems: "flex-end" }}>
                      <DText style={{ color: color, fontSize: 14 }}>
                        {item.change} ({item.change_per}%)
                      </DText>
                      <Text style={{ color: "#00000077", fontSize: 12, marginVertical: 2 }}>
                        {item.quantities} X {item.buy_price} = {item.invested_sum}
                      </Text>
                      <Text style={{ color: "#00000077", fontSize: 12, marginVertical: 2 }}>
                        {item.quantities} X {item.last_price} = {item.invested_sum}
                      </Text>
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
            <Picker selectedValue={stock} style={styles.pickerStyle} onValueChange={(itemValue, itemIndex) => setStock(itemValue)}>
              {xStockList}
            </Picker>
            <TextInput style={styles.TextInputStyle} placeholder="White Stock Price" value={price} onChangeText={setPrice}></TextInput>
            <TextInput style={styles.TextInputStyle} placeholder="Write Stock Qn" value={quantities} onChangeText={setQuantities}></TextInput>
            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }}>
              <Button
                onPress={() => {
                  createNewOrder();
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
