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
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import BluedotPointSdk from 'bluedot-react-native';
import {logger} from 'react-native-logs';
import {rnFsFileAsync} from 'react-native-logs/dist/transports/rnFsFileAsync';
var RNFS = require('react-native-fs');

const config = {
  transport: rnFsFileAsync,
  transportOptions: {
    hideDate: true,
    dateFormat: 'iso',
    hideLevel: true,
    loggerPath: RNFS.ExternalDirectoryPath,
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
    // Foreground Service for Android to improve trigger rate - iOS will ignore this.
    BluedotPointSdk.setForegroundNotification(
      channelId,
      channelName,
      title,
      content,
      true,
    );

    // If you would like to add custom event meta data
    //BluedotPointSdk.setCustomEventMetaData({userId: 'user_id_goes_here'});

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
            {heading: 'Authenticaion Success', data: 'Connection Successful'},
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
  };

  useEffect(() => {
    const getPermission = async () => {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
      if (
        granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] &&
        granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] &&
        granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE]
      ) {
        console.warn('You can use the location');
        startBluedotSDK();
      } else {
        showAlert('Oops!', 'Permission denied');
      }
    };

    getPermission();
  }, []);

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

  BluedotPointSdk.on('checkedIntoBeacon', (event) => {
    // ...
    showAlert('Beacon in', event);
    setData((prevData) => [
      ...prevData,
      ...[{heading: 'Checked into beacon', data: JSON.stringify(event)}],
    ]);
  });

  BluedotPointSdk.on('checkedOutFromBeacon', (event) => {
    // ...
    showAlert('Beacon Out', event);
    setData((prevData) => [
      ...prevData,
      ...[{heading: 'Checked out beacon', data: JSON.stringify(event)}],
    ]);
  });

  BluedotPointSdk.on('startRequiringUserInterventionForBluetooth', (event) => {
    // ...
    showAlert('Bluetooth start', event);
    setData((prevData) => [
      ...prevData,
      ...[{heading: 'Bluetooth Start', data: JSON.stringify(event)}],
    ]);
  });

  BluedotPointSdk.on('stopRequiringUserInterventionForBluetooth', (event) => {
    // ...
    showAlert('Bluetooth stop', event);
    setData((prevData) => [
      ...prevData,
      ...[{heading: 'Bluetooth Stop', data: JSON.stringify(event)}],
    ]);
  });

  BluedotPointSdk.on(
    'startRequiringUserInterventionForLocationServices',
    (event) => {
      // ...
      showAlert('Location intervention start', event);
      setData((prevData) => [
        ...prevData,
        ...[
          {heading: 'Location intervention start', data: JSON.stringify(event)},
        ],
      ]);
    },
  );

  BluedotPointSdk.on(
    'stopRequiringUserInterventionForLocationServices',
    (event) => {
      // ...
      showAlert('Location intervention stop', event);
      setData((prevData) => [
        ...prevData,
        ...[
          {heading: 'Location intervention stop', data: JSON.stringify(event)},
        ],
      ]);
    },
  );

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
