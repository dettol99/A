import { Modal, Text, View } from 'react-native';
export function AddToListBottomSheet({ visible }: { visible: boolean }) { return <Modal visible={visible} transparent><View><Text>Add to list</Text></View></Modal>; }
