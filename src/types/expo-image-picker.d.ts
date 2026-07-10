declare module 'expo-image-picker' {
  export type PermissionResponse = { granted: boolean };
  export type ImagePickerAsset = { uri: string };
  export type ImagePickerCanceledResult = { canceled: true; assets?: null };
  export type ImagePickerSuccessResult = { canceled: false; assets: ImagePickerAsset[] };
  export type ImagePickerResult = ImagePickerCanceledResult | ImagePickerSuccessResult;
  export function requestMediaLibraryPermissionsAsync(): Promise<PermissionResponse>;
  export function launchImageLibraryAsync(options?: { mediaTypes?: string[]; allowsEditing?: boolean; quality?: number }): Promise<ImagePickerResult>;
}
