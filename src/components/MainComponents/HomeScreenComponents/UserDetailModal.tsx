import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import {colors} from '../../../themes/colors';
import {layout} from '../../../constants/layout';
import {fonts} from '../../../themes/fonts';

const UserDetailModal = ({
  visible,
  setVisible,
  userDetails,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  userDetails: any;
}) => {
  return (
    <Modal
      style={styles.modal}
      isVisible={visible}
      // backdropColor={'#FEF0F0'}
      onBackdropPress={() => setVisible(false)}
      onSwipeComplete={() => setVisible(false)}
      swipeDirection={['down', 'up', 'left', 'right']}
      backdropOpacity={0.5}>
      <View style={styles.root}>
        <Text style={styles.detailText}>Name: {userDetails?.name}</Text>
        <Text style={styles.detailText}>
          Place of birth: {userDetails?.place_of_birth}
        </Text>
        <Text style={styles.detailText}>
          Date of Birth:{' '}
          {new Date(userDetails?.date_of_birth).toLocaleDateString()}
        </Text>
        <Text style={styles.detailText}>
          Time of Birth:{' '}
          {new Date(userDetails?.time_of_birth).toLocaleTimeString()}
        </Text>
        <Text style={styles.detailText}>
          Maritial Status: {userDetails?.marital_status}
        </Text>
        <Text style={styles.detailText}>
          Type of Problem: {userDetails?.type_of_problem}
        </Text>
        <Text style={styles.detailText}>Gender: {userDetails?.gender}</Text>
      </View>
    </Modal>
  );
};

export default UserDetailModal;

const styles = StyleSheet.create({
  modal: {
    // backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    // height: layout.height * 0.5,
    // width: layout.widthp * 0.5,
    alignSelf: 'center',
  },
  root: {
    backgroundColor: colors.palette.white,
    width: layout.width * 0.8,
    // height: layout.height * 0.5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    elevation: 10,
  },
  title: {
    fontFamily: fonts.contageRegular,
    fontSize: 14,
    color: colors.text,
  },
  button: {
    height: 38,
    width: 165,
    borderWidth: 1,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginTop: 20,
  },
  buttonText: {
    fontFamily: fonts.DiwanKufi,
    flex: 1,
    marginLeft: 5,
  },
  detailText: {
    fontFamily: fonts.interMedium,
    fontSize: 16,
    color: colors.text,
  },
});
