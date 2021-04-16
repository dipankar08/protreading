import { Button, FlatList, Text, View, StyleSheet, TextInput, Modal, useWindowDimensions } from "react-native";
import { DContainer, DLayoutCol, DLayoutRow, DCard, DText, DButton, FlatListItemSeparator, ScreenHeader } from "../components/basic";
import { TProps } from "./types";
import React, { useEffect } from "react";
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
import { SceneMap, TabView } from "react-native-tab-view";

export const PositionScreen = ({ navigation }: TProps) => {
  // tab config
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Break View" },
    { key: "second", title: "Consolidated View" },
  ]);

  const renderScene = SceneMap({
    first: PositionListView,
    second: PositionListView,
  });
  // new order
  const [stockList, setStockList] = React.useState([<Picker.Item key="" value="" label="Wait..." />]);
  const [stock, setStock] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [quantities, setQuantities] = React.useState("");
  const [modalVisible, setModalVisible] = React.useState(false);
  const appState = useContext(AppStateContext);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function reload(useCache = true) {
    console.log("[NETWORK] fetching from network ");
    setLoading(true);
    try {
      let position = await getRequest(
        `https://simplestore.dipankar.co.in/api/grodok_position?user_id=${appState.state.userInfo.user_id}&_limit=100`,
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
  let xStockList = appState.state.market
    ? appState.state.market.stocks.map((item) => {
        return <Picker.Item key={item.symbol} value={item.symbol} label={item.symbol} />;
      })
    : [<Picker.Item key="" value="" label="Wait..." />];

  return (
    <DContainer style={{ paddingHorizontal: 0 }}>
      <ScreenHeader title={"Position"} style={{ padding: 16 }} icon="sort-reverse-variant"></ScreenHeader>
      <TabView navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} initialLayout={{ width: layout.width }} />
      <DButton onPress={() => setModalVisible(true)} style={{ marginHorizontal: 16 }}>
        Add new Buy
      </DButton>

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

export const PositionListView = ({ route }: TProps) => {
  const appState = useContext(AppStateContext);
  const [listData, setListData] = React.useState<TOrder[]>([]);
  useEffect(() => {
    if (!appState.state.position) {
      return;
    }
    if (route.key == "first") {
      setListData(appState.state.position?.orderList);
    } else {
      setListData(appState.state.position?.consolidatedList);
    }
  }, [appState.state.position]);
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <FlatList
        data={listData}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={FlatListItemSeparator}
        renderItem={({ item }) => {
          let color = item.change_per > 0 ? "green" : "red";
          return (
            <TouchableWithoutFeedback
              onLongPress={() => {
                if (item.is_open) {
                  // closeOrder(item, "0"); << DISABLED FOR NOW
                }
              }}
            >
              <DLayoutCol style={{ padding: 16, opacity: item.is_open ? 1 : 0.3 }}>
                <DLayoutRow>
                  <DLayoutCol style={{ flex: 1 }}>
                    <Text style={{ color: "#00000077", fontSize: 16, marginVertical: 2 }}>Order# {item.index}</Text>
                    <Text style={{ color: "#000000", fontSize: 14, marginVertical: 2, textTransform: "uppercase" }}>{item.symbol}</Text>
                    <Text style={{ color: color, fontSize: 12 }}>
                      ltp : {item.last_price} ({item.ltp_change}%)
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
                      {item.quantities} X {item.last_price} = {item.current_sum}
                    </Text>
                  </DLayoutCol>
                </DLayoutRow>
              </DLayoutCol>
            </TouchableWithoutFeedback>
          );
        }}
      ></FlatList>
    </View>
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
