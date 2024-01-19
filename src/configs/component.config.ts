import { ThemeConfig } from "antd";

export const ComponentThemeConfig: ThemeConfig = {
    // algorithm: theme.darkAlgorithm,
    components: {
        Button: {
            colorPrimary: 'rgb(51, 51, 51)',
            colorPrimaryHover: '#000000',
            colorPrimaryActive: 'rgb(48, 48, 48)',
            fontSize: 18,
        },
        Input: {
            colorPrimary: 'rgb(51, 51, 51)',
            colorPrimaryHover: '#000000',
            colorPrimaryActive: 'rgb(48, 48, 48)',
            borderRadius: 4,
            colorBorder: 'rgb(51, 51, 51)',
            fontSize: 18,
            lineHeight: 2
        },
        Steps: {
            colorPrimary: 'rgb(121, 0, 0)',
            colorText: 'rgb(255, 255, 255);',
            colorPrimaryText: 'rgb(155, 18, 18);',
            colorTextDescription: 'rgb(0, 0, 0);',
            colorTextLightSolid: '#fafafa',
            colorTextLabel: 'rgb(0, 0, 0);',

            // colorTextQuaternary: 'rgb(155, 18, 18);',
            // colorPrimaryTextActive: 'rgb(155, 18, 18);',
            // colorIcon: '#000',
            // colorInfoText: 'red',
            // colorTextBase: 'rgb(155, 18, 18);',
            // colorTextDisabled: 'rgb(155, 18, 18)',
            // colorTextHeading: 'rgb(155, 18, 18);',
        }
    }
}