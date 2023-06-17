import {StyleSheet, Text, View, Alert} from 'react-native';
import React from 'react';
import {colors} from '../../themes/colors';
import {layout} from '../../constants/layout';
import {fonts} from '../../themes/fonts';
import ChatList from '../../components/MainComponents/HomeScreenComponents/ChatList';
import Call from '../../components/CallComponents/Call';
import messaging from '@react-native-firebase/messaging';

const HomeScreen = () => {
  React.useEffect(() => {
    async function getToken() {
      await messaging().registerDeviceForRemoteMessages();
      const messageToken = await messaging().getToken();
      console.log(
        '🚀 ~ file: HomeScreen.tsx:15 ~ getToken ~ messageToken:',
        messageToken,
      );
    }
    getToken();
  }, []);

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        'A new FCM message arrived!',
        JSON.stringify(remoteMessage.notification?.title),
      );
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.root}>
      {/* <Text
        style={{
          color: colors.text,
          fontFamily: fonts.interSemiBold,
          fontSize: 18,
          textAlign: 'left',
          width: '100%',
          paddingLeft: layout.width * 0.05,
        }}>
        My Chats
      </Text> */}
      <ChatList />
      {/* <Call /> */}
    </View>
  );
};

export default {component: HomeScreen, name: 'HomeScreen' as const};

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.palette.white,
    width: layout.width,
    flex: 1,
  },
  headingContainer: {
    width: layout.width,
    backgroundColor: colors.palette.accent100,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.palette.blackOpacity10,
  },
  heading: {
    fontSize: 16,
    fontFamily: fonts.contageRegular,
    color: colors.text,
    paddingVertical: 5,
  },
  padding1: {
    height: layout.height * 0.02,
  },
  bottomSpacer: {
    maxHeight: 25,
    flex: 1,
  },
});
