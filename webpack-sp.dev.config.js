/**
 * Created by Administrator on 2018/8/9.
 */
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    devtool: 'eval-source-map',
    entry:{ vonder: path.resolve(__dirname, './src/sp/vendor.js'), index: path.resolve(__dirname, './src/sp/index.js') },
    output:{
        filename: 'js/[name].js',
        path: path.join(__dirname, './dev-bundle/'),
    },
    externals: {
        'jquery': 'window.jQuery',
        'angular': 'window.angular',
        'echarts': 'window.echarts',
        'BMap':'window.BMap'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader", "postcss-loader"]
            })
        },{
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: ["css-loader", "postcss-loader", `less-loader?{modifyVars:${JSON.stringify({ mainColor:'#1089ff' })}}`]
            })
        },{
            test: /\.js$/,
            use: ['babel-loader?cacheDirectory=true'],
            include: path.join(__dirname, './src')
        },{
            test: /\.(png|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name:'images/[name].[ext]',
                    publicPath:'/'
                }
            }]
        },{
            test: /\.(woff|svg|eot|TTF|ttf)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name:'font/[name].[ext]',
                    publicPath:'/'
                }
            }]
        }]
    },
    devServer: {
        contentBase: path.join(__dirname, './'),
        historyApiFallback: true,
        host: 'localhost',
        port: 10444,
        proxy: {
            '/api': {
                // target:'http://192.168.0.3:8080',
                target: 'http://47.74.129.24',
                pathRewrite: {'^/api' : ''}
            },
            '/image/ckeditor':{
                target: 'http://47.74.129.24',
                pathRewrite: {'^/image/ckeditor' : '/image/ckeditor'}
            }
        }
    },
    plugins:[
        new HtmlWebpackPlugin({
            template: './src/sp/index.html', // 源模板文件
            filename: './index.html', // 输出文件【注意：这里的根路径是module.exports.output.path】
            showErrors: true,
            inject: 'body',
            chunks: ['vonder','index']
        }),
        new webpack.HashedModuleIdsPlugin(),
        new ExtractTextPlugin({
            filename: 'css/[name].css',
            allChunks:true
        }),
        new webpack.DefinePlugin({
            _DEV_:JSON.stringify('dev')
        })
    ]
};