import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import firestore from '@react-native-firebase/firestore';
import {use} from 'i18next';
import Auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {HomeScreenNavigationProp} from '../../../router/types';
import ChatScreen from '../../../screens/Main/ChatScreen';

const ChatList = () => {
  const [chats, setChats] = React.useState([]);
  const navigation = useNavigation<HomeScreenNavigationProp['navigation']>();
  async function fetchChats() {
    const uid = Auth().currentUser?.uid;
    console.log('🚀 ~ file: ChatList.tsx:10 ~ fetchChats ~ uid:', uid);
    const fchats = await firestore().collection('chats').get();
    setChats(fchats.docs);
  }
  React.useEffect(() => {
    fetchChats();
  }, []);
  return (
    <View>
      <Text>ChatList</Text>
      {chats.map(chat => {
        console.log(
          '🚀 ~ file: ChatList.tsx:25 ~ ChatList ~ chat:',
          chat.data(),
        );
        const user = Auth().currentUser;
        const combinedUserId =
          Number(chat.data().userID) > Number(user.uid)
            ? `${chat.data().userId}-${user.uid}`
            : `${user.uid}-${chat.data().userId}`;

        console.log(
          '🚀 ~ file: ChatList.tsx:28 ~ ChatList ~ combinedUserId:',
          combinedUserId,
        );
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(ChatScreen.name, {
                combinedUserId: combinedUserId,
              });
            }}>
            <Text style={{color: 'black'}}>{chat.data().userId}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({});
