import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {fonts} from '../../../themes/fonts';
import {colors} from '../../../themes/colors';
import UserDetailModal from '../HomeScreenComponents/UserDetailModal';
import {useQuery} from '@tanstack/react-query';
import {api} from '../../../api';
import {useRoute} from '@react-navigation/native';
import Auth from '@react-native-firebase/auth';

const Timer = () => {
  //timer in minutes and seconds
  const [timer, setTimer] = React.useState(0);
  const [showDetails, setShowDetails] = React.useState(false);
  const route = useRoute();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimer(timer => timer + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  function fancyTimeFormat(duration: number) {
    // Hours, minutes and seconds
    const hrs = ~~(duration / 3600);
    const mins = ~~((duration % 3600) / 60);
    const secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    let ret = '';

    if (hrs > 0) {
      ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }

    ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;

    return ret;
  }

  const {data, isLoading, error, refetch} = useQuery(
    ['userDetails', route?.params?.combinedUserId],
    async () => {
      console.log('userDetails', route.params?.combinedUserId);
      const cuid: string = route.params?.combinedUserId;
      const idk = cuid.split('-');
      const user_id = idk.map(id => {
        if (Number(id) !== Number(Auth().currentUser?.uid)) {
          return Number(id);
        }
      });

      const final_id = user_id.filter(id => id !== undefined);

      console.log(
        '🚀 ~ file: Timer.tsx:50 ~ const{data,isLoading,error}=useQuery ~ user_id:',
        final_id,
      );
      return api.post('/user/detail', {user_id: final_id[0]});
    },
  );

  // React.useEffect(() => {
  //   refetch();
  // }, [refetch]);

  return (
    <View style={styles.root}>
      <View>
        <Text style={styles.time}>{fancyTimeFormat(timer)} minutes</Text>
      </View>
      <View style={styles.timeContainer}>
        {/* <Text style={styles.time}>{fancyTimeFormat(timer)}</Text> */}
        <TouchableOpacity onPress={() => setShowDetails(true)}>
          <Text
            style={{
              fontFamily: fonts.interRegular,
              color: colors.palette.accent200,
            }}>
            User Details
          </Text>
        </TouchableOpacity>
      </View>
      <UserDetailModal
        userDetails={data?.data?.data}
        visible={showDetails}
        setVisible={setShowDetails}
      />
    </View>
  );
};

export default Timer;

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontFamily: fonts.DiwanKufi,
    fontSize: 14,
    color: colors.palette.accent500,
  },
  time: {
    fontFamily: fonts.DiwanKufi,
    fontSize: 14,
    color: colors.text,
  },
  timeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
