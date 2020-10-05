// In App.js in a new project
import * as React from 'react';
import { TouchableOpacity, StyleSheet, Button, View, Text, Settings, SafeAreaView, FlatList, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import { Switch } from 'react-native-gesture-handler';

const lpColor = "#3987e6";
const lfColor = "#121212";
const lbColor = "#f1f1f1";

const dpColor = "#3987e6";
const dfColor = "#fafafa";
const dbColor = "#121212";

let pColor = dpColor;
let fColor = dfColor;
let bColor = dbColor;

//Set header options
let navOptions= ({ navigation }) => ({
  headerStyle: {
    backgroundColor: pColor,
  },
  headerTintColor: "white",
  headerRight: () => (
    <TouchableOpacity
    onPress={() => navigation.navigate('Settings')}>
      <Icon name="cog" size={30} color="blue" style={styles.cog}></Icon>
   </TouchableOpacity>
  ),
});

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Details')}>
        <Text style={styles.button}>New Query</Text>
      </TouchableOpacity>
    </View>
  );
}

function SettingsScreen({ navigation }) {
  const [isEnabled, setIsEnabled] = React.useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <View style={styles.inlineSet}>
        <Text>Dark Mode: </Text>
        <Switch
          trackColor={bColor}
          thumbColor={pColor}
          ios_backgroundColor={bColor}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
}

function DetailsScreen({ navigation }) {
  wavlen = 'all';
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Wavelength:</Text>
      <DropDownPicker
        items={[
            {label: 'All', value: 'all'},
            {label: '350nm', value: '350'},
        ]}
        defaultValue={wavlen}
        containerStyle={styles.dropdown}
        style={styles.innerDropdown}
        itemStyle={{
            justifyContent: 'flex-start'
        }}
        labelStyle={styles.innerTextDropdown}
        arrowColor={fColor}
        dropDownStyle={styles.dropwDownBox}
      />
      <Text style={styles.text}>Inteference:</Text>
      <DropDownPicker
        items={[
            {label: 'All', value: 'all'},
            {label: 'Orange', value: 'orange'},
            {label: 'Yellow', value: 'yellow'},
            {label: 'Red', value: 'red'},
        ]}
        defaultValue={wavlen}
        containerStyle={styles.dropdown}
        style={styles.innerDropdown}
        itemStyle={{
            justifyContent: 'flex-start'
        }}
        labelStyle={styles.innerTextDropdown}
        arrowColor={fColor}
        dropDownStyle={styles.dropwDownBox}
      />
      <Text style={styles.text}>Substrate:</Text>
      <DropDownPicker
        items={[
            {label: 'All', value: 'all'},
            {label: 'Denim', value: 'denim'},
            {label: 'Tile', value: 'tile'},
            {label: 'Black', value: 'black'},
        ]}
        defaultValue={wavlen}
        containerStyle={styles.dropdown}
        style={styles.innerDropdown}
        itemStyle={{
            justifyContent: 'flex-start'
        }}
        labelStyle={styles.innerTextDropdown}
        arrowColor={fColor}
        dropDownStyle={styles.dropwDownBox}
      />
      <Text style={styles.text}>Substance:</Text>
      <DropDownPicker
        items={[
            {label: 'All', value: 'all'},
            {label: 'Apple Juice', value: 'Apple Juice'},
            {label: 'Urine', value: 'Urine'},
            {label: 'Toothpaste', value: 'Toothpaste'},
        ]}
        defaultValue={wavlen}
        containerStyle={styles.dropdown}
        style={styles.innerDropdown}
        itemStyle={{
            justifyContent: 'flex-start'
        }}
        labelStyle={styles.innerTextDropdown}
        arrowColor={fColor}
        dropDownStyle={styles.dropwDownBox}
      />
      <View style={styles.botButtonCon}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Results')}>
          <Text style={styles.button}>Search</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
}

function ResultsScreen({ navigation }) {
  const [dataSource, setDataSource] = React.useState([]);

  React.useState(() => {
    let items = Array.apply(null, Array(60)).map((v, i) => {
      return {
        id: i,
        src: 'http://placehold.it/200x200?text=' + (i + 1)
      };
    });
    setDataSource(items);
  }, []);

  return (
      <SafeAreaView style={styles.container}>
      <FlatList
        data={dataSource}
        renderItem={({item}) => (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              margin: 1
            }}>
            <Image
              style={styles.imageThumbnail}
              source={{uri: item.src}}
            />
          </View>
        )}
        //Setting the number of column
        numColumns={2}
        keyExtractor={(item, index) => index}
      />
    </SafeAreaView>

  );
}


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
      }}>
        <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={navOptions}
        style={styles.container} />
        <Stack.Screen name="Details" component={DetailsScreen} options={navOptions} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={navOptions} />
        <Stack.Screen name="Results" component={ResultsScreen} options={navOptions} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bColor,
    color: fColor,
  },
  text: {
    color: fColor,
    margin: 5,
    fontSize:15,
    marginLeft: 10,
    marginRight: 10,
  },
  button: {
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: pColor,
    color: "white",
    padding: 15,
    marginBottom: 10,
    marginTop: 10,
    margin: 10,
    borderRadius: 3
  },
  botButtonCon: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingRight: 10
  },
  cog: {
    color: "white",
    paddingRight: 10
  },
  inlineSet: {
    flexDirection: 'row'
  }, 
  dropdown: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    height: 50,
  },
  innerDropdown: {
    backgroundColor: bColor,
    borderColor: pColor,
    borderWidth: 2
  },
  innerTextDropdown: {
    color: fColor,
    fontSize: 16
  },
  innerArrowStyle: {
    color: fColor
  },
  dropwDownBox: {
    backgroundColor: bColor,
    borderColor: pColor,
    borderWidth: 2
  },
  imageThumbnail: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
})

export default App;