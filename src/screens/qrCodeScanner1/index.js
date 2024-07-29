import React, { useEffect, useState } from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PropTypes } from 'prop-types';
import {
  Camera,
  Code,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import styles from './style';
import { Modal } from '../../shared';
import { Color, Dimension, FontFamily, FontSize, ImageName } from '../../enums';
import { MiddlewareCheck } from '../../services/middleware';
import { Toaster } from '../../services/common-view-function';
import { ErrorCode } from '../../services/constant';

const QrScanner = ({ navigation, route }) => {
  const device = useCameraDevice('back');
  const [latestScannedData, setLatestScannedData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showHideModal, setShowHideModal] = useState(false)


  const handleCameraError = (error) => {
    console.error(error);

    navigation.goBack()
  };

  const handleCodeScanned = async (codes) => {
    if (!isScanning) {
      setIsScanning(true); // Set scanning flag to true
      let codeData = codes
      await ApiCall(codeData[0].value);
      // Optional: Implement debounce or throttle here to prevent rapid scanning
      setTimeout(() => {
        setIsScanning(false); // Reset scanning flag after processing
      }, 5000); // Adjust timeout as needed to prevent multiple scans within a short timeframe
    }
  };

  const ApiCall = async (val) => {
    let reqData = {
      'token': val,
    }
    let responseData = await MiddlewareCheck("verifyToken", reqData, this.props)
    // console.log("resp token====", JSON.stringify(responseData))
    if (responseData) {
      if (responseData.status == ErrorCode.ERROR.ERROR_CODE.SUCCESS) {
        Toaster.ShortCenterToaster(responseData.message)
        const { setResults } = route.params;
        setResults(val)
        navigation.goBack()
      } else {
        setShowHideModal(true)
      }
    }
   
  }

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => handleCodeScanned(codes),

  });

  const modalSec = () => {
    const closeModal = () => {
      setShowHideModal(false)
    }
    const onTryAgain = () => {
      setShowHideModal(false)
    }
    return (
      <>
        {showHideModal ?
          <Modal
            isVisible={showHideModal}
            padding={0}
            children={
              <View style={styles.modalview}>
                <React.Fragment>
                  <View style={styles.modalHeaderSec}>
                    <TouchableOpacity style={styles.crossImgSec} onPress={() => closeModal()}>
                      <Image source={ImageName.WHITE_CROSS} style={styles.redCrossImg} />
                    </TouchableOpacity>
                  </View>
                  <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: Color.COLOR.RED.AMARANTH, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: FontSize.XXXL }}>Error</Text>
                    <Text style={{ color: Color.COLOR.BLACK.PURE_BLACK, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: FontSize.SM, top: -10 }}>Oops! Something went worng</Text>
                    <TouchableOpacity onPress={() => onTryAgain()} style={{ backgroundColor: Color.COLOR.RED.AMARANTH, borderRadius: 10, justifyContent: "center", alignItems: "center", paddingHorizontal: 25, paddingVertical: 5, marginTop: 10 }}>
                      <Text style={{ color: Color.COLOR.WHITE.PURE_WHITE, fontFamily: FontFamily.FONTS.POPPINS.MEDIUM, fontSize: FontSize.MD }}>Try Again</Text>
                    </TouchableOpacity>
                  </View>

                </React.Fragment>
              </View>
            }
          />
          : null}
      </>
    )
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        codeScanner={codeScanner}
        device={device}
        isActive={true}
      onError={handleCameraError}
      />
      <View style={styles.overlay}>
        <View style={styles.overlayTop} />
        <View style={styles.overlayCenter}>
          <View style={styles.overlaySide} />
          <View style={styles.clearView} />
          <View style={styles.overlaySide} />
        </View>
        <View style={styles.overlayBottom} />
      </View>

      {modalSec()}
    </View>
  )
}

export default QrScanner;