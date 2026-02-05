import React from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';

// Custom theme extending Eva Light
const customTheme = {
  ...eva.light,
  'color-primary-100': '#D6E4FF',
  'color-primary-200': '#ADC8FF',
  'color-primary-300': '#84A9FF',
  'color-primary-400': '#6690FF',
  'color-primary-500': '#3366FF',
  'color-primary-600': '#254EDB',
  'color-primary-700': '#1939B7',
  'color-primary-800': '#102693',
  'color-primary-900': '#091A7A',
  'color-success-500': '#00E096',
  'color-info-500': '#0095FF',
  'color-warning-500': '#FFAA00',
  'color-danger-500': '#FF3D71',
};

export default function App() {
  return (
    <>
      <ApplicationProvider {...eva} theme={customTheme}>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </ApplicationProvider>
    </>
  );
}
