import React from "react"
import { View, ViewProps } from "react-native"

export interface {{pascalCase name}}Props extends ViewProps {
  // TODO: Add custom props
}

/**
 * {{pascalCase name}}
 *
 * {{description}}
 */
export const {{pascalCase name}}: React.FC<{{pascalCase name}}Props> = ({
  ...rest
}) => {
  return (
    <View {...rest}>
      {/* TODO: Add component content */}
    </View>
  )
}

export default {{pascalCase name}}
