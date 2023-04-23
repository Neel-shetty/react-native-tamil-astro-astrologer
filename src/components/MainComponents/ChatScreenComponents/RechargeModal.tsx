import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {layout} from '../../../constants/layout';
import {fonts} from '../../../themes/fonts';
import {colors} from '../../../themes/colors';
import Modal from 'react-native-modal';

const RechargeModal = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: (x: boolean) => void;
}) => {
  return (
    <Modal
      onSwipeComplete={() => {
        setVisible(false);
      }}
      swipeDirection={'up'}
      style={styles.modal}
      backdropOpacity={0}
      isVisible={visible}>
      <View style={styles.root}>
        <Text style={styles.text}>{'Balance left for < 1 min'}</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text2}>{'Recharge Now'}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default RechargeModal;

const styles = StyleSheet.create({
  root: {
    width: layout.widthp,
    height: 56,
    backgroundColor: '#FFD1D1',
    borderWidth: 1,
    borderRadius: 23,
    borderColor: 'rgba(0, 0, 0, 0.34)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    alignItems: 'center',
    elevation: 10,
  },
  text: {
    fontFamily: fonts.interRegular,
    color: colors.text,
  },
  button: {
    width: 105,
    height: 34,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.palette.white,
  },
  text2: {
    fontFamily: fonts.DiwanKufi,
    color: colors.text,
    fontSize: 12,
  },
  modal: {
    justifyContent: 'flex-start',
    paddingTop: layout.height * 0.1,
  },
});
