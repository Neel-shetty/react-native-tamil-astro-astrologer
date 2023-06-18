import {StyleSheet, View} from 'react-native';
import React from 'react';
import {colors} from '../../themes/colors';
import {layout} from '../../constants/layout';
import {fonts} from '../../themes/fonts';
import ChatList from '../../components/MainComponents/HomeScreenComponents/ChatList';
// import Call from '../../components/CallComponents/Call';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {api} from '../../api';
import Auth from '@react-native-firebase/auth';
import {useSelector} from 'react-redux';
import {RootState} from '../../store';

const HomeScreen = () => {
  const userInChat = useSelector((state: RootState) => state.user.userInChat);
  console.log(
    '🚀 ~ file: HomeScreen.tsx:17 ~ HomeScreen ~ userInChat:',
    userInChat,
  );

  React.useEffect(() => {
    async function getToken() {
      await messaging().registerDeviceForRemoteMessages();
      const messageToken = await messaging().getToken();
      const user_id = Auth().currentUser?.uid;
      console.log(
        '🚀 ~ file: HomeScreen.tsx:19 ~ getToken ~ user_id:',
        user_id,
      );
      api
        .post('insert/token', {
          token: messageToken,
          user_id,
        })
        .then(res => {
          console.log('res', res.data);
        })
        .catch(err => {
          console.log('err', err.response?.data);
        });
    }
    getToken();
  }, []);

  React.useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      async function onDisplayNotification({
        title,
        body,
      }: {
        title: string;
        body: string;
      }) {
        // Request permissions (required for iOS)
        await notifee.requestPermission();

        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: AndroidImportance.HIGH,
        });

        // Display a notification
        if (title === userInChat || title === Auth().currentUser?.uid) {
          return;
        }

        await notifee.displayNotification({
          title: title,
          body: body,
          android: {
            channelId,
          },
        });
      }
      onDisplayNotification({
        title: remoteMessage.notification?.title ?? '',
        body: remoteMessage.notification?.body ?? '',
      });
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
