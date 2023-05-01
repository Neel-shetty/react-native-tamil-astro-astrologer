import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import firestore from '@react-native-firebase/firestore';
import {use} from 'i18next';
import Auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {HomeScreenNavigationProp} from '../../../router/types';
import ChatScreen from '../../../screens/Main/ChatScreen';
import {layout} from '../../../constants/layout';

const ChatList = () => {
  const [chats, setChats] = React.useState([]);
  console.log('🚀 ~ file: ChatList.tsx:12 ~ ChatList ~ chats:', chats);
  const navigation = useNavigation<HomeScreenNavigationProp['navigation']>();
  async function fetchChats() {
    const uid = Auth().currentUser?.uid;
    console.log('🚀 ~ file: ChatList.tsx:10 ~ fetchChats ~ uid:', uid);
    firestore()
      .collection('chats')
      .where('astrologerId', '==', 12)
      .onSnapshot(querySnapshot => {
        console.log(
          '🚀 ~ file: ChatList.tsx:14 ~ fetchChats ~ querySnapshot:',
          setChats(querySnapshot.docs),
        );
      });

    // setChats(fchats.docs);
  }
  React.useEffect(() => {
    fetchChats();
  }, []);
  return (
    <View>
      <Text>ChatList</Text>
      {chats.map((chat, index) => {
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
            key={index}
            onPress={() => {
              navigation.navigate(ChatScreen.name, {
                combinedUserId: combinedUserId,
              });
            }}>
            <View style={styles.chatItem}>
              <Text style={{color: 'black'}}>
                user id - {chat.data().userId}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({
  chatItem: {
    padding: 10,
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    width: layout.widthp,
    borderBottomWidth: 1,
    elevation: 5,
  },
});
