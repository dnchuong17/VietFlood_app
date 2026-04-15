import React from "react"
import { View } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

type Props = NativeStackScreenProps<any, "{{pascalCase name}}">

/**
 * {{pascalCase name}}Screen
 *
 * Displays {{name}} information and functionality.
 * TODO: Migrate to MST
 */
export const {{pascalCase name}}Screen: React.FC<Props> = ({ navigation, route }) => {
  return (
    <View className="flex-1 bg-white dark:bg-black">
      {/* TODO: Add content */}
    </View>
  )
}
