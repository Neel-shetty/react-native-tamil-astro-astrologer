import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setLoggedIn} from '../store/UserSlice';
import SignInScreen from '../screens/Auth/SignInScreen';
import {RootStackParamList} from './types';
import OtpScreen from '../screens/Auth/OtpScreen';
import LanguageScreen from '../screens/Main/LanguageScreen';
import BottomTabNavigator from './BottomTabNavigator';
import HomeScreen from '../screens/Main/HomeScreen';
import ChatScreen from '../screens/Main/ChatScreen';
// import BottomTabNavigator from './BottomTabNavigator';
import ZegoUIKitPrebuiltCallService, {
  ZegoCallInvitationDialog,
  ZegoUIKitPrebuiltCallWaitingScreen,
  ZegoUIKitPrebuiltCallInCallScreen,
  GROUP_VIDEO_CALL_CONFIG,
  ONE_ON_ONE_VIDEO_CALL_CONFIG,
  GROUP_VOICE_CALL_CONFIG,
  ONE_ON_ONE_VOICE_CALL_CONFIG,
  ZegoInvitationType,
} from '@zegocloud/zego-uikit-prebuilt-call-rn';
import {Image, Text, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/Feather';

import * as ZIM from 'zego-zim-react-native';
import * as ZPNs from 'zego-zpns-react-native';
import Auth from '@react-native-firebase/auth';
import {fonts} from '../themes/fonts';
import Notification from '../components/MainComponents/notification/Notification';

const Stack = createNativeStackNavigator<RootStackParamList>();

const Navigator = () => {
  const [showSpashScreen, setShowSplashScreen] = useState(false);

  const dispatch = useDispatch();
  const loggedIn = useSelector((state: RootState) => state.user.loggedIn);

  useEffect(() => {
    setShowSplashScreen(true);
    async function checkLoggedIn() {
      const result = await AsyncStorage.getItem('loggedIn');
      console.log(
        '🚀 ~ file: Navigator.tsx:22 ~ checkLoggedIn ~ result:',
        result,
      );
      if (result === 'true') {
        dispatch(setLoggedIn(true));
      }
      setShowSplashScreen(false);
    }
    checkLoggedIn();
  }, [dispatch]);

  useEffect(() => {
    if (!loggedIn) {
      return;
    }
    ZegoUIKitPrebuiltCallService.init(
      572938071, // You can get it from ZEGOCLOUD's console
      'f6baf179282f742eeed83d3b8cc25e42be61696205162015126658a89d29c309', // You can get it from ZEGOCLOUD's console
      Auth().currentUser?.uid || '', // Your userID
      'User_' + Auth().currentUser?.uid, // Your userName
      [ZIM, ZPNs],
      {
        ringtoneConfig: {
          incomingCallFileName: 'zego_incoming.mp3',
          outgoingCallFileName: 'zego_outgoing.mp3',
        },
        requireConfig: data => {
          const callConfig =
            data.invitees.length > 1
              ? ZegoInvitationType.videoCall === data.type
                ? GROUP_VIDEO_CALL_CONFIG
                : GROUP_VOICE_CALL_CONFIG
              : ZegoInvitationType.videoCall === data.type
              ? ONE_ON_ONE_VIDEO_CALL_CONFIG
              : ONE_ON_ONE_VOICE_CALL_CONFIG;
          return {
            ...callConfig,
            //\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/
            turnOnCameraWhenJoining: false,
            turnOnMicrophoneWhenJoining: false,
            useSpeakerWhenJoining: true,
            ///\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/\
          };
        },
        notifyWhenAppRunningInBackgroundOrQuit: true,
        isIOSSandboxEnvironment: true,
        androidNotificationConfig: {
          channelID: 'ZegoUIKit',
          channelName: 'ZegoUIKit',
        },
      },
    );
  }, [loggedIn]);

  if (showSpashScreen) {
    return null;
  }

  return (
    <NavigationContainer>
      <ZegoCallInvitationDialog />
      <Stack.Navigator
        screenOptions={{
          gestureEnabled: true,
          // headerShown: false,
          animation: 'slide_from_right',
        }}>
        {loggedIn ? (
          <>
            {/* <Stack.Screen
              component={BottomTabNavigator.component}
              name={BottomTabNavigator.name}
            /> */}
            <Stack.Screen
              name={HomeScreen.name}
              component={HomeScreen.component}
              options={{
                title: 'My Chats',
                headerRight: () => (
                  <TouchableOpacity
                    style={{flexDirection: 'row', alignItems: 'center'}}
                    onPress={async () => {
                      await AsyncStorage.removeItem('loggedIn');
                      dispatch(setLoggedIn(false));
                      Auth().signOut();
                    }}>
                    <Text style={{fontFamily: fonts.interMedium, fontSize: 16}}>
                      Logout{' '}
                    </Text>
                    <Image
                      source={require('../../assets/images/drawer/logout.png')}
                    />
                  </TouchableOpacity>
                ),
              }}
            />
            <Stack.Screen
              component={ChatScreen.component}
              name={ChatScreen.name}
            />
            <Stack.Screen
              options={{headerShown: false}}
              // DO NOT change the name
              name="ZegoUIKitPrebuiltCallWaitingScreen"
              component={ZegoUIKitPrebuiltCallWaitingScreen}
            />
            <Stack.Screen
              options={{headerShown: false}}
              // DO NOT change the name
              name="ZegoUIKitPrebuiltCallInCallScreen"
              component={ZegoUIKitPrebuiltCallInCallScreen}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              component={SignInScreen.component}
              name={SignInScreen.name}
              options={{headerShown: false}}
            />
            <Stack.Screen
              component={OtpScreen.component}
              name={OtpScreen.name}
              options={{headerShown: false}}
            />
            <Stack.Screen
              component={LanguageScreen.component}
              name={LanguageScreen.name}
              options={{headerShown: false}}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigator;
