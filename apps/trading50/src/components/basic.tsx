/*
export const DTextInput = ({ children, style, dark, placeholder, onChangeText }: TProps) => {
  return (
    <TextInput
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={dark ? "#ffffff99" : "#11111199"}
      style={[
        {
          backgroundColor: "#00000000",
          color: dark ? "white" : STYLES.APP_COLOR_PRIMARY,
          borderColor: dark ? "white" : STYLES.APP_COLOR_PRIMARY,
          borderWidth: 1,
          padding: 10,
          paddingVertical: 10,
          marginVertical: 8,
          borderRadius: 6,
          textTransform: "uppercase",
        },
        style,
      ]}
    >
      {children}
    </TextInput>
  );
};
export const DContainer = ({ children, style }: TProps) => {
  return (
    <View
      style={[
        {
          paddingHorizontal: 16,
          backgroundColor: STYLES.APP_SCREEN_BACKGROUND,
          flex: 1,
          flexDirection: "column",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const DSpace = ({ children, style }: TProps) => {
  return (
    <View
      style={[
        {
          height: 20,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const DLayoutRow = ({ children, center, style }: TProps) => {
  return (
    <View
      style={[
        {
          display: "flex",
          flexDirection: "row",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const DLayoutCol = ({ children, center, style }: TProps) => {
  return (
    <View
      style={[
        {
          display: "flex",
          flexDirection: "column",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

export const FlatListItemSeparator = () => {
  return (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: "#00000020",
      }}
    />
  );
};

export const DListEmptyComponent = () => {
  return (
    <View style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: 40 }}>
      <MaterialCommunityIcons name={"emoticon-sad-outline"} color="black" size={40} />
      <Text style={{ color: "red", textAlign: "center", marginTop: 16 }}>No item found</Text>
    </View>
  );
};

export const TextWithIcon = ({ style, onPress, text, icon }: TProps) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[{ display: "flex", flexDirection: "row", alignItems: "center" }, style]}>
        <MaterialCommunityIcons name={icon} color="black" size={24} />
        <TouchableOpacity onPress={onPress}>
          <Text style={{ fontSize: 16, color: "#000000", marginLeft: 8, textTransform: "capitalize" }}>{text}</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

export const ScreenHeader = ({
  navigation, // pass navigation if yu want to suport back.
  title, // title
  icon, // icon right
  onPress, // onpress on icon right
  style,
  loading,
  leftIcon,
  onPressLeftIcon,
  hideBack,
  color,
}: any) => {
  return (
    <View
      style={[
        {
          display: "flex",
          flexDirection: "row",
          padding: 0,
          alignItems: "center",
        },
        style,
      ]}
    >
      {leftIcon && (
        <DButtonIcon
          icon={leftIcon}
          size={24}
          color={color || "black"}
          loading={false}
          onPress={onPressLeftIcon}
          style={{ marginRight: DIMENS.GAP_2X }}
        ></DButtonIcon>
      )}
      {navigation && !hideBack ? (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 20 }}>
          <MaterialCommunityIcons name={"arrow-left"} color={color || "black"} size={24} />
        </TouchableOpacity>
      ) : (
        <View></View>
      )}
      <DScreenTitle style={{ color: color || "black", marginTop: 0 }}>{title}</DScreenTitle>
      {icon && <DButtonIcon icon={icon} size={24} color={color || "black"} loading={loading || false} onPress={onPress}></DButtonIcon>}
    </View>
  );
};
*/
