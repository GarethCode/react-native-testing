// In App.js in a new project
import * as React from 'react';
import { TouchableOpacity, StyleSheet, Button, View, Text, Settings, SafeAreaView, FlatList, Image } from 'react-native';
import { NavigationContainer, NavigationHelpersContext, useNavigationState } from '@react-navigation/native';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';
import { Switch } from 'react-native-gesture-handler';

//DB and network modules
import SQLite from 'react-native-sqlite-storage';
import RNFetchBlob from 'rn-fetch-blob';
import NetInfo from "@react-native-community/netinfo";
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'
import RNFS from 'react-native-fs'

import DownloadComponent from './components/downloadComponent'

const lpColor = "#3987e6";
const lfColor = "#121212";
const lbColor = "#f1f1f1";

const dpColor = "#3987e6";
const dfColor = "#fafafa";
const dbColor = "#121212";

let pColor = dpColor;
let fColor = dfColor;
let bColor = dbColor;

const Stack = createStackNavigator();

var db;

function App() {
  
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Update"
          screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
          }}>
          <Stack.Screen
            name="Update"
            component={UpdateScreen}
            options={navOptions}
            
            style={styles.container}
             />
          <Stack.Screen name="Home" component={HomeScreen} options={navOptions} />
          <Stack.Screen name="Details" component={DetailsScreen} options={navOptions} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={navOptions} />
          <Stack.Screen name="Results" component={ResultsScreen} options={navOptions} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  
}

export default App;



//Set header options
let navOptions = ({ navigation }) => ({

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

//The following will download (rn-blob) the most current DB from the server
//and load the DB using react-native-sqlite-storage for use of the front end
function downloadCurrentDB(callback) {

  let dirs = RNFetchBlob.fs.dirs;
  console.log("Downloading DB");
  let l = RNFetchBlob
    .config({
      // response data will be saved to this path if it has access right.
      path: dirs.DocumentDir + '/images_v2.3.db'
    })
    .fetch('GET', 'http://10.51.32.171:8890/getDB', {
      //some headers ..
    })
    .then((res) => {
      // the path should be dirs.DocumentDir + 'path-to-file.anything'
      console.log('The file saved to ', res.path());

      console.log("DB copied to correct directory");
      callback(true);
      

    })
}
function logNetworkDetails(callback) {

    let l = NetInfo.fetch().then(state => {
      
    //console.log("Connection type", state.type);
    //console.log("Is connected?", state.isConnected);

    callback(state.type);
  });

}

function checkConnectivity(callback) {
  console.log("checking connectivity");
  var done;
  
  let l = NetInfo.fetch().then(state => {

      callback(state.isConnected);
  });

  
}

function queryDB(db, query) {
  db.transaction((tx) => {
    tx.executeSql(query, [], (tx, results) => {
      console.log("Query completed");

      // Get rows with Web SQL Database spec compliance.

      var len = results.rows.length;
      for (let i = 0; i < len; i++) {
        let row = results.rows.item(i);
        console.log(`image ${row.FileName}`);

      }
    });
  });
}



function extractImages() {
  console.log(`${RNFS.DocumentDirectoryPath}`);
  unzip(`${RNFS.DocumentDirectoryPath}/images_all_in_one.zip`, 
    RNFS.DocumentDirectoryPath, 'UTF-8')
    .then((path) => {
      console.log(`unzip completed at ${path}`);
    })
    .catch((error) => {
      console.error(error)
    })
}

function UpdateScreen({navigation, route}) {
//const [downloadProgress] = useState(0);


  //Check connectivity and log connections details on callback
  checkConnectivity((isConneceted) => {
      if(isConneceted) {
        logNetworkDetails((type) => {
          console.log(type);

          //download the current DB and all callback check
          //the DB for new images, if there are new images 
          //download the images.
          downloadCurrentDB((done) => {
            console.log("Download DB success: " + done);

            //connect DB
            db = SQLite.openDatabase({ name: "images_v2.3.db", createFromLocation: "/data/images_v2.3.db" });
            //console.log(db);

            //Do DB checking here
            queryDB(db, 'SELECT * FROM IMAGE');
            
            //Download data

            
            
          });
        });
        
      }
      else
        console.log("No network");
  })
    //queryDB(db, 'SELECT * FROM IMAGE');

    /*RNFetchBlob.fs.ls(RNFS.DocumentDirectoryPath).then(files => {
      console.log(files);
    }).catch(error => console.log(error))*/
    var pr = 0;
    //this.dl = DownloadComponent.bind(this)
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.button}>Dev skip</Text>
      </TouchableOpacity>

    
        <DownloadComponent />
    </View>
   
  );
    
}


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
          { label: 'All', value: 'all' },
          { label: '350nm', value: '350' },
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
          { label: 'All', value: 'all' },
          { label: 'Orange', value: 'orange' },
          { label: 'Yellow', value: 'yellow' },
          { label: 'Red', value: 'red' },
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
          { label: 'All', value: 'all' },
          { label: 'Denim', value: 'denim' },
          { label: 'Tile', value: 'tile' },
          { label: 'Black', value: 'black' },
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
          { label: 'All', value: 'all' },
          { label: 'Apple Juice', value: 'Apple Juice' },
          { label: 'Urine', value: 'Urine' },
          { label: 'Toothpaste', value: 'Toothpaste' },
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
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              margin: 1
            }}>
            <Image
              style={styles.imageThumbnail}
              source={{ uri: item.src }}
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


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: bColor,
    color: fColor,
  },
  text: {
    color: fColor,
    margin: 5,
    fontSize: 15,
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

