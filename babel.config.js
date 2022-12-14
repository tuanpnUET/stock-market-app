module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
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
        '@babel/plugin-proposal-export-namespace-from',
    ],
};
