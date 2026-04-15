import React, { useState } from "react"
import { View, Text, TouchableOpacity, Modal, FlatList, StyleSheet } from "react-native"

export interface SelectOption {
  label: string
  value: string | number
}

export interface SelectProps {
  label?: string
  placeholder?: string
  options: SelectOption[]
  value?: string | number
  onChange: (value: string | number) => void
  error?: string
  disabled?: boolean
  className?: string
}

/**
 * Select Component
 *
 * Dropdown select component for choosing from predefined options.
 * Supports error states, disabled state, and custom styling.
 */
export const Select: React.FC<SelectProps> = ({
  label,
  placeholder = "Select an option",
  options,
  value,
  onChange,
  error,
  disabled = false,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find((opt) => opt.value === value)
  const displayText = selectedOption?.label || placeholder

  const handleSelect = (optionValue: string | number) => {
    onChange(optionValue)
    setIsOpen(false)
  }

  return (
    <View className={`${className}`}>
      {label && <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text>}

      <TouchableOpacity
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={`border rounded-lg px-3 py-3 ${
          disabled ? "bg-gray-100 opacity-50" : "bg-white"
        } ${error ? "border-red-600" : "border-gray-300"}`}
      >
        <Text className={`text-base ${selectedOption ? "text-gray-900" : "text-gray-500"}`}>
          {displayText}
        </Text>
      </TouchableOpacity>

      {error && <Text className="text-red-600 text-xs mt-1">{error}</Text>}

      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
          onPress={() => setIsOpen(false)}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              paddingTop: 16,
              maxHeight: "80%",
            }}
          >
            <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
              <Text style={{ fontSize: 16, fontWeight: "600", color: "#1f2937" }}>
                {label || "Select"}
              </Text>
            </View>

            <FlatList
              data={options}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleSelect(item.value)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: "#e5e7eb",
                    backgroundColor: value === item.value ? "#eff6ff" : "#fff",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: value === item.value ? "#3b82f6" : "#1f2937",
                      fontWeight: value === item.value ? "600" : "400",
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => String(item.value)}
              scrollEnabled
            />

            <TouchableOpacity
              onPress={() => setIsOpen(false)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderTopWidth: 1,
                borderTopColor: "#e5e7eb",
              }}
            >
              <Text style={{ fontSize: 16, color: "#6b7280", textAlign: "center" }}>
                Đóng
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  )
}

export default Select
