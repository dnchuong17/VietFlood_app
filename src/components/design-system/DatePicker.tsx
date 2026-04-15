import React, { useState } from "react"
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"

export interface DatePickerProps {
  label?: string
  placeholder?: string
  value?: Date
  onChange: (date: Date) => void
  error?: string
  disabled?: boolean
  mode?: "date" | "time"
  minimumDate?: Date
  maximumDate?: Date
  className?: string
}

/**
 * DatePicker Component
 *
 * Date/time picker for selecting dates and times.
 * Uses platform-native date picker with fallback styling.
 */
export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  placeholder = "Select a date",
  value,
  onChange,
  error,
  disabled = false,
  mode = "date",
  minimumDate,
  maximumDate,
  className = "",
}) => {
  const [showPicker, setShowPicker] = useState(false)

  const displayText = value
    ? value.toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    : placeholder

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      onChange(selectedDate)
      setShowPicker(false)
    }
  }

  return (
    <View className={`${className}`}>
      {label && <Text className="text-sm font-semibold text-gray-700 mb-2">{label}</Text>}

      <TouchableOpacity
        onPress={() => !disabled && setShowPicker(true)}
        disabled={disabled}
        className={`border rounded-lg px-3 py-3 ${
          disabled ? "bg-gray-100 opacity-50" : "bg-white"
        } ${error ? "border-red-600" : "border-gray-300"}`}
      >
        <Text className={`text-base ${value ? "text-gray-900" : "text-gray-500"}`}>
          {displayText}
        </Text>
      </TouchableOpacity>

      {error && <Text className="text-red-600 text-xs mt-1">{error}</Text>}

      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          display="spinner"
          onChange={handleDateChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}

      {showPicker && (
        <Modal transparent animationType="fade">
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "flex-end",
            }}
            onPress={() => setShowPicker(false)}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
                paddingVertical: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => setShowPicker(false)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: "#e5e7eb",
                }}
              >
                <Text style={{ fontSize: 16, color: "#3b82f6", fontWeight: "600" }}>
                  Xác nhận
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  )
}

export default DatePicker
