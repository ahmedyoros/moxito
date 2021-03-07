import * as ImagePicker from 'expo-image-picker';
import { ImagePickerOptions } from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import firebase from 'firebase/app';
import 'firebase/auth';
import React from 'react';
import { View } from 'react-native';
import Avatar from './Avatar';
import Loading from './Loading';
import MyButton from './MyButton';

type ImageProps = {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  avatar?: boolean;
};

export default class UploadImage extends React.Component<ImageProps> {
  state = {
    image: this.props.imageUrl,
    uploading: false,
    avatar: this.props.avatar || false,
  };

  options: ImagePickerOptions | undefined = {
    allowsEditing: true,
    aspect: [3, 3],
    quality: 0.5,
  };

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
  }

  render() {
    let { image } = this.state;

    return (
      <View>
        {this._maybeRenderImage()}
        {this._maybeRenderUploadingOverlay()}

        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <MyButton onPress={this._pickImage} title="Parcourir" icon="file" />
          <MyButton onPress={this._takePhoto} title="Photo" icon="camera" />
        </View>
      </View>
    );
  }

  _maybeRenderUploadingOverlay = () => {
    if (this.state.uploading) return <Loading />;
  };

  _maybeRenderImage = () => {
    let { image } = this.state;
    if (!image) {
      return;
    }
    return <Avatar imageUrl={image} size={150} />;
  };

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync(this.options);

    this._handleImagePicked(pickerResult);
  };

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync(this.options);

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async (pickerResult: any) => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        const uploadUrl = await uploadImageAsync(
          pickerResult.uri,
          this.state.avatar
        );
        this.setState({ image: uploadUrl });
        this.props.setImageUrl(uploadUrl);
      }
    } catch (e) {
      console.log(e);
      alert('Upload failed, sorry :(');
    } finally {
      this.setState({ uploading: false });
    }
  };
}

async function uploadImageAsync(uri: any, avatar: boolean) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob: any = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  let ref: firebase.storage.Reference;
  if (avatar) {
    const uid = firebase.auth().currentUser!.uid;
    ref = firebase.storage().ref('avatar').child(uid);
  } else {
    ref = firebase.storage().ref();
  }
  const snapshot = await ref.put(blob);

  blob.close();
  return await snapshot.ref.getDownloadURL();
}
