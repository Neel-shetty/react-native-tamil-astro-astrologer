import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import firestore from '@react-native-firebase/firestore';
// import {use} from 'i18next';
import Auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import {HomeScreenNavigationProp} from '../../../router/types';
import ChatScreen from '../../../screens/Main/ChatScreen';
import {layout} from '../../../constants/layout';

const ChatList = () => {
  const [chats, setChats] = React.useState([]);
  const navigation = useNavigation<HomeScreenNavigationProp['navigation']>();
  async function fetchChats() {
    const uid = Auth().currentUser?.uid;
    console.log('🚀 ~ file: ChatList.tsx:10 ~ fetchChats ~ uid:', uid);
    firestore()
      .collection('chats')
      .where('astrologerId', '==', Number(uid))
      // .orderBy('userId', 'desc')
      .onSnapshot(querySnapshot => {
        const chatsInFb = querySnapshot?.docs.map(doc => doc.data());
        console.log(
          '🚀 ~ file: ChatList.tsx:27 ~ fetchChats ~ chatsInFb:',
          chatsInFb,
        );

        //@ts-ignore
        setChats(chatsInFb);
      });

    // firestore()
    //   .collection('chats')
    //   .where('astrologerId', '==', Number(uid))
    //   // .orderBy('time', 'desc')
    //   .onSnapshot(querySnapshot => {
    //     const chatsInFb = querySnapshot?.docs.map(doc => doc.data());
    //     console.log(
    //       '🚀 ~ file: ChatList.tsx:27 ~ fetchChats ~ chatsInFb:',
    //       chatsInFb,
    //     );
    //     setChats(chatsInFb);
    //   });

    // setChats(fchats.docs);
  }
  React.useEffect(() => {
    fetchChats();
  }, []);

  return (
    <View style={styles.root}>
      {chats?.map((chat, index) => {
        const user = Auth().currentUser;
        const combinedUserId =
          //@ts-ignore
          Number(chat.userID) > Number(user?.uid)
            ? //@ts-ignore
              `${chat.userId}-${user?.uid}`
            : //@ts-ignore
              `${user?.uid}-${chat.userId}`;
        //@ts-ignore
        console.log(chat.userId);

        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              navigation.navigate(ChatScreen.name, {
                combinedUserId: combinedUserId,
              });
            }}>
            <View style={styles.chatItem}>
              {/* @ts-ignore */}
              <Text style={{color: 'black'}}>user id - {chat?.userId}</Text>
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
  root: {
    flex: 1,
    alignItems: 'center',
  },
});
