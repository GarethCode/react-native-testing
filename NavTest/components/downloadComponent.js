import React, { useState }  from 'react';

import { TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

//DB and network modules
import RNFetchBlob from 'rn-fetch-blob';


const DownloadComponent = () => {
    
const styles = StyleSheet.create({

    button: {
      textAlign: 'center',
      alignItems: 'center',
      backgroundColor: "#4987a6",
      color: "white",
      padding: 15,
      marginBottom: 10,
      marginTop: 10,
      margin: 10,
      borderRadius: 3
    }
});
const [text, setText] = useState(0);

const handleChange = e => {
    setText(e);
  }


  return (
    <TouchableOpacity
    onPress={() => {
      
      let dirs = RNFetchBlob.fs.dirs;
        console.log(dirs.DocumentDir);
        let l =  RNFetchBlob
        .config({
          // response data will be saved to this path if it has access right.
          fileCache: true,
          path: dirs.DocumentDir + '/images_all_in_one.zip'
        })
        .fetch('GET', 'http://10.51.32.171:8890/downloadImages', {
          //some headers ..
        })
        .progress((received, total) => {
          var percentage = (Math.round(((received/total)*100) * 100) / 100).toFixed(2)
          var totalMB = (Math.round((total / 1000000)).toFixed(2));
          var receivedMB = (Math.round((received / 1000000)).toFixed(2));
          console.log('progress : ', percentage, ' Total size : ', totalMB, ' MB', 'Received : ', receivedMB, ' MB');
    
        {handleChange(percentage)}
       
      })
        .then((res) => {
          // the path should be dirs.DocumentDir + 'path-to-file.anything'
          console.log('The file saved to ', res.path());
          {handleChange(0)}
    
          console.log("Images downloaded to correct directory");
        })
      
    }}>
  <Text style={styles.button}>{`Downloaded : ` + text + ' %'}</Text>
    
  </TouchableOpacity>
  );

}

export default DownloadComponent;

