import React, { useContext, useEffect, useState } from "react";
import { FlatList, Text, useWindowDimensions, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { SceneMap, TabView } from "react-native-tab-view";
import { AppStateContext } from "../appstate/AppStateStore";
import { DContainerSafe, DLayoutCol, DLayoutRow, DText, FlatListItemSeparator, ScreenHeader } from "../components/basic";
import { DButtonPrimary, DButtonTag } from "../components/DButton";
import { useNetwork } from "../hooks/useNetwork";
import { TOrder } from "../models/model";
import { colors } from "../styles/colors";
import { OrderCloseDialog, OrderCreateDialog, OrderViewDialog } from "./Dialog";
import { TProps } from "./types";

export const PositionScreen = ({ navigation }: TProps) => {
  // tab config
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Break View", navigation: navigation },
    { key: "second", title: "Consolidated View", navigation: navigation },
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
      <DButtonPrimary onPress={() => setModalVisible(true)} style={{ marginHorizontal: 8, marginTop: 0, marginBottom: 10 }}>
        Add new Buy
      </DButtonPrimary>
      <OrderCreateDialog visible={modalVisible} onClose={() => setModalVisible(false)} />
    </DContainerSafe>
  );
};

export const PositionListView = ({ route, navigation }: TProps) => {
  const appState = useContext(AppStateContext);
  const network = useNetwork();
  const [listData, setListData] = React.useState<TOrder[]>([]);
  const [selectedItem, setSelectedItem] = useState<TOrder>();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [viewDialogVisible, setViewDialogVisible] = useState(false);
  const [p2rLoading, setP2rLoading] = useState(false);

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
        onRefresh={() =>
          network.fetchLatestClose({
            onBefore: () => setP2rLoading(true),
            onComplete: () => setP2rLoading(false),
          })
        }
        refreshing={p2rLoading}
        data={listData}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={FlatListItemSeparator}
        renderItem={({ item }) => {
          let color = item.change_per > 0 ? "green" : "red";
          let color_close = item.closed_sum > item.invested_sum ? "green" : "red";
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
                        <DButtonTag
                          style={{ backgroundColor: colors.orange600, marginEnd: 10 }}
                          onPress={() => {
                            setSelectedItem(item);
                            setDialogVisible(true);
                          }}
                          text="close"
                        ></DButtonTag>
                      )}
                      {item.isBreakOrder && !item.is_open && (
                        <DButtonTag
                          style={{ backgroundColor: colors.yellow400, marginEnd: 10 }}
                          onPress={() => {
                            network.reopenOrder(item._id);
                          }}
                          text="reopen"
                        ></DButtonTag>
                      )}
                      <DButtonTag
                        style={{ backgroundColor: colors.green600, marginEnd: 10 }}
                        onPress={() => {
                          setSelectedItem(item);
                          setViewDialogVisible(true);
                        }}
                        text="order"
                      ></DButtonTag>
                      <DButtonTag
                        style={{ backgroundColor: colors.green600, marginEnd: 10 }}
                        onPress={() => {
                          route.navigation.navigate("WebViewScreen", {
                            url: `https://uk.tradingview.com/chart/?symbol=NSE:${item.symbol.replace(".NS", "")}&interval=5`,
                          });
                        }}
                        text="chart"
                      >
                        chart
                      </DButtonTag>
                    </View>
                  </DLayoutCol>
                  <DLayoutCol style={{ alignItems: "flex-end" }}>
                    {item.is_open ? ( // opened
                      <>
                        <DText style={{ color: color, fontSize: 14 }}>
                          {item.change.toFixed(2)} ({item.change_per.toFixed(2)}%)
                        </DText>
                        <Text style={{ color: "#00000077", fontSize: 12, marginVertical: 2 }}>
                          Buy: {item.quantities} X {item.buy_price.toFixed(2)} = {item.invested_sum.toFixed(2)}
                        </Text>
                        <Text style={{ color: "#00000077", fontSize: 12, marginVertical: 2 }}>
                          Latest:{item.quantities} X {item.ltp.toFixed(2)} = {item.current_sum.toFixed(2)}
                        </Text>
                        <Text style={{ color: colors.purple700, fontSize: 12, marginVertical: 2 }}>
                          breakeven: {item.taxInfo?.breakeven.toFixed(2)}
                        </Text>
                      </>
                    ) : (
                      // closed
                      <>
                        <DText style={{ color: color_close, fontSize: 14 }}>
                          Gain: {(item.closed_sum - item.invested_sum).toFixed(2)} (
                          {((item.closed_sum - item.invested_sum) / item.invested_sum).toFixed(2)}%)
                        </DText>
                        <Text style={{ color: "#00000077", fontSize: 12, marginVertical: 2 }}>
                          Buy: {item.quantities} X {item.buy_price.toFixed(2)} = {item.invested_sum.toFixed(2)}
                        </Text>
                        <Text style={{ color: "#00000077", fontSize: 12, marginVertical: 2 }}>
                          Sold:{item.quantities} X {item.sell_price.toFixed(2)} = {item.closed_sum.toFixed(2)}
                        </Text>
                      </>
                    )}
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
