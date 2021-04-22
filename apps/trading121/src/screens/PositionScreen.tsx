import { Button, FlatList, Text, View, StyleSheet, TextInput, Modal, useWindowDimensions } from "react-native";
import {
  DContainer,
  DLayoutCol,
  DLayoutRow,
  DCard,
  DText,
  DButton,
  FlatListItemSeparator,
  ScreenHeader,
  DContainerSafe,
  QuickButton,
} from "../components/basic";
import { TProps } from "./types";
import React, { useEffect, useState } from "react";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import { useContext } from "react";
import { AppStateContext } from "../appstate/AppStateStore";
import { TOrder } from "../models/model";
import { SceneMap, TabView } from "react-native-tab-view";
import { OrderCloseDialog, OrderCreateDialog, OrderViewDialog } from "./Dialog";
import { globalStyle, STYLES } from "../components/styles";
import { useNetwork } from "../hooks/useNetwork";
import { colors } from "../styles/colors";

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
  const network = useNetwork();
  const [listData, setListData] = React.useState<TOrder[]>([]);
  const [selectedItem, setSelectedItem] = useState<TOrder>();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [viewDialogVisible, setViewDialogVisible] = useState(false);

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
              <DLayoutCol style={{ padding: 16, opacity: item.is_open ? 1 : 0.6 }}>
                <DLayoutRow>
                  <DLayoutCol style={{ flex: 1 }}>
                    <Text style={{ color: "#00000077", fontSize: 16, marginVertical: 2 }}>Order# {item.index}</Text>
                    <Text style={{ color: "#000000", fontSize: 14, marginTop: 2, textTransform: "uppercase" }}>{item.symbol}</Text>
                    <DText style={{ color: color, fontSize: 14 }}>
                      Long: {item.quantities} @ {item.buy_price.toFixed(2)}
                    </DText>
                    <Text style={{ color: "#000000dd", fontSize: 12, marginVertical: 2 }}>Invested for {item.open_for}</Text>
                    <View style={{ display: "flex", flexDirection: "row", marginTop: 10 }}>
                      {item.isBreakOrder && item.is_open && (
                        <QuickButton
                          style={{ backgroundColor: colors.orange600 }}
                          onPress={() => {
                            setSelectedItem(item);
                            setDialogVisible(true);
                          }}
                        >
                          closeOrder
                        </QuickButton>
                      )}
                      {item.isBreakOrder && !item.is_open && (
                        <QuickButton
                          style={{ backgroundColor: colors.yellow400 }}
                          onPress={() => {
                            network.reopenOrder(item._id);
                          }}
                        >
                          reopen Order
                        </QuickButton>
                      )}
                      <QuickButton
                        style={{ backgroundColor: colors.green600 }}
                        onPress={() => {
                          setSelectedItem(item);
                          setViewDialogVisible(true);
                        }}
                      >
                        View Order
                      </QuickButton>
                    </View>
                  </DLayoutCol>
                  <DLayoutCol style={{ alignItems: "flex-end" }}>
                    <DText style={{ color: color, fontSize: 14 }}>
                      {item.change.toFixed(2)} ({item.change_per.toFixed(2)}%)
                    </DText>
                    <Text style={{ color: "#00000077", fontSize: 12, marginVertical: 2 }}>
                      Buy: {item.quantities} X {item.buy_price.toFixed(2)} = {item.invested_sum.toFixed(2)}
                    </Text>
                    <Text style={{ color: "#00000077", fontSize: 12, marginVertical: 2 }}>
                      Latest:{item.quantities} X {item.ltp.toFixed(2)} = {item.current_sum.toFixed(2)}
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
      <OrderViewDialog
        items={selectedItem}
        visible={viewDialogVisible}
        onClose={() => {
          setViewDialogVisible(false);
        }}
      />
    </View>
  );
};
