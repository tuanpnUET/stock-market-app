module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
        '@babel/plugin-proposal-export-namespace-from',
        [
            'module-resolver',
            {
                root: ['./src'],
                alias: {
                    '@base-component': ['/shared/components/base/'],
                    '@navigation': ['/service/navigation/'],
                },
            },
        ],
        'react-native-reanimated/plugin', // This line.
    ],
};
