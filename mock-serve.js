import pkg from '@ng-apimock/core';
import express from 'express';
import devInterface from '@ng-apimock/dev-interface'

const { processor, middleware } = pkg;
const app = express();
app.set('port', 8080);

processor.process({
    src: 'mocks', // required
    patterns: { // optional
        mocks: '**/*Mock.json', // optional: default is '**/*.mock.json'
        presets: '**/*Preset.json', // optional: default is '**/*.preset.json'
    },
    watches: { // optional
        mocks: '**/*.json', // optional: no default, set if watch files regex is different from mocks pattern
        presets: '**/*.json' // optional: no default, set if watch files regex is different from presets pattern
    },
    watch: true // optional: default is 'false'
});

app.use(middleware);
app.use('/mocks', express.static(devInterface));

app.listen(app.get('port'), () => {
    console.log('mock server is running on port', app.get('port'));
    console.log('ng-apimock dev-interface is available under /mocks');
});