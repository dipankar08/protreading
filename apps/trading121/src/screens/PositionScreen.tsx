import { Button, FlatList, Text, View, StyleSheet, TextInput, Modal, useWindowDimensions } from "react-native";
import { DContainer, DLayoutCol, DLayoutRow, DCard, DText, DButton, FlatListItemSeparator, ScreenHeader, DContainerSafe } from "../components/basic";
import { TProps } from "./types";
import React, { useEffect, useState } from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import { useContext } from "react";
import { AppStateContext } from "../appstate/AppStateStore";
import { TOrder } from "../models/model";
import { SceneMap, TabView } from "react-native-tab-view";
import { OrderCloseDialog, OrderCreateDialog } from "./Dialog";

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
  const [modalVisible, setModalVisible] = React.useState(false);
  return (
    <DContainerSafe style={{ paddingHorizontal: 0 }}>
      <ScreenHeader title={"Smart Portfolio"} style={{ padding: 16 }} icon="sort-reverse-variant"></ScreenHeader>
      <TabView navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} initialLayout={{ width: layout.width }} />
      <DButton onPress={() => setModalVisible(true)} style={{ marginHorizontal: 16 }}>
        Add new Buy
      </DButton>
      <OrderCreateDialog visible={modalVisible} onClose={() => setModalVisible(false)} />
    </DContainerSafe>
  );
};

export const PositionListView = ({ route }: TProps) => {
  const appState = useContext(AppStateContext);
  const [listData, setListData] = React.useState<TOrder[]>([]);
  const [selectedItem, setSelectedItem] = useState<TOrder>();
  const [dialogVisible, setDialogVisible] = useState(false);

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
                      ltp : {item.ltp} ({item.ltp_change.toFixed(2)}%)
                    </Text>
                    <Text style={{ color: "#000000dd", fontSize: 12, marginVertical: 2 }}>Invested for {item.open_for}</Text>
                    {item.isBreakOrder && (
                      <DButton
                        style={{ padding: 1, width: 100 }}
                        onPress={() => {
                          setSelectedItem(item);
                          setDialogVisible(true);
                        }}
                      >
                        closeOrder
                      </DButton>
                    )}
                  </DLayoutCol>
                  <DLayoutCol style={{ alignItems: "flex-end" }}>
                    <DText style={{ color: color, fontSize: 14 }}>
                      {item.change.toFixed(2)} ({item.change_per.toFixed(2)}%)
                    </DText>
                    <Text style={{ color: "#00000077", fontSize: 12, marginVertical: 2 }}>
                      {item.quantities} X {item.buy_price.toFixed(2)} = {item.invested_sum.toFixed(2)}
                    </Text>
                    <Text style={{ color: "#00000077", fontSize: 12, marginVertical: 2 }}>
                      {item.quantities} X {item.ltp.toFixed(2)} = {item.current_sum.toFixed(2)}
                    </Text>
                  </DLayoutCol>
                </DLayoutRow>
              </DLayoutCol>
            </TouchableWithoutFeedback>
          );
        }}
      ></FlatList>
      <OrderCloseDialog
        item={selectedItem}
        visible={dialogVisible}
        onClose={() => {
          setDialogVisible(false);
        }}
      />
    </View>
  );
};
