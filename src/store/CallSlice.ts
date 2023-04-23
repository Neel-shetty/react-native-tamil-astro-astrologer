import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {
  ScreenCapturePickerView,
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  MediaStreamTrack,
  mediaDevices,
  registerGlobals,
} from 'react-native-webrtc';

async function call() {
  let mediaConstraints = {
    audio: true,
    video: {
      frameRate: 30,
      facingMode: 'user',
    },
  };

  let localMediaStream: MediaStream;
  let remoteMediaStream: MediaStream;
  let isVoiceOnly = false;

  try {
    const mediaStream = await mediaDevices.getUserMedia(mediaConstraints);

    if (isVoiceOnly) {
      let videoTrack = await mediaStream.getVideoTracks()[0];
      videoTrack.enabled = false;
    }

    localMediaStream = mediaStream;
  } catch (err) {
    console.log('🚀 ~ file: CallSlice.ts:38 ~ call ~ err:', err);
    // Handle Error
  }

  let peerConstraints = {
    iceServers: [
      {
        urls: 'stun:stun.l.google.com:19302',
      },
    ],
  };

  let peerConnection = new RTCPeerConnection(peerConstraints);

  peerConnection.addEventListener('connectionstatechange', event => {
    switch (peerConnection.connectionState) {
      case 'closed':
        console.log(
          '🚀 ~ file: CallSlice.ts:62 ~ call ~ peerConnection.connectionState:',
          peerConnection.connectionState,
        );
        // You can handle the call being disconnected here.

        break;
    }
  });

  peerConnection.addEventListener('icecandidate', event => {
    // When you find a null candidate then there are no more candidates.
    // Gathering of candidates has finished.
    if (!event.candidate) {
      return;
    }

    // Send the event.candidate onto the person you're calling.
    // Keeping to Trickle ICE Standards, you should send the candidates immediately.
  });

  peerConnection.addEventListener('icecandidateerror', event => {
    // You can ignore some candidate errors.
    // Connections can still be made even when errors occur.
  });

  peerConnection.addEventListener('iceconnectionstatechange', event => {
    switch (peerConnection.iceConnectionState) {
      case 'connected':
      case 'completed':
        // You can handle the call being connected here.
        // Like setting the video streams to visible.

        break;
    }
  });

  peerConnection.addEventListener('negotiationneeded', event => {
    // You can start the offer stages here.
    // Be careful as this event can be called multiple times.
  });

  peerConnection.addEventListener('signalingstatechange', event => {
    switch (peerConnection.signalingState) {
      case 'closed':
        // You can handle the call being disconnected here.

        break;
    }
  });

  peerConnection.addEventListener('track', event => {
    // Grab the remote track from the connected participant.
    remoteMediaStream = remoteMediaStream || new MediaStream();
    remoteMediaStream.addTrack(event.track, remoteMediaStream);
  });

  localMediaStream
    ?.getTracks()
    .forEach(track => peerConnection.addTrack(track, localMediaStream));
}
export interface CallState {}

const initialState: CallState = {};

export const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {},
});

// Action creators are generated for each case reducer function
export const {} = callSlice.actions;

export default callSlice.reducer;
