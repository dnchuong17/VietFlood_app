declare module 'react-native-safe-area-context' {
  import { ReactNode } from 'react';
  import { ViewProps } from 'react-native';

  export interface SafeAreaViewProps extends ViewProps {
    children: ReactNode;
  }

  export class SafeAreaView extends React.Component<SafeAreaViewProps> {}

  export function useSafeAreaInsets(): {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  export function useSafeAreaFrame(): {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}
