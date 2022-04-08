import * as React from "react";
import { useState, useEffect } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import {
  Button,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Location from "expo-location";

function Tree(props) {
  return (
    <View>
      <Marker
        {...props}
        onPress={() => props.text && props.navigate(props.treeKey)}
      >
        <View
          style={{
            backgroundColor: "#DDD",
            borderRadius: 5,
            margin: 5,
            padding: 7,
            textAlign: "center",
            flex: 0.2,
            alignSelf: "center",
            opacity: props.text ? 1 : 0,
          }}
        >
          <Text style={{ alignSelf: "center" }}>{props.tree}</Text>
          <Text style={{color: "#0363ff"}}>Click to see more</Text>
        </View>
        <Image
          source={require("./tree.png")}
          style={{ flex: 0.7, alignSelf: "center" }}
        ></Image>
      </Marker>
    </View>
  );
}

const TREES = [
  { id: "1", latitude: 23.59933, longitude: 77.412613, type: "apple tree" },
  { id: "2", latitude: 23.59, longitude: 77.412, type: "pear tree" },
];

function getTrees() {
  return TREES;
}

function AllTrees(props) {
  return getTrees().map((tree) => (
    <Tree
      coordinate={{ latitude: tree.latitude, longitude: tree.longitude }}
      tree={tree.type}
      key={tree.id}
      treeKey={tree.id}
      text={true}
      do={props.do}
      navigate={props.navigate}
    ></Tree>
  ));
}

const location = {
  latitude: 23.59933,
  longitude: 77.412613,
  latitudeDelta: 0.009,
  longitudeDelta: 0.009,
};

function HomeScreen({ navigation }) {
  const [geoLocation, setGeoLocation] = useState(null);
  const [errorLocationMsg, setErrorLocationMsg] = useState(null);

  function convertToMapLocation(geoLoc) {
    if (geoLoc) {
      return {
        latitude: geoLoc.coords.latitude,
        longitude: geoLoc.coords.longitude,
        latitudeDelta: 0.009,
        longitudeDelta: 0.009,
      };
    }
  }

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorLocationMsg("Permission to access location was denied");
        return;
      }

      let newLocation = await Location.getCurrentPositionAsync({});
      setGeoLocation(convertToMapLocation(newLocation));
    })();
  }, []);

  if (errorLocationMsg) {
    alert(errorLocationMsg);
  }
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Welcome to Urban Grove!</Text>
      <Button
        title="Add Your Tree!"
        onPress={() => navigation.navigate("Add Your Tree")}
      />
      <MapView
        style={{ width: "100%", height: "50%" }}
        provider={PROVIDER_GOOGLE}
        mapType={"hybrid"}
        region={geoLocation}
      >
        <AllTrees
          navigate={(treeKey) =>
            navigation.navigate("More Info", { treeKey: treeKey })
          }
        ></AllTrees>
      </MapView>
    </View>
  );
}
function CheckButton(props) {
  const [status, onClickButton] = React.useState(false);
  return (
    <TouchableOpacity
      {...props}
      onPress={() => onClickButton(!status)}
      style={{
        backgroundColor: status ? "#AAA" : "#DDD",
        borderRadius: 5,
        margin: 5,
        padding: 5,
        width: "25%",
        textAlign: "center",
      }}
    >
      <Text>
        {props.title} {status ? "✔︎" : ""}
      </Text>
    </TouchableOpacity>
  );
}
function MaxTextInput(props) {
  const [text, onChangeText] = React.useState("");
  const [charColor, setCharColor] = React.useState("gray");
  return (
    <View>
      <Text style={{ color: charColor }}>
        {text.length}/{props.max}
      </Text>
      <TextInput
        {...props}
        maxLength={props.max}
        multiline
        onChangeText={(e) => {
          props.onChangeText(e);
          onChangeText(e);
          if (e.length >= props.max) {
            setCharColor("red");
          } else {
            setCharColor("gray");
          }
        }}
        value={text}
      />
    </View>
  );
}
function AddScreen({ navigation }) {
  const [tree, onChangeTree] = React.useState(null);
  const [treeDisscribtion, setTreeDisscribtion] = React.useState(null);
  const [treeLocation, setTreeLocation] = React.useState(null);
  const [treeInfo, setTreeInfo] = React.useState(null);

  return (
    <ScrollView style={{ padding: 20 }} scrollable>
      <Text style={{ fontWeight: "bold" }}>Your tree: </Text>
      <TextInput
        onChangeText={onChangeTree}
        value={tree}
        placeholder={"Apple Tree"}
      />
      <Text></Text>
      <Text style={{ fontWeight: "bold" }}>Describe your tree:</Text>
      <MaxTextInput
        numberOfLines={5}
        max={100}
        onChangeText={(e) => setTreeDisscribtion(e)}
        value={treeDisscribtion}
        placeholder={
          "It's a very big tree with a lot of flowers; you can't miss it!"
        }
      ></MaxTextInput>
      <Text style={{ fontWeight: "bold" }}>Where is you tree located?</Text>
      <MaxTextInput
        numberOfLines={5}
        max={70}
        onChangeText={(e) => setTreeLocation(e)}
        value={treeLocation}
        placeholder={"The tree is in our front yard."}
      ></MaxTextInput>
      <Text style={{ fontWeight: "bold" }}>Give some other information:</Text>
      <MaxTextInput
        numberOfLines={5}
        max={150}
        onChangeText={(e) => setTreeInfo(e)}
        value={treeInfo}
        placeholder={
          "Some of the apples are very high up, so bring something to get them down."
        }
      ></MaxTextInput>
      <Text style={{ fontWeight: "bold" }}>
        When does the tree produce fruit?
      </Text>
      <CheckButton title={"spring"}></CheckButton>
      <CheckButton title={"summer"}></CheckButton>
      <CheckButton title={"fall"}></CheckButton>
      <CheckButton title={"winter"}></CheckButton>
      <Text style={{ fontWeight: "bold" }}>
        What does the fruit taste like?
      </Text>
      <CheckButton title={"bitter"}></CheckButton>
      <CheckButton title={"sweet"}></CheckButton>
      <CheckButton title={"sour"}></CheckButton>
      <CheckButton title={"juicy"}></CheckButton>

      <Button
        title={"Next"}
        onPress={() =>
          navigation.navigate("Pinpoint Your Tree", {
            tree: tree,
            treeDisscribtion: treeDisscribtion,
            treeLocation: treeLocation,
            treeInfo: treeInfo,
          })
        }
      />
      <View style={{ padding: 20 }}></View>
    </ScrollView>
  );
}

