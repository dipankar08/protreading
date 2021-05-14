import React, { useRef, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { DLayoutCol, DLayoutRow, DListEmptyComponent, DSpace, FlatListItemSeparator, TextWithIcon } from "../components/basic";
import { DButtonPrimary, DButtonTag } from "../components/DButton";
import { DDialog } from "../components/DDialog";
import { DTextSearch } from "../components/DInput";
import { DKeyValueList } from "../components/DList";
import { useNetwork } from "../hooks/useNetwork";
import { TMarketEntry } from "../models/model";
import { DIMENS } from "../res/dimens";
import { colors } from "../styles/colors";
import { TProps } from "./types";

export const TickerListView = ({ navigation, objArray }: TProps) => {
  const [listData, setListData] = React.useState<TMarketEntry[]>([]);
  const [filterListData, setFilterListData] = React.useState<TMarketEntry[]>([]);
  const [inverted, setInverted] = useState(false);
  const [p2rLoading, setP2rLoading] = useState(false);
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  const [selectedEntry, setSelectedEntry] = React.useState<TMarketEntry>();
  const network = useNetwork();
  let isSubscribed = false;
  const refRBSheet = useRef();
  const flatListRef = useRef<FlatList<TMarketEntry>>();

  React.useEffect((): any => {
    console.log(`data updated ......${objArray?.length}`);
    setListData(objArray);
    setFilterListData(objArray);
    isSubscribed = true;
    return () => {
      isSubscribed = false;
    };
  }, [objArray]);

  const refRecommendationSheet = useRef<RBSheet>();
  const [recommendationItem, setRecommendationItem] = useState<TMarketEntry>();
  function openBottomSheet(item: TMarketEntry) {
    setRecommendationItem(item);
    refRecommendationSheet.current?.open();
  }

  return (
    <View style={{ paddingHorizontal: 0 }}>
      <DLayoutRow style={{ marginHorizontal: DIMENS.GAP_FROM_EDGE, marginTop: DIMENS.GAP_1X }}>
        {listData.length > 0 && (
          <DTextSearch
            placeholder={`search in ${listData.length} items`}
            style={{ flex: 1 }}
            onSearch={(query) => {
              if (query.length == 0) {
                setFilterListData(listData);
              } else {
                setFilterListData(listData.filter((x) => x.name.toLowerCase().indexOf(query.toLowerCase()) != -1));
              }
            }}
          ></DTextSearch>
        )}
      </DLayoutRow>
      <FlatList
        ref={flatListRef}
        onRefresh={() =>
          network.fetchLatestClose({
            onBefore: () => setP2rLoading(true),
            onComplete: () => setP2rLoading(false),
          })
        }
        refreshing={p2rLoading}
        data={filterListData}
        inverted={inverted}
        keyExtractor={(item, index) => item.name}
        scrollsToTop={true}
        ListEmptyComponent={DListEmptyComponent}
        ItemSeparatorComponent={FlatListItemSeparator}
        renderItem={({ item }) => {
          return (
            <DLayoutRow style={{ padding: 16 }}>
              <View
                style={{
                  flex: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: "#00000090",
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#00000050",
                    paddingTop: 5,
                  }}
                >
                  {item.symbol}
                </Text>
                <DLayoutRow>
                  <DButtonTag
                    onPress={() => {
                      navigation.navigate("WebViewScreen", {
                        url: `https://uk.tradingview.com/chart/?symbol=NSE:${item.symbol.replace(".NS", "")}&interval=5`,
                      });
                    }}
                    style={{ marginTop: 10, marginRight: 10, backgroundColor: colors.blue600 }}
                    text={"chart"}
                  />
                  <DButtonTag
                    onPress={() => {
                      console.log(item);
                      setSelectedEntry(item);
                      setVisibleIndicator(true);
                    }}
                    style={{ marginTop: 10, marginRight: 10, backgroundColor: colors.blue600 }}
                    text={"indicator"}
                  />
                  {item.recommended_to_buy != undefined && (
                    <DButtonTag
                      onPress={() => {
                        openBottomSheet(item);
                      }}
                      style={{ backgroundColor: "#1e6f5c", marginTop: 10 }}
                      text={"Recommend to buy"}
                    ></DButtonTag>
                  )}
                  {item.recommended_to_sell && (
                    <DButtonTag
                      onPress={() => {
                        openBottomSheet(item);
                      }}
                      style={{ marginTop: 10 }}
                      text={"Recommend to sell"}
                    ></DButtonTag>
                  )}
                </DLayoutRow>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: item.change > 0 ? "green" : "red",
                  }}
                >
                  {item.close}
                </Text>
                <Text
                  style={{
                    opacity: 0.7,
                    fontSize: 12,
                    textAlign: "right",
                    color: item.change > 0 ? "green" : "red",
                  }}
                >
                  {item.change}%
                </Text>
              </View>
            </DLayoutRow>
          );
        }}
      ></FlatList>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
        }}
      >
        <DLayoutCol style={{ paddingHorizontal: 16 }}>
          <Button onPress={() => {}} title="Sort By Change"></Button>
          <DSpace />
          <Button onPress={() => {}} title="Sort By Name"></Button>
          <TextWithIcon text={"Sort based on onChangeText"} icon={"sort-ascending"} style={{ paddingVertical: 8 }} onPress={() => {}}></TextWithIcon>
          <TextWithIcon text={"Sort by stock name"} icon={"sort-ascending"} style={{ paddingVertical: 8 }}></TextWithIcon>
        </DLayoutCol>
      </RBSheet>

      {/* Button sheet to show the recomendation */}
      <RBSheet
        ref={refRecommendationSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
          container: {
            height: 350,
          },
        }}
      >
        <DLayoutCol style={{ paddingHorizontal: 16 }}>
          <Text style={{ marginTop: 16, fontWeight: "bold", fontSize: 12, color: "#00000066", textTransform: "uppercase", marginBottom: 6 }}>
            Recommendation
          </Text>

          {recommendationItem?.recommended_to_buy && <Text style={{ fontSize: 20, color: "black" }}>Recommend to buy</Text>}
          {recommendationItem?.recommended_to_sell && <Text style={{ fontSize: 20, color: "black" }}>Recommend to sell</Text>}

          <Text style={{ marginTop: 16, fontWeight: "bold", fontSize: 12, color: "#00000088", textTransform: "uppercase", marginBottom: 10 }}>
            What we recommending this?
          </Text>

          {recommendationItem?.recommended_to_buy && <Text style={{ fontSize: 13, color: "black" }}>{recommendationItem.recommended_to_buy} </Text>}
          {recommendationItem?.recommended_to_sell && <Text style={{ fontSize: 13, color: "black" }}>{recommendationItem.recommended_to_sell}</Text>}

          <Text style={{ marginTop: 30, fontWeight: "bold" }}>Love this Recommendation?</Text>
          <DButtonPrimary> Get a Free invitation for Intra day!</DButtonPrimary>
        </DLayoutCol>
      </RBSheet>
      <DDialog
        title={"Indicator List"}
        visible={visibleIndicator}
        onCancel={() => {
          setVisibleIndicator(false);
        }}
      >
        <DKeyValueList object={selectedEntry?.indicator}></DKeyValueList>
      </DDialog>
    </View>
  );
};
