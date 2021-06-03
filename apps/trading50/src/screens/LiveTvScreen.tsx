import { Video } from "expo-av";
import React, { useEffect } from "react";
import { FlatList } from "react-native-gesture-handler";
import { DListEmptyComponent, FlatListItemSeparator, ScreenHeader } from "../components/basic";
import { DButtonIcon } from "../components/DButton";
import { DBorderLine, DContainerSafe, DLayoutCol, DLayoutRow } from "../components/DLayout";
import { DTextFooter, DTextTitle } from "../components/DText";
import { showNotification } from "../components/libs/uihelper";
import { colors } from "../components/res/colors";
import { DIMENS } from "../components/res/dimens";
import { TProps } from "./types";
type TStreamList = {
  name: string;
  url: string;
};
const tvList: Array<TStreamList> = [
  {
    name: "Tv18",
    url: "https://cnbctv18-lh.akamaihd.net/i/cnbctv18_1@174868/index_5_av-p.m3u8",
  },
  {
    name: "CNBC Bazar",
    url: "https://cnbcbazar-lh.akamaihd.net/i/cnbcbajar_1@178933/index_5_av-p.m3u8",
  },
  { name: "CNBC Awaaz", url: "https://cnbcawaaz-lh.akamaihd.net/i/cnbcawaaz_1@174872/index_5_av-p.m3u8" },
  { name: "ET now", url: "https://etnowweblive-lh.akamaihd.net/i/ETN_1@348070/master.m3u8" },
  { name: "Times Now", url: "https://timesnow-lh.akamaihd.net/i/TNHD_1@129288/master.m3u8" },
];
export const LiveTVScreen = ({ navigation }: TProps) => {
  const [selected, setSelected] = React.useState<TStreamList>(tvList[0]);
  const [desc, setDesc] = React.useState("This is a Live Tv News");
  useEffect(() => {
    setSelected(tvList[0]);
  }, []);

  return (
    <DContainerSafe>
      <DLayoutCol style={{ backgroundColor: colors.black }}>
        <ScreenHeader style={{ margin: DIMENS.GAP_BETWEEN_ELEMENT }} navigation={navigation} title={"Live News"} color={colors.white}></ScreenHeader>
        <DTextFooter style={{ color: colors.white, margin: DIMENS.GAP_BETWEEN_ELEMENT }}>{`Now Playing ${selected.name}`}</DTextFooter>
        <DBorderLine />
        <Video
          source={{ uri: selected.url }}
          rate={1.0}
          //volume={1.0}
          //isMuted={true}
          resizeMode="contain"
          shouldPlay
          style={{ width: "100%", height: 300 }}
          useNativeControls
          onPlaybackStatusUpdate={(status) => {
            //console.log(status);
          }}
          onError={(err) => {
            showNotification("Not able to play:" + err);
          }}
        />
        <DBorderLine />
        <FlatList
          style={{ height: "50%" }}
          ItemSeparatorComponent={FlatListItemSeparator}
          showsHorizontalScrollIndicator={false}
          data={tvList}
          keyExtractor={(item: TStreamList) => item.name.toString()}
          ListEmptyComponent={DListEmptyComponent}
          renderItem={({ item }) => {
            return (
              <DLayoutRow style={{ marginHorizontal: DIMENS.GAP_FROM_EDGE }}>
                <DTextTitle style={{ color: "white", flex: 1 }}>{item.name}</DTextTitle>
                <DButtonIcon
                  icon="play"
                  style={{ color: "white" }}
                  onPress={() => {
                    setSelected(item);
                  }}
                ></DButtonIcon>
              </DLayoutRow>
            );
          }}
        />
      </DLayoutCol>
    </DContainerSafe>
  );
};
