/**
 * Global Error Boundary with fallback UI
 * Catches React render errors and displays recovery UI
 */

import React, { ReactNode } from 'react'
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { logger } from '@/lib/logging/logger'

interface Props {
  children: ReactNode
  onReset?: () => void
}

interface State {
  hasError: boolean
  error: Error | null
  stack: string | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      stack: null
    }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error details
    logger.error('ErrorBoundary', 'Uncaught error in component tree', error, {
      componentStack: errorInfo.componentStack
    })

    this.setState({
      error,
      stack: errorInfo.componentStack
    })

    // Report to Sentry if available
    if (typeof window !== 'undefined' && (window as any).__SENTRY__) {
      (window as any).__SENTRY__.captureException(error, {
        tags: { component_stack: errorInfo.componentStack }
      })
    }
  }

  handleReset = () => {
    logger.info('ErrorBoundary', 'User triggered error recovery')
    this.setState({ hasError: false, error: null, stack: null })
    this.props.onReset?.()
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>⚠️</Text>
            </View>

            <Text style={styles.title}>Oops! Something Went Wrong</Text>

            <Text style={styles.message}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>

            {process.env.NODE_ENV === 'development' && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Debug Info:</Text>
                <Text style={styles.debugText}>
                  {this.state.error?.toString()}
                </Text>
                {this.state.stack && (
                  <Text style={styles.stackTrace}>{this.state.stack}</Text>
                )}
              </View>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={this.handleReset}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Try Again</Text>
            </TouchableOpacity>

            <Text style={styles.supportText}>
              If the problem persists, please contact support@vietflood.io
            </Text>
          </ScrollView>
        </SafeAreaView>
      )
    }

    return this.props.children
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  content: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center'
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24
  },
  icon: {
    fontSize: 64
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#DC2626',
    marginBottom: 12,
    textAlign: 'center'
  },
  message: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 24,
    textAlign: 'center'
  },
  debugContainer: {
    backgroundColor: '#f3f4f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    maxHeight: 150
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8
  },
  debugText: {
    fontSize: 11,
    color: '#6B7280',
    fontFamily: 'monospace'
  },
  stackTrace: {
    fontSize: 10,
    color: '#9CA3AF',
    fontFamily: 'monospace',
    marginTop: 8
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  supportText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 16
  }
})