function PinPointScreen({ route, navigation }) {
  const [position, setPosition] = React.useState({ longitude: 0, latitude: 0 });
  const { tree, treeDisscribtion, treeLocation, treeInfo } = route.params;

  function addTree(tree, treeDisscribtion, treeLocation, treeInfo, position) {
    return;
  }

  return (
    <View style={{ padding: 10, left: -5 }}>
      <Text style={{ margin: 10, fontSize: 20 }}>
        Press on the map to place the tree where you press.
      </Text>
      <MapView
        style={{ width: "100%", height: "89%", borderRadius: 10, margin: 5 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={location}
        mapType={"hybrid"}
        onPress={(e) => setPosition([e.nativeEvent.coordinate][0])}
      >
        <Tree coordinate={position} text={false}></Tree>
      </MapView>
      <TouchableOpacity
        style={{
          textAlign: "center",
          alignSelf: "center",
          backgroundColor: "#AAA",
          margin: 5,
          padding: 10,
          borderRadius: 10,
        }}
      >
        <Text
          style={{ fontSize: 20, fontWeight: "400" }}
          onPress={() => {
            addTree(tree, treeDisscribtion, treeLocation, treeInfo, position);
            navigation.navigate("Home");
          }}
        >
          Add Your Tree
        </Text>
      </TouchableOpacity>
    </View>
  );
}

function DetailScreen({ route }) {
  function getTreeInfo(treeKey) {
    return {
      tree: "loquat tree",
      treeDisscribtion: "It has very tasty loquats.",
      treeLocation: "It's on the corner where it says 2048",
      treeInfo: "A ladder is required to reach the loquats.",
      seasons: ["spring", "summer"],
      taste: ["sweet"],
    };
  }
  const { treeKey } = route.params;
  let treeInfo = getTreeInfo(treeKey);
  return (
    <View>
      <Text style={{ fontSize: 50, padding: 5 }}>{treeInfo.tree} </Text>
      <Text> </Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", padding: 5 }}>
        Tree Describition:
      </Text>
      <Text style={{ padding: 5 }}>{treeInfo.treeDisscribtion}</Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", padding: 5 }}>
        Tree Location:
      </Text>
      <Text style={{ padding: 5 }}>{treeInfo.treeLocation}</Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", padding: 5 }}>
        Tree Information:
      </Text>
      <Text style={{ padding: 5 }}>{treeInfo.treeInfo}</Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", padding: 5 }}>
        The tree produces fruit in the{" "}
        {treeInfo.seasons.slice(0, -1).join(", ") &&
          treeInfo.seasons.slice(0, -1).join(", ") + " and "}
        {treeInfo.seasons[treeInfo.seasons.length - 1]}.
      </Text>
      <Text></Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", padding: 5 }}>
        The fruit is{" "}
        {treeInfo.taste.slice(0, -1).join(", ") &&
          treeInfo.taste.slice(0, -1).join(", ") + " and "}
        {treeInfo.taste[treeInfo.taste.length - 1]}.
      </Text>
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Add Your Tree" component={AddScreen} />
        <Stack.Screen name="Pinpoint Your Tree" component={PinPointScreen} />
        <Stack.Screen name="More Info" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default App;
