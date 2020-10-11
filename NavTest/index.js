/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import DownloadComponent from './components/downloadComponent';

AppRegistry.registerComponent(appName, () => App);
AppRegistry.registerComponent("DownloadComponent", () => DownloadComponent);
