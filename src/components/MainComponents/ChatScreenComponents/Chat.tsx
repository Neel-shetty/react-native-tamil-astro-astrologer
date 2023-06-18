import {FlatList, StyleSheet, View} from 'react-native';
import React from 'react';
import Timer from './Timer';
import Message from './Message';
import {layout} from '../../../constants/layout';
import ChatInput from './ChatInput';
import {Formik} from 'formik';
import RechargeModal from './RechargeModal';
import Balance0Modal from './Balance0Modal';
import FeedbackModal from './FeedbackModal';
import firestore from '@react-native-firebase/firestore';
import Auth from '@react-native-firebase/auth';
import {useRoute} from '@react-navigation/native';
import {ChatScreenNavigationProp} from '../../../router/types';
import {SendMessage} from '../../../api/SendMessage';
import {useDispatch} from 'react-redux';
import {setUserInChat} from '../../../store/UserSlice';

export type messagesType = {
  uid: string;
  message: string;
}[];

const Chat = () => {
  const [messages, setMessages] = React.useState<
    {
      uid: string;
      message: string;
    }[]
  >([]);
  const [showRechargeModal, setShowRechargeModal] = React.useState(false);
  const [showBalance0Modal, setShowBalance0Modal] = React.useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = React.useState(false);
  const flatListRef = React.useRef<FlatList>(null);
  const dispatch = useDispatch();

  const route = useRoute<ChatScreenNavigationProp['route']>();
  console.log(
    '🚀 ~ file: Chat.tsx:28 ~ Chat ~ route:',
    route.params?.combinedUserId,
  );

  const chatId = React.useMemo(() => route.params?.chatId, [route]);
  const userID = React.useMemo(() => Auth().currentUser?.uid, []);
  const uniqueId = React.useMemo(
    () => Math.floor(100000 + Math.random() * 900000),
    [],
  );

  async function getMessages() {
    firestore()
      .collection('chats')
      .doc(route.params?.combinedUserId)
      .collection('messages')
      .orderBy('createdAt', 'asc')
      // .limitToLast(5)
      .onSnapshot(doc => {
        const texts: messagesType = [];
        doc.forEach(message => {
          texts.push(message.data() as messagesType[0]);
        });
        setMessages(texts);
      });
  }

  async function sendMessageToMyServer(message: string) {
    const ids = route.params?.combinedUserId?.split('-');
    const astroId = ids?.filter((id: string) => id !== userID);
    console.log(
      '🚀 ~ file: Chat.tsx:97 ~ sendMessageToMyServer ~ astroId:',
      astroId,
    );

    //generate random number of 6 digits
    console.log(
      '🚀 ~ file: Chat.tsx:50 ~ sendMessageToMyServer ~ uniqueId:',
      uniqueId,
    );
    if (astroId) {
      const res = await SendMessage({
        to: astroId[0],
        message,
        from: userID,
        uniqueId,
      });
      console.log('send message result- ---- ', res);
    }
  }

  async function sendMessage(message: string) {
    sendMessageToMyServer(message);
    const user = Auth().currentUser;
    // limit it to 50 recent messages
    await firestore()
      .collection('chats')
      .doc(route.params?.combinedUserId)
      .collection('messages')
      .add({
        uid: user?.uid,
        message,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });
  }

  React.useEffect(() => {
    getMessages();
  }, []);

  // React.useEffect(() => {
  //   return () => {
  //     dispatch(setUserInChat(null));
  //   };
  // }, [dispatch]);

  //wrap user in useMemo
  const user = React.useMemo(() => Auth().currentUser, []);

  return (
    <View style={styles.root}>
      <View style={styles.timerContainer}>
        <Timer />
      </View>
      <View style={styles.chatContainer}>
        {/* make it scroll to bottom automatically*/}
        <FlatList
          data={messages}
          ref={flatListRef}
          renderItem={({item}) => {
            return (
              <Message
                textAlign={item.uid === user.uid ? 'right' : 'left'}
                message={item.message}
              />
            );
          }}
          onContentSizeChange={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToEnd({animated: true});
            }
          }}
        />
        <Formik
          initialValues={{message: ''}}
          onSubmit={(values, {resetForm}) => {
            console.log(values);
            sendMessage(values.message);
            resetForm();
          }}>
          {({handleChange, handleBlur, handleSubmit, values}) => (
            <ChatInput
              handleBlur={handleBlur('message')}
              handleChange={handleChange('message')}
              value={values.message}
              onPress={handleSubmit}
            />
          )}
        </Formik>
      </View>
      <RechargeModal
        visible={showRechargeModal}
        setVisible={setShowRechargeModal}
      />
      <Balance0Modal
        visible={showBalance0Modal}
        setVisible={setShowBalance0Modal}
      />
      <FeedbackModal
        setVisible={setShowFeedbackModal}
        visible={showFeedbackModal}
      />
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  root: {},
  timerContainer: {},
  chatContainer: {
    flex: 1,
    width: layout.width - 20,
    borderWidth: 1,
    marginBottom: 30,
  },
});
