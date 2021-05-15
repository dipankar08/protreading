import React, { useEffect } from "react";
import { FlatList } from "react-native";
import { DContainerSafe, DLayoutCol, DListEmptyComponent, ScreenHeader } from "../components/basic";
import { DButtonIcon } from "../components/DButton";
import { DCard, DLayoutRow } from "../components/DLayout";
import { DTextFooter, DTextSubTitle, DTextTitle } from "../components/DText";
import { useNetwork } from "../hooks/useNetwork";
import { showNotification } from "../libs/uihelper";
import { TObject } from "../models/model";
import { TProps } from "./types";
export let ScreenListScreen = ({ navigation }: TProps) => {
  const network = useNetwork();
  const [loading, setLoading] = React.useState(false);
  const [listData, setListData] = React.useState<Array<TObject>>([]);
  async function load() {
    network.getScreen({
      onBefore: () => setLoading(true),
      onComplete: () => setLoading(false),
      onError: (e) => showNotification("not able to get data"),
      onSuccess: (data) => setListData(data as Array<TObject>),
    });
  }
  useEffect(() => {
    load();
  }, []);

  return (
    <DContainerSafe>
      <DLayoutCol style={{ padding: 16 }}>
        <ScreenHeader
          title={"Screen"}
          style={{ padding: 0 }}
          icon="plus"
          onPress={() => {
            navigation.push("NewScreenScreen");
          }}
        />
        <FlatList
          showsHorizontalScrollIndicator={false}
          data={listData}
          keyExtractor={(item) => item._id.toString()}
          ListEmptyComponent={DListEmptyComponent}
          onRefresh={() => {
            load();
          }}
          refreshing={loading}
          renderItem={({ item }) => {
            return (
              <DCard style={{ marginVertical: 10 }}>
                <DLayoutRow>
                  <DLayoutCol style={{ flex: 1 }}>
                    <DTextTitle>{item.title}</DTextTitle>
                    <DTextSubTitle>{item.desc}</DTextSubTitle>
                    <DTextFooter>{item.filter}</DTextFooter>
                  </DLayoutCol>
                  <DLayoutCol>
                    <DButtonIcon
                      icon="play"
                      onPress={() => {
                        navigation.push("NewScreenScreen", { filter: item.filter });
                      }}
                    ></DButtonIcon>
                  </DLayoutCol>
                </DLayoutRow>
              </DCard>
            );
          }}
        ></FlatList>
      </DLayoutCol>
    </DContainerSafe>
  );
};
