/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Alert,
  PermissionsAndroid,
  FlatList,
  Platform,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import BluedotPointSdk from 'bluedot-react-native';
import {logger} from 'react-native-logs';
import {rnFsFileAsync} from 'react-native-logs/dist/transports/rnFsFileAsync';
var RNFS = require('react-native-fs');

import {requestMultiple, PERMISSIONS} from 'react-native-permissions';

const config = {
  transport: rnFsFileAsync,
  transportOptions: {
    hideDate: true,
    dateFormat: 'iso',
    hideLevel: true,
    loggerPath:
      Platform.OS === 'android'
        ? RNFS.ExternalDirectoryPath
        : RNFS.DocumentDirectoryPath,
    loggerName: 'myLogsFile',
  },
};

var log = logger.createLogger(config);

declare const global: {HermesInternal: null | {}};

type ListType = {
  heading: string;
  data: any;
};

const App = () => {
  const channelId = 'Bluedot React Native';
  const channelName = 'Bluedot React Native';
  const title = 'Bluedot Foreground Service';
  const content =
    'This app is running a foreground service using location services';

  const [data, setData] = useState<ListType[]>([]);
  const showAlert = (title: string, message: any) => {
    Alert.alert(
      title,
      JSON.stringify(message),
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            console.log('OK Pressed');

            //setData(newData);
          },
        },
      ],
      {cancelable: false},
    );
  };

  const printLogs = (data: any) => {
    data.timeStamp = new Date().toLocaleString();
    log.info(data);
  };
  const startBluedotSDK = () => {
    BluedotPointSdk.setForegroundNotification(
      channelId,
      channelName,
      title,
      content,
      true,
    );

    // Start Bluedot SDK
    BluedotPointSdk.authenticate(
      '02073a75-ff23-43e9-b00f-98570a0bd864',
      '<Always|WhenInUse>',
      async () => {
        printLogs({
          heading: 'Authenticaion Success',
          data: 'Connection Successful',
        });
        showAlert('Authentication Success', 'Connection Successful');
        setData((prevData) => [
          ...prevData,
          ...[
            {
              heading: 'Authenticaion Success',
              data: 'Connection Successful',
            },
          ],
        ]);
      },
      () => {
        printLogs({
          heading: 'Authenticaion Failed',
          data: 'Oops! Check location service',
        });
        showAlert('Authentication Failed', 'Oops! Check location service');
        setData((prevData) => [
          ...prevData,
          ...[
            {
              heading: 'Authenticaion Failed',
              data: 'Oops! Check location service',
            },
          ],
        ]);
      },
    );

    BluedotPointSdk.on('zoneInfoUpdate', (event) => {
      // ...
      console.warn('Zone info');
      printLogs({heading: 'Zone Info', data: event});
      showAlert('zone', event);
      setData((prevData) => [
        ...prevData,
        ...[{heading: 'Zone Info', data: JSON.stringify(event)}],
      ]);
    });

    BluedotPointSdk.on('checkedIntoFence', (event) => {
      // ...
      console.warn('Checked in');
      printLogs({heading: 'Checked in', data: event});
      showAlert('Checked in', event);
      setData((prevData) => [
        ...prevData,
        ...[{heading: 'Checked In', data: JSON.stringify(event)}],
      ]);
    });

    BluedotPointSdk.on('checkedOutFromFence', (event) => {
      // ...
      showAlert('Checked Out', event);
      printLogs({heading: 'Checked out', data: event});
      setData((prevData) => [
        ...prevData,
        ...[{heading: 'Checked Out', data: JSON.stringify(event)}],
      ]);
    });
  };

  useEffect(() => {
    const getPermission = async () => {
      if (Platform.OS === 'android') {
        const status = await requestMultiple([
          PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        ]);

        if (
          status[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] &&
          status[PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE] === 'granted'
        ) {
          startBluedotSDK();
        } else {
          showAlert('Oops!', 'Permission denied');
        }
      } else {
        const status = await requestMultiple([PERMISSIONS.IOS.LOCATION_ALWAYS]);

        if (status[PERMISSIONS.IOS.LOCATION_ALWAYS] === 'granted') {
          startBluedotSDK();
        } else {
          showAlert('Oops!', 'Permission denied');
        }
      }
    };

    getPermission();
  }, []);

  const renderItem = ({item}: any) => {
    return (
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>{item.heading}</Text>
        <Text style={styles.sectionDescription}>
          {JSON.stringify(item.data)}
        </Text>
      </View>
    );
  };
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.engine}>
            <Text style={styles.footer}>Bluedot Debug App</Text>
          </View>

          <View style={styles.body}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.heading}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    display: 'flex',
    height: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 24,
    fontWeight: '500',
    width: '100%',
    textAlign: 'center',
  },
});

export default App;
