import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Modal, Portal, TextInput, Title } from 'react-native-paper';
import CommonStyle from '../styles/CommonStyle';
import useTheme from '../themes/ThemeProvider';
import MyButton from './MyButton';

type Props = {
  intialPrice: number;
  setNewPrice: (price: number) => void;
  currency: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};

export default function NegociateModal({
  intialPrice,
  setNewPrice,
  currency,
  visible,
  setVisible,
}: Props) {
  const [price, setPrice] = useState(intialPrice);

  const theme = useTheme();
  const commonStyle = CommonStyle(theme);

  const ref = useRef<any>();

  useEffect(() => {
    setTimeout(() => ref.current?.focus(), 0);
  }, [visible]);

  return (
    <Portal>
      <Modal
        visible={visible}
        contentContainerStyle={commonStyle.modal}
        onDismiss={() => setVisible(false)}
      >
        <Title style={{ textAlign: 'center', marginBottom: 20 }}>
          Negocier le prix de la course
        </Title>
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <TextInput
            ref={ref}
            placeholder={`${intialPrice} (${currency})`}
            key="price"
            keyboardType="phone-pad"
            onChangeText={(s) => {
              const p = +s;
              if (!_.isNaN(p)) setPrice(p);
            }}
          ></TextInput>
          <MyButton
            icon="check"
            title="valider"
            onPress={() => {
              setVisible(false);
              setNewPrice(price);
            }}
          />
        </View>
      </Modal>
    </Portal>
  );
}
