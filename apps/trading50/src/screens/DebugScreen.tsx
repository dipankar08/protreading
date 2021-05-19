import React, { useContext } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { AppStateContext } from "../appstate/AppStateStore";
import { DContainerSafe, DLayoutCol, ScreenHeader } from "../components/basic";
import { DButtonPrimary } from "../components/DButton";
import { DKeyValueList } from "../components/DList";
import { DTextSection } from "../components/DText";
import { AppInfoCard } from "../core/AppInfoCard";
import { useNetwork } from "../hooks/useNetwork";
import { showNotification } from "../libs/uihelper";
import { TObject } from "../models/model";
import { TProps } from "./types";
export const DebugScreen = ({ navigation }: TProps) => {
  const appState = useContext(AppStateContext);
  const [domainDialogVisible, setDomainDialogVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const network = useNetwork();
  const [timeStampList, setTimeStampList] = React.useState<TObject>({});
  async function reload() {
    network.getTimeStamp({
      onBefore: () => setLoading(true),
      onComplete: () => setLoading(false),
      onSuccess: (obj: TObject) => {
        showNotification(obj.msg);
        setTimeStampList(obj.out.timestamp);
      },
      onError: (msg) => showNotification(msg),
    });
  }
  return (
    <DContainerSafe>
      <ScrollView>
        <DLayoutCol style={{ padding: 16 }}>
          <ScreenHeader
            navigation={navigation}
            title={"Debug Settings"}
            style={{ padding: 0 }}
            icon="reload"
            onPress={() => reload()}
            loading={loading}
          />
          <DTextSection style={{ marginTop: 20 }}>App Information</DTextSection>
          <AppInfoCard />
          <DTextSection style={{ marginTop: 40 }}>Data Information</DTextSection>
          <DKeyValueList object={timeStampList}></DKeyValueList>
          <DButtonPrimary
            style={{ marginTop: 10 }}
            onPress={() =>
              network.recomputeIndicator({
                onBefore: () => setLoading(true),
                onComplete: () => setLoading(false),
                onSuccess: () => showNotification("Task Submitted"),
                onError: (e) => showNotification(e),
              })
            }
            loading={loading}
          >
            Refresh Data in backend
          </DButtonPrimary>
        </DLayoutCol>
      </ScrollView>
    </DContainerSafe>
  );
};
