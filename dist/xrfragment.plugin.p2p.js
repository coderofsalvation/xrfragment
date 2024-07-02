// SPDX-FileCopyrightText: 2023 Leon van Kammen/NLNET
//
// SPDX-License-Identifier: MPL-2.0

(function(){
const MAX_BUFFERED_AMOUNT=65536,ICECOMPLETE_TIMEOUT=5e3,CHANNEL_CLOSING_TIMEOUT=5e3;function randombytes(e){const t=new Uint8Array(e);for(let s=0;s<e;s++)t[s]=256*Math.random()|0;return t}function getBrowserRTC(){if("undefined"==typeof globalThis)return null;const e={RTCPeerConnection:globalThis.RTCPeerConnection||globalThis.mozRTCPeerConnection||globalThis.webkitRTCPeerConnection,RTCSessionDescription:globalThis.RTCSessionDescription||globalThis.mozRTCSessionDescription||globalThis.webkitRTCSessionDescription,RTCIceCandidate:globalThis.RTCIceCandidate||globalThis.mozRTCIceCandidate||globalThis.webkitRTCIceCandidate};return e.RTCPeerConnection?e:null}function errCode(e,t){return Object.defineProperty(e,"code",{value:t,enumerable:!0,configurable:!0}),e}function filterTrickle(e){return e.replace(/a=ice-options:trickle\s\n/g,"")}function warn(e){console.warn(e)}class Peer{constructor(e={}){if(this._map=new Map,this._id=randombytes(4).toString("hex").slice(0,7),this._doDebug=e.debug,this._debug("new peer %o",e),this.channelName=e.initiator?e.channelName||randombytes(20).toString("hex"):null,this.initiator=e.initiator||!1,this.channelConfig=e.channelConfig||Peer.channelConfig,this.channelNegotiated=this.channelConfig.negotiated,this.config=Object.assign({},Peer.config,e.config),this.offerOptions=e.offerOptions||{},this.answerOptions=e.answerOptions||{},this.sdpTransform=e.sdpTransform||(e=>e),this.streams=e.streams||(e.stream?[e.stream]:[]),this.trickle=void 0===e.trickle||e.trickle,this.allowHalfTrickle=void 0!==e.allowHalfTrickle&&e.allowHalfTrickle,this.iceCompleteTimeout=e.iceCompleteTimeout||5e3,this.destroyed=!1,this.destroying=!1,this._connected=!1,this.remoteAddress=void 0,this.remoteFamily=void 0,this.remotePort=void 0,this.localAddress=void 0,this.localFamily=void 0,this.localPort=void 0,this._wrtc=e.wrtc&&"object"==typeof e.wrtc?e.wrtc:getBrowserRTC(),!this._wrtc)throw"undefined"==typeof window?errCode(new Error("No WebRTC support: Specify `opts.wrtc` option in this environment"),"ERR_WEBRTC_SUPPORT"):errCode(new Error("No WebRTC support: Not a supported browser"),"ERR_WEBRTC_SUPPORT");this._pcReady=!1,this._channelReady=!1,this._iceComplete=!1,this._iceCompleteTimer=null,this._channel=null,this._pendingCandidates=[],this._isNegotiating=!1,this._firstNegotiation=!0,this._batchedNegotiation=!1,this._queuedNegotiation=!1,this._sendersAwaitingStable=[],this._senderMap=new Map,this._closingInterval=null,this._remoteTracks=[],this._remoteStreams=[],this._chunk=null,this._cb=null,this._interval=null;try{this._pc=new this._wrtc.RTCPeerConnection(this.config)}catch(e){return void this.destroy(errCode(e,"ERR_PC_CONSTRUCTOR"))}this._isReactNativeWebrtc="number"==typeof this._pc._peerConnectionId,this._pc.oniceconnectionstatechange=()=>{this._onIceStateChange()},this._pc.onicegatheringstatechange=()=>{this._onIceStateChange()},this._pc.onconnectionstatechange=()=>{this._onConnectionStateChange()},this._pc.onsignalingstatechange=()=>{this._onSignalingStateChange()},this._pc.onicecandidate=e=>{this._onIceCandidate(e)},"object"==typeof this._pc.peerIdentity&&this._pc.peerIdentity.catch((e=>{this.destroy(errCode(e,"ERR_PC_PEER_IDENTITY"))})),this.initiator||this.channelNegotiated?this._setupData({channel:this._pc.createDataChannel(this.channelName,this.channelConfig)}):this._pc.ondatachannel=e=>{this._setupData(e)},this.streams&&this.streams.forEach((e=>{this.addStream(e)})),this._pc.ontrack=e=>{this._onTrack(e)},this._debug("initial negotiation"),this._needsNegotiation()}get bufferSize(){return this._channel&&this._channel.bufferedAmount||0}get connected(){return this._connected&&"open"===this._channel.readyState}address(){return{port:this.localPort,family:this.localFamily,address:this.localAddress}}signal(e){if(!this.destroying){if(this.destroyed)throw errCode(new Error("cannot signal after peer is destroyed"),"ERR_DESTROYED");if("string"==typeof e)try{e=JSON.parse(e)}catch(t){e={}}this._debug("signal()"),e.renegotiate&&this.initiator&&(this._debug("got request to renegotiate"),this._needsNegotiation()),e.transceiverRequest&&this.initiator&&(this._debug("got request for transceiver"),this.addTransceiver(e.transceiverRequest.kind,e.transceiverRequest.init)),e.candidate&&(this._pc.remoteDescription&&this._pc.remoteDescription.type?this._addIceCandidate(e.candidate):this._pendingCandidates.push(e.candidate)),e.sdp&&this._pc.setRemoteDescription(new this._wrtc.RTCSessionDescription(e)).then((()=>{this.destroyed||(this._pendingCandidates.forEach((e=>{this._addIceCandidate(e)})),this._pendingCandidates=[],"offer"===this._pc.remoteDescription.type&&this._createAnswer())})).catch((e=>{this.destroy(errCode(e,"ERR_SET_REMOTE_DESCRIPTION"))})),e.sdp||e.candidate||e.renegotiate||e.transceiverRequest||this.destroy(errCode(new Error("signal() called with invalid signal data"),"ERR_SIGNALING"))}}_addIceCandidate(e){const t=new this._wrtc.RTCIceCandidate(e);this._pc.addIceCandidate(t).catch((e=>{!t.address||t.address.endsWith(".local")?warn("Ignoring unsupported ICE candidate."):this.destroy(errCode(e,"ERR_ADD_ICE_CANDIDATE"))}))}send(e){if(!this.destroying){if(this.destroyed)throw errCode(new Error("cannot send after peer is destroyed"),"ERR_DESTROYED");this._channel.send(e)}}addTransceiver(e,t){if(!this.destroying){if(this.destroyed)throw errCode(new Error("cannot addTransceiver after peer is destroyed"),"ERR_DESTROYED");if(this._debug("addTransceiver()"),this.initiator)try{this._pc.addTransceiver(e,t),this._needsNegotiation()}catch(e){this.destroy(errCode(e,"ERR_ADD_TRANSCEIVER"))}else this.emit("signal",{type:"transceiverRequest",transceiverRequest:{kind:e,init:t}})}}addStream(e){if(!this.destroying){if(this.destroyed)throw errCode(new Error("cannot addStream after peer is destroyed"),"ERR_DESTROYED");this._debug("addStream()"),e.getTracks().forEach((t=>{this.addTrack(t,e)}))}}addTrack(e,t){if(this.destroying)return;if(this.destroyed)throw errCode(new Error("cannot addTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("addTrack()");const s=this._senderMap.get(e)||new Map;let i=s.get(t);if(i)throw i.removed?errCode(new Error("Track has been removed. You should enable/disable tracks that you want to re-add."),"ERR_SENDER_REMOVED"):errCode(new Error("Track has already been added to that stream."),"ERR_SENDER_ALREADY_ADDED");i=this._pc.addTrack(e,t),s.set(t,i),this._senderMap.set(e,s),this._needsNegotiation()}replaceTrack(e,t,s){if(this.destroying)return;if(this.destroyed)throw errCode(new Error("cannot replaceTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("replaceTrack()");const i=this._senderMap.get(e),r=i?i.get(s):null;if(!r)throw errCode(new Error("Cannot replace track that was never added."),"ERR_TRACK_NOT_ADDED");t&&this._senderMap.set(t,i),null!=r.replaceTrack?r.replaceTrack(t):this.destroy(errCode(new Error("replaceTrack is not supported in this browser"),"ERR_UNSUPPORTED_REPLACETRACK"))}removeTrack(e,t){if(this.destroying)return;if(this.destroyed)throw errCode(new Error("cannot removeTrack after peer is destroyed"),"ERR_DESTROYED");this._debug("removeSender()");const s=this._senderMap.get(e),i=s?s.get(t):null;if(!i)throw errCode(new Error("Cannot remove track that was never added."),"ERR_TRACK_NOT_ADDED");try{i.removed=!0,this._pc.removeTrack(i)}catch(e){"NS_ERROR_UNEXPECTED"===e.name?this._sendersAwaitingStable.push(i):this.destroy(errCode(e,"ERR_REMOVE_TRACK"))}this._needsNegotiation()}removeStream(e){if(!this.destroying){if(this.destroyed)throw errCode(new Error("cannot removeStream after peer is destroyed"),"ERR_DESTROYED");this._debug("removeSenders()"),e.getTracks().forEach((t=>{this.removeTrack(t,e)}))}}_needsNegotiation(){this._debug("_needsNegotiation"),this._batchedNegotiation||(this._batchedNegotiation=!0,queueMicrotask((()=>{this._batchedNegotiation=!1,this.initiator||!this._firstNegotiation?(this._debug("starting batched negotiation"),this.negotiate()):this._debug("non-initiator initial negotiation request discarded"),this._firstNegotiation=!1})))}negotiate(){if(!this.destroying){if(this.destroyed)throw errCode(new Error("cannot negotiate after peer is destroyed"),"ERR_DESTROYED");this.initiator?this._isNegotiating?(this._queuedNegotiation=!0,this._debug("already negotiating, queueing")):(this._debug("start negotiation"),setTimeout((()=>{this._createOffer()}),0)):this._isNegotiating?(this._queuedNegotiation=!0,this._debug("already negotiating, queueing")):(this._debug("requesting negotiation from initiator"),this.emit("signal",{type:"renegotiate",renegotiate:!0})),this._isNegotiating=!0}}destroy(e){this.destroyed||this.destroying||(this.destroying=!0,this._debug("destroying (error: %s)",e&&(e.message||e)),queueMicrotask((()=>{if(this.destroyed=!0,this.destroying=!1,this._debug("destroy (error: %s)",e&&(e.message||e)),this._connected=!1,this._pcReady=!1,this._channelReady=!1,this._remoteTracks=null,this._remoteStreams=null,this._senderMap=null,clearInterval(this._closingInterval),this._closingInterval=null,clearInterval(this._interval),this._interval=null,this._chunk=null,this._cb=null,this._channel){try{this._channel.close()}catch(e){}this._channel.onmessage=null,this._channel.onopen=null,this._channel.onclose=null,this._channel.onerror=null}if(this._pc){try{this._pc.close()}catch(e){}this._pc.oniceconnectionstatechange=null,this._pc.onicegatheringstatechange=null,this._pc.onsignalingstatechange=null,this._pc.onicecandidate=null,this._pc.ontrack=null,this._pc.ondatachannel=null}this._pc=null,this._channel=null,e&&this.emit("error",e),this.emit("close")})))}_setupData(e){if(!e.channel)return this.destroy(errCode(new Error("Data channel event is missing `channel` property"),"ERR_DATA_CHANNEL"));this._channel=e.channel,this._channel.binaryType="arraybuffer","number"==typeof this._channel.bufferedAmountLowThreshold&&(this._channel.bufferedAmountLowThreshold=65536),this.channelName=this._channel.label,this._channel.onmessage=e=>{this._onChannelMessage(e)},this._channel.onbufferedamountlow=()=>{this._onChannelBufferedAmountLow()},this._channel.onopen=()=>{this._onChannelOpen()},this._channel.onclose=()=>{this._onChannelClose()},this._channel.onerror=e=>{this.destroy(errCode(e,"ERR_DATA_CHANNEL"))};let t=!1;this._closingInterval=setInterval((()=>{this._channel&&"closing"===this._channel.readyState?(t&&this._onChannelClose(),t=!0):t=!1}),5e3)}_startIceCompleteTimeout(){this.destroyed||this._iceCompleteTimer||(this._debug("started iceComplete timeout"),this._iceCompleteTimer=setTimeout((()=>{this._iceComplete||(this._iceComplete=!0,this._debug("iceComplete timeout completed"),this.emit("iceTimeout"),this.emit("_iceComplete"))}),this.iceCompleteTimeout))}_createOffer(){this.destroyed||this._pc.createOffer(this.offerOptions).then((e=>{if(this.destroyed)return;this.trickle||this.allowHalfTrickle||(e.sdp=filterTrickle(e.sdp)),e.sdp=this.sdpTransform(e.sdp);const t=()=>{if(this.destroyed)return;const t=this._pc.localDescription||e;this._debug("signal"),this.emit("signal",{type:t.type,sdp:t.sdp})};this._pc.setLocalDescription(e).then((()=>{this._debug("createOffer success"),this.destroyed||(this.trickle||this._iceComplete?t():this.once("_iceComplete",t))})).catch((e=>{this.destroy(errCode(e,"ERR_SET_LOCAL_DESCRIPTION"))}))})).catch((e=>{this.destroy(errCode(e,"ERR_CREATE_OFFER"))}))}_requestMissingTransceivers(){this._pc.getTransceivers&&this._pc.getTransceivers().forEach((e=>{e.mid||!e.sender.track||e.requested||(e.requested=!0,this.addTransceiver(e.sender.track.kind))}))}_createAnswer(){this.destroyed||this._pc.createAnswer(this.answerOptions).then((e=>{if(this.destroyed)return;this.trickle||this.allowHalfTrickle||(e.sdp=filterTrickle(e.sdp)),e.sdp=this.sdpTransform(e.sdp);const t=()=>{if(this.destroyed)return;const t=this._pc.localDescription||e;this._debug("signal"),this.emit("signal",{type:t.type,sdp:t.sdp}),this.initiator||this._requestMissingTransceivers()};this._pc.setLocalDescription(e).then((()=>{this.destroyed||(this.trickle||this._iceComplete?t():this.once("_iceComplete",t))})).catch((e=>{this.destroy(errCode(e,"ERR_SET_LOCAL_DESCRIPTION"))}))})).catch((e=>{this.destroy(errCode(e,"ERR_CREATE_ANSWER"))}))}_onConnectionStateChange(){this.destroyed||"failed"===this._pc.connectionState&&this.destroy(errCode(new Error("Connection failed."),"ERR_CONNECTION_FAILURE"))}_onIceStateChange(){if(this.destroyed)return;const e=this._pc.iceConnectionState,t=this._pc.iceGatheringState;this._debug("iceStateChange (connection: %s) (gathering: %s)",e,t),this.emit("iceStateChange",e,t),"connected"!==e&&"completed"!==e||(this._pcReady=!0,this._maybeReady()),"failed"===e&&this.destroy(errCode(new Error("Ice connection failed."),"ERR_ICE_CONNECTION_FAILURE")),"closed"===e&&this.destroy(errCode(new Error("Ice connection closed."),"ERR_ICE_CONNECTION_CLOSED"))}getStats(e){const t=e=>("[object Array]"===Object.prototype.toString.call(e.values)&&e.values.forEach((t=>{Object.assign(e,t)})),e);0===this._pc.getStats.length||this._isReactNativeWebrtc?this._pc.getStats().then((s=>{const i=[];s.forEach((e=>{i.push(t(e))})),e(null,i)}),(t=>e(t))):this._pc.getStats.length>0?this._pc.getStats((s=>{if(this.destroyed)return;const i=[];s.result().forEach((e=>{const s={};e.names().forEach((t=>{s[t]=e.stat(t)})),s.id=e.id,s.type=e.type,s.timestamp=e.timestamp,i.push(t(s))})),e(null,i)}),(t=>e(t))):e(null,[])}_maybeReady(){if(this._debug("maybeReady pc %s channel %s",this._pcReady,this._channelReady),this._connected||this._connecting||!this._pcReady||!this._channelReady)return;this._connecting=!0;const e=()=>{this.destroyed||this.getStats(((t,s)=>{if(this.destroyed)return;t&&(s=[]);const i={},r={},n={};let o=!1;s.forEach((e=>{"remotecandidate"!==e.type&&"remote-candidate"!==e.type||(i[e.id]=e),"localcandidate"!==e.type&&"local-candidate"!==e.type||(r[e.id]=e),"candidatepair"!==e.type&&"candidate-pair"!==e.type||(n[e.id]=e)}));const a=e=>{o=!0;let t=r[e.localCandidateId];t&&(t.ip||t.address)?(this.localAddress=t.ip||t.address,this.localPort=Number(t.port)):t&&t.ipAddress?(this.localAddress=t.ipAddress,this.localPort=Number(t.portNumber)):"string"==typeof e.googLocalAddress&&(t=e.googLocalAddress.split(":"),this.localAddress=t[0],this.localPort=Number(t[1])),this.localAddress&&(this.localFamily=this.localAddress.includes(":")?"IPv6":"IPv4");let s=i[e.remoteCandidateId];s&&(s.ip||s.address)?(this.remoteAddress=s.ip||s.address,this.remotePort=Number(s.port)):s&&s.ipAddress?(this.remoteAddress=s.ipAddress,this.remotePort=Number(s.portNumber)):"string"==typeof e.googRemoteAddress&&(s=e.googRemoteAddress.split(":"),this.remoteAddress=s[0],this.remotePort=Number(s[1])),this.remoteAddress&&(this.remoteFamily=this.remoteAddress.includes(":")?"IPv6":"IPv4"),this._debug("connect local: %s:%s remote: %s:%s",this.localAddress,this.localPort,this.remoteAddress,this.remotePort)};if(s.forEach((e=>{"transport"===e.type&&e.selectedCandidatePairId&&a(n[e.selectedCandidatePairId]),("googCandidatePair"===e.type&&"true"===e.googActiveConnection||("candidatepair"===e.type||"candidate-pair"===e.type)&&e.selected)&&a(e)})),o||Object.keys(n).length&&!Object.keys(r).length){if(this._connecting=!1,this._connected=!0,this._chunk){try{this.send(this._chunk)}catch(t){return this.destroy(errCode(t,"ERR_DATA_CHANNEL"))}this._chunk=null,this._debug('sent chunk from "write before connect"');const e=this._cb;this._cb=null,e(null)}"number"!=typeof this._channel.bufferedAmountLowThreshold&&(this._interval=setInterval((()=>this._onInterval()),150),this._interval.unref&&this._interval.unref()),this._debug("connect"),this.emit("connect")}else setTimeout(e,100)}))};e()}_onInterval(){!this._cb||!this._channel||this._channel.bufferedAmount>65536||this._onChannelBufferedAmountLow()}_onSignalingStateChange(){this.destroyed||("stable"===this._pc.signalingState&&(this._isNegotiating=!1,this._debug("flushing sender queue",this._sendersAwaitingStable),this._sendersAwaitingStable.forEach((e=>{this._pc.removeTrack(e),this._queuedNegotiation=!0})),this._sendersAwaitingStable=[],this._queuedNegotiation?(this._debug("flushing negotiation queue"),this._queuedNegotiation=!1,this._needsNegotiation()):(this._debug("negotiated"),this.emit("negotiated"))),this._debug("signalingStateChange %s",this._pc.signalingState),this.emit("signalingStateChange",this._pc.signalingState))}_onIceCandidate(e){this.destroyed||(e.candidate&&this.trickle?this.emit("signal",{type:"candidate",candidate:{candidate:e.candidate.candidate,sdpMLineIndex:e.candidate.sdpMLineIndex,sdpMid:e.candidate.sdpMid}}):e.candidate||this._iceComplete||(this._iceComplete=!0,this.emit("_iceComplete")),e.candidate&&this._startIceCompleteTimeout())}_onChannelMessage(e){if(this.destroyed)return;let t=e.data;t instanceof ArrayBuffer&&(t=new Uint8Array(t)),this.emit("data",t)}_onChannelBufferedAmountLow(){if(this.destroyed||!this._cb)return;this._debug("ending backpressure: bufferedAmount %d",this._channel.bufferedAmount);const e=this._cb;this._cb=null,e(null)}_onChannelOpen(){this._connected||this.destroyed||(this._debug("on channel open"),this._channelReady=!0,this._maybeReady())}_onChannelClose(){this.destroyed||(this._debug("on channel close"),this.destroy())}_onTrack(e){this.destroyed||e.streams.forEach((t=>{this._debug("on track"),this.emit("track",e.track,t),this._remoteTracks.push({track:e.track,stream:t}),this._remoteStreams.some((e=>e.id===t.id))||(this._remoteStreams.push(t),queueMicrotask((()=>{this._debug("on stream"),this.emit("stream",t)})))}))}_debug(...e){this._doDebug&&(e[0]="["+this._id+"] "+e[0],console.log(...e))}on(e,t){const s=this._map;s.has(e)||s.set(e,new Set),s.get(e).add(t)}off(e,t){const s=this._map,i=s.get(e);i&&(i.delete(t),0===i.size&&s.delete(e))}once(e,t){const s=(...i)=>{this.off(e,s),t(...i)};this.on(e,s)}emit(e,...t){const s=this._map;if(s.has(e))for(const i of s.get(e))try{i(...t)}catch(e){console.error(e)}}}Peer.WEBRTC_SUPPORT=!!getBrowserRTC(),Peer.config={iceServers:[{urls:["stun:stun.l.google.com:19302","stun:global.stun.twilio.com:3478"]}],sdpSemantics:"unified-plan"},Peer.channelConfig={};const charSet="0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz",initPeer=(e,t,s)=>{const i=new Peer({initiator:e,trickle:t,config:s}),r=e=>i.__earlyDataBuffer.push(e);return i.on(events.data,r),i.__earlyDataBuffer=[],i.__drainEarlyData=e=>{i.off(events.data,r),i.__earlyDataBuffer.forEach(e),delete i.__earlyDataBuffer,delete i.__drainEarlyData},i},genId=e=>Array(e).fill().map((()=>charSet[Math.floor(62*Math.random())])).join(""),initGuard=(e,t)=>(s,i)=>{if(e[i])return e[i];if(!s)throw mkErr("requires a config map as the first argument");if(!s.appId&&!s.firebaseApp)throw mkErr("config map is missing appId field");if(!i)throw mkErr("namespace argument required");return e[i]=t(s,i)},libName="Trystero",selfId=genId(20),{keys:keys,values:values,entries:entries,fromEntries:fromEntries}=Object,noOp=()=>{},mkErr=e=>new Error(`${libName}: ${e}`),encodeBytes=e=>(new TextEncoder).encode(e),decodeBytes=e=>(new TextDecoder).decode(e),events=fromEntries(["close","connect","data","error","signal","stream","track"].map((e=>[e,e]))),combineChunks=e=>{const t=new Uint8Array(e.reduce(((e,t)=>e+t.byteLength),0));return e.reduce(((e,s)=>(t.set(s,e),e+s.byteLength)),0),t},sleep=e=>new Promise((t=>setTimeout(t,e))),TypedArray=Object.getPrototypeOf(Uint8Array),typeByteLimit=12,typeIndex=0,nonceIndex=12,tagIndex=13,progressIndex=14,payloadIndex=15,chunkSize=16369,oneByteMax=255,buffLowEvent="bufferedamountlow";var room=(e,t)=>{const s={},i={},r={},n={},o={},a={},c=(e,t)=>(e?Array.isArray(e)?e:[e]:keys(s)).flatMap((e=>{const i=s[e];return i?t(e,i):(console.warn(`${libName}: no peer with id ${e} found`),[])})),d=e=>{if(i[e])return[i[e].send,i[e].setOnComplete,i[e].setOnProgress];if(!e)throw mkErr("action type argument is required");const t=encodeBytes(e);if(t.byteLength>12)throw mkErr(`action type string "${e}" (${t.byteLength}b) exceeds byte limit (12). Hint: choose a shorter name.`);const r=new Uint8Array(12);r.set(t);let n=0;return i[e]={onComplete:noOp,onProgress:noOp,setOnComplete:t=>i[e]={...i[e],onComplete:t},setOnProgress:t=>i[e]={...i[e],onProgress:t},send:async(e,t,i,o)=>{if(i&&"object"!=typeof i)throw mkErr("action meta argument must be an object");if(void 0===e)throw mkErr("action data cannot be undefined");const a="string"!=typeof e,d=e instanceof Blob,h=d||e instanceof ArrayBuffer||e instanceof TypedArray;if(i&&!h)throw mkErr("action meta argument can only be used with binary data");const l=h?new Uint8Array(d?await e.arrayBuffer():e):encodeBytes(a?JSON.stringify(e):e),_=i?encodeBytes(JSON.stringify(i)):null,p=Math.ceil(l.byteLength/16369)+(i?1:0),u=new Array(p).fill().map(((e,t)=>{const s=t===p-1,o=i&&0===t,c=new Uint8Array(15+(o?_.byteLength:s?l.byteLength-16369*(p-(i?2:1)):16369));return c.set(r),c.set([n],12),c.set([s|o<<1|h<<2|a<<3],13),c.set([Math.round((t+1)/p*255)],14),c.set(i?o?_:l.subarray(16369*(t-1),16369*t):l.subarray(16369*t,16369*(t+1)),15),c}));return n=n+1&255,Promise.all(c(t,(async(e,t)=>{const r=t._channel;let n=0;for(;n<p;){const a=u[n];if(r.bufferedAmount>r.bufferedAmountLowThreshold&&await new Promise((e=>{const t=()=>{r.removeEventListener(buffLowEvent,t),e()};r.addEventListener(buffLowEvent,t)})),!s[e])break;t.send(a),n++,o&&o(a[14]/255,e,i)}})))}},[i[e].send,i[e].setOnComplete,i[e].setOnProgress]},h=(e,t)=>{const s=new Uint8Array(t),n=decodeBytes(s.subarray(0,12)).replaceAll("\0",""),[o]=s.subarray(12,13),[a]=s.subarray(13,14),[c]=s.subarray(14,15),d=s.subarray(15),h=!!(1&a),l=!!(2&a),_=!!(4&a),p=!!(8&a);if(!i[n])throw mkErr(`received message with unregistered type (${n})`);r[e]||(r[e]={}),r[e][n]||(r[e][n]={});let u=r[e][n][o];if(u||(u=r[e][n][o]={chunks:[]}),l?u.meta=JSON.parse(decodeBytes(d)):u.chunks.push(d),i[n].onProgress(c/255,e,u.meta),!h)return;const g=combineChunks(u.chunks);if(_)i[n].onComplete(g,e,u.meta);else{const t=decodeBytes(g);i[n].onComplete(p?JSON.parse(t):t,e)}delete r[e][n][o]},[l,_]=d("__91n6__"),[p,u]=d("__90n6__"),[g,f]=d("__516n4L__"),[m,y]=d("__57r34m__"),[C,E]=d("__7r4ck__");let b=noOp,w=noOp,R=noOp,T=noOp;return e(((e,t)=>{if(s[t])return;const i=h.bind(null,t);s[t]=e,e.on(events.signal,(e=>g(e,t))),e.on(events.close,(()=>(e=>{s[e]&&(delete s[e],delete r[e],delete n[e],w(e))})(t))),e.on(events.data,i),e.on(events.stream,(e=>{R(e,t,o[t]),delete o[t]})),e.on(events.track,((e,s)=>{T(e,s,t,a[t]),delete a[t]})),e.on(events.error,(e=>{"ERR_DATA_CHANNEL"!==e.code&&console.error(e)})),b(t),e.__drainEarlyData(i)})),_(((e,t)=>p(null,t))),u(((e,t)=>{n[t]&&(n[t](),delete n[t])})),f(((e,t)=>{s[t]&&s[t].signal(e)})),y(((e,t)=>o[t]=e)),E(((e,t)=>a[t]=e)),{makeAction:d,ping:async e=>{if(!e)throw mkErr("ping() must be called with target peer ID");const t=Date.now();return l(null,e),await new Promise((t=>n[e]=t)),Date.now()-t},leave:()=>{entries(s).forEach((([e,t])=>{t.destroy(),delete s[e]})),t()},getPeers:()=>fromEntries(entries(s).map((([e,t])=>[e,t._pc]))),addStream:(e,t,s)=>c(t,(async(t,i)=>{s&&await m(s,t),i.addStream(e)})),removeStream:(e,t)=>c(t,((t,s)=>s.removeStream(e))),addTrack:(e,t,s,i)=>c(s,(async(s,r)=>{i&&await C(i,s),r.addTrack(e,t)})),removeTrack:(e,t,s)=>c(s,((s,i)=>i.removeTrack(e,t))),replaceTrack:(e,t,s,i,r)=>c(i,(async(i,n)=>{r&&await C(r,i),n.replaceTrack(e,t,s)})),onPeerJoin:e=>b=e,onPeerLeave:e=>w=e,onPeerStream:e=>R=e,onPeerTrack:e=>T=e}};const algo="AES-CBC",pack=e=>btoa(String.fromCharCode.apply(null,new Uint8Array(e))),unpack=e=>{const t=atob(e);return new Uint8Array(t.length).map(((e,s)=>t.charCodeAt(s))).buffer},genKey=async(e,t)=>crypto.subtle.importKey("raw",await crypto.subtle.digest({name:"SHA-256"},encodeBytes(`${e}:${t}`)),{name:algo},!1,["encrypt","decrypt"]),encrypt=async(e,t)=>{const s=crypto.getRandomValues(new Uint8Array(16));return JSON.stringify({c:pack(await crypto.subtle.encrypt({name:algo,iv:s},await e,encodeBytes(t))),iv:[...s]})},decrypt=async(e,t)=>{const{c:s,iv:i}=JSON.parse(t);return decodeBytes(await crypto.subtle.decrypt({name:algo,iv:new Uint8Array(i)},await e,unpack(s)))},occupiedRooms={},socketPromises={},sockets={},socketRetryTimeouts={},socketListeners={},hashLimit=20,offerPoolSize=10,defaultRedundancy=2,defaultAnnounceSecs=33,maxAnnounceSecs=120,trackerRetrySecs=4,trackerAction="announce",defaultTrackerUrls=["wss://tracker.webtorrent.dev","wss://tracker.files.fm:7073/announce","wss://fediverse.tv/tracker/socket","wss://tracker.openwebtorrent.com","wss://tracker.btorrent.xyz","wss://qot.abiir.top:443/announce","wss://spacetradersapi-chatbox.herokuapp.com:443/announce"],joinRoom=initGuard(occupiedRooms,((e,t)=>{const s={},i=e.password&&genKey(e.password,t),r=(e.trackerUrls||defaultTrackerUrls).slice(0,e.trackerUrls?e.trackerUrls.length:e.trackerRedundancy||2);if(!r.length)throw mkErr("trackerUrls is empty");const n=crypto.subtle.digest("SHA-1",encodeBytes(`${libName}:${e.appId}:${t}`)).then((e=>Array.from(new Uint8Array(e)).map((e=>e.toString(36))).join("").slice(0,20))),o=t=>fromEntries(Array(t).fill().map((()=>{const t=initPeer(!0,!1,e.rtcConfig);return[genId(20),{peer:t,offerP:new Promise((e=>t.once(events.signal,e)))}]}))),a=async(t,r)=>{const o=await n;let a;try{a=JSON.parse(r.data)}catch(r){return void console.error(`${libName}: received malformed SDP JSON`)}if(a.info_hash!==o||a.peer_id&&a.peer_id===selfId)return;const c=a["failure reason"];if(c)console.warn(`${libName}: torrent tracker failure (${c})`);else{if(a.interval&&a.interval>g&&a.interval<=120&&(clearInterval(f),g=a.interval,f=setInterval(h,1e3*g)),a.offer&&a.offer_id){if(s[a.peer_id]||y[a.offer_id])return;y[a.offer_id]=!0;const r=initPeer(!1,!1,e.rtcConfig);return r.once(events.signal,(async e=>t.send(JSON.stringify({answer:i?{...e,sdp:await encrypt(i,e.sdp)}:e,action:"announce",info_hash:o,peer_id:selfId,to_peer_id:a.peer_id,offer_id:a.offer_id})))),r.on(events.connect,(()=>_(r,a.peer_id))),r.on(events.close,(()=>p(r,a.peer_id,a.offer_id))),void r.signal(i?{...a.offer,sdp:await decrypt(i,a.offer.sdp)}:a.offer)}if(a.answer){if(s[a.peer_id]||y[a.offer_id])return;const e=u[a.offer_id];if(e){const{peer:t}=e;if(t.destroyed)return;y[a.offer_id]=!0,t.on(events.connect,(()=>_(t,a.peer_id,a.offer_id))),t.on(events.close,(()=>p(t,a.peer_id,a.offer_id))),t.signal(i?{...a.answer,sdp:await decrypt(i,a.answer.sdp)}:a.answer)}}}},c=async(e,t)=>e.send(JSON.stringify({action:"announce",info_hash:t,numwant:10,peer_id:selfId,offers:await Promise.all(entries(u).map((async([e,{offerP:t}])=>{const s=await t;return{offer_id:e,offer:i?{...s,sdp:await encrypt(i,s.sdp)}:s}})))})),d=(e,t,s)=>(s||!socketPromises[e]?(socketListeners[e]={...socketListeners[e],[t]:a},socketPromises[e]=new Promise((s=>{const i=new WebSocket(e);sockets[e]=i,i.addEventListener("open",(()=>{socketRetryTimeouts[e]=4e3,s(i)})),i.addEventListener("message",(t=>values(socketListeners[e]).forEach((e=>e(i,t))))),i.addEventListener("close",(async()=>{socketRetryTimeouts[e]=socketRetryTimeouts[e]??4e3,await sleep(socketRetryTimeouts[e]),socketRetryTimeouts[e]*=2,d(e,t,!0)}))}))):socketListeners[e][t]=a,socketPromises[e]),h=async()=>{const e=await n;u&&l(),u=o(10),r.forEach((async t=>{const s=await d(t,e);s.readyState===WebSocket.OPEN?c(s,e):s.readyState!==WebSocket.CONNECTING&&c(await d(t,e,!0),e)}))},l=()=>{entries(u).forEach((([e,{peer:t}])=>{y[e]||s[e]||t.destroy()})),y={}},_=(e,t,i)=>{m(e,t),s[t]=!0,i&&(s[i]=!0)},p=(e,t,i)=>{delete s[t],e.destroy();i in u&&(delete u[i],u={...u,...o(1)})};let u,g=33,f=setInterval(h,1e3*g),m=noOp,y={};return h(),room((e=>m=e),(async()=>{const e=await n;r.forEach((t=>delete socketListeners[t][e])),delete occupiedRooms[t],clearInterval(f),l()}))})),getTrackers=()=>({...sockets});
window.trystero = (opts) => new Proxy({

  profile:{
    type: 'network',
    name: 'Peer2Peer',
    description: 'WebRTC over bittorrent for signaling & encryption',
    url: 'https://github.com/dmotz/trystero',
    protocol: 'trystero://',
    video: true,
    audio: true,
    chat: true,
    scene: true
  },

  html: {
    generic: (opts) => `<div>
        <div target="_blank" class="badge ruler">Peer2Peer<a onclick="frontend.plugin.trystero.info()"><i class="gg-info right"></i></a></div>
        <table>
          <tr>
            <td>nickname</td>
            <td>
              <input type="text" id="nickname" placeholder="your nickname" maxlength="18" onkeydown="trystero.nickname = this.value"/>
            </td>
          </tr>
        </table>
      </div>
    `
  },

  room:       null, // { selfId: .... } when connected
  link:       '',
  selfId:     null,
  selfStream: null,
  nickname:   '',
  connected:  false,

  useWebcam: false,
  useChat:   false,
  useScene:  false,

  videos:    {},

  names:  {},
  ping:   { send: null, get: null },
  chat:   { send: null, get: null },
  name:   { send: null, get: null },
  href:   { send: null, get: null },

  init(){
    frontend.plugin['trystero'] = this
    $connections.webcam      = $connections.webcam.concat([this])
    $connections.chatnetwork = $connections.chatnetwork.concat([this])
    $connections.scene       = $connections.scene.concat([this])
    this.selfId = selfId // selfId is a trystero global (unique per session)
    this.reactToConnectionHrefs()
    this.nickname         = localStorage.getItem("nickname") || `human${String(Math.random()).substr(5,4)}`
    this.names[ this.selfId ] = this.nickname
    document.addEventListener('network.connect', (e) => this.connect(e.detail) )
    document.addEventListener('network.init', () => {
      let meeting = network.getMeetingFromUrl(document.location.href)
      if( meeting.match(this.profile.protocol) ){
        this.parseLink( meeting )
      }
    })
  },

  confirmConnected(){
    if( !this.connected ){
      this.connected = true
      frontend.emit('network.connected',{plugin:this,username: this.nickname}) 
    }
  },

  async connect(opts){
    // embedded https://github.com/dmotz/trystero (trystero-torrent.min.js build)
    if( opts.selectedWebcam      == this.profile.name ) this.useWebcam = true
    if( opts.selectedChatnetwork == this.profile.name ) this.useChat   = true
    if( opts.selectedScene       == this.profile.name ) this.useScene  = true
    if( this.useWebcam || this.useChat || this.useScene ){
      this.createLink() // ensure link 
      console.log("connecting "+this.profile.name)

      console.log("trystero link: "+this.link)
      this.room        = joinRoom( {appId: 'xrfragment'}, this.link )
      
      $chat.send({message:`Share the meeting link <a onclick="frontend.share()">by clicking here</a>`,class:['info']})
      $chat.send({message:"waiting for other humans..",class:['info']})

      // setup trystero events
      const [sendPing, getPing] = this.room.makeAction('ping')
      this.ping.send = sendPing
      this.ping.get  = getPing

      const [sendName, getName] = this.room.makeAction('name')
      this.name.send = sendName
      this.name.get  = getName

      // start pinging
      this.ping.pinger = setInterval( () => this.ping.send({ping:true}), 3000 )
      this.ping.get((data,peerId) => this.confirmConnected() )

      // listen for peers naming themselves
      this.name.get((name, peerId) => {
        this.confirmConnected()
        this.names[peerId] = name
      })
      // send name to peers who join later
      this.room.onPeerJoin( (peerId) => {
        this.confirmConnected()
        this.names[peerId] = name
        this.name.send(this.nickname, peerId ) 
        $chat.send({message:"a new human joined",class:['info']})
      })
      // delete name of people leaving
      this.room.onPeerLeave( (peerId) => delete this.names[peerId] )
  
      if( this.useWebcam ) this.initWebcam()
      if( this.useChat )   this.initChat()
      if( this.useScene )  this.initScene()

    }
  },

  initChat(){
    const [sendChat, getChat] = this.room.makeAction('chat')
    this.chat.send = sendChat
    this.chat.get  = getChat

    document.addEventListener('network.send', (e) => {
      console.log("trystero")
      this.chat.send({...e.detail, from: this.nickname, pos: network.pos })                     // send to P2P network
    })
    // prime chatlog of other people joining
    this.room.onPeerJoin( (peerId) => {
      if( $chat.getChatLog().length > 0 ) this.chat.send({prime: $chat.getChatLog() }, peerId )
    })
    // listen for chatmsg 
    this.chat.get((data, peerId) => {
      if( data.prime ){   // first prime is 'truth'
        if( this.chat.primed || $chat.getChatLog().length > 0 ) return // only prime once
        $chat.$messages.innerHTML += data.prime
        $chat.$messages.scrollTop = $chat.$messages.scrollHeight // scroll down
        this.chat.primed = true
      }else $chat.send({ ...data})          // send to screen
    })

  },

  async initWebcam(){
    if( !$connections.$audioInput.value && !$connections.$videoInput.value ) return  // nothing to do

    // get a local audio stream from the microphone
    this.selfStream = await navigator.mediaDevices.getUserMedia({
      audio: $connections.$audioInput.value, 
      video: $connections.$videoInput.value 
    })
    this.room.addStream(this.selfStream) 
    this.getVideo(this.selfId,{create:true,stream: this.selfStream})

    // send stream + chatlog to peers who join later
    this.room.onPeerJoin( (peerId) => this.room.addStream( this.selfStream, peerId))

    this.room.onPeerStream((stream, peerId) => {
      let video = this.getVideo(peerId,{create:true, stream}) 
      this.videos[ this.names[peerId] || peerId ] = video
    })

    this.room.onPeerLeave( (peerId) => {
      let video = this.getVideo(peerId)
      if( video ){
        video.remove() 
        delete this.videos[peerId]
      }
    })

  },

  initScene(){
    // setup trystero events
    const [sendHref, getHref] = this.room.makeAction('name')
    this.href.send = sendHref
    this.href.get  = getHref
    this.href.get((data,peerId) => {
      xrf.hashbus.pub(data.href)      
    })
  },

  getVideo(peerId,opts){
    opts = opts || {}
    let video = this.videos[ this.names[peerId] ] || this.videos[ peerId ]
    if (!video && opts.create) {
      video = document.createElement('video')
      video.autoplay = true

      // add video element to the DOM
      if( opts.stream ) video.srcObject = opts.stream 
      console.log("creating video for peerId "+this.selfId)
      this.videos[ this.selfId ] = video
      $chat.$videos.appendChild(video)
    }
  },

  send(opts){ $chat.send({...opts, source: 'trystero'}) },

  createLink(opts){
    if( !this.link ){
      const meeting = network.getMeetingFromUrl(document.location.href)
      this.link = network.meetingLink = meeting.match("trystero://") ? meeting : `trystero://r/${network.randomRoom()}:bittorrent`
    }
    if( !xrf.navigator.URI.hash.meet ) xrf.navigator.URI.hash.meet = this.link 
  },

  config(opts){
    opts = {...opts, ...this.profile }
    this.el   = document.createElement('div')
    this.el.innerHTML = this.html.generic(opts)
    this.el.querySelector('#nickname').value = this.nickname
    this.el.querySelector('#nickname').addEventListener('change', (e) => localStorage.setItem("nickname",e.target.value) )
    // resolve ip
    return this.el
  },

  info(opts){
    window.notify(`${this.profile.name} is ${this.profile.description} <br>by using a serverless technology called <a href="https://webrtc.org/" target="_blank">webRTC</a> via <a href="${this.profile.url}" target="_blank">trystero</a>.<br>You can basically make up your own channelname or choose an existing one.<br>Use this for hasslefree anonymous meetings.`)
  },

  parseLink(url){
    if( !url.match(this.profile.protocol) ) return
    let parts = url.replace(this.profile.protocol,'').split("/")
    if( parts[0] == 'r' ){ // this.room
      let roomid = parts[1].replace(/:.*/,'') 
      let server = parts[1].replace(/.*:/,'')
      if( server != 'bittorrent' ) return window.notify("only bittorrent is supported for trystero (for now) :/") 
      this.link = url
      $connections.show({
        chatnetwork:this.profile.name,
        scene:      this.profile.name,
        webcam:     this.profile.name 
      })
      return true
    }
    return false
  },

  reactToConnectionHrefs(){
    xrf.addEventListener('href', (opts) => {
      let {mesh} = opts
      if( !opts.click ) return
      this.parseLink(mesh.userData.href)
      let href = mesh.userData.href
      let isLocal    = href[0] == '#'
      let isTeleport = href.match(/(pos=|http:)/)
      if( isLocal && !isTeleport && this.href.send ) this.href.send({href})
    })
    let hashvars = xrf.URI.parse( document.location.hash ).XRF
    if( hashvars.meet ) this.parseLink(hashvars.meet.string)
  }

},
{ 
  // auto-trigger events on changes 
  get(data,k,receiver){ return data[k] },
  set(data,k,v){
    let from   = data[k]
    data[k] = v
    //switch( k ){
    //  default: elcene.dispatchEvent({type:`trystero.${k}.change`, from, to:v})
    //}
  }
})
      
document.addEventListener('$connections:ready', (e) => {
  trystero(e.detail).init()
})

//window.meeting = window.meeting||{}
//window.meeting.trystero = async function(el,this){
//
//  // embed https://github.com/dmotz/trystero (trystero-torrent.min.js build)
//  const { joinRoom } = await import("./../../../dist/trystero-torrent.min.js");
//  this.room  = {
//    this.room: null,
//    link:   null,
//    selfId: null,
//    names:  {},
//    chat:   { send: null, get: null },
//    name:   { send: null, get: null },
//    config: {appId: this.data.id }
//  }
//
//  this.sendName = null
//
//  this.send = (opts) => com.send({...opts, source: 'trystero'})
//
//  el.addEventListener('remove', () => {
//    if( this.room.room ) this.room.room.leave()
//  })
//
//  el.addEventListener('connect', async () => {
//    let this.room = this.room
//    
//    this.room.link = this.data.link
//    if( !room.linkmatch(/(#|&)meet/) ){
//      this.room.link = this.room.link.match(/#/) ? '&meet' : '#meet'
//    }
//    this.room.room     = joinRoom( this.room.config, this.room.link )
//    this.selfId     = this.room.selfId
//
//    this.send({
//      message: "joined meeting at "+roomname.replace(/(#|&)meet/,''),  // dont trigger init()
//      classes: ["info"],
//      sendNetwork:false
//    })
//
//    this.send({
//      message:"copied meeting link to clipboard",
//      classes: ["info"],
//      sendNetwork:false
//    })
//
//    // setup trystero events
//    const [sendName, getName] = this.room.makeAction('name')
//    const [sendChat, getChat] = this.room.makeAction('chat')
//    this.chat.send = sendChat
//    this.chat.get  = getChat
//    this.name.send = sendName
//    this.name.get  = getName
//
//    // tell other peers currently in the this.room our name
//    this.names[ this.selfId ] = this.nickname.substr(0,15)
//    this.name.send( this.nickname )
//
//    // listen for peers naming themselves
//    this.name.get((name, peerId) => (room.names[peerId] = name))
//
//    // send self stream to peers currently in the this.room
//    this.room.addStream(this.selfStream)
//
//    // send stream + chatlog to peers who join later
//    this.room.onPeerJoin( (peerId) => {
//      this.room.addStream( this.selfStream, peerId)
//      this.name.send( this.nickname, peerId)
//      this.chat.send({prime: com.log}, peerId )
//    })
//
//    this.room.onPeerLeave( (peerId) => {
//      console.log(`${room.names[peerId] || 'a visitor'} left`)
//      if( com.videos[peerId] ){
//        com.videos[peerId].remove()
//        delete com.videos[peerId]
//      }
//      delete this.names[peerId]
//    })
//
//    // this.room streams from other peers
//    this.room.onPeerStream((stream, peerId) => {
//      // create an audio instance and set the incoming stream
//      const audio = new Audio()
//      audio.srcObject = stream
//      audio.autoplay = true
//      // add the audio to peerAudio object if you want to address it for something
//      // later (volume, etc.)
//      this.audios[peerId] = audio
//    })
//
//    this.room.onPeerStream((stream, peerId) => {
//      com.createVideoElement(stream,peerId)
//    })
//
//    // listen for chatmsg 
//    this.chat.get((data, peerId) => {
//      if( data.prime ){
//        if( com.log.length > 0 ) return                // only prime once
//        console.log("receiving prime")
//        data.prime.map( (l) => this.send({message:l, sendLocal:false ) ) // send log to screen
//        this.chat.primed = true
//      }
//      this.send({ ...data, sendLocal: false})          // send to screen
//    })
//
//  }
//
//
//}
}).apply({})
