import { Text } from 'react-native';
export function StarRating({ value }: { value: number }) { return <Text accessibilityLabel={`${value} of 5 stars`}>{'★★★★★'.slice(0, Math.round(value))}</Text>; }
