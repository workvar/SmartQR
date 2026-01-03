
import { QRSettings } from "../types";

export const DEFAULT_SETTINGS: QRSettings = {
    url: '',
    width: 320,
    height: 320,
    margin: 10,
    dotsType: 'rounded',
    dotsColor: '#000000',
    dotsGradientEnabled: false,
    dotsGradientSecondary: '#1d4ed8',
    dotsGradientType: 'linear',
    dotsGradientRotation: 0,
    backgroundColor: '#ffffff',
    bgGradientEnabled: false,
    bgGradient: {
        type: 'linear',
        rotation: 45,
        colorStops: [
            { offset: 0, color: '#ffffff' },
            { offset: 1, color: '#f3f4f6' }
        ]
    },
    isTransparent: false,
    cornerSquareType: 'extra-rounded',
    cornerSquareColor: '#000000',
    cornerDotType: 'dot',
    cornerDotColor: '#000000',
    logoSize: 0.35,
    logoMargin: 5,
    frameEnabled: false,
    frameColor: '#000000',
    frameThickness: 4,
    frameSync: true,
    frameStyle: 'solid',
    frameBorderRadius: 24,
    framePadding: 12,
    theme: 'light',
    isDynamic: false
};
