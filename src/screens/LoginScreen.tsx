import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import {connect} from 'react-redux';
import {ButtonWithTitle, TextField} from '../componets';
import { CartStackParamList } from '../model/navigation';
import {
  ApplicationState,
  UserState,
  onUserLogin,
  onUserSignup,
  onRequestOtp,
  onVerifyOtp,
  UserModel,
} from '../redux';

interface LoginScreenProps {
  userReducer: UserState;
  onUserLogin: Function;
  onUserSignup: Function;
  onRequestOtp: (user: UserModel) => void;
  onVerifyOtp: (otp: string, user: UserModel) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({
  onUserLogin,
  onUserSignup,
  onRequestOtp,
  userReducer,
  onVerifyOtp,
}) => {
  const { navigate }= useNavigation<NavigationProp<CartStackParamList>>()
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [otp, setOptp] = useState('');
  const [verified, setVerified] = useState(true);
  const [requestOtpTitle, setRequestOtpTitle] = useState(
    'Request a New OTP in',
  );
  const [canRequestOtp, setCanRequestOtp] = useState(false);

  const title = isSignup ? 'Signup' : 'Login';
  const {user} = userReducer;

  let countDown: number;
  useEffect(() => {
    if (user.verified !== undefined) {
      if (user.verified === true) {
        navigate('CartScreen')
      } else {
        setVerified(user.verified);
      }
    }
    onEnableOtpRequest();
    return () => clearInterval(countDown);
  }, [user]);

  const onAuthenticate = () => {
    if (isSignup) {
      onUserSignup(email, phone, password);
    } else {
      onUserLogin(email, password);
    }
  };

  const onEnableOtpRequest = () => {
    const otpDate = new Date();
    otpDate.setTime(new Date().getTime() + 2 * 60 * 1000);
    const otpTime = otpDate.getTime();

    countDown = setInterval(() => {
      const currentTime = new Date().getTime();
      const totalTime = otpTime - currentTime;
      let minutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((totalTime % (1000 * 60)) / 1000);

      setRequestOtpTitle(`Request a New OTP in ${minutes}:${seconds}`);
      if (minutes < 1 && seconds < 1) {
        setRequestOtpTitle('Request a New OTP');
        setCanRequestOtp(true);
        clearInterval(countDown);
      }
    }, 1000);
  };

  const onTapVerify = () => {
    onVerifyOtp(otp, user);
  };

  const onTapRequestNewOtp = () => {
    setCanRequestOtp(false);
    onRequestOtp(user);
  };

  if (verified) {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.navigation}>
          <Text style={styles.titleText}>{title}</Text>
        </View>
        <View style={styles.body}>
          <TextField onTextChange={setEmail} placeholder="Email" />
          {isSignup && (
            <TextField onTextChange={setPhone} placeholder="Phone" />
          )}
          <TextField onTextChange={setPassword} placeholder="Password" isSecure />
          <ButtonWithTitle
            title={title}
            onTap={onAuthenticate}
            width={340}
            height={50}
          />
          <ButtonWithTitle
            title={
              isSignup
                ? 'Have an Account? Login Here'
                : 'No Account? Signup Here'
            }
            onTap={() => setIsSignup(!isSignup)}
            width={340}
            height={50}
            isNoBg
          />
        </View>
        <View style={styles.footer}></View>
      </View>
    );
  } else {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.body}>
          <Image
            style={styles.otpImage}
            source={require('../images/verify_otp.png')}
          />
          <Text style={styles.verificationText}>Verification</Text>
          <Text style={styles.verifyHelpText}>
            Enter your OTP sent to your mobile number
          </Text>
          <TextField
            placeholder="OTP"
            onTextChange={setOptp}
            isOtp
            isSecure
          />
          <ButtonWithTitle
            title="Verify OTP"
            onTap={onTapVerify}
            width={340}
            height={50}
          />
          <ButtonWithTitle
            title={requestOtpTitle}
            isNoBg
            onTap={onTapRequestNewOtp}
            width={340}
            height={50}
            disabled={!canRequestOtp}
          />
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  navigation: {
    flex: 1,
    paddingLeft: 50,
    paddingTop: 50,
  },
  titleText: {
    fontSize: 30,
  },
  body: {
    flex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
  },
  otpImage: {
    width: 120,
    height: 120,
    margin: 20,
  },
  verificationText: {
    fontSize: 22,
    fontWeight: '500',
    margin: 10,
  },
  verifyHelpText: {
    fontSize: 16,
    padding: 10,
    marginBottom: 20,
    color: '#716F6F',
  },
});

const mapStateToProps = (state: ApplicationState) => ({
  userReducer: state.userReducer,
});

export default connect(mapStateToProps, {
  onUserLogin,
  onUserSignup,
  onRequestOtp,
  onVerifyOtp,
})(LoginScreen);
